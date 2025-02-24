// Manually add your song files here
const songs = [
    { 
        name: '505',
        artist: 'Arctic Monkeys',
        file: 'songs/505(48k).mp3',
        image: '505.png'
    },
    { 
        name: 'Space Song',
        artist: 'Depression Cherry',
        file: 'songs/Beach_House_-_Space_Song(48k).mp3',
        image: 'space.png'
    },
    { 
        name: 'Wildflower',
        artist: 'Billie Eilish',
        file: 'songs/Billie_Eilish_-_WILDFLOWER__Official_Lyric_Video_(128k).mp3',
        image: 'wild.png'
    },
    {
        name: 'Beanie',
        artist: 'Chezile',
        file: 'songs/Chezile_-_Beanie__Official_Visualizer_(128k).mp3',
        image: 'beanie.png'
    },
    {
        name: 'HUSN',
        artist: 'Anuv Jain',
        file: 'songs/Anuv_Jain_-_HUSN__Official_Video_(48k).mp3',
        image: 'husn.png'
    },
    {
        name: 'The Local Train',
        artist: 'Aalas Ka Pedh',
        file: 'songs/The_Local_Train_-_Aalas_Ka_Pedh_-_Choo_Lo__Official_Audio_(48k).mp3',
        image: 'aalas.png'
    },
    {
        name: 'End of Beginning',
        artist: 'Djo',
        file: 'songs/Djo_-_End_Of_Beginning__Lyrics_(128k).mp3',
        image: 'end.png'
    },
    {
        name: 'Good for you x One of the girls',
        artist: 'DreamSoda',
        file: 'songs/Good_For_You_x_One_Of_The_Girls(128k).mp3',
        image: 'onegirl.png'
    },
    {
        name: 'Jaane kyun',
        artist: 'Tanveer Evan',
        file: 'songs/Jaane_Kyun_-_Tanveer_Evan__Official_Music_Video____Mennu_Bhool_Na_Jaave_.(48k).mp3',
        image: 'jaane.png'
    },
    {
        name: 'Another Love',
        artist: 'Tom Odell',
        file: 'songs/Tom_Odell_-_Another_Love__Lyrics_(48k).mp3',
        image: 'anotherlove.png'
    },
    {
        name: 'Tumse Mohabbat Hai',
        artist: 'JalRaj',
        file: 'songs/Tumse_Mohabbat_Hai_-_JalRaj___Safar___Latest_hindi_song_2020_original(48k).mp3',
        image: 'tumse.png'
    },
    {
        name: 'Birds of a feather',
        artist: 'Billie Eilish',
        file: 'songs/Billie_Eilish_-_BIRDS_OF_A_FEATHER__Official_Music_Video_(128k).mp3',
        image: 'birds.png'
    },
    {
        name: 'Messy',
        artist: 'Lola Young',
        file: 'songs/Lola_Young_-_Messy__Official_Video_(128k).mp3',
        image: 'messy.png'
    },
    {
        name: 'Pastlives',
        artist: 'sapientdream',
        file: 'songs/sapientdream_-_Pastlives__lyrics_(128k).mp3',
        image: 'pastlives.png'
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
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');

// Update search input handler
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const filteredSongs = songs.filter(song => 
        song.name.toLowerCase().includes(searchTerm) ||
        song.artist.toLowerCase().includes(searchTerm)
    );
    
    updateSuggestions(filteredSongs);
    updateSongGrid(filteredSongs);
});

// Update song grid with original indices
function updateSongGrid(filteredSongs) {
    const grid = document.querySelector('.grid-container');
    grid.innerHTML = '';
    
    filteredSongs.forEach(filteredSong => {
        // Find original index in main songs array
        const originalIndex = songs.findIndex(song => 
            song.file === filteredSong.file &&
            song.name === filteredSong.name &&
            song.artist === filteredSong.artist
        );
        
        const gradient = generateGradient(originalIndex);
        const card = createSongCard(filteredSong, originalIndex, gradient);
        grid.appendChild(card);
    });
}

// Create song card with correct original index
function createSongCard(song, originalIndex, gradient) {
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
        changeSong(originalIndex);
        if (!isPlaying) togglePlayPause();
    };
    
    return card;
}

// Update suggestions to use original indices
function updateSuggestions(filteredSongs) {
    searchSuggestions.innerHTML = '';
    
    filteredSongs.forEach(filteredSong => {
        const originalIndex = songs.findIndex(song => 
            song.file === filteredSong.file &&
            song.name === filteredSong.name &&
            song.artist === filteredSong.artist
        );
        
        const div = document.createElement('div');
        div.className = 'suggestion-item';
        div.textContent = `${filteredSong.name} - ${filteredSong.artist}`;
        div.onclick = () => {
            changeSong(originalIndex);
            searchInput.value = '';
            searchSuggestions.style.display = 'none';
        };
        searchSuggestions.appendChild(div);
    });
    
    searchSuggestions.style.display = filteredSongs.length ? 'block' : 'none';
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

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
        document.getElementById('searchSuggestions').style.display = 'none';
    }
}); 