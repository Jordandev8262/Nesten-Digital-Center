document.getElementById('year').textContent = new Date().getFullYear();

// Preloader logic: hide overlay once page is loaded
(function(){
  const preloader = document.getElementById('preloader');
  const body = document.body;
  if(!preloader) return;

  function hidePreloader(){
    preloader.classList.add('hidden');
    body.classList.remove('no-scroll');
  }

  if(document.readyState === 'complete'){
    // Si tout est déjà chargé
    setTimeout(hidePreloader, 4000);
  } else {
    window.addEventListener('load', ()=> setTimeout(hidePreloader, 4000));
  }
})();

// Smooth scroll for internal anchors
const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link=>{
  link.addEventListener('click',e=>{
    const targetId = link.getAttribute('href').slice(1);
    const el = document.getElementById(targetId);
    if(el){
      e.preventDefault();
      window.scrollTo({top: el.offsetTop-70, behavior: 'smooth'});
    }
  });
});

// Auto-cycle testimonials
const carouselEl = document.getElementById('testimonials');
if(carouselEl){
  const carousel = new bootstrap.Carousel(carouselEl, { interval: 6000 });
}

// Intersection Observer for reveal animation with subtle movement
const revealEls = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-zoom');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  })
},{threshold:0.15, rootMargin:'0px 0px -40px 0px'});
revealEls.forEach(el=>io.observe(el));

// Pricing toggle (Mensuel / Annuel)
(function(){
  const btnMonthly = document.getElementById('btnMonthly');
  const btnYearly = document.getElementById('btnYearly');
  const prices = document.querySelectorAll('.price');
  if(!btnMonthly || !btnYearly || prices.length === 0) return;

  function setMode(mode){
    prices.forEach(el => {
      const value = el.dataset[mode];
      if(value) el.textContent = value;
    });
    btnMonthly.classList.toggle('active', mode === 'monthly');
    btnYearly.classList.toggle('active', mode === 'yearly');
  }

  btnMonthly.addEventListener('click', () => setMode('monthly'));
  btnYearly.addEventListener('click', () => setMode('yearly'));
})();

// Navbar: toggle "navbar-scrolled" class on scroll + swap logo (noir ↔ blanc)
(function(){
  const nav = document.querySelector('.navbar');
  if(!nav) return;
  const logo = nav.querySelector('.navbar-logo');
  const darkSrc = 'assets/svg/ENIFMAUP%20NOIR%25.png';
  const lightSrc = 'assets/svg/BLANC.png';

  // Assure qu'aucune classe d'état scroll n'est active au chargement
  nav.classList.remove('navbar-scrolled');

  function update(){
    // Désactivation de la transformation de navbar au scroll
    // On conserve simplement le logo sombre et on n’ajoute plus la classe navbar-scrolled
    nav.classList.remove('navbar-scrolled');
    if(logo){
      const desiredAbs = new URL(darkSrc, window.location.href).href;
      if(logo.src !== desiredAbs){ logo.src = darkSrc; }
    }
  }
  update();
  // On laisse l'écouteur de scroll en place, mais il ne change plus l'apparence de la navbar
  window.addEventListener('scroll', update, { passive: true });

  // Mobile menu: fullscreen square background when collapse is open
  const collapse = document.getElementById('mainNav');
  if(collapse){
    collapse.addEventListener('show.bs.collapse', ()=>{
      nav.classList.add('navbar-open');
    });
    collapse.addEventListener('hide.bs.collapse', ()=>{
      nav.classList.remove('navbar-open');
    });
  }
})();