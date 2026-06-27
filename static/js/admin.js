// ============================================================
// UMIC Yearbook — Admin panel behaviors
// ============================================================

// Prefix-aware URL helper. window.APP_PREFIX is injected by the base
// template from request.script_root, so this resolves correctly whether
// the app runs at the domain root or under a subpath like /yearbook.
function apiUrl(path) {
  const prefix = window.APP_PREFIX || '';
  return prefix + path;
}

function setupDropZone(zoneId, inputId, onFiles) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  if (!zone || !input) return;
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
  });
  input.addEventListener('change', () => { if (input.files.length) onFiles(input.files); });
}

async function postForm(url, formData) {
  const res = await fetch(url, { method: 'POST', body: formData });
  let data;
  try { data = await res.json(); } catch (e) { data = { ok: false, error: 'Invalid server response' }; }
  if (!res.ok && !data.error) data.error = `Request failed (${res.status})`;
  return data;
}

async function postJSON(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  let data;
  try { data = await res.json(); } catch (e) { data = { ok: false, error: 'Invalid server response' }; }
  return data;
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('show'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('show'); document.body.style.overflow = ''; }
}
document.querySelectorAll('.modal-bg').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('show'); });
});

function confirmAction(message) {
  return window.confirm(message);
}

// Mobile sidebar toggle (admin pages)
const mobileAdminBtn = document.getElementById('mobileAdminBtn');
if (mobileAdminBtn) {
  mobileAdminBtn.addEventListener('click', () => {
    document.querySelector('.admin-sidebar').classList.toggle('show');
  });
}
