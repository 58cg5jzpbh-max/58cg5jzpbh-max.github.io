// ================================================================
//  SIDEBAR TOGGLE
// ================================================================

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
}

function navigateTo(sectionId) {
    // Update active link
    document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
    const target = document.querySelector(`.sidebar nav a[href="${sectionId}"]`);
    if (target) target.classList.add('active');

    // Close sidebar on mobile
    closeSidebar();

    // Scroll to section
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ================================================================
//  COURSES DATA
// ================================================================

const courses = [
    { emoji: '📊', title: 'Stock Market Basics', desc: 'Learn how the stock market works, what drives prices, and how to start investing.', tag: 'Beginner' },
    { emoji: '📈', title: 'Technical Analysis', desc: 'Read charts, identify trends, and use indicators to make better trades.', tag: 'Intermediate' },
    { emoji: '🏦', title: 'Value Investing', desc: 'Find undervalued stocks, analyze financials, and build a long-term portfolio.', tag: 'Advanced' },
    { emoji: '🛡️', title: 'Risk Management', desc: 'Protect your capital with proven risk management strategies.', tag: 'Essential' },
    { emoji: '🌍', title: 'Global Markets', desc: 'Explore international markets, forex, and global economic impacts.', tag: 'Advanced' },
    { emoji: '🤖', title: 'AI & Trading', desc: 'Understand how AI is transforming trading and how to leverage it.', tag: 'Cutting-Edge' },
];

const courseGrid = document.getElementById('courseGrid');
courses.forEach(c => {
    const div = document.createElement('div');
    div.className = 'course-card';
    div.innerHTML = `
        <div class="emoji">${c.emoji}</div>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <span class="tag">${c.tag}</span>
    `;
    courseGrid.appendChild(div);
});

// ================================================================
//  BUSINESS IDEAS DATA
// ================================================================

const allIdeas = [
    { title: '📱 Digital Marketing Agency', desc: 'Help businesses grow with social media, SEO, and ads.', profit: 'High Profit' },
    { title: '🛒 E-commerce Store', desc: 'Sell products online with Shopify or dropshipping.', profit: 'Scalable' },
    { title: '📊 Financial Coaching', desc: 'Teach people to manage money and build wealth.', profit: 'Recurring Income' },
    { title: '🍔 Food Delivery Service', desc: 'Partner with local restaurants to deliver meals.', profit: 'Growing Demand' },
    { title: '📚 Online Course Creator', desc: 'Turn expertise into a course and sell it.', profit: 'Passive Income' },
    { title: '💻 Web Development Agency', desc: 'Build websites and apps for small businesses.', profit: 'High Demand' },
    { title: '🌱 Organic Farming', desc: 'Grow and sell organic vegetables to local markets.', profit: 'Sustainable' },
    { title: '🎥 Video Production', desc: 'Create videos for businesses and social media.', profit: 'Creative + Profitable' },
    { title: '🧠 AI Consulting', desc: 'Help businesses implement AI and automation.', profit: 'Future-Proof' },
    { title: '🏠 Real Estate Investing', desc: 'Buy, renovate, and rent or sell properties.', profit: 'Long-Term Wealth' },
    { title: '👕 Print-on-Demand', desc: 'Sell custom-designed merchandise online.', profit: 'Low Startup Cost' },
    { title: '✍️ Content Writing', desc: 'Write blog posts, articles, and copy for businesses.', profit: 'Flexible' },
    { title: '☕ Coffee Shop', desc: 'Open a specialty coffee shop with unique offerings.', profit: 'Steady Income' },
    { title: '🧘 Wellness Coaching', desc: 'Offer yoga, meditation, or holistic health coaching.', profit: 'Growing Demand' },
];

let displayedIdeas = 0;
const IDEAS_PER_PAGE = 6;

function loadMoreIdeas() {
    const grid = document.getElementById('ideaGrid');
    const start = displayedIdeas;
    const end = Math.min(start + IDEAS_PER_PAGE, allIdeas.length);

    for (let i = start; i < end; i++) {
        const idea = allIdeas[i];
        const div = document.createElement('div');
        div.className = 'idea-item';
        div.innerHTML = `
            <h4>${idea.title}</h4>
            <p>${idea.desc}</p>
            <div class="profit">💰 ${idea.profit}</div>
        `;
        grid.appendChild(div);
    }

    displayedIdeas = end;

    // Hide button if all loaded
    if (displayedIdeas >= allIdeas.length) {
        document.getElementById('loadMoreBtn').style.display = 'none';
    }
}

// Load initial ideas
loadMoreIdeas();

// ================================================================
//  TESTIMONIALS DATA
// ================================================================

const testimonials = [
    { name: 'Sarah Johnson', role: 'Entrepreneur', text: 'I went from knowing nothing about stocks to making my first profitable trade. This platform changed my life!', stars: 5 },
    { name: 'Michael Okafor', role: 'Business Owner', text: 'The business ideas section gave me the confidence to start my own e-commerce store.', stars: 5 },
    { name: 'Grace Adeyemi', role: 'Student', text: 'The practice trading simulator helped me understand the market without risking my savings.', stars: 4 },
];

const testGrid = document.getElementById('testGrid');
testimonials.forEach(t => {
    const div = document.createElement('div');
    div.className = 'test-card';
    div.innerHTML = `
        <div class="stars">${'⭐'.repeat(t.stars)}</div>
        <blockquote>"${t.text}"</blockquote>
        <div class="name">— ${t.name}</div>
        <div class="role">${t.role}</div>
    `;
    testGrid.appendChild(div);
});

// ================================================================
//  TRADING SIMULATOR
// ================================================================

let simPrice = 45200;
let simCash = 10000;
let simShares = 0;
let simTotal = 10000;

const simPriceDisplay = document.getElementById('simPrice');
const simChangeDisplay = document.getElementById('simChange');
const simCashDisplay = document.getElementById('simCash');
const simSharesDisplay = document.getElementById('simShares');
const simTotalDisplay = document.getElementById('simTotal');
const dashboardPortfolio = document.getElementById('dashboardPortfolio');
const tradeInput = document.getElementById('tradeAmount');

function updateSimUI() {
    simTotal = simCash + (simShares * simPrice);
    simPriceDisplay.textContent = `$${simPrice.toFixed(2)}`;
    simPriceDisplay.className = simPrice >= 45200 ? 'price' : 'price down';
    simCashDisplay.textContent = `$${simCash.toFixed(2)}`;
    simSharesDisplay.textContent = simShares.toFixed(2);
    simTotalDisplay.textContent = `$${simTotal.toFixed(2)}`;
    if (dashboardPortfolio) {
        dashboardPortfolio.textContent = `$${simTotal.toFixed(2)}`;
    }
}

function simBuy() {
    const amount = parseFloat(tradeInput.value);
    if (!amount || amount <= 0) {
        alert('Please enter a valid USD amount.');
        return;
    }
    if (amount > simCash) {
        alert(`You only have $${simCash.toFixed(2)} in cash.`);
        return;
    }

    const sharesBought = amount / simPrice;
    simCash -= amount;
    simShares += sharesBought;
    simPrice = simPrice * (1 + (sharesBought / 1000) * 0.012);

    const change = ((simPrice - 45200) / 45200 * 100);
    simChangeDisplay.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    simChangeDisplay.className = `change ${change >= 0 ? 'green' : 'red'}`;

    updateSimUI();
    tradeInput.value = '';
}

function simSell() {
    const amount = parseFloat(tradeInput.value);
    if (!amount || amount <= 0) {
        alert('Please enter a valid USD amount.');
        return;
    }

    const sharesToSell = amount / simPrice;
    if (sharesToSell > simShares) {
        alert(`You only have ${simShares.toFixed(2)} shares.`);
        return;
    }

    simCash += amount;
    simShares -= sharesToSell;
    simPrice = simPrice * (1 - (sharesToSell / 1000) * 0.01);

    const change = ((simPrice - 45200) / 45200 * 100);
    simChangeDisplay.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    simChangeDisplay.className = `change ${change >= 0 ? 'green' : 'red'}`;

    updateSimUI();
    tradeInput.value = '';
}

function simReset() {
    if (!confirm('Reset your practice account?')) return;
    simPrice = 45200;
    simCash = 10000;
    simShares = 0;
    simTotal = 10000;
    simChangeDisplay.textContent = '+2.4%';
    simChangeDisplay.className = 'change green';
    updateSimUI();
    tradeInput.value = '';
}

// Enter key to buy
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement === tradeInput) {
        simBuy();
    }
});

// Initial UI
updateSimUI();

// ================================================================
//  SMOOTH SCROLL FOR NAV LINKS
// ================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

console.log('📈 FinAcademy Loaded!');
console.log('📚 Courses:', courses.length);
console.log('💼 Business Ideas:', allIdeas.length);
console.log('📊 Practice Trading Simulator Ready!');
console.log('⚠️ Educational purposes only – Not financial advice.');