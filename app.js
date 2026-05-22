/* === 3D TILT EFFECT ON MOUSE MOVE === */
document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // NAVBAR SCROLL BEHAVIOR
  // =============================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // =============================================
  // MOBILE MENU TOGGLE
  // =============================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  navToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  // Close menu on link click
  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // =============================================
  // SCROLL REVEAL (Intersection Observer)
  // =============================================
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // =============================================
  // ANIMATED COUNTER (Stats)
  // =============================================
  const counters = document.querySelectorAll('[data-target]');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target);
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          const update = () => {
            current += step;
            if (current < target) {
              counter.textContent = Math.floor(current).toLocaleString();
              requestAnimationFrame(update);
            } else {
              counter.textContent = target.toLocaleString();
            }
          };
          update();
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) counterObserver.observe(statsSection);

  // =============================================
  // 3D CARD TILT EFFECT (Desktop)
  // =============================================
  const tiltCards = document.querySelectorAll('.precio-card, .servicio-card, .testimonio-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // =============================================
  // FAQ ACCORDION
  // =============================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach(f => {
        f.classList.remove('open');
        f.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Open clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // =============================================
  // HERO 3D PARALLAX (Mouse)
  // =============================================
  const hero = document.querySelector('.hero');
  const floatingCards = document.querySelectorAll('.floating-card');
  const heroOrbs = document.querySelectorAll('.hero-orb');

  hero?.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    floatingCards.forEach((card, i) => {
      const depth = (i + 1) * 0.4;
      card.style.transform = `translate(${x * 20 * depth}px, ${y * 15 * depth}px) rotate(${i % 2 === 0 ? -3 : 3}deg)`;
    });

    heroOrbs.forEach((orb, i) => {
      const depth = (i + 1) * 0.15;
      orb.style.transform = `translate(${x * 30 * depth}px, ${y * 20 * depth}px)`;
    });
  });

  hero?.addEventListener('mouseleave', () => {
    floatingCards.forEach((card, i) => {
      card.style.transform = '';
    });
    heroOrbs.forEach(orb => { orb.style.transform = ''; });
  });

  // =============================================
  // SMOOTH ANCHOR SCROLL
  // =============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // =============================================
  // PLAN CARDS — GLOW ON HOVER
  // =============================================
  const pricingCards = document.querySelectorAll('.precio-card');
  pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      pricingCards.forEach(c => {
        if (c !== card) c.style.opacity = '0.7';
      });
    });
    card.addEventListener('mouseleave', () => {
      pricingCards.forEach(c => c.style.opacity = '1');
    });
  });

  // =============================================
  // SCROLL PROGRESS INDICATOR
  // =============================================
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4);
    z-index: 2000;
    transition: width 0.1s linear;
    width: 0%;
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });

  // =============================================
  // INTERACTIVE DASHBOARD TABS
  // =============================================
  const tabs = document.querySelectorAll('.cf-step-tab');
  const panels = document.querySelectorAll('.mock-content-body');
  const mockTitle = document.getElementById('mock-panel-title');
  const mockStatus = document.getElementById('mock-panel-status');

  const panelStates = {
    '1': { title: 'ZoraIQ - Auditoría Inicial', status: 'Escaneando...' },
    '2': { title: 'ZoraIQ - Goteo Inteligente', status: 'Smart Drip' },
    '3': { title: 'ZoraIQ - Perfiles de Autoridad', status: 'Autorizado' }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabNum = tab.dataset.tab;
      
      // Deactivate all
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      // Activate target
      tab.classList.add('active');
      const targetPanel = document.getElementById(`mock-view-${tabNum}`);
      if (targetPanel) targetPanel.classList.add('active');
      
      // Update mock header texts
      if (panelStates[tabNum]) {
        if (mockTitle) mockTitle.textContent = panelStates[tabNum].title;
        if (mockStatus) {
          mockStatus.textContent = panelStates[tabNum].status;
          // Color changes based on status
          if (tabNum === '1') {
            mockStatus.style.background = 'rgba(6, 182, 212, 0.1)';
            mockStatus.style.color = '#67e8f9';
            mockStatus.style.borderColor = 'rgba(6, 182, 212, 0.2)';
          } else if (tabNum === '2') {
            mockStatus.style.background = 'rgba(168, 85, 247, 0.1)';
            mockStatus.style.color = '#d8b4fe';
            mockStatus.style.borderColor = 'rgba(168, 85, 247, 0.2)';
          } else {
            mockStatus.style.background = 'rgba(34, 197, 94, 0.1)';
            mockStatus.style.color = '#4ade80';
            mockStatus.style.borderColor = 'rgba(34, 197, 94, 0.2)';
          }
        }
      }
    });
  });

  // =============================================
  // DYNAMIC ROI CALCULATOR
  // =============================================
  const reviewsRange = document.getElementById('reviews-range');
  const reviewsDisplay = document.getElementById('reviews-display');
  const ticketInput = document.getElementById('ticket-input');
  
  const metricRoiBoost = document.getElementById('metric-roi-boost');
  const valPlanCost = document.getElementById('val-plan-cost');
  const valVisibilityBoost = document.getElementById('val-visibility-boost');
  const valClientsRecovery = document.getElementById('val-clients-recovery');
  const valRoiPercentage = document.getElementById('val-roi-percentage');
  const btnBuySim = document.getElementById('btn-buy-sim');

  function calculateROI() {
    if (!reviewsRange || !ticketInput) return;

    const reviews = parseInt(reviewsRange.value);
    const ticket = parseFloat(ticketInput.value) || 0;

    // 1. Calculate Plan Cost
    let basePricePerReview = 5;
    let discount = 0;
    
    if (reviews >= 100) {
      discount = 0.30;
    } else if (reviews >= 50) {
      discount = 0.20;
    } else if (reviews >= 30) {
      discount = 0.10;
    }
    
    const rawCost = reviews * basePricePerReview * (1 - discount);
    const planCost = parseFloat(rawCost.toFixed(2));

    // 2. Estimate Visibility Boost
    const visibilityBoost = Math.min(250, reviews * 2.5);

    // 3. Estimate Monthly Clicks & New Customers
    const predictedClicksLift = reviews * 22;
    const conversionRate = 0.05;
    const newCustomers = Math.ceil(predictedClicksLift * conversionRate);
    
    // 4. Monthly Revenue & ROI
    const monthlyRevenue = newCustomers * ticket;
    const clientsToRecover = ticket > 0 ? Math.ceil(planCost / ticket) : 0;
    const roiPercentage = planCost > 0 ? Math.round((monthlyRevenue / planCost) * 100) : 0;

    // 5. Update UI Displays
    if (reviewsDisplay) reviewsDisplay.textContent = reviews;
    if (valPlanCost) valPlanCost.textContent = `$${planCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (valVisibilityBoost) valVisibilityBoost.textContent = `+${visibilityBoost}%`;
    if (valClientsRecovery) valClientsRecovery.textContent = `${clientsToRecover} ${clientsToRecover === 1 ? 'cliente' : 'clientes'}`;
    if (valRoiPercentage) valRoiPercentage.textContent = `${roiPercentage.toLocaleString()}%`;
    if (metricRoiBoost) metricRoiBoost.textContent = `+$${monthlyRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

    // 6. Update WhatsApp Link
    if (btnBuySim) {
      const message = `Hola ZoraIQ! Calculé mi ROI para un plan personalizado de ${reviews} reseñas con un ticket promedio de $${ticket}. Costo del plan: $${planCost}, Retorno estimado mensual: +$${monthlyRevenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}. Quiero contratar este plan.`;
      btnBuySim.href = `https://wa.me/584246057432?text=${encodeURIComponent(message)}`;
    }
  }

  if (reviewsRange && ticketInput) {
    reviewsRange.addEventListener('input', calculateROI);
    ticketInput.addEventListener('input', calculateROI);
    
    // Initial run
    calculateROI();
  }

  // =============================================
  // MINIMALIST BLOG CAROUSEL SLIDER
  // =============================================
  const blogGrid = document.getElementById('blog-grid');
  const prevBtn = document.getElementById('blog-prev-btn');
  const nextBtn = document.getElementById('blog-next-btn');

  if (blogGrid && prevBtn && nextBtn) {
    const getScrollParams = () => {
      const cards = blogGrid.querySelectorAll('.blog-card');
      if (cards.length === 0) return { cardWidth: 0, gap: 0 };
      const cardWidth = cards[0].offsetWidth;
      const style = window.getComputedStyle(blogGrid);
      const gap = parseFloat(style.columnGap || style.gap) || 28;
      return { cardWidth, gap };
    };

    const updateButtonStates = () => {
      const scrollLeft = blogGrid.scrollLeft;
      const maxScroll = Math.max(0, blogGrid.scrollWidth - blogGrid.clientWidth);
      
      if (scrollLeft <= 5) {
        prevBtn.style.opacity = '0.2';
        prevBtn.style.pointerEvents = 'none';
      } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
      }

      if (scrollLeft >= maxScroll - 5) {
        nextBtn.style.opacity = '0.2';
        nextBtn.style.pointerEvents = 'none';
      } else {
        nextBtn.style.opacity = '1';
        nextBtn.style.pointerEvents = 'auto';
      }
    };

    nextBtn.addEventListener('click', () => {
      const { cardWidth, gap } = getScrollParams();
      blogGrid.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      const { cardWidth, gap } = getScrollParams();
      blogGrid.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
    });

    // Update buttons on scroll and window resize
    blogGrid.addEventListener('scroll', updateButtonStates, { passive: true });
    window.addEventListener('resize', updateButtonStates, { passive: true });
    
    // Initial update after DOM settling
    setTimeout(updateButtonStates, 200);
  }

  // =============================================
  // PARTICLE SPARKLES (Hero background)
  // =============================================
  createParticles();

});

function createParticles() {
  const hero = document.querySelector('.hero-bg');
  if (!hero) return;

  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 8;
    const duration = Math.random() * 6 + 6;

    particle.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${Math.random() > 0.5 ? '#6366f1' : '#8b5cf6'};
      opacity: 0;
      animation: particle-twinkle ${duration}s ease-in-out ${delay}s infinite;
      pointer-events: none;
      z-index: 0;
    `;
    hero.appendChild(particle);
  }

  // Add keyframes for particle animation
  if (!document.getElementById('particle-style')) {
    const style = document.createElement('style');
    style.id = 'particle-style';
    style.textContent = `
      @keyframes particle-twinkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 0.6; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
}
