// Game data – all $5
const games = [
    { title: "CyberStrike 2077", icon: "🚀", genre: "Sci-Fi RPG" },
    { title: "Shadow Ops", icon: "🔫", genre: "Tactical Shooter" },
    { title: "Pixel Racer", icon: "🏎️", genre: "Arcade Racing" },
    { title: "Dragon Forge", icon: "🐉", genre: "Fantasy Adventure" },
    { title: "Star Drift", icon: "🌌", genre: "Space Exploration" },
    { title: "Urban Brawl", icon: "🥊", genre: "Fighting / Action" }
];

const grid = document.getElementById("gameGrid");

games.forEach(game => {
    const card = document.createElement("div");
    card.className = "game-card";

    card.innerHTML = `
        <div class="icon">${game.icon}</div>
        <h3>${game.title}</h3>
        <p style="color:#7a8fa5; font-size:14px;">${game.genre}</p>
        <div class="price">$5.00</div>
        <a href="https://wa.me/2349133750885?text=Hi%20GameDeals!%20I%20want%20to%20buy%20%22${encodeURIComponent(game.title)}%22" 
           class="btn-buy" target="_blank">Buy Now</a>
    `;

    grid.appendChild(card);
});

console.log("🎮 GameDeals loaded — all games $5!");