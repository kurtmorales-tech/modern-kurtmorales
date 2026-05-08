const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#nav-links');
const year = document.querySelector('#year');

year.textContent = new Date().getFullYear();

menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});
