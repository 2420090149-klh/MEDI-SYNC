// MediSync landing page JS: navigation, mock search, toast notifications
(function(){
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');
  navToggle.addEventListener('click', ()=>{
    siteNav.classList.toggle('show');
  });

  // Update year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Simple mock search handler
  const form = document.getElementById('searchForm');
  const results = document.getElementById('searchResults');
  const toast = document.getElementById('toast');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const specialty = document.getElementById('specialty').value.trim();
    const date = document.getElementById('date').value;
    if(!specialty || !date){
      showToast('Please enter a specialty and date');
      return;
    }
    results.innerHTML = '<div class="loading">Searching available doctors...</div>';
    // Mock async search
    setTimeout(()=>{
      const sample = generateMockSlots(specialty,date);
      results.innerHTML = renderResults(sample);
      // Attach handlers for book buttons
      document.querySelectorAll('.book-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          const slot = btn.dataset.slot;
          showToast('Appointment confirmed for ' + slot);
        });
      });
    },700);
  });

  function generateMockSlots(specialty,date){
    // simple deterministic slots
    const slots = ["09:00 AM","10:30 AM","12:00 PM","02:00 PM","04:30 PM"];
    return slots.map((s,i)=>({doctor:`Dr. ${specialty.split(' ')[0]} ${i+1}`,slot:`${date} ${s}`}));
  }
  function renderResults(items){
    if(!items.length) return '<p>No doctors found.</p>';
    return `
      <div class="results-grid">
        ${items.map(it=>`<div class="result-card">
           <div class="rc-left">
             <strong>${escapeHtml(it.doctor)}</strong>
             <div class="muted">${escapeHtml(it.slot.split(' ')[0])} • ${escapeHtml(it.slot.split(' ')[1])}</div>
           </div>
           <div class="rc-right">
             <button class="btn btn-primary book-btn" data-slot="${escapeHtml(it.slot)}">Book ${escapeHtml(it.slot.split(' ')[1])}</button>
           </div>
         </div>`).join('')}
      </div>
    `;
  }

  function showToast(message){
    toast.textContent = message;
    toast.style.display = 'block';
    toast.style.opacity = 1;
    setTimeout(()=>{
      toast.style.transition = 'opacity .4s ease';
      toast.style.opacity = 0;
      setTimeout(()=>toast.style.display = 'none',400);
    },2200);
  }

  function escapeHtml(s){return String(s).replace(/[&<>"']/g, function(m){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m];});}
})();
