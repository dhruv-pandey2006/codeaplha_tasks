document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.querySelector('.gallery-grid');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const lightbox = document.querySelector('.lightbox');
  const lbImg = document.querySelector('.lightbox-img');
  const closeBtn = document.querySelector('.close-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentIndex = 0;
  let currentFilter = 'all';

  // Utility to get currently visible items (after filtering)
  function getVisibleItems() {
    return items.filter(i => i.style.display !== 'none');
  }

  // Open lightbox for visible index
  function openLightbox(index) {
    const visible = getVisibleItems();
    if (!visible.length) return;
    currentIndex = (index + visible.length) % visible.length;
    const img = visible[currentIndex].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function showNext() {
    const visible = getVisibleItems();
    if (!visible.length) return;
    currentIndex = (currentIndex + 1) % visible.length;
    const img = visible[currentIndex].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
  }

  function showPrev() {
    const visible = getVisibleItems();
    if (!visible.length) return;
    currentIndex = (currentIndex - 1 + visible.length) % visible.length;
    const img = visible[currentIndex].querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt || '';
  }

  // Click image to open lightbox (index relative to visible items)
  galleryGrid.addEventListener('click', e => {
    const card = e.target.closest('.gallery-item');
    if (!card) return;
    const visible = getVisibleItems();
    const index = visible.indexOf(card);
    if (index !== -1) openLightbox(index);
  });

  // Lightbox controls
  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);

  // Close when clicking outside image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Filtering by category
  function applyFilter(category) {
    currentFilter = category;
    filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === category));
    items.forEach(item => {
      const cat = item.dataset.category || 'all';
      if (category === 'all' || cat === category) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
    // If lightbox is open but the current item got hidden, close it
    const visible = getVisibleItems();
    if (lightbox && !lightbox.classList.contains('hidden')) {
      if (!visible.length) closeLightbox();
      else if (currentIndex >= visible.length) currentIndex = 0;
    }
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter));
  });

  // Bonus: insert simple filter toggles (grayscale, sepia, blur)
  (function insertImageFilterControls(){
    const header = document.querySelector('.gallery-header');
    if (!header) return;
    const wrap = document.createElement('div');
    wrap.style.marginTop = '6px';
    wrap.style.display = 'flex';
    wrap.style.gap = '8px';

    const filters = [
      { id: 'grayscale', label: 'Grayscale', cls: 'filter-grayscale' },
      { id: 'sepia', label: 'Sepia', cls: 'filter-sepia' },
      { id: 'blur', label: 'Blur', cls: 'filter-blur' }
    ];

    filters.forEach(f => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = f.label;
      b.className = 'filter-btn';
      b.style.fontSize = '0.8rem';
      b.style.padding = '6px 9px';
      b.setAttribute('aria-pressed','false');
      b.addEventListener('click', () => {
        const active = galleryGrid.classList.toggle(f.cls);
        b.setAttribute('aria-pressed', String(active));
      });
      wrap.appendChild(b);
    });

    header.appendChild(wrap);
  })();

  // Initialize: show all
  applyFilter('all');
});
