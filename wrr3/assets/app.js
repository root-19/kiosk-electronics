// Simple client-side interactivity for downloads filtering + modal
(function(){
  const q = (sel,ctx=document)=>ctx.querySelector(sel);
  const qa = (sel,ctx=document)=>Array.from(ctx.querySelectorAll(sel));

  // Downloads filter
  const searchInput = q('#downloadSearch');
  if(searchInput){
    searchInput.addEventListener('input',()=>{
      const term = searchInput.value.trim().toLowerCase();
      qa('.download-item').forEach(it=>{
        const text = it.dataset.search || '';
        it.classList.toggle('hidden', term && !text.includes(term));
      });
    });
  }

  // Details modal
  const backdrop = q('#modalBackdrop');
  const modalTitle = q('#modalTitle');
  const modalBody = q('#modalBody');

  function openModal(title, body){
    if(!backdrop) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = body;
    backdrop.classList.add('active');
  }
  function closeModal(){ backdrop?.classList.remove('active'); }
  q('#closeModal')?.addEventListener('click',closeModal);
  backdrop?.addEventListener('click',e=>{ if(e.target === backdrop) closeModal(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(); });

  qa('[data-details]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const dataset = btn.closest('.download-item')?.dataset || {};
      const title = dataset.title || 'Download details';
      const size = dataset.size || '—';
      const month = dataset.month || '—';
      const desc = dataset.desc || 'No description provided.';
      openModal(title, `<p><strong>Month:</strong> ${month}</p><p><strong>File Size:</strong> ${size}</p><p>${desc}</p>`);
    });
  });
})();