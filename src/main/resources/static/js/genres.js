document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = '/api';
    
    // DOM Elements
    const genresGrid = document.getElementById('genresGrid');
    const addGenreBtn = document.getElementById('addGenreBtn');
    const genreModal = document.getElementById('genreModal');
    const closeModal = document.getElementById('closeModal');
    const cancelGenre = document.getElementById('cancelGenre');
    const genreForm = document.getElementById('genreForm');
    const modalTitle = document.getElementById('modalTitle');
    
    // Current genres data
    let genres = [];
    
    // Load data
    const loadData = async () => {
        try {
            await fetchGenres();
            setupEventListeners();
            if (!isAdmin()) {
                document.getElementById('addGenreBtn').style.display = 'none';
                document.querySelectorAll('.btn-edit, .btn-delete').forEach(btn => btn.style.display = 'none');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Erreur lors du chargement des données', 'error');
        }
    };
    
    // Fetch all genres
    const fetchGenres = async () => {
        try {
            const response = await fetchWithAuth(`${API_URL}/genres`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch genres');
            }
            
            genres = await response.json();
            renderGenresGrid(genres);
        } catch (error) {
            console.error('Error fetching genres:', error);
            genresGrid.innerHTML = '<p class="error-message">Erreur lors du chargement des genres. Veuillez réessayer.</p>';
        }
    };
    
    // Render genres grid
    const renderGenresGrid = (genresToRender) => {
        genresGrid.innerHTML = '';
        
        if (genresToRender.length === 0) {
            genresGrid.innerHTML = '<p class="no-items">Aucun genre trouvé</p>';
            return;
        }
        
        genresToRender.forEach(genre => {
            const genreCard = document.createElement('div');
            genreCard.className = 'genre-card';
            
            genreCard.innerHTML = `
                <div class="genre-content">
                    <h3>${genre.nom}</h3>
                    ${genre.description ? `<p class="genre-description">${genre.description}</p>` : ''}
                </div>
                <div class="genre-actions">
                    <button class="btn-icon btn-edit edit-genre" data-id="${genre.id}">modifier
                    </button>
                    <button class="btn-icon btn-delete delete-genre" data-id="${genre.id}"> supprimer
                    </button>
                </div>
            `;
            
            genresGrid.appendChild(genreCard);
        });
        
        // Add event listeners to the buttons
        document.querySelectorAll('.edit-genre').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const genre = genres.find(g => g.id == id);
                if (genre) {
                    openEditModal(genre);
                }
            });
        });
        
        document.querySelectorAll('.delete-genre').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                if (confirm('Êtes-vous sûr de vouloir supprimer ce genre?')) {
                    await deleteGenre(id);
                }
            });
        });
    };
    
    // Setup event listeners
    const setupEventListeners = () => {
        // Add genre button
        addGenreBtn.addEventListener('click', () => {
            resetForm();
            modalTitle.textContent = 'Ajouter un genre';
            genreModal.classList.add('active');
        });
        
        // Close modal buttons
        closeModal.addEventListener('click', () => {
            genreModal.classList.remove('active');
        });
        
        cancelGenre.addEventListener('click', () => {
            genreModal.classList.remove('active');
        });
        
        // Form submission
        genreForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const genreId = document.getElementById('genreId').value;
            const genreData = {
                nom: document.getElementById('nom').value,
                description: document.getElementById('description').value
            };
            
            if (genreId) {
                // Update existing genre
                await updateGenre(genreId, genreData);
            } else {
                // Create new genre
                await createGenre(genreData);
            }
            
            genreModal.classList.remove('active');
        });
    };
    
    // Reset form fields
    const resetForm = () => {
        document.getElementById('genreId').value = '';
        document.getElementById('nom').value = '';
        document.getElementById('description').value = '';
    };
    
    // Open edit modal with genre data
    const openEditModal = (genre) => {
        document.getElementById('genreId').value = genre.id;
        document.getElementById('nom').value = genre.nom;
        document.getElementById('description').value = genre.description || '';
        
        modalTitle.textContent = 'Modifier le genre';
        genreModal.classList.add('active');
    };
    
    // Create a new genre
    const createGenre = async (genreData) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/genres`, {
                method: 'POST',
                body: JSON.stringify(genreData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create genre');
            }
            await fetchGenres();
            showToast('Genre ajouté avec succès', 'success');
        } catch (error) {
            console.error('Error creating genre:', error);
            showToast(error.message || 'Erreur lors de l\'ajout du genre', 'error');
        }
    };
    
    // Update an existing genre
    const updateGenre = async (id, genreData) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/genres/${id}`, {
                method: 'PUT',
                body: JSON.stringify(genreData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update genre');
            }
            await fetchGenres();
            showToast('Genre mis à jour avec succès', 'success');
        } catch (error) {
            console.error('Error updating genre:', error);
            showToast(error.message || 'Erreur lors de la mise à jour du genre', 'error');
        }
    };
    
    // Delete a genre
    const deleteGenre = async (id) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/genres/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete genre');
            }
            await fetchGenres();
            showToast('Genre supprimé avec succès', 'success');
        } catch (error) {
            console.error('Error deleting genre:', error);
            showToast(error.message || 'Erreur lors de la suppression du genre', 'error');
        }
    };
    
    // Apply some additional styles for the genre cards
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .genres-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
        }
        
        .genre-card {
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease;
        }
        
        .genre-card:hover {
            transform: translateY(-5px);
        }
        
        .genre-content {
            margin-bottom: 1rem;
        }
        
        .genre-content h3 {
            color: #2e384d;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        
        .genre-description {
            font-size: 0.9rem;
            color: #666;
            margin-top: 0.5rem;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        
        .genre-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
            margin-top: auto;
        }
        
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .status-badge.available {
            background-color: #e7f7ef;
            color: #1db954;
        }
        
        .status-badge.unavailable {
            background-color: #ffebee;
            color: #f44336;
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Initialize the page
    loadData();
});

// Après avoir chargé l'utilisateur courant, masquer les boutons si non admin
const isAdmin = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload && payload.sub && payload.role === 'ADMIN';
}; 