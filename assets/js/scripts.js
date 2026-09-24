/**
 * Md. Tamal Hossain Portfolio - Core Engine (100% Dynamic Backend Sync)
 */
(function () {
  "use strict";

  const BACKEND_URL = "https://tamalhossain-backend.vercel.app"; // শেষে কোনো স্লাশ (/) বা admin দেওয়া যাবে না
  const API_BASE = `${BACKEND_URL}/api`;

  // ডিফল্ট ব্যাকআপ ডাটা (ডাটাবেজ লোড হতে দেরি হলে বা খালি থাকলেও সাইট কখনো ফাঁকা থাকবে না)
  const DEFAULT_PROFILE = {
    name: "Md. Tamal Hossain",
    badgeText: "- I AM MD. TAMAL HOSSAIN",
    typingTitles:
      "Front-End Developer, WordPress Specialist, Full-Stack Developer, UI/UX Designer",
    heroTagline:
      "Crafting high-performance modern web applications, scalable WordPress architectures, and conversion-focused digital experiences.",
    btnSayHelloLink: "#contact",
    btnPortfolioLink: "#portfolio",
    aboutBio:
      "I am a passionate Front-End Developer & WordPress Specialist with proven expertise in building modern, ultra-fast web platforms. Specializing in high-converting landing pages, custom WooCommerce development, and scalable backend API integrations.\n\nWhether architecting headless CMS solutions, developing custom plugins, or optimizing Core Web Vitals for sub-second speeds, I focus on engineering clean, scalable solutions that drive measurable business growth.",
    email: "tamalhossain908@gmail.com",
    phone: "+880 1730048626",
    address: "Dhaka, Bangladesh",
    profileImage: "assets/img/profile-pic.png",
    skills: [
      { name: "HTML5 & CSS3 / SCSS", percentage: 95 },
      { name: "JavaScript (ES6+) & React.js", percentage: 90 },
      { name: "WordPress & WooCommerce", percentage: 95 },
      { name: "Node.js & Express / REST APIs", percentage: 85 },
      { name: "UI/UX Design & Tailwind / Bootstrap", percentage: 90 },
    ],
    services: [
      {
        title: "Front-End Development",
        icon: "fa-solid fa-code",
        desc: "Modern, responsive, pixel-perfect web interfaces built with clean HTML5, CSS3, JavaScript and React.",
      },
      {
        title: "WordPress & WooCommerce",
        icon: "fa-brands fa-wordpress",
        desc: "Custom themes, performance tuning, plugin configurations, and seamless checkout optimization.",
      },
      {
        title: "Full-Stack Web Apps",
        icon: "fa-solid fa-server",
        desc: "Scalable backend API development with Node.js, Express, MongoDB, and headless CMS integrations.",
      },
    ],
    funfacts: [
      {
        number: "50+",
        label: "Projects Completed",
        icon: "fa-solid fa-laptop-code",
      },
      {
        number: "4+",
        label: "Years Experience",
        icon: "fa-solid fa-calendar-check",
      },
      {
        number: "100%",
        label: "Client Satisfaction",
        icon: "fa-solid fa-heart",
      },
      {
        number: "24/7",
        label: "Dedicated Support",
        icon: "fa-solid fa-headset",
      },
    ],
    projectCategories: ["Website", "WordPress", "Graphic", "UI/UX"],
  };

  function resolveImageUrl(imgUrl) {
    if (!imgUrl) return "assets/img/profile-pic.png";
    if (
      imgUrl.startsWith("http://") ||
      imgUrl.startsWith("https://") ||
      imgUrl.startsWith("data:") ||
      imgUrl.startsWith("./") ||
      imgUrl.startsWith("assets/")
    ) {
      return imgUrl;
    }
    return `${BACKEND_URL}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
  }

  /* 1. SMART PRELOADER */
  let preloaderDismissed = false;
  function dismissPreloader() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.style.transition = "opacity 0.4s ease";
      preloader.style.opacity = "0";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 400);
    }
  }
  const fallbackTimer = setTimeout(dismissPreloader, 1500);

  /* 2. STICKY NAVBAR */
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (navbar) navbar.classList.toggle("nav-sticky", window.scrollY >= 50);
  });

  /* 3. DYNAMIC TYPEWRITER ENGINE */
  let typewriterTimeout = null;
  function runTypewriter(titles) {
    let wrap = document.querySelector("#typewriteHeading .wrap");
    if (!wrap) {
      const heading = document.getElementById("typewriteHeading");
      if (heading) {
        heading.innerHTML = '<span class="wrap"></span>';
        wrap = heading.querySelector(".wrap");
      }
    }
    if (!wrap || !titles || titles.length === 0) return;

    if (typewriterTimeout) clearTimeout(typewriterTimeout);
    let loopNum = 0;
    let isDeleting = false;
    let txt = "";

    function tick() {
      let i = loopNum % titles.length;
      let fullTxt = titles[i];

      if (isDeleting) {
        txt = fullTxt.substring(0, txt.length - 1);
      } else {
        txt = fullTxt.substring(0, txt.length + 1);
      }

      wrap.innerHTML = txt;

      let delta = 140 - Math.random() * 40;
      if (isDeleting) delta /= 2;

      if (!isDeleting && txt === fullTxt) {
        delta = 2000;
        isDeleting = true;
      } else if (isDeleting && txt === "") {
        isDeleting = false;
        loopNum++;
        delta = 350;
      }

      typewriterTimeout = setTimeout(tick, delta);
    }
    tick();
  }

  /* 4. SKILLS ANIMATION */
  window.triggerSkillsAnimation = function () {
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target
              .querySelectorAll(".skill-progress-fill")
              .forEach((bar) => {
                bar.style.width =
                  (bar.getAttribute("data-percent") || "0") + "%";
              });
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(skillsSection);
  };

  /* ==========================================================================
       5. MASTER DYNAMIC DOM RENDERER
       ========================================================================== */
  function applyProfileToDOM(prof) {
    if (!prof) return;

    // ১. ব্র্যান্ডিং ও ফেভিকন
    if (prof.siteLogo) {
      const navLogo = document.getElementById("dynNavLogo");
      if (navLogo) navLogo.src = resolveImageUrl(prof.siteLogo);
    }
    if (prof.siteFavicon) {
      const fav = document.getElementById("dynFavicon");
      if (fav) fav.href = resolveImageUrl(prof.siteFavicon);
    }

    // ২. হিরো সেকশন
    const sub = document.getElementById("dynSubtitle");
    if (sub) sub.innerText = prof.badgeText || DEFAULT_PROFILE.badgeText;

    const hName = document.getElementById("dynHeroName");
    if (hName) hName.innerText = prof.name || DEFAULT_PROFILE.name;

    const chatName = document.getElementById("dynChatName");
    if (chatName) chatName.innerText = prof.name || DEFAULT_PROFILE.name;

    const bio = document.getElementById("dynHeroBio");
    if (bio) bio.innerText = prof.heroTagline || DEFAULT_PROFILE.heroTagline;

    const b1 = document.getElementById("dynBtnSayHello");
    if (b1) b1.href = prof.btnSayHelloLink || "#contact";

    const b2 = document.getElementById("dynBtnPortfolio");
    if (b2) b2.href = prof.btnPortfolioLink || "#portfolio";

    // টাইপরাইটার
    const titlesStr = prof.typingTitles || DEFAULT_PROFILE.typingTitles;
    if (titlesStr) {
      const titlesArr = titlesStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      runTypewriter(titlesArr);
    }

    // সোশ্যাল লিংকস
    const socials =
      prof.socialLinks && prof.socialLinks.length > 0
        ? prof.socialLinks
        : [
            {
              name: "LinkedIn",
              icon: "fa-brands fa-linkedin-in",
              url: "https://linkedin.com",
            },
            {
              name: "GitHub",
              icon: "fa-brands fa-github",
              url: "https://github.com",
            },
            {
              name: "WhatsApp",
              icon: "fa-brands fa-whatsapp",
              url: "https://wa.me/8801730048626",
            },
          ];

    const socialHtml = socials
      .map(
        (s) => `
            <a target="_blank" href="${s.url}" class="social-dock-btn" aria-label="${s.name}">
                <i class="${s.icon}"></i>
                <span>${s.name}</span>
            </a>
        `,
      )
      .join("");

    const hDock = document.getElementById("dynHeroSocialDock");
    const cDock = document.getElementById("dynContactSocialDock");
    if (hDock) hDock.innerHTML = socialHtml;
    if (cDock) cDock.innerHTML = socialHtml;

    // ৩. ছবি ও বায়ো
    const pImg = document.getElementById("dynProfileImg");
    if (pImg)
      pImg.src = resolveImageUrl(
        prof.profileImage || DEFAULT_PROFILE.profileImage,
      );

    const chatAv = document.getElementById("dynChatAvatar");
    if (chatAv)
      chatAv.src = resolveImageUrl(
        prof.profileImage || DEFAULT_PROFILE.profileImage,
      );

    const introTitle = document.getElementById("dynIntroTitle");
    if (introTitle) {
      const primaryRole = (prof.typingTitles || DEFAULT_PROFILE.typingTitles)
        .split(",")[0]
        .trim();
      introTitle.innerHTML = `<span class="about-name-highlight">${prof.name || DEFAULT_PROFILE.name}</span> <span class="about-divider">-</span> <span class="about-role-highlight">${primaryRole}</span>`;
    }

    const aBio = document.getElementById("dynAboutBio");
    if (aBio) {
      const bioText = prof.aboutBio || DEFAULT_PROFILE.aboutBio;
      const paras = bioText.split("\n\n").filter(Boolean);
      aBio.innerHTML = paras.map((p) => `<p>${p}</p>`).join("");
    }

    if (prof.resumeFile && prof.resumeFile !== '#') {
            const resBtn = document.getElementById('dynResumeBtn');
            if (resBtn) {
                // ব্রাউজার সিকিউরিটি বাইপাস করে সরাসরি ডাউনলোড করার ট্রিক
                if (prof.resumeFile.startsWith('data:')) {
                    resBtn.href = "javascript:void(0)";
                    resBtn.onclick = function(e) {
                        e.preventDefault();
                        const link = document.createElement('a');
                        link.href = prof.resumeFile;
                        link.download = 'Md_Tamal_Hossain_Resume.pdf'; // ডাউনলোডের পর ফাইলের নাম এটি হবে
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    };
                } else {
                    resBtn.href = resolveImageUrl(prof.resumeFile);
                    resBtn.target = "_blank";
                }
                resBtn.style.display = 'inline-flex';
            }
        }
        

    // ৪. স্কিলস
    const skillsData =
      prof.skills && prof.skills.length > 0
        ? prof.skills
        : DEFAULT_PROFILE.skills;
    const sContainer = document.getElementById("dynSkillsList");
    if (sContainer) {
      sContainer.innerHTML = skillsData
        .map(
          (s) => `
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">${s.name}</span>
                        <span class="skill-percent">${s.percentage}%</span>
                    </div>
                    <div class="skill-progress-track">
                        <div class="skill-progress-fill" data-percent="${s.percentage}" style="width: ${s.percentage}%;"></div>
                    </div>
                </div>
            `,
        )
        .join("");
      window.triggerSkillsAnimation();
    }

    // ৫. সার্ভিসেস
    const servicesData =
      prof.services && prof.services.length > 0
        ? prof.services
        : DEFAULT_PROFILE.services;
    const servContainer = document.getElementById("dynServicesList");
    if (servContainer) {
      servContainer.innerHTML = servicesData
        .map(
          (s, idx) => `
                <div class="col-lg-4 col-md-6 col-sm-12 mb-4" data-aos="fade-up" data-aos-delay="${(idx + 1) * 100}">
                    <div class="serviceBox">
                        <div class="service-icon"><span class="${s.icon}"></span></div>
                        <h3 class="title">${s.title}</h3>
                        <p class="description">${s.desc}</p>
                    </div>
                </div>
            `,
        )
        .join("");
    }

    // ৬. ফানফ্যাক্টস
    const funData =
      prof.funfacts && prof.funfacts.length > 0
        ? prof.funfacts
        : DEFAULT_PROFILE.funfacts;
    const funContainer = document.getElementById("dynFunfactsList");
    if (funContainer) {
      funContainer.innerHTML = funData
        .map(
          (f, idx) => `
                <div class="col-lg-3 col-sm-6 col-12 mb-4" data-aos="fade-up" data-aos-delay="${(idx + 1) * 100}">
                    <div class="sp">
                        <h2 class="counter-num">${f.number}</h2>
                        <h3>${f.label}</h3>
                    </div>
                </div>
            `,
        )
        .join("");
    }

    // ৭. টেকনোলজি
    if (prof.technologies && prof.technologies.length > 0) {
      const techContainer = document.getElementById("dynTechGrid");
      if (techContainer) {
        techContainer.innerHTML = prof.technologies
          .map(
            (t) => `
                    <div class="tec-item">
                        <img src="${resolveImageUrl(t.logo)}" alt="${t.name}" class="img-fluid" loading="lazy" title="${t.name}" />
                    </div>
                `,
          )
          .join("");
      }
    }

    // ৮. এডুকেশন ও এক্সপেরিয়েন্স
    if (prof.education && prof.education.length > 0) {
      const eduContainer = document.getElementById("dynEduContainer");
      if (eduContainer) {
        eduContainer.innerHTML = prof.education
          .map(
            (e) => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-card">
                            <div class="timeline-card-header">
                                <h4 class="timeline-role">${e.degree}</h4>
                                <span class="timeline-badge">${e.year}</span>
                            </div>
                            <h5 class="timeline-company"><i class="fa-solid fa-award me-2"></i>${e.institute}</h5>
                        </div>
                    </div>
                `,
          )
          .join("");
      }
    }

    if (prof.experience && prof.experience.length > 0) {
      const expContainer = document.getElementById("dynExpContainer");
      if (expContainer) {
        expContainer.innerHTML = prof.experience
          .map(
            (x) => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-card">
                            <div class="timeline-card-header">
                                <h4 class="timeline-role">${x.role}</h4>
                                <span class="timeline-badge">${x.duration}</span>
                            </div>
                            <h5 class="timeline-company"><i class="fa-regular fa-building me-2"></i>${x.company}</h5>
                            <p class="timeline-desc">${x.description}</p>
                        </div>
                    </div>
                `,
          )
          .join("");
      }
    }

    // ৯. কনট্যাক্ট ইনফো
    const em = document.getElementById("dynContactEmail");
    if (em) em.innerText = prof.email || DEFAULT_PROFILE.email;

    const ph = document.getElementById("dynContactPhone");
    if (ph) ph.innerText = prof.phone || DEFAULT_PROFILE.phone;

    const ad = document.getElementById("dynContactAddress");
    if (ad) ad.innerText = prof.address || DEFAULT_PROFILE.address;
  }

  /* ==========================================================================
       6. PORTFOLIO PROJECTS RENDERER
       ========================================================================== */
  function applyProjectsToDOM(projects) {
    const grid = document.getElementById("dynPortfolioGrid");
    if (!grid || !projects || projects.length === 0) return;

    grid.innerHTML = projects
      .map((p) => {
        const isScroll = p.scrollMode === "scroll";
        const isLightbox = p.actionType === "lightbox";
        const catClass = (p.category || "website")
          .toLowerCase()
          .replace(/\s+/g, "-");
        const safeTitle = (p.title || "").replace(/'/g, "\\'");
        const projectImg = resolveImageUrl(p.image);

        return `
                <div class="col-lg-4 col-md-6 col-12 mix ${catClass} mb-4">
                    <div class="portfolio-card">
                        <div class="browser-bar">
                            <span class="dot dot-red"></span>
                            <span class="dot dot-yellow"></span>
                            <span class="dot dot-green"></span>
                            <span class="browser-title">${p.title}</span>
                        </div>
                        <div class="${isScroll ? "card-screen-scroll" : "card-screen-graphic"}">
                            <img src="${projectImg}" alt="${p.title}" loading="lazy" />
                            ${
                              isLightbox
                                ? `
                                <button type="button" class="graphic-zoom-overlay" onclick="openLightbox('${projectImg}', '${safeTitle}')" title="Zoom Preview">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </button>
                            `
                                : ""
                            }
                        </div>
                        <div class="card-meta">
                            <div class="meta-text">
                                <span class="meta-cat">${p.category}</span>
                                <h3 class="title">${p.title}</h3>
                                <p class="desc">${p.description || ""}</p>
                            </div>
                            <div class="meta-action">
                                ${
                                  p.liveUrl && !isLightbox
                                    ? `
                                    <a href="${p.liveUrl}" target="_blank" class="port-btn" title="Live Preview">
                                        <i class="fa fa-link"></i>
                                    </a>
                                `
                                    : `
                                    <button type="button" onclick="openLightbox('${projectImg}', '${safeTitle}')" class="port-btn" title="Zoom Preview">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                `
                                }
                            </div>
                        </div>
                    </div>
                </div>
            `;
      })
      .join("");
  }

  /* ==========================================================================
       7. ZERO-LAG BACKEND SYNC (BULLETPROOF EXECUTION)
       ========================================================================== */
  async function syncPortfolioWithBackend() {
    // ধাপ ১: ডিফল্ট বা ক্যাশ থেকে সাথে সাথে স্ক্রিন লোড করা (যাতে কখনো ব্ল্যাঙ্ক না থাকে)
    try {
      const cachedProf = localStorage.getItem("portfolio_cached_profile");
      applyProfileToDOM(cachedProf ? JSON.parse(cachedProf) : DEFAULT_PROFILE);

      const cachedProj = localStorage.getItem("portfolio_cached_projects");
      if (cachedProj) applyProjectsToDOM(JSON.parse(cachedProj));
    } catch (e) {
      applyProfileToDOM(DEFAULT_PROFILE);
    }

    // ধাপ ২: ব্যাকএন্ড থেকে তাজা ডেটা ফেচ
    try {
      const [profRes, projRes] = await Promise.all([
        fetch(`${API_BASE}/profile`).catch(() => null),
        fetch(`${API_BASE}/projects`).catch(() => null),
      ]);

      if (profRes && profRes.ok) {
        const freshProfile = await profRes.json();
        if (freshProfile && Object.keys(freshProfile).length > 0) {
          applyProfileToDOM(freshProfile);
          localStorage.setItem(
            "portfolio_cached_profile",
            JSON.stringify(freshProfile),
          );
        }
      }

      if (projRes && projRes.ok) {
        const freshProjects = await projRes.json();
        if (freshProjects && freshProjects.length > 0) {
          applyProjectsToDOM(freshProjects);
          localStorage.setItem(
            "portfolio_cached_projects",
            JSON.stringify(freshProjects),
          );
        }
      }
    } catch (err) {
      console.log("Running on cached/fallback content:", err);
    } finally {
      clearTimeout(fallbackTimer);
      dismissPreloader();
    }
  }

  // স্ক্রিপ্ট যখনই রান হোক, সাথে সাথে এক্সিকিউট করবে (ইভেন্ট মিস হবে না)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncPortfolioWithBackend);
  } else {
    syncPortfolioWithBackend();
  }

  /* ==========================================================================
       8. LIGHTBOX, CONTACT & LIVE CHAT
       ========================================================================== */
  window.openLightbox = function (imageSrc, title) {
    const modal = document.getElementById("imageLightbox");
    const img = document.getElementById("lightboxImg");
    const caption = document.getElementById("lightboxTitle");
    if (!modal || !img) return;
    img.src = imageSrc || "";
    if (caption) caption.innerText = title || "";
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  window.closeLightbox = function () {
    const modal = document.getElementById("imageLightbox");
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  window.handleLightboxBackdrop = function (e) {
    if (e && e.target && e.target.id === "imageLightbox")
      window.closeLightbox();
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") window.closeLightbox();
  });

  // Contact Form
  const form = document.getElementById("contactForm");
  const popup = document.getElementById("thankYouPopup");
  const submitBtn = document.getElementById("submitBtn");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const originalText = submitBtn.innerText;
      submitBtn.innerText = "Sending...";
      submitBtn.disabled = true;

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(form),
      })
        .then((res) => {
          if (res.ok) {
            if (popup) popup.style.display = "flex";
            form.reset();
          } else {
            alert("Something went wrong, please try again.");
          }
        })
        .catch(() => alert("Network error, please try again."))
        .finally(() => {
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
        });
    });
  }

  window.closePopup = function () {
    if (popup) popup.style.display = "none";
  };

  window.toggleLiveChat = function () {
    const chatBox = document.getElementById("liveChatBox");
    if (!chatBox) return;
    const isOpen =
      chatBox.classList.contains("open") || chatBox.style.display === "flex";
    chatBox.classList.toggle("open", !isOpen);
    chatBox.style.display = isOpen ? "none" : "flex";
  };

  window.sendLiveMessage = function (e) {
    e.preventDefault();
    const input = document.getElementById("liveUserMessage");
    const msg = input ? input.value.trim() : "";
    if (!msg) return;

    const chatBody = document.getElementById("liveChatBody");
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (chatBody) {
      chatBody.innerHTML += `
                <div class="chat-msg chat-outgoing">
                    <p>${msg}</p>
                    <span class="chat-msg-time">${time}</span>
                </div>
            `;
      chatBody.scrollTop = chatBody.scrollHeight;
    }
    if (input) input.value = "";
  };
})();

/* ==========================================================================
   BACKGROUND CANVAS PARTICLES (Cosmic Stars 60 FPS)
   ========================================================================== */
const canvas = document.getElementById("bgCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [];
  const starCount = window.innerWidth < 768 ? 40 : 80;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class SparklingStar {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.6;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.sparklePhase = Math.random() * Math.PI * 2;
      this.isDiamond = Math.random() > 0.75;
    }
    draw() {
      this.sparklePhase += 0.02;
      const brightness = (Math.sin(this.sparklePhase) + 1) / 2;
      const alpha = 0.2 + brightness * 0.7;

      ctx.save();
      ctx.translate(this.x, this.y);
      if (this.isDiamond) {
        ctx.fillStyle = `rgba(240, 187, 98, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 2.5);
        ctx.lineTo(this.size * 0.6, -this.size * 0.6);
        ctx.lineTo(this.size * 2.5, 0);
        ctx.lineTo(this.size * 0.6, this.size * 0.6);
        ctx.lineTo(0, this.size * 2.5);
        ctx.lineTo(-this.size * 0.6, this.size * 0.6);
        ctx.lineTo(-this.size * 2.5, 0);
        ctx.lineTo(-this.size * 0.6, -this.size * 0.6);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
      this.draw();
    }
  }

  for (let i = 0; i < starCount; i++) stars.push(new SparklingStar());

  function animateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => star.update());
    requestAnimationFrame(animateSparkles);
  }
  animateSparkles();
}




// ==========================================
// 9. INITIALIZE AOS ANIMATION (CRITICAL FIX)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 50
            });
            AOS.refresh();
        }
    }, 500); // ডাটা রেন্ডার হওয়ার জন্য হাফ সেকেন্ড সময় দেওয়া হলো
});