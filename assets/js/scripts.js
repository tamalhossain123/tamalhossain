/**
 * Md. Tamal Hossain Portfolio - Core Engine (High-Performance Sync)
 * Features: Zero-Lag Cache Hydration + Smart Preloader + Canvas Particles + Lightbox + Live Chat
 */

(function() {
    'use strict';

    // ১. ব্যাকএন্ড URL কনফিগারেশন
    const BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000'
        : 'https://tamalhossain-backend.vercel.app';

    const API_BASE = `${BACKEND_URL}/api`;
    const BACKEND_SOCKET_URL = BACKEND_URL;

    // ইমেজ পাথ ঠিক করার হেল্পার ফাংশন
    function resolveImageUrl(imgUrl) {
        if (!imgUrl) return 'assets/img/profile-pic.png';
        if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('//') || imgUrl.startsWith('data:')) {
            return imgUrl;
        }
        return `${BACKEND_URL}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
    }

    /* ==========================================================================
       1. SMART PRELOADER (ডাটা লোড হওয়া পর্যন্ত স্ক্রিন স্মুথ রাখবে)
       ========================================================================== */
    let preloaderDismissed = false;
    function dismissPreloader() {
        if (preloaderDismissed) return;
        preloaderDismissed = true;

        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.transition = 'opacity 0.4s ease';
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 400);
        }
    }

    // ব্যাকএন্ড কানেকশন খুব ধীরগতির হলে সর্বোচ্চ ১২০০ms পর প্রিলোডার নিজে থেকেই সরে যাবে
    const fallbackTimer = setTimeout(dismissPreloader, 1200);

    /* ==========================================================================
       2. STICKY NAVBAR
       ========================================================================== */
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('nav-sticky', window.scrollY >= 50);
        }
    });

    /* ==========================================================================
       3. BACKGROUND CANVAS PARTICLES (60 FPS)
       ========================================================================== */
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = window.innerWidth < 768 ? 25 : 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 0.8,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4
            });
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(240, 187, 98, 0.25)';
            ctx.strokeStyle = 'rgba(240, 187, 98, 0.05)';

            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                for (let j = idx + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ==========================================================================
       4. SKILLS SCROLL ANIMATION & NUMBER COUNTER
       ========================================================================== */
    window.triggerSkillsAnimation = function() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-progress-fill').forEach(bar => {
                        const targetWidth = bar.getAttribute('data-percent') || '0';
                        bar.style.width = targetWidth + '%';
                    });

                    entry.target.querySelectorAll('.skill-percent').forEach(label => {
                        const targetNum = parseInt(label.getAttribute('data-target'), 10) || 0;
                        let currentNum = 0;
                        const duration = 1400;
                        const stepTime = Math.abs(Math.floor(duration / (targetNum || 1)));

                        const timer = setInterval(() => {
                            currentNum += 1;
                            label.innerText = currentNum + '%';
                            if (currentNum >= targetNum) {
                                clearInterval(timer);
                                label.innerText = targetNum + '%';
                            }
                        }, stepTime);
                    });

                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        observer.observe(skillsSection);
    };

    window.updateSkillsFromBackend = function(skills) {
        const sContainer = document.getElementById('dynSkillsList');
        if (sContainer && skills && skills.length > 0) {
            sContainer.innerHTML = skills.map(s => `
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">${s.name}</span>
                        <span class="skill-percent" data-target="${s.percentage}">0%</span>
                    </div>
                    <div class="skill-progress-track">
                        <div class="skill-progress-fill" data-percent="${s.percentage}" style="width: 0%;"></div>
                    </div>
                </div>
            `).join('');

            window.triggerSkillsAnimation();
        }
    };

    /* ==========================================================================
       5. DYNAMIC DOM RENDERERS (DOM আপডেট লজিক)
       ========================================================================== */
    function applyProfileToDOM(prof) {
        if (!prof) return;

        if (prof.name) {
            const sub = document.getElementById('dynSubtitle');
            if (sub) sub.innerText = `- I Am ${prof.name}`;
        }
        if (prof.email) {
            const em1 = document.getElementById('dynEmail');
            const em2 = document.getElementById('dynContactEmail');
            if (em1) em1.innerText = prof.email;
            if (em2) em2.innerText = prof.email;
        }
        if (prof.phone) {
            const ph1 = document.getElementById('dynPhone');
            const ph2 = document.getElementById('dynContactPhone');
            if (ph1) ph1.innerText = prof.phone;
            if (ph2) ph2.innerText = prof.phone;
        }
        if (prof.address) {
            const ad1 = document.getElementById('dynAddress');
            const ad2 = document.getElementById('dynContactAddress');
            if (ad1) ad1.innerText = prof.address;
            if (ad2) ad2.innerText = prof.address;
        }
        if (prof.profileImage) {
            const img = document.getElementById('dynProfileImg');
            if (img) img.src = resolveImageUrl(prof.profileImage);
        }
        if (prof.aboutBio) {
            const bio = document.getElementById('dynAboutBio');
            if (bio) bio.innerHTML = `<p>${prof.aboutBio}</p>`;
        }

        if (prof.skills && prof.skills.length > 0) {
            window.updateSkillsFromBackend(prof.skills);
        }

        if (prof.education && prof.education.length > 0) {
            const eContainer = document.getElementById('dynEduContainer');
            if (eContainer) {
                eContainer.innerHTML = prof.education.map(e => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-card">
                            <div class="timeline-card-header">
                                <h4 class="timeline-role">${e.degree || ''}</h4>
                                <span class="timeline-badge">${e.year || ''}</span>
                            </div>
                            <h5 class="timeline-company"><i class="fa-solid fa-award me-2"></i>${e.institute || ''}</h5>
                            <p class="timeline-desc">${e.field ? e.field + ' - ' : ''}Formal academic curriculum and practical training.</p>
                        </div>
                    </div>
                `).join('');
            }
        }

        if (prof.experience && prof.experience.length > 0) {
            const expContainer = document.getElementById('dynExpContainer');
            if (expContainer) {
                expContainer.innerHTML = prof.experience.map(x => `
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-card">
                            <div class="timeline-card-header">
                                <h4 class="timeline-role">${x.role || ''}</h4>
                                <span class="timeline-badge">${x.duration || ''}</span>
                            </div>
                            <h5 class="timeline-company"><i class="fa-regular fa-building me-2"></i>${x.company || ''}</h5>
                            <p class="timeline-desc">${x.description || ''}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    function applyProjectsToDOM(projects) {
        if (!projects || projects.length === 0) return;
        const grid = document.getElementById('dynPortfolioGrid');
        if (!grid) return;

        grid.innerHTML = projects.map(p => {
            const isWeb = p.category === 'website' || p.category === 'wordpress';
            const safeTitle = (p.title || '').replace(/'/g, "\\'");
            const projectImg = resolveImageUrl(p.image);

            if (isWeb) {
                return `
                    <div class="col-lg-4 col-md-6 col-12 mix ${p.category} mb-4">
                        <div class="portfolio-card">
                            <div class="browser-bar">
                                <span class="dot dot-red"></span>
                                <span class="dot dot-yellow"></span>
                                <span class="dot dot-green"></span>
                                <span class="browser-title">${p.title}</span>
                            </div>
                            <div class="card-screen-scroll">
                                <img src="${projectImg}" alt="${p.title}" loading="lazy">
                            </div>
                            <div class="card-meta">
                                <div class="meta-text">
                                    <span class="meta-cat">${p.category}</span>
                                    <h3 class="title">${p.title}</h3>
                                    <p class="desc">${p.description || ''}</p>
                                </div>
                                <div class="meta-action">
                                    ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" class="port-btn" title="Live Preview"><i class="fa fa-link"></i></a>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="col-lg-4 col-md-6 col-12 mix ${p.category} mb-4">
                        <div class="portfolio-card">
                            <div class="browser-bar">
                                <span class="dot dot-red"></span>
                                <span class="dot dot-yellow"></span>
                                <span class="dot dot-green"></span>
                                <span class="browser-title">${p.title}</span>
                            </div>
                            <div class="card-screen-graphic">
                                <img src="${projectImg}" alt="${p.title}" loading="lazy">
                                <button type="button" class="graphic-zoom-overlay" onclick="openLightbox('${projectImg}', '${safeTitle}')" title="Zoom Preview">
                                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                                </button>
                            </div>
                            <div class="card-meta">
                                <div class="meta-text">
                                    <span class="meta-cat">${p.category}</span>
                                    <h3 class="title">${p.title}</h3>
                                    <p class="desc">${p.description || ''}</p>
                                </div>
                                <div class="meta-action">
                                    <button type="button" onclick="openLightbox('${projectImg}', '${safeTitle}')" class="port-btn" title="Zoom Preview">
                                        <i class="fa-solid fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }).join('');
    }

    /* ==========================================================================
       6. ZERO-LAG BACKEND SYNC (ক্যাশ ও লাইভ ডাটা ইন্টিগ্রেশন)
       ========================================================================== */
    async function syncPortfolioWithBackend() {
        // ধাপ ১: ব্রাউজার ক্যাশে থাকা ডাটা দিয়ে পেজ ০ms-এ সাজিয়ে নেওয়া (কোনো ল্যাগ থাকবে না)
        try {
            const cachedProf = localStorage.getItem('portfolio_cached_profile');
            if (cachedProf) applyProfileToDOM(JSON.parse(cachedProf));

            const cachedProj = localStorage.getItem('portfolio_cached_projects');
            if (cachedProj) applyProjectsToDOM(JSON.parse(cachedProj));
        } catch (e) {
            console.warn('Cache read error:', e);
        }

        // ধাপ ২: ব্যাকএন্ড থেকে নতুন ডাটা ফেচ করা
        try {
            const [profRes, projRes] = await Promise.all([
                fetch(`${API_BASE}/profile`).catch(() => null),
                fetch(`${API_BASE}/projects`).catch(() => null)
            ]);

            if (profRes && profRes.ok) {
                const freshProfile = await profRes.json();
                applyProfileToDOM(freshProfile);
                localStorage.setItem('portfolio_cached_profile', JSON.stringify(freshProfile));
            }

            if (projRes && projRes.ok) {
                const freshProjects = await projRes.json();
                applyProjectsToDOM(freshProjects);
                localStorage.setItem('portfolio_cached_projects', JSON.stringify(freshProjects));
            }
        } catch (err) {
            console.log('Running on cached/offline content:', err);
        } finally {
            // ডাটা সম্পূর্ণ আসার পর প্রিলোডার মসৃণভাবে সরিয়ে নেওয়া হবে
            clearTimeout(fallbackTimer);
            dismissPreloader();
        }
    }

    /* ==========================================================================
       7. PORTFOLIO FILTERING
       ========================================================================== */
    document.addEventListener('DOMContentLoaded', function() {
        syncPortfolioWithBackend();
        window.triggerSkillsAnimation();

        const filterButtons = document.querySelectorAll('.portfolio_filter ul li');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');
                const items = document.querySelectorAll('#dynPortfolioGrid .mix');

                items.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue.replace('.', ''))) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    });

    /* ==========================================================================
       8. LIGHTBOX CONTROLS
       ========================================================================== */
    window.openLightbox = function(imageSrc, title) {
        const modal = document.getElementById('imageLightbox');
        const img = document.getElementById('lightboxImg');
        const caption = document.getElementById('lightboxTitle');

        if (!modal || !img) return;

        img.src = imageSrc || '';
        img.alt = title || 'Project Preview';
        if (caption) caption.innerText = title || '';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function() {
        const modal = document.getElementById('imageLightbox');
        const img = document.getElementById('lightboxImg');

        if (modal) modal.classList.remove('active');
        if (img) img.src = '';
        document.body.style.overflow = '';
    };

    window.handleLightboxBackdrop = function(e) {
        if (e && e.target && e.target.id === 'imageLightbox') {
            window.closeLightbox();
        }
    };

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeLightbox();
        }
    });

    /* ==========================================================================
       9. CONTACT FORM SUBMISSION (Web3Forms)
       ========================================================================== */
    const form = document.getElementById('contactForm');
    const popup = document.getElementById('thankYouPopup');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: new FormData(form)
            })
            .then(res => {
                if (res.ok) {
                    if (popup) popup.style.display = 'flex';
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

    window.closePopup = function() {
        if (popup) popup.style.display = 'none';
    };

    /* ==========================================================================
       10. INITIALIZE AOS ANIMATIONS
       ========================================================================== */
    if (typeof AOS !== 'undefined') {
        AOS.init({ once: true, duration: 800 });
    }

})();

// ==========================================================================
// 11. BRANDED LIVE CHAT (SOCKET.IO TO BACKEND)
// ==========================================================================
const LIVE_BACKEND_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : 'https://tamalhossain-backend.vercel.app';

let visitorId = localStorage.getItem('portfolio_visitor_id');
if (!visitorId) {
    visitorId = Math.random().toString(36).substring(2, 7);
    localStorage.setItem('portfolio_visitor_id', visitorId);
}

let liveSocket = null;
if (typeof io !== 'undefined') {
    liveSocket = io(LIVE_BACKEND_URL);

    liveSocket.on('connect', () => {
        console.log('Connected to live chat engine with Visitor ID:', visitorId);
        liveSocket.emit('init_visitor', { visitorId });
    });

    liveSocket.on('admin_message', (data) => {
        const chatBody = document.getElementById('liveChatBody');
        if (chatBody) {
            chatBody.innerHTML += `
                <div class="chat-msg chat-incoming" style="animation: fadeIn 0.3s ease;">
                    <p>${data.text}</p>
                    <span class="chat-msg-time">${data.time}</span>
                </div>
            `;
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        const chatBox = document.getElementById('liveChatBox');
        if (chatBox && !chatBox.classList.contains('open')) {
            chatBox.classList.add('open');
            chatBox.style.display = 'flex';
        }
    });
}

window.toggleLiveChat = function() {
    const chatBox = document.getElementById('liveChatBox');
    if (!chatBox) return;

    if (chatBox.classList.contains('open') || chatBox.style.display === 'flex') {
        chatBox.classList.remove('open');
        chatBox.style.display = 'none';
    } else {
        chatBox.classList.add('open');
        chatBox.style.display = 'flex';
        const input = document.getElementById('liveUserMessage');
        if (input) setTimeout(() => input.focus(), 250);
    }
};

window.sendLiveMessage = function(e) {
    e.preventDefault();
    const input = document.getElementById('liveUserMessage');
    const msg = input ? input.value.trim() : '';
    if (!msg) return;

    const chatBody = document.getElementById('liveChatBody');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (chatBody) {
        chatBody.innerHTML += `
            <div class="chat-msg chat-outgoing">
                <p>${msg}</p>
                <span class="chat-msg-time">${time}</span>
            </div>
        `;
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    if (liveSocket && liveSocket.connected) {
        liveSocket.emit('visitor_message', { visitorId, text: msg });
    } else {
        console.warn('Socket not connected to backend.');
    }

    if (input) input.value = '';
};

// ==========================================================================
// 12. AUTO-POPUP FLOATING BADGE (Smooth Motion)
// ==========================================================================
document.addEventListener('DOMContentLoaded', function() {
    function showFloatingBadge() {
        const badge = document.getElementById('chatFloatingBadge');
        const chatBox = document.getElementById('liveChatBox');

        if (!badge || (chatBox && (chatBox.classList.contains('open') || chatBox.style.display === 'flex'))) {
            return;
        }

        badge.classList.remove('hide');
        badge.classList.add('show');

        setTimeout(function() {
            badge.classList.remove('show');
            badge.classList.add('hide');
        }, 5000);
    }

    setTimeout(function() {
        showFloatingBadge();
        setInterval(showFloatingBadge, 15000);
    }, 2000);
});