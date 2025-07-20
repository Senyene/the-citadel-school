export function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.main-nav');
  
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggle.textContent = nav.classList.contains('active') ? '✕' : '☰';
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        toggle.textContent = '☰';
      });
    });
  }
}