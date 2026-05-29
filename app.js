/* -------------------------------------------------------------
 * ABHIJEET SALVE - PORTFOLIO INTERACTION & GRAPHICS SCRIPT
 * ------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Loader
  initLoader();

  // 2. Load Dynamic Content from cv-data.js
  loadPortfolioData();

  // 3. Initialize Custom Cursor & Spotlight
  initCustomCursor();

  // 4. Initialize Three.js Background
  initThreeBackground();

  // 5. Initialize GSAP & ScrollTrigger Animations
  initScrollAnimations();

  // 6. Setup Interactive Features (Contact Form, Print Action)
  setupInteractions();
});

/* =============================================================
 * 1. LOADING CONTROLLER
 * ============================================================= */
function initLoader() {
  const overlay = document.getElementById("loader-overlay");
  const progress = document.querySelector(".loader-progress");
  const logo = document.querySelector(".loader-logo");
  
  if (!overlay) return;

  // Animate the text in
  gsap.to(logo, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });

  // Simulate loading steps
  let loadingObj = { pct: 0 };
  gsap.to(loadingObj, {
    pct: 100,
    duration: 2.2,
    ease: "power2.inOut",
    onUpdate: () => {
      progress.style.width = `${loadingObj.pct}%`;
    },
    onComplete: () => {
      // Fade out loader
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          overlay.style.display = "none";
          // Trigger Hero entry animations
          triggerHeroEntry();
        }
      });
    }
  });
}

function triggerHeroEntry() {
  const tl = gsap.timeline();
  tl.from(".hero-designation", { opacity: 0, y: -20, duration: 0.6, ease: "power3.out" })
    .from(".hero-name", { opacity: 0, y: 30, duration: 0.8, ease: "power4.out" }, "-=0.3")
    .from(".hero-headline", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.4")
    .from(".hero-desc", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" }, "-=0.4")
    .from(".hero-btn", { opacity: 0, scale: 0.9, stagger: 0.15, duration: 0.5, ease: "back.out(1.7)" }, "-=0.3")
    .from(".profile-frame-container", { opacity: 0, scale: 0.8, rotate: -5, duration: 1.2, ease: "power4.out" }, "-=1")
    .from("header", { opacity: 0, y: -50, duration: 0.8, ease: "power3.out" }, "-=1");
}

/* =============================================================
 * 2. DYNAMIC CONTENT INJECTION
 * ============================================================= */
function loadPortfolioData() {
  if (typeof cvData === "undefined") {
    console.error("cvData not found. Make sure cv-data.js is loaded first.");
    return;
  }

  // Set Profile details
  document.querySelectorAll(".meta-name").forEach(el => el.textContent = cvData.profile.name);
  document.querySelectorAll(".meta-designation").forEach(el => el.textContent = cvData.profile.designation);
  
  const headlineEl = document.querySelector(".meta-headline");
  if (headlineEl) headlineEl.textContent = cvData.profile.headline;
  
  const bioEl = document.querySelector(".meta-bio");
  if (bioEl) bioEl.textContent = cvData.profile.bio;
  
  document.querySelectorAll(".meta-avatar").forEach(el => el.src = cvData.profile.avatar);
  
  // Set Contact Links
  const phoneEl = document.getElementById("contact-phone");
  if (phoneEl) phoneEl.textContent = cvData.profile.contact.phone;
  
  const phoneLinkEl = document.getElementById("contact-phone-link");
  if (phoneLinkEl) phoneLinkEl.href = `tel:${cvData.profile.contact.phone.replace(/\s+/g, '')}`;
  
  const emailEl = document.getElementById("contact-email");
  if (emailEl) emailEl.textContent = cvData.profile.contact.email;
  
  const emailLinkEl = document.getElementById("contact-email-link");
  if (emailLinkEl) emailLinkEl.href = `mailto:${cvData.profile.contact.email}`;

  const emailLinkCardEl = document.getElementById("contact-email-link-card");
  if (emailLinkCardEl) emailLinkCardEl.href = `mailto:${cvData.profile.contact.email}`;
  
  const addressEl = document.getElementById("contact-address");
  if (addressEl) addressEl.textContent = cvData.profile.contact.address;
  
  const cvBtnEl = document.getElementById("cv-download-btn");
  if (cvBtnEl) cvBtnEl.href = cvData.profile.resumeLink;

  // Build Metrics
  const metricsGrid = document.getElementById("metrics-grid");
  if (metricsGrid) {
    metricsGrid.innerHTML = cvData.metrics.map(metric => `
      <div class="glass-card p-6 flex flex-col items-center text-center group">
        <div class="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
          <i data-lucide="${metric.icon}"></i>
        </div>
        <div class="metric-number text-4xl md:text-5xl font-extrabold mb-1" data-value="${metric.value}">${metric.value}</div>
        <div class="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-2">${metric.label}</div>
        <div class="text-xs text-slate-400 leading-relaxed">${metric.description}</div>
      </div>
    `).join('');
  }

  // Build Skills (Categories)
  const skillsContainer = document.getElementById("skills-container");
  if (skillsContainer) {
    skillsContainer.innerHTML = cvData.skills.map(skill => `
      <div class="glass-card skill-card p-5 group flex flex-col justify-between" data-category="${skill.category}">
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-500/5 border border-white/5 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/30 transition-all duration-300">
              <i data-lucide="${skill.icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="text-xs font-semibold uppercase tracking-widest text-slate-500">${skill.category}</span>
              <h4 class="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">${skill.name}</h4>
            </div>
          </div>
          <span class="text-xs font-bold text-slate-400 skill-percent-label" data-target="${skill.percentage}">0%</span>
        </div>
        <div class="skill-progress-bar w-full mt-2">
          <div class="skill-progress-fill" data-percentage="${skill.percentage}"></div>
        </div>
      </div>
    `).join('');
  }

  // Build Timeline Experience
  const timeline = document.getElementById("experience-timeline");
  if (timeline) {
    timeline.innerHTML = cvData.experience.map(exp => `
      <div class="relative timeline-card pl-8 pb-12 last:pb-0">
        <div class="timeline-node"></div>
        <div class="glass-card p-6 md:p-8 hover:shadow-[0_10px_30px_rgba(0,240,255,0.05)] transition-all">
          <span class="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/30 px-3 py-1 rounded-full">${exp.period}</span>
          <h3 class="text-xl md:text-2xl font-bold mt-4 text-white">${exp.role}</h3>
          <h4 class="text-base font-semibold text-slate-400 mt-1">${exp.company} | ${exp.location}</h4>
          <p class="text-sm text-slate-400 mt-4 leading-relaxed">${exp.description}</p>
          
          <ul class="mt-6 space-y-3">
            ${exp.highlights.map(hl => `
              <li class="flex items-start text-xs md:text-sm text-slate-300 leading-relaxed">
                <span class="text-blue-500 mr-2.5 mt-1">&#9670;</span>
                <span>${hl}</span>
              </li>
            `).join('')}
          </ul>

          <div class="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/5">
            ${exp.tags.map(tag => `
              <span class="text-xs text-slate-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded">${tag}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  // Build Achievements
  const achievementsGrid = document.getElementById("achievements-grid");
  if (achievementsGrid) {
    achievementsGrid.innerHTML = cvData.achievements.map(ach => `
      <div class="glass-card p-6 flex flex-col justify-between group">
        <div>
          <div class="flex justify-between items-start mb-4">
            <span class="text-xs font-semibold text-purple-400 uppercase tracking-wider bg-purple-950/40 border border-purple-800/30 px-2.5 py-1 rounded-full">${ach.period}</span>
            <div class="text-purple-400 group-hover:rotate-12 transition-transform duration-300">
              <i data-lucide="award" class="w-6 h-6"></i>
            </div>
          </div>
          <h3 class="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">${ach.title}</h3>
          <p class="text-xs md:text-sm text-slate-400 leading-relaxed">${ach.description}</p>
        </div>
      </div>
    `).join('');
  }

  // Build Education (Timeline or Grid)
  const educationTimeline = document.getElementById("education-timeline");
  if (educationTimeline) {
    educationTimeline.innerHTML = cvData.education.map(edu => `
      <div class="relative timeline-card pl-8 pb-8 last:pb-0">
        <div class="timeline-node" style="border-color: var(--accent-purple); box-shadow: 0 0 10px var(--accent-purple);"></div>
        <div class="glass-card p-6">
          <span class="text-xs font-bold text-purple-400 uppercase tracking-widest bg-purple-950/40 border border-purple-800/30 px-3 py-1 rounded-full">${edu.period}</span>
          <h3 class="text-lg md:text-xl font-bold mt-4 text-white">${edu.degree}</h3>
          ${edu.institution ? `<h4 class="text-sm font-semibold text-slate-400 mt-1">${edu.institution}</h4>` : ''}
          ${edu.details ? `<p class="text-xs md:text-sm text-slate-500 mt-2">${edu.details}</p>` : ''}
        </div>
      </div>
    `).join('');
  }

  // Trigger Lucide icon render
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

/* =============================================================
 * 3. CUSTOM CURSOR & LIGHT SPOTLIGHT
 * ============================================================= */
function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const spotlight = document.getElementById("mouse-spotlight");

  if (!cursor || window.matchMedia("(max-width: 1024px)").matches) {
    if (cursor) cursor.style.display = "none";
    return;
  }

  // Mouse Move Event Listener
  window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;

    // Direct position for inner dot
    gsap.to(cursor, {
      x: clientX,
      y: clientY,
      xPercent: -50,
      yPercent: -50,
      duration: 0.1,
      ease: "power2.out"
    });

    // Spotlight follows custom coordinates
    document.documentElement.style.setProperty("--x", `${clientX}px`);
    document.documentElement.style.setProperty("--y", `${clientY}px`);
  });

  // Hover Effect for interactive links
  const interactives = document.querySelectorAll("a, button, input, textarea, .glass-card, .btn-glow");
  interactives.forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hovering");
      gsap.to(cursor, { scale: 1.5, duration: 0.2 });
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hovering");
      gsap.to(cursor, { scale: 1, duration: 0.2 });
    });
  });
}

/* =============================================================
 * 4. THREE.JS 3D PARTICLE WAVE BACKGROUND
 * ============================================================= */
function initThreeBackground() {
  const container = document.getElementById("canvas-container");
  if (!container) return;

  const width = window.innerWidth;
  const height = window.innerHeight;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 30;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Particles Configuration
  const particleCount = 1000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorBlue = new THREE.Color("#0066ff");
  const colorPurple = new THREE.Color("#a21caf");
  const colorCyan = new THREE.Color("#00f0ff");

  // Grid / Field layout
  const rows = 40;
  const cols = 25;
  const spacingX = 1.2;
  const spacingY = 1.2;

  let index = 0;
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (index >= particleCount) break;

      // Center layout around 0
      const posX = (x - rows / 2) * spacingX;
      const posY = (y - cols / 2) * spacingY;
      const posZ = 0;

      positions[index * 3] = posX;
      positions[index * 3 + 1] = posY;
      positions[index * 3 + 2] = posZ;

      // Color gradients based on grid coordinates
      let mixColor = new THREE.Color();
      const mixRatio = (x / rows) * 0.5 + (y / cols) * 0.5;
      
      if (mixRatio < 0.4) {
        mixColor.copy(colorBlue).lerp(colorCyan, mixRatio * 2.5);
      } else {
        mixColor.copy(colorCyan).lerp(colorPurple, (mixRatio - 0.4) * 1.6);
      }

      colors[index * 3] = mixColor.r;
      colors[index * 3 + 1] = mixColor.g;
      colors[index * 3 + 2] = mixColor.b;

      index++;
    }
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Materials
  // Using simple transparent circle texture
  const textureLoader = new THREE.TextureLoader();
  // Falling back to custom Canvas Texture for reliability without external assets
  const canvasTexture = createCircleTexture();

  const material = new THREE.PointsMaterial({
    size: 0.4,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
    map: canvasTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  // Points mesh
  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // Tilt/Rotation properties
  let targetRotationX = 0;
  let targetRotationY = 0;
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    // Range: -0.5 to 0.5
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const positionArray = geometry.attributes.position.array;

    // Apply wave modulation
    let idx = 0;
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        if (idx >= particleCount) break;

        // Animate grid heights (Z coordinate) using dual-sine wave mapping
        const posX = positionArray[idx * 3];
        const posY = positionArray[idx * 3 + 1];

        // Complex operational frequency simulation
        const wave1 = Math.sin(posX * 0.12 + elapsedTime * 0.6) * 1.8;
        const wave2 = Math.cos(posY * 0.18 + elapsedTime * 0.8) * 1.2;
        const wave3 = Math.sin((posX + posY) * 0.08 + elapsedTime * 0.5) * 0.8;

        positionArray[idx * 3 + 2] = wave1 + wave2 + wave3;

        idx++;
      }
    }
    geometry.attributes.position.needsUpdate = true;

    // Smooth hover camera rotation parallax
    targetRotationX += (mouseY * 0.25 - targetRotationX) * 0.05;
    targetRotationY += (mouseX * 0.25 - targetRotationY) * 0.05;

    points.rotation.x = targetRotationX;
    points.rotation.y = targetRotationY;
    points.rotation.z = elapsedTime * 0.015; // Slow ambient rotation

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// Generate simple circular texture for WebGL particles
function createCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d");

  // Create gradient
  const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
  grad.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
  grad.addColorStop(1, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 16, 16);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/* =============================================================
 * 5. GSAP SCROLL-TRIGGER ANIMATIONS
 * ============================================================= */
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Custom Page Scroll Indicator
  const scrollBar = document.querySelector(".scroll-progress");
  if (scrollBar) {
    window.addEventListener("scroll", () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = (window.scrollY / scrollHeight) * 100;
      scrollBar.style.width = `${pct}%`;
    });
  }

  // Scroll Fade in for general containers
  const animateOnScroll = document.querySelectorAll(".glass-card, .section-heading, .timeline-card");
  animateOnScroll.forEach(el => {
    gsap.from(el, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "play none none none"
      }
    });
  });

  // Animated KPI Counters (in Hero Background or Metrics section)
  setTimeout(() => {
    const counterElements = document.querySelectorAll(".metric-number");
    counterElements.forEach(el => {
      const valStr = el.dataset.value;
      const numericVal = parseFloat(valStr.replace(/[^\d.]/g, ''));
      const hasPercent = valStr.includes("%");
      const hasPlus = valStr.includes("+");
      const suffix = (hasPercent ? "%" : "") + (hasPlus ? "+" : "");

      const numObj = { val: 0 };
      
      gsap.to(numObj, {
        val: numericVal,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%"
        },
        onUpdate: () => {
          // Check if float or int
          if (numericVal % 1 === 0) {
            el.textContent = Math.floor(numObj.val) + suffix;
          } else {
            el.textContent = numObj.val.toFixed(1) + suffix;
          }
        }
      });
    });
  }, 500);

  // Skill Fill Progress animations
  setTimeout(() => {
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) return;

    const skillFills = document.querySelectorAll(".skill-progress-fill");
    const skillLabels = document.querySelectorAll(".skill-percent-label");

    skillFills.forEach((fill, index) => {
      const targetPercent = parseInt(fill.dataset.percentage);
      const label = skillLabels[index];

      gsap.to(fill, {
        width: `${targetPercent}%`,
        duration: 1.8,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: skillsSection,
          start: "top 75%"
        }
      });

      // Animate percentage counts
      const pctObj = { val: 0 };
      gsap.to(pctObj, {
        val: targetPercent,
        duration: 1.8,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: skillsSection,
          start: "top 75%"
        },
        onUpdate: () => {
          label.textContent = `${Math.floor(pctObj.val)}%`;
        }
      });
    });
  }, 500);

  // Parallax Scroll Effect for background ambient blobs
  gsap.to(".glow-blue", {
    y: 100,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });

  gsap.to(".glow-purple", {
    y: -100,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });
}

/* =============================================================
 * 6. USER INTERACTIONS (FORM SUBMISSION & PRINT)
 * ============================================================= */
function setupInteractions() {
  // Contact Form Interception
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const btn = contactForm.querySelector("button[type='submit']");
      const name = document.getElementById("form-name").value;
      const email = document.getElementById("form-email").value;
      
      // Visual Feedback using GSAP
      const originalText = btn.innerHTML;
      btn.innerHTML = `<span class="flex items-center justify-center gap-2"><i data-lucide="loader" class="animate-spin w-4 h-4"></i> Sending...</span>`;
      if (typeof lucide !== "undefined") lucide.createIcons();

      setTimeout(() => {
        btn.innerHTML = `<span class="flex items-center justify-center gap-2 text-emerald-400"><i data-lucide="check-circle" class="w-4 h-4"></i> Message Sent!</span>`;
        if (typeof lucide !== "undefined") lucide.createIcons();
        contactForm.reset();
        
        // Return button text to normal after a delay
        setTimeout(() => {
          btn.innerHTML = originalText;
          if (typeof lucide !== "undefined") lucide.createIcons();
        }, 3000);
      }, 1500);
    });
  }

  // Print Page / Resume View trigger
  const printTrigger = document.getElementById("btn-print-resume");
  if (printTrigger) {
    printTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      window.print();
    });
  }
}
