window.CMS_MANUAL_INIT = true;

document.getElementById('open-editor').addEventListener('click', async event => {
  const button = event.currentTarget;
  const status = document.getElementById('status');
  button.disabled = true;
  status.textContent = 'Loading your editor…';
  try {
    const response = await fetch('/admin/config.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load editor settings.');
    const config = await response.json();
    if (document.body.dataset.demo === 'true') {
      config.backend = { name: 'test-repo' };
    }
    await new Promise((resolve, reject) => {
      if (window.CMS) return resolve();
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js';
      script.onload = resolve;
      script.onerror = () => { script.remove(); reject(new Error('The editor could not be downloaded. Check your connection and try again.')); };
      document.head.append(script);
    });
    await window.CMS.init({ config });
    document.getElementById('welcome').hidden = true;
    document.body.classList.add('editing');
    document.querySelector('link[href="/admin/start.css"]')?.remove();
  } catch (error) {
    status.textContent = error.message || 'Could not start the editor. Please reload and try again.';
    button.disabled = false;
  }
});
