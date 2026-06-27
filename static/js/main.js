// ============================================================
// UMIC Yearbook — shared front-end behaviors
// ============================================================

const AV_GRADS = [
  ['#0A2F23','#1A6B4F'],['#7C1D3E','#A52A5C'],['#92400E','#C2710C'],
  ['#1E3A5F','#2E5FA1'],['#4C1D95','#7C3AED'],['#065F46','#0D9668'],
  ['#9F1239','#E11D48'],['#78350F','#B45309'],['#1E40AF','#3B82F6'],
  ['#831843','#BE185D'],['#064E3B','#059669'],['#713F12','#A16207']
];

function getGrad(name){
  let h=0;
  for(let i=0;i<name.length;i++) h = name.charCodeAt(i) + ((h<<5)-h);
  return AV_GRADS[Math.abs(h) % AV_GRADS.length];
}

function getInitials(name){
  return name.split(' ').filter(x=>x.length>0).map(x=>x[0]).join('').toUpperCase().slice(0,2);
}

function avatarHTML(name, size=80){
  const [c1,c2] = getGrad(name);
  const fs = size < 50 ? size*0.36 : size*0.32;
  return `<div class="avatar-grad" style="width:${size}px;height:${size}px;background:linear-gradient(135deg,${c1},${c2});font-size:${fs}px">${getInitials(name)}</div>`;
}

// ---------------- Mobile drawer ----------------
const mobileBtn = document.getElementById('mobileMenuBtn');
const drawer = document.getElementById('mobileDrawer');
const drawerClose = document.querySelector('.drawer-close');
if (mobileBtn) mobileBtn.addEventListener('click', () => drawer.classList.add('show'));
if (drawerClose) drawerClose.addEventListener('click', () => drawer.classList.remove('show'));
if (drawer) drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('show')));

// ---------------- Lightbox ----------------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src){
  if (!lightbox) return;
  lightboxImg.src = src;
  lightbox.classList.add('show');
}
function closeLightbox(){
  if (!lightbox) return;
  lightbox.classList.remove('show');
}
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

document.addEventListener('click', e => {
  const item = e.target.closest('[data-lightbox]');
  if (item) openLightbox(item.dataset.lightbox);
});

// ---------------- Toast ----------------
function showToast(message, type='ok'){
  const host = document.getElementById('toastHost') || document.body;
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = message;
  host.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 3200);
}

// ---------------- Stat count-up ----------------
function animateCount(el, target){
  let current = 0;
  if (target === 0) { el.textContent = '0'; return; }
  const step = Math.max(1, Math.ceil(target/30));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, 30);
}
document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  animateCount(el, parseInt(el.dataset.target || '0', 10));
});

// ---------------- Profile gallery swipe dots ----------------
document.querySelectorAll('.profile-gallery-track').forEach(track => {
  const dots = track.parentElement.querySelectorAll('.profile-gallery-dots span');
  track.addEventListener('scroll', () => {
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    dots.forEach((d,i) => d.classList.toggle('active', i===idx));
  });
});
