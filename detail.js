// Fungsi untuk mendapatkan parameter URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        film: params.get('film'),
        title: params.get('title')
    };
}

// Fungsi untuk decode URL parameter
function decodeUrlParam(param) {
    try {
        return decodeURIComponent(param || '');
    } catch (e) {
        return param || '';
    }
}

// Fungsi untuk mencari film berdasarkan URL
async function findMovieByUrl(filmUrl) {
    const categories = ['horror', 'drama', 'action', 'comedy', 'kid', 'music', 'documenter', 'discover'];
    
    // Decode URL untuk pencarian yang lebih akurat
    const decodedFilmUrl = decodeUrlParam(filmUrl);
    
    for (const category of categories) {
        try {
            const response = await fetch(`data/${category}.json`);
            if (!response.ok) continue;
            
            const movies = await response.json();
            
            // Cari film dengan berbagai kemungkinan matching
            const movie = movies.find(m => {
                // Cek berbagai format URL yang mungkin
                const movieUrl = m.film_url || '';
                return movieUrl === filmUrl || 
                       movieUrl === decodedFilmUrl ||
                       decodeUrlParam(movieUrl) === decodedFilmUrl ||
                       movieUrl.includes(filmUrl) ||
                       filmUrl.includes(movieUrl);
            });
            
            if (movie) {
                movie.category = category; // Tambahkan kategori ke objek movie
                return movie;
            }
        } catch (error) {
            console.warn(`Error searching in ${category}:`, error);
            continue;
        }
    }
    
    // Jika tidak ditemukan, coba gunakan data demo
    console.log('Movie not found in JSON files, using demo data');
    return getDemoMovie(filmUrl);
}

// Fungsi untuk data demo jika film tidak ditemukan
function getDemoMovie(filmUrl) {
    const demoMovies = [
        {
            title: "The Matriarch 2024",
            description: "Film horror terbaru dengan cerita menegangkan tentang seorang ibu yang memiliki kekuatan gelap.",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=The+Matriarch",
            film_url: "detail.html?film=the-matriarch",
            embed_url: "https://example.com/embed/the-matriarch",
            genre: "Horror",
            year: "2024",
            category: "horror",
            duration: "1h 38m"
        },
        {
            title: "Action Hero 2024",
            description: "Film aksi penuh adrenalin dengan pertarungan dan ledakan yang spektakuler.",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Action+Hero",
            film_url: "detail.html?film=action-hero",
            embed_url: "https://example.com/embed/action-hero",
            genre: "Action",
            year: "2024",
            category: "action",
            duration: "2h 15m"
        },
        {
            title: "Drama Story 2024",
            description: "Film drama mengharukan tentang perjalanan hidup dan cinta yang tak terlupakan.",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Drama+Story",
            film_url: "detail.html?film=drama-story",
            embed_url: "https://example.com/embed/drama-story",
            genre: "Drama",
            year: "2024",
            category: "drama",
            duration: "1h 52m"
        }
    ];
    
    // Cari film demo berdasarkan URL
    return demoMovies.find(movie => movie.film_url === filmUrl) || demoMovies[0];
}

// Fungsi untuk memuat film terkait
async function loadRelatedMovies(movie) {
    if (!movie || !movie.category) {
        console.warn('No movie or category provided for related movies');
        return;
    }
    
    try {
        const response = await fetch(`data/${movie.category}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${movie.category}.json`);
        }
        
        const movies = await response.json();
        
        // Filter film dengan kategori yang sama, kecuali film saat ini
        const relatedMovies = movies
            .filter(m => m.film_url !== movie.film_url)
            .slice(0, 6); // Ambil 6 film pertama
        
        displayRelatedMovies(relatedMovies);
    } catch (error) {
        console.error('Error loading related movies:', error);
        // Fallback ke data demo
        const demoMovies = getDemoMoviesByCategory(movie.category);
        displayRelatedMovies(demoMovies.slice(0, 6));
    }
}

// Fungsi untuk data demo film terkait
function getDemoMoviesByCategory(category) {
    const allDemoMovies = [
        {
            title: "Horror Night",
            description: "Film horror mencekam",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Horror+Night",
            film_url: "detail.html?film=horror-night",
            genre: "Horror",
            year: "2024",
            category: "horror"
        },
        {
            title: "Action Packed",
            description: "Film aksi seru",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Action+Packed",
            film_url: "detail.html?film=action-packed",
            genre: "Action",
            year: "2024",
            category: "action"
        },
        {
            title: "Drama Life",
            description: "Film drama kehidupan",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Drama+Life",
            film_url: "detail.html?film=drama-life",
            genre: "Drama",
            year: "2024",
            category: "drama"
        },
        {
            title: "Comedy Time",
            description: "Film komedi lucu",
            thumbnail: "https://via.placeholder.com/300x533/1f1f1f/e50914?text=Comedy+Time",
            film_url: "detail.html?film=comedy-time",
            genre: "Comedy",
            year: "2024",
            category: "comedy"
        }
    ];
    
    return allDemoMovies.filter(movie => movie.category === category);
}

// Fungsi untuk menampilkan film terkait
function displayRelatedMovies(movies) {
    const container = document.getElementById('related-movies');
    if (!container) {
        console.error('Related movies container not found');
        return;
    }
    
    if (!movies || movies.length === 0) {
        container.innerHTML = '<div class="loading"><p>😞 Tidak ada film terkait</p></div>';
        return;
    }
    
    container.innerHTML = movies.map(movie => `
        <div class="movie-card">
            <a href="detail.html?film=${encodeURIComponent(movie.film_url || '')}&title=${encodeURIComponent(movie.title || '')}">
                <div class="movie-poster-container">
                    <img src="${movie.thumbnail || 'https://via.placeholder.com/300x533/1f1f1f/8c8c8c?text=No+Image'}" 
                         alt="${movie.title || 'No Title'}" 
                         class="movie-poster" 
                         onerror="this.src='https://via.placeholder.com/300x533/1f1f1f/8c8c8c?text=No+Image'">
                </div>
            </a>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title || 'Untitled'}</h3>
                <div class="movie-meta">
                    <span>${movie.genre || 'Unknown'}</span>
                    <span class="movie-year">${movie.year || 'N/A'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Fungsi untuk menampilkan detail film
function displayMovieDetail(movie) {
    if (!movie) {
        showErrorState();
        return;
    }
    
    // Update judul halaman
    document.title = `${movie.title || 'Film'} - INTROMOVIE 21`;
    
    // Isi detail film
    const titleElement = document.getElementById('movie-title');
    const yearElement = document.getElementById('movie-year');
    const genreElement = document.getElementById('movie-genre');
    const categoryElement = document.getElementById('movie-category');
    const durationElement = document.getElementById('movie-duration');
    const descriptionElement = document.getElementById('movie-description');
    const posterElement = document.getElementById('movie-poster');
    
    if (titleElement) titleElement.textContent = movie.title || 'Judul tidak tersedia';
    if (yearElement) yearElement.textContent = movie.year || 'N/A';
    if (genreElement) genreElement.textContent = movie.genre || 'N/A';
    if (categoryElement) categoryElement.textContent = movie.category ? movie.category.charAt(0).toUpperCase() + movie.category.slice(1) : 'N/A';
    if (durationElement) durationElement.textContent = movie.duration || 'N/A';
    if (descriptionElement) descriptionElement.textContent = movie.description || 'Deskripsi tidak tersedia.';
    
    // Set poster film
    if (posterElement) {
        posterElement.src = movie.thumbnail || 'https://via.placeholder.com/300x533/1f1f1f/8c8c8c?text=No+Image';
        posterElement.alt = movie.title || 'Movie Poster';
    }
    
    // Setup video player jika ada embed_url
    setupVideoPlayer(movie);
}

// Fungsi untuk setup video player
function setupVideoPlayer(movie) {
    const videoPlayer = document.getElementById('video-player');
    const playerContainer = document.querySelector('.player-container');
    
    if (videoPlayer && movie.embed_url) {
        videoPlayer.src = movie.embed_url;
    } else if (playerContainer) {
        playerContainer.innerHTML = `
            <div style="background: #000; color: #fff; padding: 40px; text-align: center; border-radius: 8px;">
                <h3>🎬 Film Preview</h3>
                <p>Video player akan muncul di sini ketika film diputar</p>
                <p><small>URL embed: ${movie.embed_url || 'Tidak tersedia'}</small></p>
            </div>
        `;
    }
}

// Fungsi untuk menampilkan state error
function showErrorState() {
    document.getElementById('movie-title').textContent = 'Film tidak ditemukan';
    document.getElementById('movie-description').textContent = 'Maaf, film yang Anda cari tidak ditemukan. Silakan kembali ke halaman utama.';
    
    const playerContainer = document.querySelector('.player-container');
    if (playerContainer) {
        playerContainer.innerHTML = `
            <div style="background: #1f1f1f; color: #fff; padding: 40px; text-align: center; border-radius: 8px;">
                <h3>❌ Film Tidak Ditemukan</h3>
                <p>Film yang Anda cari tidak tersedia dalam database kami.</p>
                <a href="index.html" class="cta-button" style="margin-top: 20px; display: inline-block;">Kembali ke Beranda</a>
            </div>
        `;
    }
}

// Fungsi untuk memutar film
function playMovie() {
    if (!currentMovie) {
        alert('Film tidak tersedia untuk diputar');
        return;
    }
    
    const videoPlayer = document.getElementById('video-player');
    if (videoPlayer && currentMovie.embed_url) {
        videoPlayer.src = currentMovie.embed_url;
        videoPlayer.style.display = 'block';
        
        // Scroll ke video player
        videoPlayer.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert('URL embed tidak tersedia untuk film ini');
    }
}

// Fungsi untuk menambah ke favorit
function addToFavorites() {
    if (!currentMovie) {
        alert('Tidak ada film yang bisa ditambahkan ke favorit');
        return;
    }
    
    // Simpan ke localStorage
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    // Cek apakah film sudah ada di favorit
    const existingIndex = favorites.findIndex(fav => fav.film_url === currentMovie.film_url);
    
    if (existingIndex === -1) {
        favorites.push(currentMovie);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert(`"${currentMovie.title}" telah ditambahkan ke favorit!`);
    } else {
        alert(`"${currentMovie.title}" sudah ada di favorit!`);
    }
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!mobileMenuBtn || !mobileMenu) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenu.classList.toggle('active');
        this.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });
    
    // Tutup mobile menu ketika klik di luar
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        }
    });
    
    // Tutup mobile menu ketika link diklik
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        });
    });
}

// Setup event listeners untuk tombol aksi
function setupActionButtons() {
    const playBtn = document.getElementById('play-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    
    if (playBtn) {
        playBtn.addEventListener('click', playMovie);
    }
    
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', addToFavorites);
    }
}

let currentMovie = null;

// Inisialisasi halaman detail
document.addEventListener('DOMContentLoaded', async function() {
    console.log('INTROMOVIE 21 - Detail Page Initializing...');
    
    const params = getUrlParams();
    
    if (!params.film) {
        console.warn('No film parameter found');
        showErrorState();
        return;
    }

    console.log('Searching for film:', params.film);
    
    // Tampilkan loading state
    document.getElementById('movie-title').textContent = 'Memuat...';
    document.getElementById('movie-description').textContent = 'Sedang memuat detail film...';

    // Cari film berdasarkan URL
    try {
        currentMovie = await findMovieByUrl(params.film);
        
        if (currentMovie) {
            console.log('Movie found:', currentMovie);
            displayMovieDetail(currentMovie);
            loadRelatedMovies(currentMovie);
        } else {
            console.warn('Movie not found');
            showErrorState();
        }
    } catch (error) {
        console.error('Error loading movie:', error);
        showErrorState();
    }
    
    // Setup UI components
    setupMobileMenu();
    setupActionButtons();
});