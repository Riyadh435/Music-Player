// Manually add your song files here
const songs = [
    { 
        name: 'Christmas Song 1',
        artist: 'Chill Artist',
        file: 'songs/christmas-song-01-273026.mp3',
        image: ''
    },
    { 
        name: 'Christmas Song 2',
        artist: 'Nature Sounds',
        file: 'songs/christmas-song-02-273025.mp3',
        image: 'cover2.jpg'
    },
    { 
        name: 'Creepy Song',
        artist: 'Relaxation Studio',
        file: 'songs/creepy-song-276076.mp3',
        image: 'cover3.jpg'
    },
    {
        name: 'Happy Birthday',
        artist: 'Chill Artist',
        file: 'songs/happy-birthday-254480.mp3',
        image: 'happybirthday.png'
    },
    {
        name: 'Lapupu',
        artist: 'Chill Artist',
        file: 'songs/lapupu-song-274773.mp3',
        image: 'lapupu.png'
    },
    {
        name: 'Tera Roothna',
        artist: 'Chill Artist',
        file: 'songs/romantic-song-tera-roothna-by-ashir-hindi-top-trending-viral-song-231771.mp3',
        image: ''
    },
    {
        name: 'Summer Vibes',
        artist: 'Chill Artist',
        file: 'songs/song1.mp3',
        image: 'my_p.jpg'
    }
];

const audio = new Audio();
let currentSongIndex = 0;
let isPlaying = false;

// Player elements
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
const songTitle = document.getElementById('song-title');
const songTime = document.getElementById('song-time');
const playlist = document.getElementById('playlist');

// Add gradient generation function
function generateGradient(index) {
    const hue = (index * 137.508) % 360; // Golden angle distribution
    return `linear-gradient(45deg, 
        hsl(${hue}, 70%, 50%),
        hsl(${(hue + 120) % 360}, 70%, 50%)
    )`;
}

function getTextColor(gradient) {
    // Simple check for light/dark gradient
    return gradient.includes('hsl(0, 70%, 50%)') ? '#fff' : '#000';
}

// Initialize playlist
function initPlaylist() {
    const grid = document.querySelector('.grid-container');
    grid.innerHTML = '';
    
    songs.forEach((song, index) => {
        const gradient = generateGradient(index);
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="card-image" style="background: ${gradient}">
                <img src="Pictures/${song.image}" 
                     onerror="this.remove()">
                <button class="play-button">▶</button>
            </div>
            <h3 class="card-title">${song.name}</h3>
            <p class="card-artist">${song.artist}</p>
        `;
        card.onclick = () => {
            changeSong(index);
            if (!isPlaying) togglePlayPause();
        };
        grid.appendChild(card);
    });
    
    audio.src = songs[0].file;
    audio.load().catch(console.error);
}

// Update player UI
function updatePlayer() {
    songTitle.textContent = songs[currentSongIndex].name;
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => 
        item.classList.toggle('playing', index === currentSongIndex)
    );
}

// Change song
function changeSong(index) {
    currentSongIndex = index;
    const song = songs[index];
    const gradient = generateGradient(index);
    
    // Update player UI
    const currentArt = document.getElementById('currentArt');
    currentArt.src = `Pictures/${song.image}`;
    currentArt.onerror = () => {
        currentArt.style.background = gradient;
        currentArt.style.display = 'block';
    };
    currentArt.style.background = gradient;
    
    document.getElementById('song-title').textContent = song.name;
    document.getElementById('song-artist').textContent = song.artist;
    
    // Load and play audio
    audio.src = song.file;
    if (isPlaying) {
        audio.play().catch(console.error);
    }
    updatePlayer();
}

// Play/pause toggle
function togglePlayPause() {
    if (audio.paused) {
        audio.play().then(() => {
            isPlaying = true;
            updatePlayButton();
        }).catch(error => {
            console.error('Playback failed:', error);
            alert('Error playing audio: ' + error.message);
        });
    } else {
        audio.pause();
        isPlaying = false;
        updatePlayButton();
    }
}

// Update progress
audio.ontimeupdate = () => {
    if (!isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100 || 0;
        document.getElementById('progress').value = progress;
    }
};

// Format time (mm:ss)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Event listeners
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', () => changeSong(
    (currentSongIndex - 1 + songs.length) % songs.length
));
nextBtn.addEventListener('click', () => changeSong(
    (currentSongIndex + 1) % songs.length
));

progress.addEventListener('input', (e) => {
    audio.currentTime = (e.target.value / 100) * audio.duration;
});

volume.addEventListener('input', (e) => {
    audio.volume = e.target.value;
});

audio.addEventListener('ended', () => {
    changeSong((currentSongIndex + 1) % songs.length);
});

// Update search functionality
function updateSongGrid(filteredSongs) {
    const grid = document.querySelector('.grid-container');
    grid.innerHTML = '';
    
    filteredSongs.forEach((song) => {
        // Find the original index in the main songs array
        const originalIndex = songs.findIndex(s => 
            s.file === song.file && 
            s.name === song.name && 
            s.artist === song.artist
        );
        
        const gradient = generateGradient(originalIndex);
        
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="card-image" style="background: ${gradient}">
                <img src="Pictures/${song.image}" onerror="this.remove()">
                <button class="play-button">▶</button>
            </div>
            <h3 class="card-title">${song.name}</h3>
            <p class="card-artist">${song.artist}</p>
        `;
        
        card.onclick = () => {
            changeSong(originalIndex);  // Use original index
            if (!isPlaying) togglePlayPause();
        };
        
        grid.appendChild(card);
    });
}

// Add proper audio event listeners
audio.addEventListener('play', () => {
    isPlaying = true;
    updatePlayButton();
});

audio.addEventListener('pause', () => {
    isPlaying = false;
    updatePlayButton();
});

// Update play button state
function updatePlayButton() {
    playPauseBtn.innerHTML = isPlaying ? 
        '<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"></path></svg>' :
        '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>';
}

// Handle song metadata loading
audio.addEventListener('loadedmetadata', () => {
    document.getElementById('progress').max = audio.duration;
});

// Update progress bar handling
audio.addEventListener('timeupdate', () => {
    const progress = document.getElementById('progress');
    const currentTimeElement = document.querySelector('.current-time');
    const durationElement = document.querySelector('.duration');
    
    const currentTime = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);
    
    currentTimeElement.textContent = currentTime;
    durationElement.textContent = duration;
    progress.value = audio.currentTime;
    progress.max = audio.duration;
});

// Auto-play next song
audio.addEventListener('ended', () => {
    changeSong((currentSongIndex + 1) % songs.length);
});

// Handle audio errors
audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    isPlaying = false;
    updatePlayButton();
});

// Initialize
initPlaylist();
audio.src = songs[0].file;  // Set initial song without showing detail view
updatePlayer();

// Add search functionality
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const suggestions = document.getElementById('searchSuggestions');
    
    if (searchTerm.length === 0) {
        suggestions.innerHTML = '';
        suggestions.style.display = 'none';
        return;
    }

    const filteredSongs = songs.filter(song => 
        song.name.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Show top 5 results

    updateSuggestions(filteredSongs);
    updateSongGrid(filteredSongs);
});

function updateSuggestions(songs) {
    const suggestions = document.getElementById('searchSuggestions');
    suggestions.innerHTML = '';
    
    songs.forEach(song => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = `${song.name} - ${song.artist}`;
        div.onclick = () => {
            const originalIndex = songs.findIndex(s => 
                s.file === song.file && 
                s.name === song.name && 
                s.artist === song.artist
            );
            changeSong(originalIndex);
            searchInput.value = '';
            suggestions.style.display = 'none';
        };
        suggestions.appendChild(div);
    });
    
    suggestions.style.display = songs.length ? 'block' : 'none';
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
        document.getElementById('searchSuggestions').style.display = 'none';
    }
}); 