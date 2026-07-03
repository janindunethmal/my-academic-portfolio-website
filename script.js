// ----------------------------------------------------
// 1. Math Particles Background (Canvas)
// ----------------------------------------------------
const canvas = document.getElementById("math-bg-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const symbols = ["∑", "∫", "∂", "∇", "∞", "π", "θ", "δ", "√", "λ", "μ", "σ", "φ", "ℝ", "ℂ", "ℋ"];

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    let scrollVelocity = 0;
    let lastScrollY = window.scrollY;
    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        scrollVelocity = (currentScrollY - lastScrollY) * 0.15;
        lastScrollY = currentScrollY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height + canvas.height;
            this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
            this.size = Math.random() * 12 + 10; // 10px to 22px
            this.speedY = -(Math.random() * 0.5 + 0.2); // move upwards slowly
            this.speedX = (Math.random() - 0.5) * 0.2; // slight drift
            this.opacity = Math.random() * 0.3 + 0.15; // low opacity
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.005;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY - Math.abs(scrollVelocity);
            this.rotation += this.rotationSpeed;

            // Loop back to bottom if it moves off top
            if (this.y < -30) {
                this.y = canvas.height + 30;
                this.x = Math.random() * canvas.width;
            }
            // Loop back to sides if it moves off screen
            if (this.x < -30) this.x = canvas.width + 30;
            if (this.x > canvas.width + 30) this.x = -30;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            // Dynamic color depending on body theme
            const isDark = !document.body.classList.contains("light");
            ctx.fillStyle = isDark
                ? `rgba(99, 102, 241, ${this.opacity})` // Indigo in dark mode
                : `rgba(79, 70, 229, ${this.opacity * 0.7})`; // Indigo slightly fainter in light mode
            ctx.font = `${this.size}px 'Outfit', sans-serif`;
            ctx.fillText(this.symbol, 0, 0);
            ctx.restore();
        }
    }

    function initParticles() {
        const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 30000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
            // Randomize starting Y across the whole screen initially
            particles[i].y = Math.random() * canvas.height;
        }
    }
    initParticles();
    window.addEventListener("resize", initParticles);

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        scrollVelocity *= 0.92; // Decay the velocity
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ----------------------------------------------------
// 2. Role Typewriter Effect
// ----------------------------------------------------
const typewriterText = [
    "Mathematician & Researcher",
    "Visiting Lecturer",
    "Former USJ Teaching Assistant",
    "Math in Moscow Alumnus",
    "Topology & Functional Analysis Specialist",
    "Scientific Computing Enthusiast",
    "Computer Science Enthusiast",
];

let typeWordIndex = 0;
let typeCharIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const delayBetweenWords = 2000;
const typewriterEl = document.getElementById("typing");

if (typewriterEl) {
    function type() {
        const currentWord = typewriterText[typeWordIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentWord.substring(0, typeCharIndex - 1);
            typeCharIndex--;
        } else {
            typewriterEl.textContent = currentWord.substring(0, typeCharIndex + 1);
            typeCharIndex++;
        }

        let activeSpeed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && typeCharIndex === currentWord.length) {
            activeSpeed = delayBetweenWords;
            isDeleting = true;
        } else if (isDeleting && typeCharIndex === 0) {
            isDeleting = false;
            typeWordIndex = (typeWordIndex + 1) % typewriterText.length;
            activeSpeed = 500;
        }

        setTimeout(type, activeSpeed);
    }
    // Start typewriter
    setTimeout(type, 500);
}

// ----------------------------------------------------
// 3. Tab Switching Layouts (Fellowships, Education, Leadership)
// ----------------------------------------------------
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanes = document.querySelectorAll(".tab-pane");

tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        // Deactivate all
        tabButtons.forEach(b => b.classList.remove("active"));
        tabPanes.forEach(p => p.classList.remove("active"));

        // Activate current
        btn.classList.add("active");
        const targetPane = document.getElementById(btn.getAttribute("data-tab"));
        if (targetPane) {
            targetPane.classList.add("active");
        }
    });
});

// ----------------------------------------------------
// 4. Coursework Live Search and Filters
// ----------------------------------------------------
const courseSearch = document.getElementById("course-search");
const courseFilter = document.getElementById("course-filter");
const courseRows = document.querySelectorAll(".coursework-table tbody tr");

function filterCoursework() {
    const query = courseSearch.value.toLowerCase().trim();
    const filterVal = courseFilter.value;

    courseRows.forEach(row => {
        const code = row.querySelector(".course-code-cell").textContent.toLowerCase();
        const title = row.querySelector(".course-title-cell").textContent.toLowerCase();
        const yearChar = code.match(/\d/); // Find the first digit in the code (e.g. 1 in MAT 111)
        const yearLevel = yearChar ? yearChar[0] : "";

        // Logic filters
        const matchSearch = code.includes(query) || title.includes(query);

        let matchFilter = true;
        if (filterVal === "year1" && yearLevel !== "1") matchFilter = false;
        else if (filterVal === "year2" && yearLevel !== "2") matchFilter = false;
        else if (filterVal === "year3" && yearLevel !== "3") matchFilter = false;
        else if (filterVal === "year4" && yearLevel !== "4") matchFilter = false;
        else if (filterVal === "special-core") {
            // Core topics: Real Analysis, Topology, Linear Algebra, Functional Analysis, Measure Theory, Differential Equations
            const coreKeywords = [
                "analysis", "topology", "linear algebra",
                "differential equations", "measure theory", "functional analysis"
            ];
            const isCore = coreKeywords.some(keyword => title.includes(keyword));
            if (!isCore) matchFilter = false;
        }

        // Show/hide row
        if (matchSearch && matchFilter) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

if (courseSearch && courseFilter) {
    courseSearch.addEventListener("input", filterCoursework);
    courseFilter.addEventListener("change", filterCoursework);
}

// ----------------------------------------------------
// 5. Scroll Fade In Intersection Observer
// ----------------------------------------------------
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            // Stop observing once shown
            scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
});

document.querySelectorAll(".scroll-fade").forEach(el => {
    scrollObserver.observe(el);
});

// ----------------------------------------------------
// 6. Navigation Link Highlighting on Scroll
// ----------------------------------------------------
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
    let currentId = "";
    const scrollPos = window.pageYOffset + 150; // offset for nav height

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
            currentId = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("active");
        }
    });
});

// ----------------------------------------------------
// 7. Stats Counter Animation
// ----------------------------------------------------
const statsSection = document.getElementById("about");
const statNums = document.querySelectorAll(".stat-num");
let animatedStats = false;

function animateStats() {
    statNums.forEach(stat => {
        const target = parseFloat(stat.getAttribute("data-target"));
        const suffix = stat.getAttribute("data-suffix") || "";
        const decimals = parseInt(stat.getAttribute("data-decimals") || "0");

        let start = 0;
        const duration = 1500; // 1.5s
        const steps = 60;
        const stepTime = duration / steps;
        const increment = target / steps;
        let step = 0;

        const counter = setInterval(() => {
            start += increment;
            step++;

            if (step >= steps) {
                stat.textContent = target.toFixed(decimals) + suffix;
                clearInterval(counter);
            } else {
                stat.textContent = start.toFixed(decimals) + suffix;
            }
        }, stepTime);
    });
}

// Observe stats component to trigger counters
if (statsSection && statNums.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedStats) {
                animateStats();
                animatedStats = true;
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    statsObserver.observe(statsSection);
}

// ----------------------------------------------------
// 8. Theme Toggle (Dark / Light Mode)
// ----------------------------------------------------
const themeToggleBtn = document.getElementById("theme-toggle");
const toggleIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;

// Check stored preference
const currentTheme = localStorage.getItem("theme");
if (currentTheme === "light") {
    document.body.classList.add("light");
    if (toggleIcon) {
        toggleIcon.className = "fas fa-sun";
    }
} else {
    // Default to dark mode
    document.body.classList.remove("light");
    if (toggleIcon) {
        toggleIcon.className = "fas fa-moon";
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light");
        const isLight = document.body.classList.contains("light");

        if (isLight) {
            localStorage.setItem("theme", "light");
            if (toggleIcon) toggleIcon.className = "fas fa-sun";
        } else {
            localStorage.setItem("theme", "dark");
            if (toggleIcon) toggleIcon.className = "fas fa-moon";
        }
    });
}

// ----------------------------------------------------
// 9. Mobile Menu Toggle
// ----------------------------------------------------
const menuToggle = document.querySelector(".menu-toggle");
const mobileNavLinks = document.querySelector(".nav-links");
const individualLinks = document.querySelectorAll(".nav-links a");

if (menuToggle && mobileNavLinks) {
    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        mobileNavLinks.classList.toggle("mobile-active");
    });

    // Close mobile nav when link is clicked
    individualLinks.forEach(link => {
        link.addEventListener("click", () => {
            menuToggle.classList.remove("active");
            mobileNavLinks.classList.remove("mobile-active");
        });
    });
}

// ----------------------------------------------------
// 10. Scroll Enhancements (Progress bar, Nav scaling, Stagger, Mouse glow)
// ----------------------------------------------------
// Navbar scroll effects & progress bar
const navElement = document.querySelector("nav");
if (navElement) {
    // Inject progress bar elements dynamically
    const progressContainer = document.createElement("div");
    progressContainer.className = "scroll-progress-container";
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress-bar";
    progressContainer.appendChild(progressBar);
    navElement.appendChild(progressContainer);

    window.addEventListener("scroll", () => {
        // Calculate scroll progress percentage
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + "%";

        // Scroll active navbar shrink classes
        if (window.scrollY > 50) {
            navElement.classList.add("scrolled");
        } else {
            navElement.classList.remove("scrolled");
        }
    });
}

// Stagger child elements transition delays inside scroll-fade blocks
document.querySelectorAll(".scroll-fade").forEach(section => {
    const cards = section.querySelectorAll(".stat-card, .research-card, .teaching-card, .reference-card, .timeline-item");
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.08}s`;
    });
});

// ----------------------------------------------------
// 11. Back to Top Button
// ----------------------------------------------------
const backToTopBtn = document.getElementById("back-to-top");

if (backToTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ----------------------------------------------------
// 12. Dynamic hover mouse coordinates tracking on cards for interactive glow gradient
// ----------------------------------------------------
document.querySelectorAll(".research-card, .teaching-card, .reference-card, .stat-card").forEach(card => {
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    });
});

// ----------------------------------------------------
// 13. Feedback & Memories Image Galleries (Static)
// ----------------------------------------------------
// Place your image files in assets/feedbacks/{folder}/ or assets/memories/{folder}/
// then add the filenames to the arrays below. Supported: .jpg, .jpeg, .png, .gif, .webp
const FEEDBACK_IMAGES = {
    gism:     [],
    colombo:  ["01.png","02.png","03.png","04.png","05.png","06.png","07.png","08.png","09.png"],
    usj:      []
};

const MEMORIES_IMAGES = {
    gism:     ["01.jpg"],
    colombo:  ["01.jpg"],
    usj:      ["01.jpg","02.jpg","03.jpeg","04.jpeg"]
};

let currentUrls = [];
let currentLightboxIndex = 0;

function toggleFeedback(headerEl) {
    const content = headerEl.nextElementSibling;
    const icon = headerEl.querySelector(".feedback-toggle-icon");
    content.classList.toggle("hidden");
    if (icon) icon.classList.toggle("collapsed");
}

function loadImageGallery(config, attrPrefix) {
    Object.entries(config).forEach(([key, files]) => {
        const grid = document.querySelector(`[data-feedback-key="${attrPrefix}-${key}"]`);
        if (!grid) return;
        grid.innerHTML = "";
        if (files.length === 0) return;
        const urls = files.map(f => `assets/${attrPrefix}/${key}/${f}`);
        urls.forEach((url, i) => {
            const item = document.createElement("div");
            item.className = "feedback-item";
            const img = document.createElement("img");
            img.src = url;
            img.alt = `${i + 1}`;
            img.loading = "lazy";
            img.addEventListener("click", () => openLightbox(urls, i));
            item.appendChild(img);
            grid.appendChild(item);
        });
    });
}

function openLightbox(urls, index) {
    currentUrls = urls;
    currentLightboxIndex = index;
    let lb = document.getElementById("feedback-lightbox");
    if (!lb) {
        lb = document.createElement("div");
        lb.id = "feedback-lightbox";
        lb.className = "feedback-lightbox";
        lb.innerHTML = `
            <span class="feedback-lightbox-close">&times;</span>
            <button class="feedback-lightbox-nav feedback-lightbox-prev"><i class="fas fa-chevron-left"></i></button>
            <img src="" alt="Photo">
            <button class="feedback-lightbox-nav feedback-lightbox-next"><i class="fas fa-chevron-right"></i></button>
        `;
        document.body.appendChild(lb);
        lb.querySelector(".feedback-lightbox-close").addEventListener("click", () => lb.classList.remove("active"));
        lb.addEventListener("click", e => { if (e.target === lb) lb.classList.remove("active"); });
        document.addEventListener("keydown", e => {
            if (!lb.classList.contains("active")) return;
            if (e.key === "Escape") lb.classList.remove("active");
            if (e.key === "ArrowLeft") navigateLightbox(-1);
            if (e.key === "ArrowRight") navigateLightbox(1);
        });
        lb.querySelector(".feedback-lightbox-prev").addEventListener("click", () => navigateLightbox(-1));
        lb.querySelector(".feedback-lightbox-next").addEventListener("click", () => navigateLightbox(1));
    }
    lb.querySelector("img").src = urls[index];
    lb.classList.add("active");
}

function navigateLightbox(direction) {
    if (currentUrls.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + direction + currentUrls.length) % currentUrls.length;
    document.querySelector("#feedback-lightbox img").src = currentUrls[currentLightboxIndex];
}

document.addEventListener("DOMContentLoaded", () => {
    loadImageGallery(FEEDBACK_IMAGES, "feedbacks");
    loadImageGallery(MEMORIES_IMAGES, "memories");
});