window.CMS_MANUAL_INIT = true;

const destinations = {
  inventory: '/collections/products',
  pages: '/collections/website/entries/site',
  services: '/collections/website/entries/services',
};
let opening = false;

async function openEditor(button, requestedDestination) {
  if (opening) return;
  opening = true;
  const status = document.getElementById('status');
  const buttons = document.querySelectorAll('#open-editor, [data-open-editor]');
  buttons.forEach(item => { item.disabled = true; });
  status.textContent = 'Loading your editor…';
  status.removeAttribute('data-error');
  status.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch('/admin/config.json', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Could not load editor settings.');
    const config = await response.json();
    // The CMS's view-site links should review this deployment, rather than live content.
    config.site_url = window.location.origin;
    config.display_url = window.location.origin;
    if (document.body.dataset.demo === 'true') {
      config.backend = { name: 'test-repo' };
    }
    await new Promise((resolve, reject) => {
      if (window.CMS) return resolve();
      const script = document.createElement('script');
      const timer = setTimeout(() => {
        script.remove();
        reject(new Error('The editor took too long to load. Check your connection, then try again.'));
      }, 20000);
      script.src = 'https://unpkg.com/@sveltia/cms@0.266.0/dist/sveltia-cms.js';
      script.onload = () => {
        clearTimeout(timer);
        if (window.CMS) resolve();
        else { script.remove(); reject(new Error('The editor did not start. Please try again.')); }
      };
      script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('The editor could not load. Check your connection, then try again.')); };
      document.head.append(script);
    });
    const { productProblems, siteProblems, servicesProblems } = await import('/admin/content-rules.js');
    if (!window.cmsValidationRegistered) {
      window.CMS.registerEventListener({ name: 'preSave', handler: ({ entry }) => {
        const collection = entry.get('collection');
        const data = entry.get('data').toJS();
        const entryPath = entry.get('path') || '';
        const problems = collection === 'products' ? productProblems(data)
          : collection === 'website' && /(?:^|\/)site\.json$/.test(entryPath) ? siteProblems(data)
          : collection === 'website' && /(?:^|\/)services\.json$/.test(entryPath) ? servicesProblems(data)
          : [];
        if (problems.length) throw new Error(problems.join('\n'));
      } });
      const { registerPreviews } = await import('/admin/preview-templates.js');
      registerPreviews(window.CMS, { demo: document.body.dataset.demo === 'true' });
      window.cmsValidationRegistered = true;
    }
    await window.CMS.init({ config });
    const entry = button?.dataset.entry;
    const destination = requestedDestination || (entry && /^[a-z0-9][a-z0-9-]*$/.test(entry)
      ? `/collections/products/entries/${entry}` : destinations[button?.dataset.destination]);
    if (destination) window.location.hash = destination;
    document.getElementById('welcome').hidden = true;
    document.body.classList.add('editing');
    document.querySelector('link[href="/admin/start.css"]')?.remove();
  } catch (error) {
    status.textContent = error.name === 'TimeoutError'
      ? 'The editor settings took too long to load. Check your connection, then try again.'
      : error.message || 'Could not start the editor. Please reload and try again.';
    status.dataset.error = 'true';
    status.focus({ preventScroll: true });
    buttons.forEach(item => { item.disabled = false; });
    opening = false;
  } finally {
    status.removeAttribute('aria-busy');
  }
}

// Delegation also covers the quick-edit buttons loaded with the catalog summary.
document.addEventListener('click', event => {
  const button = event.target.closest('#open-editor, [data-open-editor]');
  if (button) void openEditor(button);
});
const initialRoute = window.location.hash.slice(1);
if (/^\/collections\/[a-z0-9/-]+$/.test(initialRoute)) void openEditor(null, initialRoute);
