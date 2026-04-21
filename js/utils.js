// ============ CART ============
const Cart = {
  KEY: 'calli_cart',
  get() { try { return JSON.parse(localStorage.getItem(this.KEY) || '[]'); } catch { return []; } },
  save(items) { localStorage.setItem(this.KEY, JSON.stringify(items)); this.badge(); },
  add(product, qty = 1) {
    const items = this.get();
    const cartId = product.size ? `${product.id}_${product.size.replace(/\s+/g, '_')}` : product.id;
    const ex = items.find(i => (i.cartId || i.id) === cartId);
    if (ex) ex.quantity += qty; else items.push({ ...product, cartId, quantity: qty });
    this.save(items);
    showToast(`${product.name} added to cart!`, 'success');
  },
  remove(cartId) { this.save(this.get().filter(i => (i.cartId || i.id) !== cartId)); },
  setQty(cartId, qty) {
    if (qty <= 0) { this.remove(cartId); return; }
    const items = this.get();
    const item = items.find(i => (i.cartId || i.id) === cartId);
    if (item) item.quantity = qty;
    this.save(items);
  },
  total() { return this.get().reduce((s, i) => s + i.price * i.quantity, 0); },
  count() { return this.get().reduce((s, i) => s + i.quantity, 0); },
  clear() { localStorage.removeItem(this.KEY); this.badge(); },
  badge() {
    const n = this.count();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = n;
      el.style.display = n > 0 ? 'flex' : 'none';
    });
  }
};

// ============ FORMAT ============
function rupees(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

// ============ WHATSAPP ============
function sendWhatsAppOrder(info, settings) {
  const items = Cart.get();
  const total = Cart.total();
  const s = settings || {};
  let msg = `🖊️ *New Order — ${s.storeName || 'Calligraphy Store'}*\n\n`;
  msg += `*📦 Items:*\n`;
  items.forEach(i => { msg += `• ${i.name} × ${i.quantity} = ${rupees(i.price * i.quantity)}\n`; });
  msg += `\n*💰 Total: ${rupees(total)}*\n\n`;
  msg += `*👤 Customer:*\nName: ${info.name}\nPhone: ${info.phone}\nAddress: ${info.address}`;
  if (info.notes) msg += `\nNotes: ${info.notes}`;
  const phone = (s.whatsappNumber || '917736348312').replace(/\D/g, '');
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ============ TOAST ============
function showToast(msg, type = 'info') {
  let box = document.getElementById('toasts');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toasts';
    box.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(box);
  }
  const t = document.createElement('div');
  const bg = type === 'success' ? '#C9A84C' : type === 'error' ? '#ef4444' : '#1C3D2E';
  t.style.cssText = `background:${bg};color:white;padding:12px 20px;border-radius:10px;font-family:Inter,sans-serif;font-size:14px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,.25);transform:translateX(120px);opacity:0;transition:all .3s ease;max-width:280px;pointer-events:all;`;
  t.textContent = msg;
  box.appendChild(t);
  requestAnimationFrame(() => { t.style.transform = 'translateX(0)'; t.style.opacity = '1'; });
  setTimeout(() => { t.style.transform = 'translateX(120px)'; t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ============ NAV ============
function initNav() {
  Cart.badge();
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }
  const btn = document.getElementById('mob-menu-btn');
  const menu = document.getElementById('mob-menu');
  if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));
}

// ============ FOOTER ============
async function initFooter() {
  if (typeof getSettings === 'function') {
    try {
      const s = await getSettings();
      const phone = (s.whatsappNumber || '917736348312').replace(/\D/g, '');

      const footerWa = document.getElementById('footer-wa');
      if (footerWa) footerWa.href = `https://wa.me/${phone}?text=${encodeURIComponent('Hello! I would like to know more about your calligraphy products.')}`;

      const footerPhone = document.getElementById('footer-phone');
      if (footerPhone) {
        footerPhone.innerHTML = `<i class="fa-solid fa-phone-flip w-5 text-gold"></i> +${phone}`;
        footerPhone.href = `tel:+${phone}`;
      }
      const footerEmail = document.getElementById('footer-email');
      if (footerEmail && s.storeEmail) {
        footerEmail.innerHTML = `<i class="fa-regular fa-envelope w-5 text-gold"></i> ${s.storeEmail}`;
        footerEmail.href = `mailto:${s.storeEmail}`;
      }
      const footerInsta = document.getElementById('footer-insta');
      if (footerInsta && s.storeInstagram) {
        footerInsta.innerHTML = `<i class="fa-brands fa-instagram w-5 text-gold"></i> @${s.storeInstagram}`;
        footerInsta.href = `https://www.instagram.com/${s.storeInstagram}/`;
        footerInsta.target = "_blank";
      }
    } catch (e) { console.error('Footer link init failed:', e); }
  }
}

// ============ LAZY IMAGES ============
function lazyLoad() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const img = e.target;
        if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[data-src]').forEach(i => obs.observe(i));
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFooter();
  lazyLoad();
  if (typeof AOS !== 'undefined') AOS.init({ duration: 750, once: true, offset: 80 });
});
