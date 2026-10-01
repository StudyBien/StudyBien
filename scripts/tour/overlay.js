(() => {
  const install = () => {
    if (document.getElementById('__tour')) return;
    const root = document.createElement('div'); root.id = '__tour';
    root.innerHTML = `
      <style>
        #__cur{position:fixed;left:0;top:0;width:28px;height:28px;z-index:2147483647;pointer-events:none;transition:transform .05s linear}
        .__rip{position:fixed;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;border:4px solid #0a66d4;z-index:2147483646;pointer-events:none;animation:__r .55s ease-out forwards}
        @keyframes __r{from{transform:scale(.3);opacity:1}to{transform:scale(1.6);opacity:0}}
        #__cap{position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(16px);opacity:0;z-index:2147483645;pointer-events:none;
          background:#0b2f6b;color:#fff;font:700 26px/1.25 'Atkinson Hyperlegible',system-ui,sans-serif;padding:14px 28px;border-radius:999px;
          box-shadow:0 10px 30px rgba(0,0,0,.25);transition:opacity .3s,transform .3s;white-space:nowrap}
        #__cap.on{opacity:1;transform:translateX(-50%) translateY(0)}
        #__cap small{display:block;font-weight:400;font-size:16px;opacity:.85;text-align:center}
      </style>
      <svg id="__cur" viewBox="0 0 24 24"><path d="M3 2l7 19 2.6-7.6L20 11z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>
      <div id="__cap"></div>`;
    document.documentElement.appendChild(root);
    const cur = document.getElementById('__cur');
    const last = window.__pos ?? JSON.parse(sessionStorage.getItem('__pos') || '[640,360]');
    cur.style.transform = `translate(${last[0]}px,${last[1]}px)`;
    addEventListener('mousemove', (e) => { cur.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; sessionStorage.setItem('__pos', JSON.stringify([e.clientX, e.clientY])); }, true);
    const cap = sessionStorage.getItem('__cap');
    if (cap) { const el = document.getElementById('__cap'); el.innerHTML = cap; el.classList.add('on'); }
  };
  window.__ripple = (x, y) => { const r = document.createElement('div'); r.className = '__rip'; r.style.left = x + 'px'; r.style.top = y + 'px'; document.documentElement.appendChild(r); setTimeout(() => r.remove(), 700); };
  window.__caption = (html) => { sessionStorage.setItem('__cap', html); const el = document.getElementById('__cap'); if (!el) return; el.classList.remove('on'); setTimeout(() => { el.innerHTML = html; if (html) el.classList.add('on'); }, html ? 180 : 0); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install); else install();
})();