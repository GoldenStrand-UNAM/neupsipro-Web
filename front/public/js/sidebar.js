const btn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

btn.addEventListener('click', () => {
  sidebar.classList.remove('-translate-x-full');
  overlay.classList.remove('hidden');
});

overlay.addEventListener('click', () => {
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
});

document.getElementById('closeBtn').addEventListener('click', () => {
  sidebar.classList.add('-translate-x-full');
  overlay.classList.add('hidden');
});
