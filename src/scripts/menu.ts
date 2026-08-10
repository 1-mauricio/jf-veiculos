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
