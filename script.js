// ================================================================
//  DIVINELOVE EZEH – VIDEO WEBSITE (FIXED SOUND)
// ================================================================

// Your Channel ID
const CHANNEL_ID = 'UC9sjVKNLqGWW1EjcEBny6xQ';

// Your YouTube API Key
const API_KEY = 'AIzaSyCyGfLFk_WgLWvbplqVJ1_oOtkaTDm2X5Q';

// ================================================================
//  📹 YOUR VIDEOS – Edit this section!
// ================================================================

const myVideos = [
    { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', channel: 'Rick Astley' },
    { id: '9bZkp7q19f0', title: 'Gangnam Style', channel: 'PSY' },
    { id: '3JZ_D3ELwOQ', title: 'Baby Shark Dance', channel: 'Pinkfong' },
    { id: 'kJQP7kiw5Fk', title: 'Despacito', channel: 'Luis Fonsi' },
    // Add your videos here when you upload them
];

// ================================================================
//  RENDER VIDEOS (FIXED SOUND)
// ================================================================

const feed = document.getElementById('feed');
const loading = document.getElementById('loading');
const container = document.getElementById('feedContainer');

let currentVideoIndex = -1;
let isMuted = true;

function renderVideos(videos) {
    feed.innerHTML = '';
    
    videos.forEach((video, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';
        wrapper.dataset.index = index;
        
        wrapper.innerHTML = `
            <iframe 
                id="player-${index}"
                src="https://www.youtube.com/embed/${video.id}?autoplay=0&mute=1&controls=0&loop=1&playlist=${video.id}&modestbranding=1&rel=0&showinfo=0&disablekb=1"
                allow="autoplay; encrypted-media; accelerometer; gyroscope"
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

            <button class="sound-toggle" data-muted="true" data-index="${index}">
                🔇
            </button>
            <div class="progress-bar"></div>
        `;

        feed.appendChild(wrapper);

        // --- SOUND TOGGLE BUTTON (FIXED) ---
        const soundBtn = wrapper.querySelector('.sound-toggle');
        const iframe = wrapper.querySelector('iframe');
        
        soundBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // Toggle mute state
            isMuted = !isMuted;
            this.dataset.muted = isMuted;
            this.textContent = isMuted ? '🔇' : '🔊';
            
            // Update iframe mute parameter
            let src = iframe.src;
            if (isMuted) {
                src = src.replace(/mute=[01]/, 'mute=1');
            } else {
                src = src.replace(/mute=[01]/, 'mute=0');
            }
            iframe.src = src;
            
            // Force reload with sound
            if (!isMuted) {
                // Add autoplay with sound
                iframe.src = iframe.src.replace(/autoplay=[01]/, 'autoplay=1');
            }
            
            console.log('🔊 Sound:', isMuted ? 'Muted' : 'Unmuted');
        });

        // --- DOUBLE TAP LIKE ---
        wrapper.addEventListener('dblclick', function(e) {
            e.preventDefault();
            const likeBtn = this.querySelector('.like-btn');
            let count = parseInt(likeBtn.dataset.likes) || 0;
            count++;
            likeBtn.dataset.likes = count;
            likeBtn.querySelector('.like-count').textContent = count;
        });
    });

    loading.classList.add('hidden');
}

// ================================================================
//  AUTO-PLAY WHEN SCROLLING
// ================================================================

container.addEventListener('scroll', function() {
    const wrappers = document.querySelectorAll('.video-wrapper');
    let newIndex = -1;

    wrappers.forEach((wrapper, index) => {
        const rect = wrapper.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        if (rect.top <= containerRect.top + containerRect.height / 2 &&
            rect.bottom >= containerRect.top + containerRect.height / 2) {
            newIndex = index;
        }
    });

    if (newIndex !== currentVideoIndex) {
        currentVideoIndex = newIndex;
        updateVideoPlayback();
    }
});

function updateVideoPlayback() {
    const wrappers = document.querySelectorAll('.video-wrapper');
    
    wrappers.forEach((wrapper, index) => {
        const iframe = wrapper.querySelector('iframe');
        const soundBtn = wrapper.querySelector('.sound-toggle');
        
        if (index === currentVideoIndex) {
            // PLAY this video (with current mute state)
            let src = iframe.src;
            src = src.replace(/autoplay=[01]/, 'autoplay=1');
            src = src.replace(/mute=[01]/, `mute=${isMuted ? 1 : 0}`);
            iframe.src = src;
            soundBtn.style.display = 'flex';
            
            // Progress bar
            const progress = wrapper.querySelector('.progress-bar');
            if (progress) {
                progress.style.width = '0%';
                let width = 0;
                const interval = setInterval(() => {
                    if (index !== currentVideoIndex) {
                        clearInterval(interval);
                        return;
                    }
                    width += 0.5;
                    if (width > 100) {
                        clearInterval(interval);
                        progress.style.width = '100%';
                        setTimeout(() => {
                            if (index === currentVideoIndex) {
                                progress.style.width = '0%';
                            }
                        }, 500);
                        return;
                    }
                    progress.style.width = width + '%';
                }, 100);
                wrapper.dataset.progressInterval = interval;
            }
        } else {
            // PAUSE this video
            let src = iframe.src;
            src = src.replace(/autoplay=[01]/, 'autoplay=0');
            iframe.src = src;
            soundBtn.style.display = 'none';
            
            if (wrapper.dataset.progressInterval) {
                clearInterval(parseInt(wrapper.dataset.progressInterval));
                wrapper.dataset.progressInterval = '';
            }
        }
    });
}

// ================================================================
//  KEYBOARD CONTROLS
// ================================================================

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const wrappers = document.querySelectorAll('.video-wrapper');
        let targetIndex = currentVideoIndex + (e.key === 'ArrowDown' ? 1 : -1);
        targetIndex = Math.max(0, Math.min(targetIndex, wrappers.length - 1));
        if (wrappers[targetIndex]) {
            wrappers[targetIndex].scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    if (e.key === 'm' || e.key === 'M') {
        const wrapper = document.querySelectorAll('.video-wrapper')[currentVideoIndex];
        if (wrapper) {
            const soundBtn = wrapper.querySelector('.sound-toggle');
            soundBtn.click();
        }
    }
});

// ================================================================
//  START!
// ================================================================

renderVideos(myVideos);
console.log('📹 Divinelove Ezeh Video Feed Started!');
console.log(`✅ Showing ${myVideos.length} videos`);
console.log('🔊 Tap the speaker button to toggle sound!');