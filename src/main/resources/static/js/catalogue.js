document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = '/api';
    
    // DOM Elements
    const booksGrid = document.getElementById('booksGrid');
    const searchInput = document.getElementById('searchInput');
    const filterAuteur = document.getElementById('filterAuteur');
    const filterGenre = document.getElementById('filterGenre');
    
    // Data
    let livres = [];
    let auteurs = [];
    let genres = [];
    
    // Load data
    const loadData = async () => {
        try {
            // Fetch all books
            await fetchLivres();
            
            // Fetch authors for the filter
            await fetchAuteurs();
            
            // Fetch genres for the filter
            await fetchGenres();
            
            // Setup event listeners
            setupEventListeners();
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Erreur lors du chargement des données', 'error');
        }
    };
    
    // Fetch all books
    const fetchLivres = async () => {
        try {
            const response = await fetch(`${API_URL}/livres`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            
            livres = await response.json();
            renderBooksGrid(livres);
        } catch (error) {
            console.error('Error fetching books:', error);
            booksGrid.innerHTML = '<div class="error-message">Erreur lors du chargement des livres</div>';
        }
    };
    
    // Fetch all authors
    const fetchAuteurs = async () => {
        try {
            const response = await fetch(`${API_URL}/auteurs`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch authors');
            }
            
            auteurs = await response.json();
            
            // Populate author filter
            filterAuteur.innerHTML = '<option value="all">Tous les auteurs</option>';
            
            auteurs.forEach(auteur => {
                const option = document.createElement('option');
                option.value = auteur.id;
                option.textContent = auteur.nom;
                filterAuteur.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };
    
    // Fetch all genres
    const fetchGenres = async () => {
        try {
            const response = await fetch(`${API_URL}/genres`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch genres');
            }
            
            genres = await response.json();
            
            // Populate genre filter
            filterGenre.innerHTML = '<option value="all">Tous les genres</option>';
            
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.nom;
                filterGenre.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };
    
    // Render books grid
    const renderBooksGrid = (booksToRender) => {
        booksGrid.innerHTML = '';
        
        if (booksToRender.length === 0) {
            booksGrid.innerHTML = '<div class="no-books">Aucun livre trouvé</div>';
            return;
        }
        
        booksToRender.forEach(livre => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            
            bookCard.innerHTML = `
                <div class="book-cover">
                    <i class="fas fa-book"></i>
                </div>
                <div class="book-info">
                    <h4>${livre.titre}</h4>
                    <p><i class="fas fa-user"></i> ${livre.auteur ? livre.auteur.nom : 'Auteur inconnu'}</p>
                    <p><i class="fas fa-tag"></i> ${livre.genre ? livre.genre.nom : 'Genre non spécifié'}</p>
                    <p><i class="fas fa-barcode"></i> ${livre.isbn || 'ISBN non disponible'}</p>
                    <div class="book-status">
                        <span class="status-badge ${livre.disponible ? 'available' : 'unavailable'}">
                            ${livre.disponible ? 'Disponible' : 'Emprunté'}
                        </span>
                    </div>
                </div>
            `;
            
            booksGrid.appendChild(bookCard);
        });
    };
    
    // Filter books
    const filterBooks = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const auteurFilter = filterAuteur.value;
        const genreFilter = filterGenre.value;
        
        let filteredBooks = livres.filter(livre => {
            // Search term filter
            const matchesSearch = livre.titre.toLowerCase().includes(searchTerm) ||
                                (livre.auteur && livre.auteur.nom.toLowerCase().includes(searchTerm)) ||
                                (livre.genre && livre.genre.nom.toLowerCase().includes(searchTerm));
            
            // Author filter
            const matchesAuthor = auteurFilter === 'all' || 
                                (livre.auteur && livre.auteur.id == auteurFilter);
            
            // Genre filter
            const matchesGenre = genreFilter === 'all' || 
                               (livre.genre && livre.genre.id == genreFilter);
            
            return matchesSearch && matchesAuthor && matchesGenre;
        });
        
        renderBooksGrid(filteredBooks);
    };
    
    // Setup event listeners
    const setupEventListeners = () => {
        // Search input
        searchInput.addEventListener('input', filterBooks);
        
        // Filter changes
        filterAuteur.addEventListener('change', filterBooks);
        filterGenre.addEventListener('change', filterBooks);
    };
    
    // Initialize the page
    loadData();
}); 