// ================================================================
//  NAIJASTOCK – COMPLETE TRADING PLATFORM
//  With LocalStorage "Backend"
// ================================================================

// ================================================================
//  STATE / DATA
// ================================================================

let state = {
    cash: 10000,
    shares: 0,
    price: 1250,
    priceHistory: [],
    trades: [],
    profit: 0,
    initialCash: 10000,
    userName: 'Beginner'
};

// ================================================================
//  LOAD / SAVE STATE (LocalStorage = Backend)
// ================================================================

function loadState() {
    const saved = localStorage.getItem('naijastock_state');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
            return true;
        } catch (e) {
            console.error('Error loading state:', e);
        }
    }
    return false;
}

function saveState() {
    try {
        localStorage.setItem('naijastock_state', JSON.stringify(state));
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

// ================================================================
//  INITIALIZE
// ================================================================

function init() {
    const loaded = loadState();
    
    if (!loaded) {
        state = {
            cash: 10000,
            shares: 0,
            price: 1250,
            priceHistory: [],
            trades: [],
            profit: 0,
            initialCash: 10000,
            userName: 'Beginner'
        };
        // Add initial price history
        for (let i = 0; i < 10; i++) {
            state.priceHistory.push({
                price: 1200 + Math.random() * 100,
                time: new Date(Date.now() - (10 - i) * 60000).toLocaleTimeString()
            });
        }
        saveState();
    }
    
    updateUI();
    renderLearnCards();
    renderPriceHistory();
    renderLeaderboard();
    
    // Start price simulation
    setInterval(simulatePrice, 5000);
    
    console.log('🇳🇬 NaijaStock Loaded!');
    console.log(`💰 Cash: ₦${state.cash.toFixed(2)}`);
    console.log(`📈 Shares: ${state.shares}`);
    console.log(`💎 Total: ₦${(state.cash + state.shares * state.price).toFixed(2)}`);
}

// ================================================================
//  PRICE SIMULATION (Goes up and down like real stock)
// ================================================================

function simulatePrice() {
    // Random walk – price goes up or down
    const change = (Math.random() - 0.48) * 25;
    state.price = Math.max(100, state.price + change);
    state.price = Math.round(state.price * 100) / 100;
    
    // Add to price history
    state.priceHistory.push({
        price: state.price,
        time: new Date().toLocaleTimeString()
    });
    
    // Keep only last 50 entries
    if (state.priceHistory.length > 50) {
        state.priceHistory = state.priceHistory.slice(-50);
    }
    
    saveState();
    updateUI();
    renderPriceHistory();
}

// ================================================================
//  BUY SHARES
// ================================================================

function buyShares() {
    const amountInput = document.getElementById('tradeAmount');
    const quantityInput = document.getElementById('shareQuantity');
    
    let amount = parseFloat(amountInput.value);
    let quantity = parseFloat(quantityInput.value);
    
    // Determine which input was used
    if (quantity && quantity > 0) {
        const totalCost = quantity * state.price;
        if (totalCost > state.cash) {
            alert(`❌ Insufficient funds! You need ₦${totalCost.toFixed(2)} but have ₦${state.cash.toFixed(2)}`);
            return;
        }
        state.shares += quantity;
        state.cash -= totalCost;
        state.trades.push({
            type: 'BUY',
            shares: quantity,
            price: state.price,
            total: totalCost,
            time: new Date().toLocaleTimeString()
        });
        amountInput.value = '';
        quantityInput.value = '';
    } else if (amount && amount > 0) {
        if (amount > state.cash) {
            alert(`❌ Insufficient funds! You have ₦${state.cash.toFixed(2)}`);
            return;
        }
        const sharesBought = amount / state.price;
        state.shares += sharesBought;
        state.cash -= amount;
        state.trades.push({
            type: 'BUY',
            shares: sharesBought,
            price: state.price,
            total: amount,
            time: new Date().toLocaleTimeString()
        });
        amountInput.value = '';
        quantityInput.value = '';
    } else {
        alert('⚠️ Please enter an amount OR quantity.');
        return;
    }
    
    // Price goes up when people buy (demand)
    state.price = state.price * (1 + 0.005);
    state.price = Math.round(state.price * 100) / 100;
    
    saveState();
    updateUI();
    renderPriceHistory();
    renderLeaderboard();
}

// ================================================================
//  SELL SHARES
// ================================================================

function sellShares() {
    const amountInput = document.getElementById('tradeAmount');
    const quantityInput = document.getElementById('shareQuantity');
    
    let amount = parseFloat(amountInput.value);
    let quantity = parseFloat(quantityInput.value);
    
    if (state.shares === 0) {
        alert('❌ You don\'t own any shares!');
        return;
    }
    
    if (quantity && quantity > 0) {
        if (quantity > state.shares) {
            alert(`❌ You only have ${state.shares.toFixed(2)} shares.`);
            return;
        }
        const totalValue = quantity * state.price;
        state.shares -= quantity;
        state.cash += totalValue;
        state.trades.push({
            type: 'SELL',
            shares: quantity,
            price: state.price,
            total: totalValue,
            time: new Date().toLocaleTimeString()
        });
        amountInput.value = '';
        quantityInput.value = '';
    } else if (amount && amount > 0) {
        const sharesToSell = amount / state.price;
        if (sharesToSell > state.shares) {
            alert(`❌ You only have ${state.shares.toFixed(2)} shares.`);
            return;
        }
        state.shares -= sharesToSell;
        state.cash += amount;
        state.trades.push({
            type: 'SELL',
            shares: sharesToSell,
            price: state.price,
            total: amount,
            time: new Date().toLocaleTimeString()
        });
        amountInput.value = '';
        quantityInput.value = '';
    } else {
        alert('⚠️ Please enter an amount OR quantity.');
        return;
    }
    
    // Price goes down when people sell (supply)
    state.price = state.price * (1 - 0.005);
    state.price = Math.round(state.price * 100) / 100;
    
    saveState();
    updateUI();
    renderPriceHistory();
    renderLeaderboard();
}

// ================================================================
//  RESET ACCOUNT
// ================================================================

function resetAccount() {
    if (!confirm('⚠️ Reset your account to ₦10,000? All data will be lost!')) return;
    
    state = {
        cash: 10000,
        shares: 0,
        price: 1250,
        priceHistory: [],
        trades: [],
        profit: 0,
        initialCash: 10000,
        userName: 'Beginner'
    };
    
    for (let i = 0; i < 10; i++) {
        state.priceHistory.push({
            price: 1200 + Math.random() * 100,
            time: new Date(Date.now() - (10 - i) * 60000).toLocaleTimeString()
        });
    }
    
    saveState();
    updateUI();
    renderPriceHistory();
    renderLeaderboard();
    alert('✅ Account reset to ₦10,000!');
}

// ================================================================
//  UPDATE UI
// ================================================================

function updateUI() {
    const total = state.cash + state.shares * state.price;
    const profit = total - state.initialCash;
    const profitPercent = (profit / state.initialCash) * 100;
    
    // Dashboard
    document.getElementById('totalPortfolio').textContent = `₦${total.toFixed(2)}`;
    document.getElementById('availableCash').textContent = `₦${state.cash.toFixed(2)}`;
    document.getElementById('sharesOwned').textContent = state.shares.toFixed(2);
    
    const profitEl = document.getElementById('totalProfit');
    profitEl.textContent = `${profit >= 0 ? '+' : ''}₦${profit.toFixed(2)}`;
    profitEl.style.color = profit >= 0 ? '#008751' : '#d32f2f';
    
    const changeEl = document.getElementById('portfolioChange');
    changeEl.textContent = `${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`;
    changeEl.className = `card-change ${profitPercent >= 0 ? 'positive' : 'negative'}`;
    
    // Stock Price
    document.getElementById('stockPrice').textContent = `₦${state.price.toFixed(2)}`;
    const priceChange = ((state.price - 1250) / 1250 * 100);
    const changeDisplay = document.getElementById('priceChange');
    changeDisplay.textContent = `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`;
    changeDisplay.className = `change ${priceChange >= 0 ? 'positive' : 'negative'}`;
    
    // Trade Info
    document.getElementById('tradeCash').textContent = `₦${state.cash.toFixed(2)}`;
    document.getElementById('tradeShares').textContent = state.shares.toFixed(2);
    document.getElementById('tradeTotal').textContent = `₦${total.toFixed(2)}`;
}

// ================================================================
//  RENDER LEARN CARDS
// ================================================================

function renderLearnCards() {
    const lessons = [
        { icon: '📊', title: 'What is the Stock Market?', desc: 'Learn the basics of how stock markets work and why companies list shares.', tag: 'Beginner' },
        { icon: '📈', title: 'How to Read Stock Prices', desc: 'Understand bid/ask, market cap, and what moves prices up and down.', tag: 'Beginner' },
        { icon: '📉', title: 'Supply and Demand', desc: 'Learn why prices go up when people buy and down when people sell.', tag: 'Intermediate' },
        { icon: '🛡️', title: 'Risk Management', desc: 'Protect your capital with stop-losses and position sizing.', tag: 'Essential' },
        { icon: '💡', title: 'Trading Strategies', desc: 'Explore different strategies for short-term and long-term trading.', tag: 'Advanced' },
        { icon: '🇳🇬', title: 'Nigerian Stock Market', desc: 'Learn about the NGX, how it works, and how to invest in Nigerian companies.', tag: 'Local Focus' },
    ];
    
    const grid = document.getElementById('learnGrid');
    grid.innerHTML = '';
    
    lessons.forEach(lesson => {
        const div = document.createElement('div');
        div.className = 'learn-card';
        div.innerHTML = `
            <div class="icon">${lesson.icon}</div>
            <h3>${lesson.title}</h3>
            <p>${lesson.desc}</p>
            <span class="tag">${lesson.tag}</span>
        `;
        grid.appendChild(div);
    });
}

// ================================================================
//  RENDER PRICE HISTORY
// ================================================================

function renderPriceHistory() {
    const list = document.getElementById('priceHistoryList');
    list.innerHTML = '';
    
    if (state.trades.length > 0) {
        const recentTrades = state.trades.slice(-10).reverse();
        recentTrades.forEach(trade => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <span class="${trade.type === 'BUY' ? 'buy' : 'sell'}">${trade.type}</span>
                <span>${trade.shares.toFixed(2)} shares @ ₦${trade.price.toFixed(2)}</span>
                <span class="price-text">₦${trade.total.toFixed(2)}</span>
                <span class="price-text">${trade.time}</span>
            `;
            list.appendChild(div);
        });
    } else {
        const recent = state.priceHistory.slice(-10).reverse();
        recent.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <span>💹 Price</span>
                <span>₦${entry.price.toFixed(2)}</span>
                <span class="price-text">${entry.time}</span>
            `;
            list.appendChild(div);
        });
    }
}

// ================================================================
//  LEADERBOARD
// ================================================================

function renderLeaderboard() {
    const list = document.getElementById('leaderboardList');
    list.innerHTML = '';
    
    // Get current user's profit
    const total = state.cash + state.shares * state.price;
    const userProfit = total - state.initialCash;
    
    // Get existing leaderboard or create
    let leaderboard = JSON.parse(localStorage.getItem('naijastock_leaderboard')) || [];
    
    // Update current user in leaderboard if they have trades
    if (state.trades.length > 0) {
        // Remove existing entry for this user
        leaderboard = leaderboard.filter(item => item.name !== 'You');
        // Add current user
        leaderboard.push({
            name: 'You',
            profit: userProfit,
            trades: state.trades.length
        });
        // Sort by profit
        leaderboard.sort((a, b) => b.profit - a.profit);
        // Keep top 10
        leaderboard = leaderboard.slice(0, 10);
        localStorage.setItem('naijastock_leaderboard', JSON.stringify(leaderboard));
    }
    
    // If no leaderboard data, create dummy
    if (leaderboard.length === 0) {
        const names = ['Chidi', 'Amara', 'Femi', 'Ngozi', 'Tunde', 'Zainab', 'Emeka', 'Sade', 'Kofi'];
        for (let i = 0; i < 8; i++) {
            leaderboard.push({
                name: names[i],
                profit: (Math.random() * 3000) - 500,
                trades: Math.floor(Math.random() * 15) + 1
            });
        }
        leaderboard.sort((a, b) => b.profit - a.profit);
        localStorage.setItem('naijastock_leaderboard', JSON.stringify(leaderboard));
    }
    
    // Display leaderboard
    leaderboard.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'leaderboard-item';
        const isYou = item.name === 'You';
        div.innerHTML = `
            <span class="rank">${index + 1}</span>
            <span class="name">${isYou ? '⭐ ' : ''}${item.name}</span>
            <span>${item.trades} trades</span>
            <span class="profit ${item.profit >= 0 ? 'positive' : 'negative'}">
                ${item.profit >= 0 ? '+' : ''}₦${item.profit.toFixed(2)}
            </span>
        `;
        list.appendChild(div);
    });
}

// ================================================================
//  MENU TOGGLE (Mobile)
// ================================================================

function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('open');
}

// ================================================================
//  KEYBOARD SHORTCUTS
// ================================================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const active = document.activeElement;
        if (active.id === 'tradeAmount' || active.id === 'shareQuantity') {
            buyShares();
        }
    }
});

// ================================================================
//  START!
// ================================================================

// Close mobile menu when clicking a link
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        document.getElementById('navMenu').classList.remove('open');
        // Update active link
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

// Initialize
init();

console.log('🇳🇬 NaijaStock Trading Platform Ready!');
console.log('📈 BUY = Price goes UP');
console.log('📉 SELL = Price goes DOWN');
console.log('💾 All data saved in your browser (LocalStorage)');