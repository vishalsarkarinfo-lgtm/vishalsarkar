/* Vishal Sarkar static site. No framework, external library, analytics or backend. */
(() => {
  'use strict';
  const serviceButton = document.querySelector('[data-services-toggle]');
  const serviceMenu = document.querySelector('#static-services-menu');
  function closeServices(restoreFocus = false) {
    if (!serviceButton || !serviceMenu) return;
    serviceMenu.hidden = true;
    serviceButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) serviceButton.focus();
  }
  serviceButton?.addEventListener('click', () => {
    const open = serviceMenu.hidden;
    serviceMenu.hidden = !open;
    serviceButton.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.services-nav')) closeServices();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && serviceMenu && !serviceMenu.hidden) closeServices(true);
  });
  const menu = document.querySelector('#static-mobile-dialog');
  const menuButton = document.querySelector('[data-mobile-toggle]');
  if (menu && menuButton) {
    menuButton.addEventListener('click', () => {
      menu.showModal();
      menuButton.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    });
    menu.querySelector('[data-menu-close]').addEventListener('click', () => menu.close());
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
    menu.addEventListener('click', event => {
      const r = menu.getBoundingClientRect();
      if (event.target === menu && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) menu.close();
    });
    menu.addEventListener('close', () => {
      document.body.style.overflow = '';
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    });
    window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
      if (event.matches && menu.open) menu.close();
    });
  }
  const form = document.querySelector('.static-appointment-form');
  if (!form) return;
  form.hidden = false;
  const preview = form.querySelector('.static-request-preview');
  const error = form.querySelector('.static-field-error');
  const date = form.elements.namedItem('date');
  const service = form.elements.namedItem('service');
  const chosen = new URLSearchParams(location.search).get('service');
  if (chosen && [...service.options].some(option => option.value === chosen)) service.value = chosen;
  const todayIST = new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);
  date.min = todayIST;
  function clearPreview() {
    preview.hidden = true;
    error.hidden = true;
    form.querySelectorAll('input, textarea').forEach(field => field.setCustomValidity(''));
  }
  form.addEventListener('input', clearPreview);
  form.addEventListener('change', clearPreview);
  form.addEventListener('submit', event => {
    event.preventDefault();
    error.hidden = true;
    if (!form.reportValidity()) return;
    const d = Object.fromEntries(new FormData(form));
    Object.keys(d).forEach(key => d[key] = String(d[key]).trim());
    const fail = (field, message) => {
      field.setCustomValidity(message);
      field.reportValidity();
      error.textContent = message;
      error.hidden = false;
    };
    if (d.name.length < 2) return fail(form.elements.namedItem('name'), 'Please enter your name.');
    if (!/^\+?[\d ()-]{7,22}$/.test(d.phone) || d.phone.replace(/\D/g, '').length < 7) return fail(form.elements.namedItem('phone'), 'Enter a valid phone number with at least 7 digits.');
    if (d.whatsapp && (!/^\+?[\d ()-]{7,22}$/.test(d.whatsapp) || d.whatsapp.replace(/\D/g, '').length < 7)) return fail(form.elements.namedItem('whatsapp'), 'Enter a valid WhatsApp number or leave it blank.');
    if (d.requirement.length < 10) return fail(form.elements.namedItem('requirement'), 'Please describe your project in at least 10 characters.');
    if (!Number.isFinite(Date.parse(d.date + 'T' + d.time + ':00+05:30')) || Date.parse(d.date + 'T' + d.time + ':00+05:30') <= Date.now()) return fail(date, 'Choose a future date and time in India Standard Time (IST).');
    const lines = ['Hi Vishal, I would like to request a project discussion.', '', 'Name: ' + d.name];
    if (d.business) lines.push('Business: ' + d.business);
    lines.push('Phone: ' + d.phone);
    if (d.whatsapp) lines.push('WhatsApp: ' + d.whatsapp);
    lines.push('Email: ' + d.email, 'Service: ' + service.selectedOptions[0].textContent);
    if (d.budget) lines.push('Budget: ' + d.budget);
    lines.push('Preferred date: ' + d.date, 'Preferred time: ' + d.time + ' IST', 'Meeting type: ' + d.meeting, '', 'Project requirement:', d.requirement, '', 'Please contact me to confirm a suitable meeting.');
    const message = lines.join('\n');
    preview.querySelector('pre').textContent = message;
    preview.querySelector('[data-send-whatsapp]').href = 'https://wa.me/919907537245?text=' + encodeURIComponent(message);
    preview.querySelector('[data-send-email]').href = 'mailto:vishalsarkar.info@gmail.com?subject=' + encodeURIComponent('Project discussion request — ' + d.name) + '&body=' + encodeURIComponent(message);
    preview.querySelector('.static-copy-status').textContent = '';
    preview.hidden = false;
    preview.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest'});
    preview.querySelector('[data-send-whatsapp]').focus({preventScroll: true});
  });
  form.querySelector('[data-copy-message]').addEventListener('click', async () => {
    const message = preview.querySelector('pre').textContent;
    const status = preview.querySelector('.static-copy-status');
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard not available');
      await navigator.clipboard.writeText(message);
      status.textContent = 'Message copied. Paste it into WhatsApp or your email app.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(preview.querySelector('pre'));
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Message selected. Use Copy, then paste it into WhatsApp or your email app.';
    }
  });
})();
