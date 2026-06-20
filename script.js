// ================================================================
//  🎯 YOUR CHANNEL CONFIGURATION
// ================================================================

// Your channel handle and link (already set for you)
const CHANNEL_HANDLE = '@DivineloveEzeh';
const CHANNEL_URL = 'https://www.youtube.com/@DivineloveEzeh';

// !!! IMPORTANT: You MUST replace this with your actual Channel ID !!!
// How to find it: https://www.streamweasels.com/tools/youtube-channel-id/
const CHANNEL_ID = 'UC...'; // <-- PASTE YOUR REAL CHANNEL ID HERE (starts with UC)

// !!! IMPORTANT: You MUST replace this with your actual YouTube API Key !!!
// Get it from: https://console.cloud.google.com/
const API_KEY = 'YOUR_API_KEY'; // <-- PASTE YOUR REAL API KEY HERE

// ================================================================
//  🎯 THE CODE (Don't change below unless you know what you're doing)
// ================================================================

const feed = document.getElementById('feed');
const loading = document.getElementById('loading');
const container = document.getElementById('feedContainer');

let allVideos = [];
let currentIndex = 0;
let isLoading = false;
let nextPageToken = '';
let hasMore = true;
let currentVideoIndex = -1;
let isMuted = true;

// ================================================================
//  FETCH VIDEOS FROM YOUR CHANNEL
// ================================================================

async function fetchVideos(pageToken = '') {
    if (isLoading || !hasMore) return;
    isLoading = true;
    loading.classList.remove('hidden');

    try {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20&type=video&pageToken=${pageToken}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            let errorMsg = '❌ API Error: ' + data.error.message;
            if (data.error.code === 403) {
                errorMsg += '\n\n🔑 This usually means your API key is invalid, expired, or the YouTube API is not enabled.\nPlease check your Google Cloud Console.';
            } else if (data.error.code === 404) {
                errorMsg += '\n\n🔍 Channel not found. Please double-check your CHANNEL_ID.';
            }
            alert(errorMsg);
            loading.classList.add('hidden');
            isLoading = false;
            return;
        }

        const newVideos = data.items.filter(item => item.id.videoId).map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            channel: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt
        }));

        if (newVideos.length === 0 && !pageToken) {
            loading.innerHTML = '📹 No videos found on this channel yet.';
            loading.style.opacity = '0.8';
        }

        allVideos = allVideos.concat(newVideos);
        nextPageToken = data.nextPageToken || '';
        hasMore = !!nextPageToken;

        renderVideos();

    } catch (error) {
        console.error('Error fetching videos:', error);
        alert('⚠️ Network error. Please check your connection.');
    } finally {
        isLoading = false;
        loading.classList.add('hidden');
    }
}

// ================================================================
//  RENDER VIDEOS
// ================================================================

function renderVideos() {
    for (let i = currentIndex; i < allVideos.length; i++) {
        const video = allVideos[i];
        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';
        wrapper.dataset.index = i;
        wrapper.dataset.videoId = video.id;

        wrapper.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${video.id}?autoplay=0&mute=1&controls=0&loop=1&playlist=${video.id}&modestbranding=1&rel=0&showinfo=0&disablekb=1&fs=0"
                allow="autoplay; encrypted-media"
                loading="lazy"
                allowfullscreen
            ></iframe>
            
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>📅 ${new Date(video.publishedAt).toLocaleDateString()} • ${video.channel}</p>
            </div>
            
            <div class="side-actions">
                <div class="like-btn" data-likes="0">
                    <span class="icon">❤️</span>
                    <span class="like-count">0</span>
                </div>
                <div>
                    <span class="icon">💬</span>
                    0
                </div>
                <div>
                    <span class="icon">↗️</span>
                    0
                </div>
            </div>

            <button class="sound-toggle visible" data-muted="true">🔇</button>
            <div class="progress-bar"></div>
        `;

        feed.appendChild(wrapper);

        // Sound toggle
        const soundBtn = wrapper.querySelector('.sound-toggle');
        soundBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSound(wrapper);
        });

        // Double-tap like
        wrapper.addEventListener('dblclick', (e) => {
            e.preventDefault();
            handleLike(wrapper, e);
        });
    }

    currentIndex = allVideos.length;
}

// ================================================================
//  SOUND TOGGLE
// ================================================================

function toggleSound(wrapper) {
    const iframe = wrapper.querySelector('iframe');
    const btn = wrapper.querySelector('.sound-toggle');
    if (!iframe) return;

    isMuted = !isMuted;
    const src = iframe.src;
    const newSrc = src.replace(/mute=[01]/, `mute=${isMuted ? 1 : 0}`);
    iframe.src = newSrc;

    if (btn) {
        btn.textContent = isMuted ? '🔇' : '🔊';
        btn.dataset.muted = isMuted;
    }
}

// ================================================================
//  LIKE / DOUBLE-TAP
// ================================================================

function handleLike(wrapper, event) {
    const likeBtn = wrapper.querySelector('.like-btn');
    if (!likeBtn) return;

    let count = parseInt(likeBtn.dataset.likes) || 0;
    count++;
    likeBtn.dataset.likes = count;
    const countSpan = likeBtn.querySelector('.like-count');
    if (countSpan) countSpan.textContent = count;

    // Heart popup
    const heart = document.createElement('div');
    heart.className = 'heart-popup';
    heart.textContent = '❤️';
    heart.style.left = (event.clientX || window.innerWidth / 2) + 'px';
    heart.style.top = (event.clientY || window.innerHeight / 2) + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
}

// ================================================================
//  SCROLL HANDLER – Auto-play & infinite load
// ================================================================

container.addEventListener('scroll', () => {
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    // Load more when 80% down
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        fetchVideos(nextPageToken);
    }

    // Find current video in view
    const wrappers = document.querySelectorAll('.video-wrapper');
    let newCurrentIndex = -1;

    wrappers.forEach((wrapper, index) => {
        const rect = wrapper.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        if (rect.top <= containerRect.top + containerRect.height / 2 &&
            rect.bottom >= containerRect.top + containerRect.height / 2) {
            newCurrentIndex = index;
        }
    });

    if (newCurrentIndex !== currentVideoIndex) {
        currentVideoIndex = newCurrentIndex;
        updateVideoPlayback();
    }
});

// ================================================================
//  VIDEO PLAYBACK CONTROL
// ================================================================

function updateVideoPlayback() {
    const wrappers = document.querySelectorAll('.video-wrapper');

    wrappers.forEach((wrapper, index) => {
        const iframe = wrapper.querySelector('iframe');
        if (!iframe) return;

        if (index === currentVideoIndex) {
            // Play this video
            iframe.src = iframe.src.replace(/autoplay=[01]/, 'autoplay=1');
            wrapper.querySelector('.sound-toggle')?.classList.add('visible');

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
            // Pause this video
            iframe.src = iframe.src.replace(/autoplay=[01]/, 'autoplay=0');
            wrapper.querySelector('.sound-toggle')?.classList.remove('visible');

            if (wrapper.dataset.progressInterval) {
                clearInterval(parseInt(wrapper.dataset.progressInterval));
                wrapper.dataset.progressInterval = '';
            }
        }
    });
}

// ================================================================
//  KEYBOARD SHORTCUTS
// ================================================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const wrappers = document.querySelectorAll('.video-wrapper');
        let targetIndex = currentVideoIndex + (e.key === 'ArrowDown' ? 1 : -1);
        targetIndex = Math.max(0, Math.min(targetIndex, wrappers.length - 1));
        const targetWrapper = wrappers[targetIndex];
        if (targetWrapper) {
            targetWrapper.scrollIntoView({ behavior: 'smooth' });
        }
    }

    if (e.key === 'm' || e.key === 'M') {
        const wrapper = document.querySelectorAll('.video-wrapper')[currentVideoIndex];
        if (wrapper) toggleSound(wrapper);
    }
});

// ================================================================
//  START!
// ================================================================

console.log(`📹 Divinelove Ezeh Video Feed Started!`);
console.log(`🔗 Channel: ${CHANNEL_URL}`);

// Check configuration
if (CHANNEL_ID === 'UC...' || API_KEY === 'YOUR_API_KEY') {
    alert('⚠️ Please configure your Channel ID and API Key in the script.js file!\n\nChannel URL: ' + CHANNEL_URL);
} else {
    fetchVideos();
    console.log('✅ Channel ID:', CHANNEL_ID);
    console.log('🔑 API Key:', API_KEY ? '✅ Set' : '❌ Missing!');
}