// ================================================================
//  DIVINELOVE EZEH – YOUR YOUTUBE CHANNEL VIDEOS
// ================================================================

// Your Channel ID
const CHANNEL_ID = 'UC9sjVKNLqGWW1EjcEBny6xQ';

// Your YouTube API Key
const API_KEY = 'AIzaSyCyGfLFk_WgLWvbplqVJ1_oOtkaTDm2X5Q';

// ================================================================
//  FETCH YOUR VIDEOS FROM YOUTUBE
// ================================================================

const feed = document.getElementById('feed');
const loading = document.getElementById('loading');
const container = document.getElementById('feedContainer');

let currentVideoIndex = -1;
let isMuted = true;
let allVideos = [];

// ================================================================
//  FETCH VIDEOS FROM YOUR CHANNEL
// ================================================================

async function fetchMyVideos() {
    try {
        loading.classList.remove('hidden');
        loading.textContent = '📡 Loading your videos from YouTube...';
        
        const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`;
        
        const response = await fetch(url);
        const data = await response.json();

        console.log('YouTube Response:', data);

        if (data.error) {
            alert('❌ API Error: ' + data.error.message + '\n\nCheck your API key and Channel ID.');
            loading.textContent = '⚠️ Error loading videos';
            return;
        }

        allVideos = data.items
            .filter(item => item.id.videoId)
            .map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                channel: item.snippet.channelTitle
            }));

        if (allVideos.length === 0) {
            loading.textContent = '📹 No videos found on your channel. Upload your first video!';
            loading.style.opacity = '0.8';
            return;
        }

        console.log(`✅ Found ${allVideos.length} videos from your channel!`);
        renderVideos(allVideos);

    } catch (error) {
        console.error('Error:', error);
        alert('⚠️ Network error. Please check your connection.');
    }
}

// ================================================================
//  RENDER VIDEOS
// ================================================================

function renderVideos(videos) {
    feed.innerHTML = '';
    
    videos.forEach((video, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';
        wrapper.dataset.index = index;
        
        wrapper.innerHTML = `
            <iframe 
                id="player-${index}"
                src="https://www.youtube.com/embed/${video.id}?autoplay=0&mute=1&controls=0&loop=1&playlist=${video.id}&modestbranding=1&rel=0&showinfo=0&disablekb=1&fs=0"
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

        // --- SOUND TOGGLE ---
        const soundBtn = wrapper.querySelector('.sound-toggle');
        const iframe = wrapper.querySelector('iframe');
        
        soundBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            isMuted = !isMuted;
            this.dataset.muted = isMuted;
            this.textContent = isMuted ? '🔇' : '🔊';
            
            let src = iframe.src;
            src = src.replace(/mute=[01]/, `mute=${isMuted ? 1 : 0}`);
            iframe.src = src;
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
//  STOP ALL OTHER VIDEOS
// ================================================================

function stopAllVideosExcept(currentWrapper) {
    const allIframes = document.querySelectorAll('.video-wrapper iframe');
    const currentIframe = currentWrapper ? currentWrapper.querySelector('iframe') : null;
    
    allIframes.forEach(iframe => {
        if (iframe !== currentIframe) {
            let src = iframe.src;
            src = src.replace(/autoplay=[01]/, 'autoplay=0');
            iframe.src = src;
        }
    });
}

// ================================================================
//  PLAY CURRENT VIDEO
// ================================================================

function playVideo(wrapper) {
    if (!wrapper) return;
    
    const iframe = wrapper.querySelector('iframe');
    const soundBtn = wrapper.querySelector('.sound-toggle');
    
    stopAllVideosExcept(wrapper);
    
    let src = iframe.src;
    src = src.replace(/autoplay=[01]/, 'autoplay=1');
    src = src.replace(/mute=[01]/, `mute=${isMuted ? 1 : 0}`);
    iframe.src = src;
    
    soundBtn.style.display = 'flex';
    soundBtn.textContent = isMuted ? '🔇' : '🔊';
}

// ================================================================
//  SCROLL HANDLER
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
        if (newIndex >= 0 && newIndex < wrappers.length) {
            playVideo(wrappers[newIndex]);
        }
    }
});

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
//  START! – FETCH YOUR REAL YOUTUBE VIDEOS
// ================================================================

fetchMyVideos();
console.log('📹 Divinelove Ezeh – Your YouTube Videos');
console.log(`🎯 Channel ID: ${CHANNEL_ID}`);