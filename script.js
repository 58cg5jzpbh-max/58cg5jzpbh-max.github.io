// ===== PRELOADER =====
window.addEventListener('load', () => {
    document.getElementById('preloader').classList.add('hidden');
});

// ===== HAMBURGER MENU =====
document.getElementById('hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('open');
    });
});

// ===== GAME DATA =====
const games = [
    { title: "CyberStrike 2077", icon: "🚀", genre: "Sci-Fi RPG" },
    { title: "Shadow Ops", icon: "🔫", genre: "Tactical Shooter" },
    { title: "Pixel Racer", icon: "🏎️", genre: "Arcade Racing" },
    { title: "Dragon Forge", icon: "🐉", genre: "Fantasy Adventure" },
    { title: "Star Drift", icon: "🌌", genre: "Space Exploration" },
    { title: "Urban Brawl", icon: "🥊", genre: "Fighting" },
    { title: "Mystic Quest", icon: "🧙", genre: "Magic RPG" },
    { title: "Neon Riders", icon: "🛵", genre: "Cyberpunk Racing" }
];

const grid = document.getElementById('gameGrid');

games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <span class="game-img">${game.icon}</span>
        <h3>${game.title}</h3>
        <p class="genre">${game.genre}</p>
        <div class="price"><span class="old-price">$10</span> $3.00</div>
        <a href="https://wa.me/2349133750885?text=Hi%20GameStore!%20I%20want%20to%20buy%20${encodeURIComponent(game.title)}%20for%20%243" class="btn-buy" target="_blank">Buy Now →</a>
    `;
    grid.appendChild(card);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== SCROLL ANIMATION =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.game-card, .feature-card, .testimonial-card, .step-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(el);
});