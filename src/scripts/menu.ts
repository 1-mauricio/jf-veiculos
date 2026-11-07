export function initMobileMenu() {
  const header = document.querySelector<HTMLElement>('.jf-header');
  const toggle = document.getElementById('jf-menu-toggle');
  const mobileNav = document.getElementById('jf-mobile-nav');
  if (!header || !toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('is-menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('is-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

export function initThemeToggle() {
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!btn) return;
  const root = document.documentElement;
  const sync = () => {
    const dark = root.dataset.theme === 'dark';
    const label = dark ? 'Mudar para tema claro' : 'Mudar para tema escuro';
    btn.setAttribute('aria-label', label);
    btn.title = label;
  };
  sync();
  btn.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    if (dark) root.dataset.theme = 'dark';
    else delete root.dataset.theme;
    try { localStorage.setItem('jf-tema', dark ? 'dark' : 'light'); } catch {}
    sync();
  });
}
