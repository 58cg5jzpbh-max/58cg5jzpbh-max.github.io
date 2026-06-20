// ================================================================
//  DIVINELOVE EZEH – VIDEO WEBSITE
// ================================================================

// Your Channel ID (UC9sjVKNLqGWW1EjcEBny6xQ)
const CHANNEL_ID = 'UC9sjVKNLqGWW1EjcEBny6xQ';

// Your YouTube API Key
const API_KEY = 'AIzaSyCyGfLFk_WgLWvbplqVJ1_oOtkaTDm2X5Q';

// ================================================================
//  📹 YOUR VIDEOS – Edit this section!
// ================================================================

// These are your current videos. Add more when you upload to YouTube!
const myVideos = [
    // 👇 ADD YOUR VIDEOS HERE (copy this format)
    { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', channel: 'Rick Astley' },
    { id: '9bZkp7q19f0', title: 'Gangnam Style', channel: 'PSY' },
    { id: '3JZ_D3ELwOQ', title: 'Baby Shark Dance', channel: 'Pinkfong' },
    { id: 'kJQP7kiw5Fk', title: 'Despacito', channel: 'Luis Fonsi' },
    
    // When you upload videos to YouTube, add them here:
    // { id: 'VIDEO_ID_HERE', title: 'Your Title', channel: 'Divinelove Ezeh' },
    // { id: 'VIDEO_ID_HERE', title: 'Your Title', channel: 'Divinelove Ezeh' },
];

// ================================================================
//  RENDER VIDEOS (Don't change anything below)
// ================================================================

const feed = document.getElementById('feed');
const loading = document.getElementById('loading');

function renderVideos(videos) {
    feed.innerHTML = '';
    videos.forEach(video => {
        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';
        wrapper.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${video.id}?autoplay=0&mute=1&controls=0&loop=1&playlist=${video.id}"
                allow="autoplay; encrypted-media"
                loading="lazy"
                allowfullscreen
            ></iframe>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.channel}</p>
            </div>
            <div class="side-actions">
                <div class="like-btn" data-likes="0">
                    <span class="icon">❤️</span>
                    <span class="like-count">0</span>
                </div>
                <div><span class="icon">💬</span>0</div>
                <div><span class="icon">↗️</span>0</div>
            </div>
            <button class="sound-toggle visible" data-muted="true">🔇</button>
            <div class="progress-bar"></div>
        `;
        feed.appendChild(wrapper);

        // Like button
        wrapper.querySelector('.like-btn').addEventListener('dblclick', function(e) {
            e.preventDefault();
            let count = parseInt(this.dataset.likes) || 0;
            count++;
            this.dataset.likes = count;
            this.querySelector('.like-count').textContent = count;
        });
    });
    loading.classList.add('hidden');
}

// ================================================================
//  START!
// ================================================================

renderVideos(myVideos);
console.log('📹 Divinelove Ezeh Video Feed Started!');
console.log(`✅ Showing ${myVideos.length} videos!`);