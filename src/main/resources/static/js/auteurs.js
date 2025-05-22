document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = '/api';
    
    // DOM Elements
    const auteursTableBody = document.getElementById('auteursTableBody');
    const addAuteurBtn = document.getElementById('addAuteurBtn');
    const auteurModal = document.getElementById('auteurModal');
    const closeModal = document.getElementById('closeModal');
    const cancelAuteur = document.getElementById('cancelAuteur');
    const auteurForm = document.getElementById('auteurForm');
    const modalTitle = document.getElementById('modalTitle');
    
    // Current authors data
    let auteurs = [];
    
    // Load data
    const loadData = async () => {
        try {
            await fetchAuteurs();
            setupEventListeners();
            if (!isAdmin()) {
                document.getElementById('addAuteurBtn').style.display = 'none';
                document.querySelectorAll('.btn-edit, .btn-delete').forEach(btn => btn.style.display = 'none');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Erreur lors du chargement des données', 'error');
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
            renderAuteursTable(auteurs);
        } catch (error) {
            console.error('Error fetching authors:', error);
            auteursTableBody.innerHTML = '<tr><td colspan="5">Erreur lors du chargement des auteurs</td></tr>';
        }
    };
    
    // Render authors table
    const renderAuteursTable = (auteursToRender) => {
        auteursTableBody.innerHTML = '';
        
        if (auteursToRender.length === 0) {
            auteursTableBody.innerHTML = '<tr><td colspan="5">Aucun auteur trouvé</td></tr>';
            return;
        }
        
        auteursToRender.forEach(auteur => {
            // Fetch book count for this author (this could be optimized in a real app)
            let bookCount = 0;
            if (auteur.livres) {
                bookCount = auteur.livres.length;
            }
            
            // Format date if available
            let dateNaissance = 'N/A';
            if (auteur.dateDeNaissance) {
                dateNaissance = new Date(auteur.dateDeNaissance).toLocaleDateString();
            }
            
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${auteur.id}</td>
                <td>${auteur.nom}</td>
                <td>${dateNaissance}</td>
                <td>${bookCount}</td>
                <td class="action-buttons">
                    <button class="btn-icon btn-edit edit-auteur" data-id="${auteur.id}"> Modifier </button>
                    <button class="btn-icon btn-delete delete-auteur" data-id="${auteur.id}">Supprimer</button>
                </td>
            `;
            
            auteursTableBody.appendChild(tr);
        });
        
        // Add event listeners to the edit and delete buttons
        document.querySelectorAll('.edit-auteur').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const auteur = auteurs.find(a => a.id == id);
                if (auteur) {
                    openEditModal(auteur);
                }
            });
        });
        
        document.querySelectorAll('.delete-auteur').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                if (confirm('Êtes-vous sûr de vouloir supprimer cet auteur?')) {
                    await deleteAuteur(id);
                }
            });
        });
    };
    
    // Setup event listeners
    const setupEventListeners = () => {
        // Add author button
        addAuteurBtn.addEventListener('click', () => {
            resetForm();
            modalTitle.textContent = 'Ajouter un auteur';
            auteurModal.classList.add('active');
        });
        
        // Close modal buttons
        closeModal.addEventListener('click', () => {
            auteurModal.classList.remove('active');
        });
        
        cancelAuteur.addEventListener('click', () => {
            auteurModal.classList.remove('active');
        });
        
        // Form submission
        auteurForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const auteurId = document.getElementById('auteurId').value;
            const auteurData = {
                nom: document.getElementById('nom').value,
                biographie: document.getElementById('biographie').value,
                dateDeNaissance: document.getElementById('dateDeNaissance').value || null
            };
            
            if (auteurId) {
                // Update existing author
                await updateAuteur(auteurId, auteurData);
            } else {
                // Create new author
                await createAuteur(auteurData);
            }
            
            auteurModal.classList.remove('active');
        });
    };
    
    // Reset form fields
    const resetForm = () => {
        document.getElementById('auteurId').value = '';
        document.getElementById('nom').value = '';
        document.getElementById('biographie').value = '';
        document.getElementById('dateDeNaissance').value = '';
    };
    
    // Format date for input field (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    
    // Open edit modal with author data
    const openEditModal = (auteur) => {
        document.getElementById('auteurId').value = auteur.id;
        document.getElementById('nom').value = auteur.nom;
        document.getElementById('biographie').value = auteur.biographie || '';
        document.getElementById('dateDeNaissance').value = formatDateForInput(auteur.dateDeNaissance);
        
        modalTitle.textContent = 'Modifier l\'auteur';
        auteurModal.classList.add('active');
    };
    
    // Create a new author
    const createAuteur = async (auteurData) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/auteurs`, {
                method: 'POST',
                body: JSON.stringify(auteurData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create author');
            }
            await fetchAuteurs();
            showToast('Auteur ajouté avec succès', 'success');
        } catch (error) {
            console.error('Error creating author:', error);
            showToast(error.message || 'Erreur lors de l\'ajout de l\'auteur', 'error');
        }
    };
    
    // Update an existing author
    const updateAuteur = async (id, auteurData) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/auteurs/${id}`, {
                method: 'PUT',
                body: JSON.stringify(auteurData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update author');
            }
            await fetchAuteurs();
            showToast('Auteur mis à jour avec succès', 'success');
        } catch (error) {
            console.error('Error updating author:', error);
            showToast(error.message || 'Erreur lors de la mise à jour de l\'auteur', 'error');
        }
    };
    
    // Delete an author
    const deleteAuteur = async (id) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/auteurs/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to delete author');
            }
            await fetchAuteurs();
            showToast('Auteur supprimé avec succès', 'success');
        } catch (error) {
            console.error('Error deleting author:', error);
            showToast(error.message || 'Erreur lors de la suppression de l\'auteur', 'error');
        }
    };
    
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