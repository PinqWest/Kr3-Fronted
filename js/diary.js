// script.js
document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('open-add');
  const modal = document.getElementById('addModal');
  const modalPanel = modal.querySelector('.modal__panel');
  const closeBtn = document.getElementById('close-add');
  const cancelBtn = document.getElementById('cancel-add');
  const addForm = document.getElementById('addForm');
  const timeline = document.getElementById('timeline');
  const statusLive = document.getElementById('formStatus');

  let lastFocused = null;

  function openModal() {
    lastFocused = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    // focus first input
    const first = modal.querySelector('input, textarea, button');
    first && first.focus();
    trapFocus(modalPanel);
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    removeTrap();
    if (lastFocused) lastFocused.focus();
    addForm.reset();
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // close with overlay click
  modal.querySelector('.modal__overlay').addEventListener('click', closeModal);

  // close with Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('entryDate').value.trim();
    const title = document.getElementById('entryTitle').value.trim();
    const desc = document.getElementById('entryDesc').value.trim();

    if (!date || !title || !desc) {
      statusLive.textContent = 'Заполните все поля';
      statusLive.classList.remove('visually-hidden');
      return;
    }

    // create new timeline item
    const id = 't' + Date.now();
    const article = document.createElement('article');
    article.className = 'timeline__item';
    article.setAttribute('data-date', date);
    article.setAttribute('aria-labelledby', id + '-title');

    article.innerHTML = `
      <div class="timeline__date">${escapeHtml(date)}</div>
      <div class="timeline__content">
        <h3 id="${id}-title" class="timeline__title">${escapeHtml(title)} <span class="timeline__status timeline__status--planned" aria-hidden="true">●</span></h3>
        <p class="timeline__description">${escapeHtml(desc)}</p>
      </div>
    `;
    // insert at top
    timeline.insertBefore(article, timeline.firstChild);

    statusLive.textContent = 'Запись добавлена';
    statusLive.classList.remove('visually-hidden');

    // announce and close
    setTimeout(() => { closeModal(); statusLive.textContent = ''; }, 700);
  });

  // Simple focus trap implementation
  let focusable = [];
  let trapActive = false;
  function trapFocus(container) {
    focusable = container.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    focusable = Array.prototype.slice.call(focusable).filter(el => !el.disabled);
    if (focusable.length === 0) return;
    trapActive = true;
    focusable[0].focus();
    document.addEventListener('keydown', handleTab);
  }
  function removeTrap() {
    trapActive = false;
    document.removeEventListener('keydown', handleTab);
  }
  function handleTab(e) {
    if (!trapActive) return;
    if (e.key !== 'Tab') return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // small helper to avoid XSS when inserting text
  function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      })[s];
    });
  }
});
