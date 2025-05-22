document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = '/api';
    
    // DOM Elements
    const livresTableBody = document.getElementById('livresTableBody');
    const addLivreBtn = document.getElementById('addLivreBtn');
    const livreModal = document.getElementById('livreModal');
    const closeModal = document.getElementById('closeModal');
    const cancelLivre = document.getElementById('cancelLivre');
    const livreForm = document.getElementById('livreForm');
    const modalTitle = document.getElementById('modalTitle');
    
    // Filter elements
    const filterDisponible = document.getElementById('filterDisponible');
    const filterAuteur = document.getElementById('filterAuteur');
    const filterGenre = document.getElementById('filterGenre');
    
    // Current livres data
    let livres = [];
    let auteurs = [];
    let genres = [];
    
    // Check if we're viewing a specific book (from URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const bookIdFromUrl = urlParams.get('id');
    
    // Load data
    const loadData = async () => {
        try {
            // Fetch all books
            await fetchLivres();
            
            // Fetch authors for the filter and form
            await fetchAuteurs();
            
            // Fetch genres for the filter and form
            await fetchGenres();
            
            // Setup event listeners
            setupEventListeners();
            
            // Check if we need to view a specific book
            if (bookIdFromUrl) {
                const book = livres.find(l => l.id == bookIdFromUrl);
                if (book) {
                    openEditModal(book);
                }
            }
            
            // Après avoir chargé l'utilisateur courant, masquer les boutons si non admin
            if (!isAdmin()) {
                document.getElementById('addLivreBtn').style.display = 'none';
                // Masquer les boutons d'action dans le tableau
                document.querySelectorAll('.btn-edit, .btn-delete').forEach(btn => btn.style.display = 'none');
            }
            
            // Appeler filterLivres() après le chargement des livres pour appliquer le filtre initial
            filterLivres();
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Erreur lors du chargement des données', 'error');
        }
    };
    
    // Fetch all books
    const fetchLivres = async () => {
        try {
            const response = await fetchWithAuth(`${API_URL}/livres`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            
            livres = await response.json();
            renderLivresTable(livres);
        } catch (error) {
            console.error('Error fetching books:', error);
            livresTableBody.innerHTML = '<tr><td colspan="7">Erreur lors du chargement des livres</td></tr>';
        }
    };
    
    // Fetch all authors
    const fetchAuteurs = async () => {
        try {
            const response = await fetchWithAuth(`${API_URL}/auteurs`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch authors');
            }
            
            auteurs = await response.json();
            
            // Populate author filter
            const filterAuteurElement = document.getElementById('filterAuteur');
            filterAuteurElement.innerHTML = '<option value="all">Tous les auteurs</option>';
            
            auteurs.forEach(auteur => {
                const option = document.createElement('option');
                option.value = auteur.id;
                option.textContent = auteur.nom;
                filterAuteurElement.appendChild(option);
            });
            
            // Populate author select in form
            const auteurSelect = document.getElementById('auteurId');
            auteurSelect.innerHTML = '';
            
            auteurs.forEach(auteur => {
                const option = document.createElement('option');
                option.value = auteur.id;
                option.textContent = auteur.nom;
                auteurSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching authors:', error);
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
            
            // Populate genre filter
            const filterGenreElement = document.getElementById('filterGenre');
            filterGenreElement.innerHTML = '<option value="all">Tous les genres</option>';
            
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.nom;
                filterGenreElement.appendChild(option);
            });
            
            // Populate genre select in form
            const genreSelect = document.getElementById('genreId');
            genreSelect.innerHTML = '';
            
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.nom;
                genreSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };
    
    // Render books table
    const renderLivresTable = (booksToRender) => {
        livresTableBody.innerHTML = '';
        
        if (booksToRender.length === 0) {
            livresTableBody.innerHTML = '<tr><td colspan="7">Aucun livre trouvé</td></tr>';
            return;
        }
        
        booksToRender.forEach(livre => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${livre.id}</td>
                <td>${livre.titre}</td>
                <td>${livre.auteur ? livre.auteur.nom : 'N/A'}</td>
                <td>${livre.genre ? livre.genre.nom : 'N/A'}</td>
                <td>${livre.isbn || 'N/A'}</td>
                <td>${livre.disponible ? '<span class="status-badge available">Disponible</span>' : '<span class="status-badge unavailable">Emprunté</span>'}</td>
                <td class="action-buttons">
                    <button class="btn-icon btn-edit edit-livre" data-id="${livre.id}">
                        modifier
                    </button>
                    <button class="btn-icon btn-delete delete-livre" data-id="${livre.id}">
                        supprimer
                    </button>
                </td>
            `;
            
            livresTableBody.appendChild(tr);
        });
        
        // Add event listeners to the edit and delete buttons
        document.querySelectorAll('.edit-livre').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const livre = livres.find(l => l.id == id);
                if (livre) {
                    openEditModal(livre);
                }
            });
        });
        
        document.querySelectorAll('.delete-livre').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                if (confirm('Êtes-vous sûr de vouloir supprimer ce livre?')) {
                    await deleteLivre(id);
                }
            });
        });
    };
    
    // Filter books
    const filterLivres = () => {
        const disponibleFilter = filterDisponible.value;
        const auteurFilter = filterAuteur.value;
        const genreFilter = filterGenre.value;
        
        let filteredLivres = [...livres];
        
        // Filter by availability
        if (disponibleFilter !== 'all') {
            const isDisponible = disponibleFilter === 'disponible';
            filteredLivres = filteredLivres.filter(livre => livre.disponible === isDisponible);
        }
        
        // Filter by author
        if (auteurFilter !== 'all') {
            filteredLivres = filteredLivres.filter(livre => livre.auteur && livre.auteur.id == auteurFilter);
        }
        
        // Filter by genre
        if (genreFilter !== 'all') {
            filteredLivres = filteredLivres.filter(livre => livre.genre && livre.genre.id == genreFilter);
        }
        
        renderLivresTable(filteredLivres);
        if (!isAdmin()) {
            document.querySelectorAll('.btn-edit, .btn-delete').forEach(btn => btn.style.display = 'none');
        }
    };
    
    // Setup event listeners
    const setupEventListeners = () => {
        // Add book button
        addLivreBtn.addEventListener('click', () => {
            resetForm();
            modalTitle.textContent = 'Ajouter un livre';
            livreModal.classList.add('active');
        });
        
        // Close modal buttons
        closeModal.addEventListener('click', () => {
            livreModal.classList.remove('active');
        });
        
        cancelLivre.addEventListener('click', () => {
            livreModal.classList.remove('active');
        });
        
        // Form submission
        livreForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const livreId = document.getElementById('livreId').value;
            const livreData = {
                titre: document.getElementById('titre').value,
                auteurId: parseInt(document.getElementById('auteurId').value),
                genreId: parseInt(document.getElementById('genreId').value),
                isbn: document.getElementById('isbn').value,
                disponible: document.getElementById('disponible').value === 'true'
            };
            
            if (livreId) {
                // Update existing book
                await updateLivre(livreId, livreData);
            } else {
                // Create new book
                await createLivre(livreData);
            }
            
            livreModal.classList.remove('active');
        });
        
        // Filter change events
        filterDisponible.addEventListener('change', filterLivres);
        filterAuteur.addEventListener('change', filterLivres);
        filterGenre.addEventListener('change', filterLivres);
    };
    
    // Reset form fields
    const resetForm = () => {
        document.getElementById('livreId').value = '';
        document.getElementById('titre').value = '';
        document.getElementById('isbn').value = '';
        document.getElementById('disponible').value = 'true';
        
        // Select first option for auteur and genre if available
        if (document.getElementById('auteurId').options.length > 0) {
            document.getElementById('auteurId').selectedIndex = 0;
        }
        
        if (document.getElementById('genreId').options.length > 0) {
            document.getElementById('genreId').selectedIndex = 0;
        }
    };
    
    // Open edit modal with book data
    const openEditModal = (livre) => {
        document.getElementById('livreId').value = livre.id;
        document.getElementById('titre').value = livre.titre;
        document.getElementById('isbn').value = livre.isbn || '';
        document.getElementById('disponible').value = livre.disponible.toString();
        
        // Set the author and genre if they exist
        if (livre.auteur) {
            document.getElementById('auteurId').value = livre.auteur.id;
        }
        
        if (livre.genre) {
            document.getElementById('genreId').value = livre.genre.id;
        }
        
        modalTitle.textContent = 'Modifier le livre';
        livreModal.classList.add('active');
    };
    
    // Create a new book
    const createLivre = async (livreData) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/livres`, {
                method: 'POST',
                body: JSON.stringify(livreData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create book');
            }
            await fetchLivres();
            showToast('Livre ajouté avec succès', 'success');
        } catch (error) {
            console.error('Error creating book:', error);
            showToast(error.message || 'Erreur lors de l\'ajout du livre', 'error');
        }
    };
    
    // Update an existing book
    const updateLivre = async (id, livreData) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/livres/${id}`, {
                method: 'PUT',
                body: JSON.stringify(livreData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update book');
            }
            await fetchLivres();
            showToast('Livre mis à jour avec succès', 'success');
        } catch (error) {
            console.error('Error updating book:', error);
            showToast(error.message || 'Erreur lors de la mise à jour du livre', 'error');
        }
    };
    
    // Delete a book
    const deleteLivre = async (id) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/livres/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete book');
            }
            await fetchLivres();
            showToast('Livre supprimé avec succès', 'success');
        } catch (error) {
            console.error('Error deleting book:', error);
            showToast(error.message || 'Erreur lors de la suppression du livre', 'error');
        }
    };
    
    // Après avoir chargé l'utilisateur courant, masquer les boutons si non admin
    const isAdmin = () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return false;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload && payload.sub && payload.role === 'ADMIN';
    };
    
    // Initialize the page
    loadData();
}); 