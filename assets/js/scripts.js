/**
 * Md. Tamal Hossain Portfolio - Universal Realtime Dynamic Engine
 */
(function() {
    'use strict';

    const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000'
        : 'https://tamalhossain-backend.vercel.app';

    const API_PROFILE = `${BACKEND_URL}/api/profile`;
    const API_PROJECTS = `${BACKEND_URL}/api/projects`;

    function resolveImageUrl(url) {
        if (!url) return 'assets/img/profile-pic.png';
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('./') || url.startsWith('assets/')) {
            return url;
        }
        return `${BACKEND_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    // প্রিলোডার ডিমিস
    function dismissPreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.transition = 'opacity 0.4s ease';
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 400);
        }
    }
    setTimeout(dismissPreloader, 1500);

    /* ==========================================================
       টাইপরাইটার এফেক্ট
       ========================================================== */
    function initTypewriter(words) {
        const target = document.getElementById('typewriteHeading');
        if (!target || !words || words.length === 0) return;

        let wordIdx = 0, charIdx = 0, isDeleting = false;
        const wrap = target.querySelector('.wrap') || target;

        function type() {
            const current = words[wordIdx];
            if (isDeleting) {
                wrap.innerText = current.substring(0, charIdx - 1);
                charIdx--;
            } else {
                wrap.innerText = current.substring(0, charIdx + 1);
                charIdx++;
            }

            let speed = isDeleting ? 40 : 80;
            if (!isDeleting && charIdx === current.length) {
                speed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                speed = 500;
            }
            setTimeout(type, speed);
        }
        type();
    }

    /* ==========================================================
       DOM আপডেট লজিক (সব কয়টি ফিল্ড)
       ========================================================= */
    function applyProfileToDOM(prof) {
        if (!prof) return;

        // ১. ব্র্যান্ডিং ও হেড
        if (prof.siteLogo) {
            const logo = document.getElementById('dynNavLogo');
            if (logo) logo.src = resolveImageUrl(prof.siteLogo);
        }
        if (prof.siteFavicon) {
            const fav = document.getElementById('dynFavicon');
            if (fav) fav.href = resolveImageUrl(prof.siteFavicon);
        }

        // ২. হিরো সেকশন
        if (prof.badgeText) {
            const b = document.getElementById('dynSubtitle');
            if (b) b.innerText = prof.badgeText;
        }
        if (prof.name) {
            const n = document.getElementById('dynHeroName');
            if (n) n.innerText = prof.name;
            const chatN = document.getElementById('dynChatName');
            if (chatN) chatN.innerText = prof.name;
        }
        if (prof.heroTagline) {
            const bio = document.getElementById('dynHeroBio');
            if (bio) bio.innerText = prof.heroTagline;
        }
        if (prof.btnSayHelloLink) {
            const btn1 = document.getElementById('dynBtnSayHello');
            if (btn1) btn1.href = prof.btnSayHelloLink;
        }
        if (prof.btnPortfolioLink) {
            const btn2 = document.getElementById('dynBtnPortfolio');
            if (btn2) btn2.href = prof.btnPortfolioLink;
        }

        // টাইপিং টাইটেলস
        if (prof.typingTitles) {
            const titlesArr = prof.typingTitles.split(',').map(s => s.trim()).filter(Boolean);
            initTypewriter(titlesArr);
        }

        // সোশাল ডক (হিরো ও কনট্যাক্ট উভয়েই)
        if (prof.socialLinks && prof.socialLinks.length > 0) {
            const html = prof.socialLinks.map(s => `
                <a target="_blank" href="${s.url}" class="social-dock-btn" aria-label="${s.name}">
                    <i class="${s.icon}"></i>
                    <span>${s.name}</span>
                </a>
            `).join('');
            const hDock = document.getElementById('dynHeroSocialDock');
            const cDock = document.getElementById('dynContactSocialDock');
            if (hDock) hDock.innerHTML = html;
            if (cDock) cDock.innerHTML = html;
        }

        // ৩. অ্যাবাউট, ছবি ও রেজুমে
        if (prof.profileImage) {
            const pImg = document.getElementById('dynProfileImg');
            if (pImg) pImg.src = resolveImageUrl(prof.profileImage);
            const cImg = document.getElementById('dynChatAvatar');
            if (cImg) cImg.src = resolveImageUrl(prof.profileImage);
        }
        if (prof.name) {
            const titleEl = document.getElementById('dynIntroTitle');
            if (titleEl) {
                const role = prof.typingTitles ? prof.typingTitles.split(',')[0].trim() : 'Developer';
                titleEl.innerHTML = `<span class="about-name-highlight">${prof.name}</span> <span class="about-divider">-</span> <span class="about-role-highlight">${role}</span>`;
            }
        }
        if (prof.aboutBio) {
            const aBio = document.getElementById('dynAboutBio');
            if (aBio) aBio.innerHTML = `<p>${prof.aboutBio}</p>`;
        }
        if (prof.resumeFile && prof.resumeFile !== '#') {
            const resBtn = document.getElementById('dynResumeBtn');
            if (resBtn) {
                resBtn.href = resolveImageUrl(prof.resumeFile);
                resBtn.style.display = 'inline-flex';
            }
        }

        // ৪. সার্ভিসেস
        if (prof.services && prof.services.length > 0) {
            const sContainer = document.getElementById('dynServicesList');
            if (sContainer) {
                sContainer.innerHTML = prof.services.map(s => `
                    <div class="col-lg-4 col-md-6 col-sm-12 mb-4" data-aos="fade-up">
                        <div class="serviceBox">
                            <div class="service-icon"><span class="${s.icon}"></span></div>
                            <h3 class="title">${s.title}</h3>
                            <p class="description">${s.desc}</p>
                        </div>
                    </div>
                `).join('');
            }
        }

        // ৫. ফানফ্যাক্টস
        if (prof.funfacts && prof.funfacts.length > 0) {
            const fContainer = document.getElementById('dynFunfactsList');
            if (fContainer) {
                fContainer.innerHTML = prof.funfacts.map(f => `
                    <div class="col-lg-3 col-sm-6 col-12 mb-4" data-aos="fade-up">
                        <div class="sp">
                            <h2 class="counter-num">${f.number}</h2>
                            <h3>${f.label}</h3>
                        </div>
                    </div>
                `).join('');
            }
        }

        // ৬. টেকনোলজি লোগো
        if (prof.technologies && prof.technologies.length > 0) {
            const tContainer = document.getElementById('dynTechGrid');
            if (tContainer) {
                tContainer.innerHTML = prof.technologies.map(t => `
                    <div class="tec-item">
                        <img src="${resolveImageUrl(t.logo)}" alt="${t.name}" class="img-fluid" loading="lazy" title="${t.name}" />
                    </div>
                `).join('');
            }
        }

        // ৭. স্কিলস
        if (prof.skills && prof.skills.length > 0) {
            const skContainer = document.getElementById('dynSkillsList');
            if (skContainer) {
                skContainer.innerHTML = prof.skills.map(sk => `
                    <div class="skill-item">
                        <div class="skill-info">
                            <span class="skill-name">${sk.name}</span>
                            <span class="skill-percent">${sk.percentage}%</span>
                        </div>
                        <div class="skill-progress-track">
                            <div class="skill-progress-fill" style="width: ${sk.percentage}%;"></div>
                        </div>
                    </div>
                `).join('');
            }
        }

        // ৮. এডুকেশন ও এক্সপেরিয়েন্স
        if (prof.education && prof.education.length > 0) {
            const eduC = document.getElementById('dynEduContainer');
            if (eduC) {
                eduC.innerHTML = prof.education.map(e => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-card">
                            <div class="timeline-card-header">
                                <h4 class="timeline-role">${e.degree}</h4>
                                <span class="timeline-badge">${e.year}</span>
                            </div>
                            <h5 class="timeline-company"><i class="fa-solid fa-graduation-cap me-2"></i>${e.institute}</h5>
                        </div>
                    </div>
                `).join('');
            }
        }
        if (prof.experience && prof.experience.length > 0) {
            const expC = document.getElementById('dynExpContainer');
            if (expC) {
                expC.innerHTML = prof.experience.map(x => `
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
                `).join('');
            }
        }

        // ৯. কনট্যাক্ট ইনফো
        if (prof.email) {
            const em = document.getElementById('dynContactEmail');
            if (em) em.innerText = prof.email;
        }
        if (prof.phone) {
            const ph = document.getElementById('dynContactPhone');
            if (ph) ph.innerText = prof.phone;
        }
        if (prof.address) {
            const ad = document.getElementById('dynContactAddress');
            if (ad) ad.innerText = prof.address;
        }

        // ১০. পোর্টফোলিও ক্যাটাগরি ফিল্টার
        if (prof.projectCategories && prof.projectCategories.length > 0) {
            const fList = document.getElementById('dynFilterList');
            if (fList) {
                fList.innerHTML = `<li class="filter active" data-filter="all">All Projects</li>` +
                    prof.projectCategories.map(cat => `
                        <li class="filter" data-filter=".${cat.toLowerCase().replace(/\s+/g, '-')}">${cat}</li>
                    `).join('');

                // ফিল্টার ইভেন্ট বাইন্ডিং
                fList.querySelectorAll('li').forEach(li => {
                    li.addEventListener('click', function() {
                        fList.querySelectorAll('li').forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                        const filter = this.getAttribute('data-filter');
                        document.querySelectorAll('#dynPortfolioGrid .mix').forEach(item => {
                            if (filter === 'all' || item.classList.contains(filter.replace('.', ''))) {
                                item.style.display = 'block';
                            } else {
                                item.style.display = 'none';
                            }
                        });
                    });
                });
            }
        }
    }

    /* ==========================================================
       পোর্টফোলিও প্রজেক্টস রেন্ডারার
       ========================================================== */
    function applyProjectsToDOM(projects) {
        const grid = document.getElementById('dynPortfolioGrid');
        if (!grid || !projects || projects.length === 0) return;

        grid.innerHTML = projects.map(p => {
            const isScroll = p.scrollMode === 'scroll';
            const isLightbox = p.actionType === 'lightbox';
            const catClass = (p.category || 'website').toLowerCase().replace(/\s+/g, '-');
            const imgUrl = resolveImageUrl(p.image);
            const safeTitle = (p.title || '').replace(/'/g, "\\'");

            return `
                <div class="col-lg-4 col-md-6 col-12 mix ${catClass} mb-4">
                    <div class="portfolio-card">
                        <div class="browser-bar">
                            <span class="dot dot-red"></span>
                            <span class="dot dot-yellow"></span>
                            <span class="dot dot-green"></span>
                            <span class="browser-title">${p.title}</span>
                        </div>
                        <div class="${isScroll ? 'card-screen-scroll' : 'card-screen-graphic'}">
                            <img src="${imgUrl}" alt="${p.title}" loading="lazy" />
                            ${isLightbox ? `
                                <button type="button" class="graphic-zoom-overlay" onclick="openLightbox('${imgUrl}', '${safeTitle}')">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </button>
                            ` : ''}
                        </div>
                        <div class="card-meta">
                            <div class="meta-text">
                                <span class="meta-cat">${p.category}</span>
                                <h3 class="title">${p.title}</h3>
                                <p class="desc">${p.description || ''}</p>
                            </div>
                            <div class="meta-action">
                                ${p.liveUrl && !isLightbox ? `
                                    <a href="${p.liveUrl}" target="_blank" class="port-btn" title="Live Preview">
                                        <i class="fa fa-link"></i>
                                    </a>
                                ` : `
                                    <button type="button" onclick="openLightbox('${imgUrl}', '${safeTitle}')" class="port-btn" title="Zoom Preview">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /* ==========================================================
       সিঙ্ক ইঞ্জিন (লোকাল ক্যাশ + লাইভ ব্যাকএন্ড)
       ========================================================== */
    async function syncPortfolio() {
        // ধাপ ১: ব্রাউজার ক্যাশ থেকে দ্রুত লোড
        try {
            const cachedP = localStorage.getItem('cache_profile');
            if (cachedP) applyProfileToDOM(JSON.parse(cachedP));

            const cachedProj = localStorage.getItem('cache_projects');
            if (cachedProj) applyProjectsToDOM(JSON.parse(cachedProj));
        } catch (e) {}

        // ধাপ ২: ব্যাকএন্ড থেকে নতুন ডাটা ফেচ
        try {
            const [pRes, projRes] = await Promise.all([
                fetch(API_PROFILE).catch(() => null),
                fetch(API_PROJECTS).catch(() => null)
            ]);

            if (pRes && pRes.ok) {
                const profileData = await pRes.json();
                applyProfileToDOM(profileData);
                localStorage.setItem('cache_profile', JSON.stringify(profileData));
            }
            if (projRes && projRes.ok) {
                const projectsData = await projRes.json();
                applyProjectsToDOM(projectsData);
                localStorage.setItem('cache_projects', JSON.stringify(projectsData));
            }
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            dismissPreloader();
        }
    }

    document.addEventListener('DOMContentLoaded', syncPortfolio);

    // লাইটবক্স গ্লোবাল হ্যান্ডলার
    window.openLightbox = function(src, title) {
        const modal = document.getElementById('imageLightbox');
        const img = document.getElementById('lightboxImg');
        const cap = document.getElementById('lightboxTitle');
        if (modal && img) {
            img.src = src;
            if (cap) cap.innerText = title;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };
    window.closeLightbox = function() {
        const modal = document.getElementById('imageLightbox');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };
    window.handleLightboxBackdrop = function(e) {
        if (e && e.target && e.target.id === 'imageLightbox') closeLightbox();
    };

    window.toggleLiveChat = function() {
        const box = document.getElementById('liveChatBox');
        if (box) box.style.display = (box.style.display === 'flex') ? 'none' : 'flex';
    };
    window.sendLiveMessage = function(e) {
        e.preventDefault();
        const inp = document.getElementById('liveUserMessage');
        if (inp && inp.value.trim()) inp.value = '';
    };

})();