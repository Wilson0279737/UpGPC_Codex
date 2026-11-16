import { test } from 'node:test';
import assert from 'node:assert/strict';
import type { Settings, User } from '@netlify/identity';
import { createAuthSession, savedPcIds, safeReturnPath, type AuthService } from '../src/auth/session.ts';
import { CustomerProfileError, createProfileTransport } from '../src/auth/profile.ts';
import { nextSavedPcIds } from '../src/auth/shortlist.ts';
import { consumeAuthCallback } from '../src/auth/callback.ts';
import { decodeSaveIntent, encodeSaveIntent, parseSavePcId, savePcAccountPath } from '../src/auth/saveIntent.ts';

const settings: Settings = { autoconfirm: true, disableSignup: false, providers: { google: true, github: false, gitlab: false, bitbucket: false, facebook: false, email: false } };
const userA: User = { id: 'customer-a', email: 'a@example.test', userMetadata: { full_name: 'Customer A', saved_pcs: ['existing-pc'] } };
const userB: User = { id: 'customer-b', email: 'b@example.test', userMetadata: { saved_pcs: ['other-pc'] } };

function fakeService(initial: User | null = structuredClone(userA)) {
  let current = initial;
  const profiles = new Map<string, User>([[userA.id, structuredClone(userA)], [userB.id, structuredClone(userB)]]);
  let listener: ((event: string, user: User | null) => void) | null = null;
  let calls = 0;
  let redirects = 0;
  const service: AuthService = {
    getSettings: async () => { calls++; return settings; },
    getUser: async () => { calls++; return current; },
    getProfile: async user => structuredClone(profiles.get(user.id)!),
    changeShortlist: async (user, id, save) => {
      const profile = profiles.get(user.id)!;
      const updated = { ...profile, userMetadata: { ...profile.userMetadata, saved_pcs: nextSavedPcIds(profile, id, save) } };
      profiles.set(user.id, updated);
      return structuredClone(updated);
    },
    changePassword: async user => structuredClone(profiles.get(user.id)!),
    handleAuthCallback: async () => { calls++; return null; },
    onAuthChange: callback => { calls++; listener = callback; return () => { listener = null; }; },
    oauthLogin: () => { redirects++; const error = new Error('Redirecting to OAuth provider'); error.name = 'AuthError'; throw error; },
    logout: async () => { current = null; listener?.('logout', null); },
    acceptInvite: async () => { current = structuredClone(userA); listener?.('login', current); return current; },
  };
  return { service, calls: () => calls, redirects: () => redirects, current: () => current, profiles, event: (event: string, user: User | null) => { current = user; listener?.(event, user); } };
}

test('disabled accounts perform no SDK calls or requests', async () => {
  const fake = fakeService(); const session = createAuthSession(fake.service, 100, false);
  await session.start(); await session.retry(); session.signInWithGoogle();
  assert.equal(fake.calls(), 0); assert.equal(session.getSnapshot().loading, false); assert.equal(session.getSnapshot().serviceStatus, 'unavailable');
});

test('fresh server profile replaces cached SDK shortlist and saves preserve current profile data', async () => {
  const fake = fakeService(); fake.profiles.set(userA.id, { ...userA, userMetadata: { full_name: 'Server profile', saved_pcs: ['cloud-pc'] } });
  const session = createAuthSession(fake.service); await session.start();
  assert.deepEqual(savedPcIds(session.getSnapshot().user), ['cloud-pc']);
  await session.savePc('new-pc'); await session.savePc('new-pc');
  assert.deepEqual(savedPcIds(session.getSnapshot().user), ['cloud-pc', 'new-pc']);
  assert.equal(fake.profiles.get(userA.id)?.userMetadata?.full_name, 'Server profile');
  assert.deepEqual(savedPcIds(fake.current()), ['existing-pc'], 'the SDK session was never rewritten');
  await session.removePc('cloud-pc'); assert.deepEqual(savedPcIds(session.getSnapshot().user), ['new-pc']); session.stop();
});

test('cross-account changes during a save reject the old result without changing the new account', async () => {
  const fake = fakeService(); let finish: ((user: User) => void) | null = null;
  fake.service.changeShortlist = async () => new Promise<User>(resolve => { finish = resolve; });
  const session = createAuthSession(fake.service); await session.start();
  const save = session.savePc('new-pc'); await Promise.resolve(); await Promise.resolve();
  fake.event('login', structuredClone(userB));
  assert.ok(finish); (finish as (user: User) => void)({ ...userA, userMetadata: { saved_pcs: ['new-pc'] } });
  await assert.rejects(save, /sign-in changed/);
  assert.equal(session.getSnapshot().user?.id, 'customer-b'); assert.equal(fake.current()?.id, 'customer-b');
  assert.deepEqual(savedPcIds(session.getSnapshot().user), ['other-pc']);
  session.stop();
});

test('settings failures are unavailable states and OAuth redirect sentinel is not an error', async () => {
  const fake = fakeService(null); const session = createAuthSession(fake.service); await session.start();
  session.signInWithGoogle(); assert.equal(session.getSnapshot().error, null); session.stop();
  fake.service.getSettings = async () => { throw new Error('Network down'); };
  const failed = createAuthSession(fake.service); await failed.start();
  assert.equal(failed.getSnapshot().serviceStatus, 'unavailable'); assert.equal(failed.getSnapshot().settings, null); failed.stop();
});

test('a retry recovers settings and fresh saved PCs after a temporary service failure', async () => {
  const fake = fakeService();
  const originalSettings = fake.service.getSettings;
  const originalProfile = fake.service.getProfile;
  fake.service.getSettings = async () => { throw new Error('Network down'); };
  fake.service.getProfile = async () => { throw new Error('Network down'); };
  const session = createAuthSession(fake.service); await session.start();
  assert.equal(session.getSnapshot().serviceStatus, 'unavailable');
  assert.equal(session.getSnapshot().profileStatus, 'unavailable');
  assert.deepEqual(savedPcIds(session.getSnapshot().user), [], 'cached SDK data was not shown as a confirmed list');
  fake.service.getSettings = originalSettings;
  fake.service.getProfile = originalProfile;
  fake.profiles.set(userA.id, { ...userA, userMetadata: { saved_pcs: ['changed-on-another-device'] } });
  const before = fake.calls();
  const first = session.retry(); const duplicate = session.retry();
  await Promise.all([first, duplicate]);
  assert.equal(fake.calls() - before, 3, 'duplicate retries do not start another bootstrap');
  assert.equal(session.getSnapshot().serviceStatus, 'available');
  assert.equal(session.getSnapshot().profileStatus, 'ready');
  assert.deepEqual(savedPcIds(session.getSnapshot().user), ['changed-on-another-device']);
  assert.equal(session.getSnapshot().error, null); session.stop();
});

test('a profile response arriving after account change cannot reveal the old shortlist', async () => {
  const fake = fakeService();
  let finish: ((user: User) => void) | null = null;
  const originalProfile = fake.service.getProfile;
  fake.service.getProfile = async user => user.id === userA.id ? new Promise<User>(resolve => { finish = resolve; }) : originalProfile(user);
  const session = createAuthSession(fake.service);
  const initial = session.start();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.ok(finish);
  fake.event('login', structuredClone(userB));
  await new Promise(resolve => setTimeout(resolve, 0));
  (finish as (user: User) => void)(structuredClone(userA));
  await initial;
  assert.equal(session.getSnapshot().user?.id, userB.id);
  assert.deepEqual(savedPcIds(session.getSnapshot().user), ['other-pc']); session.stop();
});

test('an unresponsive service leaves the loading state and can be retried', async () => {
  const fake = fakeService(null);
  const originalSettings = fake.service.getSettings;
  fake.service.getSettings = () => new Promise<Settings>(() => undefined);
  const session = createAuthSession(fake.service, 10); await session.start();
  assert.equal(session.getSnapshot().loading, false);
  assert.equal(session.getSnapshot().serviceStatus, 'unavailable');
  fake.service.getSettings = originalSettings; await session.retry();
  assert.equal(session.getSnapshot().serviceStatus, 'available'); session.stop();
});

test('failed saves and logouts retain the actual account state', async () => {
  const fake = fakeService(); const session = createAuthSession(fake.service); await session.start();
  fake.service.changeShortlist = async () => { throw new Error('Unavailable'); };
  await assert.rejects(session.savePc('new-pc'), /couldn’t confirm/); assert.deepEqual(savedPcIds(session.getSnapshot().user), ['existing-pc']);
  fake.service.logout = async () => { throw new Error('Unavailable'); };
  await assert.rejects(session.signOut(), /not confirmed/); assert.equal(session.getSnapshot().user?.id, 'customer-a'); session.stop();
});

test('expired server sessions offer Google reauthentication and ignore stale refresh snapshots', async () => {
  const fake = fakeService(); fake.service.getProfile = async () => { throw new CustomerProfileError('expired'); };
  const session = createAuthSession(fake.service); await session.start();
  assert.equal(session.getSnapshot().user, null); assert.match(session.getSnapshot().error!, /sign-in expired/);
  fake.event('token_refresh', structuredClone(userA));
  assert.equal(session.getSnapshot().user, null); assert.deepEqual(savedPcIds(session.getSnapshot().user), []);
  session.signInWithGoogle(); assert.equal(fake.redirects(), 1); session.stop();
});

test('a failed SDK callback cannot turn an idless partial SDK user into a signed-in account', async () => {
  const fake = fakeService({ email: 'partial@example.test' } as User);
  let profileCalls = 0;
  fake.service.handleAuthCallback = async () => { throw new Error('Invalid callback'); };
  fake.service.getProfile = async () => { profileCalls++; return structuredClone(userA); };
  const session = createAuthSession(fake.service); await session.start();
  assert.equal(session.getSnapshot().user, null); assert.equal(session.getSnapshot().profileStatus, 'none'); assert.equal(profileCalls, 0);
  assert.match(session.getSnapshot().error!, /couldn’t finish signing/); session.stop();
});

test('safe IDs, return paths, and shortlist profile size are bounded', async () => {
  const ids = Array.from({ length: 150 }, (_, index) => `pc-${index}`);
  assert.equal(savedPcIds({ id: 'a', userMetadata: { saved_pcs: [...ids, '../bad', 'https://bad.test', 12] } }).length, 100);
  assert.deepEqual(savedPcIds({ id: 'a', userMetadata: { saved_pcs: ['good-pc', 'good-pc', '../bad'] } }), ['good-pc']);
  for (const next of ['//bad.test', 'https://bad.test', '/account?token=bad', null]) assert.equal(safeReturnPath(next), '/account');
  assert.equal(safeReturnPath('/products#inventory'), '/products#inventory');
  const fake = fakeService(); const session = createAuthSession(fake.service); await session.start();
  await session.savePc('p'.repeat(160)); assert.ok(savedPcIds(session.getSnapshot().user).includes('p'.repeat(160)));
  for (let index = 0; index < 6; index++) await session.savePc(`pc-${index}-${'p'.repeat(180)}`);
  await assert.rejects(session.savePc(`pc-too-many-${'p'.repeat(180)}`), /shortlist is full/); session.stop();
});

test('signed-out save links preserve the exact PC and reject unsafe selections', () => {
  assert.equal(savePcAccountPath('marketplace-123'), '/account?save=marketplace-123&next=%2Fproducts%23inventory');
  for (const value of ['../pc', 'https://other.test/pc', 'pc?save=other', 'pc#other', '', 'a'.repeat(201)]) {
    assert.equal(parseSavePcId(value), null);
    assert.equal(savePcAccountPath(value), '/account');
  }
  assert.equal(parseSavePcId(null), null);
});

test('pending save selection survives an OAuth round trip only within its time limit', () => {
  const started = 1_000_000;
  const intent = encodeSaveIntent('marketplace-123', started);
  assert.ok(intent);
  assert.deepEqual(Object.keys(JSON.parse(intent)), ['productId', 'createdAt'], 'pending selection never stores credentials or a guest shortlist');
  assert.equal(decodeSaveIntent(intent, started + 60_000), 'marketplace-123');
  assert.equal(decodeSaveIntent(intent, started + 30 * 60_000 + 1), null);
  assert.equal(decodeSaveIntent(intent, started - 1), null);
  for (const value of ['not json', 'null', '[]', '{"productId":"../bad","createdAt":1000000}', '{"productId":"pc","createdAt":"1000000"}']) {
    assert.equal(decodeSaveIntent(value, started), null);
  }
  assert.equal(encodeSaveIntent('../bad', started), null);
});

const rawProfile = (ids: string[] = ['cloud-pc']) => ({ id: userA.id, email: 'a@example.test', user_metadata: { full_name: 'Fresh profile', saved_pcs: ids } });

test('profile transport fresh-reads before PUT and never mixes cookies with captured authorization', async () => {
  let written: Record<string, unknown> | null = null;
  const methods: string[] = [];
  const transport = createProfileTransport({ origin: () => 'https://example.test', readSessionCookie: () => 'test-session-a', fetch: async (url, options) => {
    assert.equal(url, 'https://example.test/.netlify/identity/user'); assert.equal(options?.credentials, 'omit'); assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer test-session-a');
    methods.push(options?.method!);
    if (options?.method === 'GET') return Response.json(rawProfile());
    written = JSON.parse(String(options?.body)); return Response.json({ ...rawProfile(), user_metadata: written!.data });
  } });
  const updated = await transport.changeShortlist(userA, 'new-pc', true);
  assert.deepEqual(methods, ['GET', 'PUT']); assert.deepEqual(savedPcIds(updated), ['cloud-pc', 'new-pc']); assert.equal(updated.userMetadata?.full_name, 'Fresh profile');
});

test('late profile writes cannot change session storage or return another account profile', async () => {
  let cookie = 'test-session-a'; let resolvePut: ((response: Response) => void) | null = null;
  const transport = createProfileTransport({ origin: () => 'https://example.test', readSessionCookie: () => cookie, fetch: async (_url, options) => {
    if (options?.method === 'GET') return Response.json(rawProfile());
    return new Promise<Response>(resolve => { resolvePut = resolve; });
  } });
  const save = transport.changeShortlist(userA, 'new-pc', true); await new Promise(resolve => setTimeout(resolve, 0));
  cookie = 'test-session-b'; assert.ok(resolvePut); (resolvePut as (response: Response) => void)(Response.json(rawProfile(['new-pc'])));
  await assert.rejects(save, (error: unknown) => error instanceof CustomerProfileError && error.code === 'account-changed'); assert.equal(cookie, 'test-session-b');
});

test('password updates use the same immutable credential and reject expired sessions', async () => {
  const transport = createProfileTransport({ origin: () => 'https://example.test', readSessionCookie: () => 'test-session-a', fetch: async () => new Response(null, { status: 401 }) });
  await assert.rejects(transport.changePassword(userA, 'not-a-real-password'), (error: unknown) => error instanceof CustomerProfileError && error.code === 'expired');
});

test('callback tokens are scrubbed immediately even when the SDK callback fails', async () => {
  const location = { hash: '#access_token=placeholder&refresh_token=placeholder', pathname: '/account', search: '?next=%2Fproducts' };
  let capturedHash = ''; let replacement = ''; let reject: ((error: Error) => void) | null = null;
  const completion = consumeAuthCallback(() => { capturedHash = location.hash; return new Promise((_resolve, fail) => { reject = fail; }); }, location, url => { replacement = url; location.hash = ''; });
  assert.ok(capturedHash.startsWith('#access_token=')); assert.equal(location.hash, ''); assert.equal(replacement, '/account?next=%2Fproducts');
  assert.ok(reject); (reject as (error: Error) => void)(new Error('Callback failed')); await assert.rejects(completion, /Callback failed/);
});
