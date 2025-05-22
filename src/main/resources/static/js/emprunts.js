document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = '/api';
    
    // DOM Elements
    const empruntsTableBody = document.getElementById('empruntsTableBody');
    const addEmpruntBtn = document.getElementById('addEmpruntBtn');
    const empruntModal = document.getElementById('empruntModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEmprunt = document.getElementById('cancelEmprunt');
    const empruntForm = document.getElementById('empruntForm');
    const modalTitle = document.getElementById('modalTitle');
    
    // Data for selects
    let livres = [];
    let utilisateurs = [];
    let emprunts = [];
    
    // Check if we're creating a loan for a specific book (from URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const bookIdFromUrl = urlParams.get('bookId');
    
    // Load data
    const loadData = async () => {
        try {
            // Fetch all loans
            await fetchEmprunts();
            
            // Fetch books for the form
            await fetchLivres();
            
            // Fetch users for the form
            await fetchUtilisateurs();
            
            // Setup event listeners
            setupEventListeners();
            
            // Check if we need to create a loan for a specific book
            if (bookIdFromUrl) {
                prepareNewLoanForBook(bookIdFromUrl);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Erreur lors du chargement des données', 'error');
        }
    };
    
    // Fetch all loans
    const fetchEmprunts = async () => {
        try {
            const response = await fetchWithAuth(`${API_URL}/emprunts`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch loans');
            }
            
            emprunts = await response.json();
            renderEmpruntsTable(emprunts);
        } catch (error) {
            console.error('Error fetching loans:', error);
            empruntsTableBody.innerHTML = '<tr><td colspan="7">Erreur lors du chargement des emprunts</td></tr>';
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
            
            // Populate book select in form (showing only available books)
            const livreSelect = document.getElementById('livreId');
            livreSelect.innerHTML = '';
            
            // Filter books to show only available ones or the current book being edited
            const availableLivres = livres.filter(livre => livre.disponible);
            
            availableLivres.forEach(livre => {
                const option = document.createElement('option');
                option.value = livre.id;
                option.textContent = `${livre.titre} (${livre.auteur ? livre.auteur.nom : 'N/A'})`;
                livreSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };
    
    // Fetch all users
    const fetchUtilisateurs = async () => {
        try {
            const response = await fetchWithAuth(`${API_URL}/utilisateurs/getAll`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
            }
            
            utilisateurs = await response.json();
            
            // Populate user select in form
            const utilisateurSelect = document.getElementById('utilisateurId');
            utilisateurSelect.innerHTML = '';
            
            utilisateurs.forEach(utilisateur => {
                const option = document.createElement('option');
                option.value = utilisateur.id;
                option.textContent = `${utilisateur.nom} (${utilisateur.username})`;
                utilisateurSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };
    
    // Render loans table
    const renderEmpruntsTable = (empruntsToRender) => {
        empruntsTableBody.innerHTML = '';
        
        if (empruntsToRender.length === 0) {
            empruntsTableBody.innerHTML = '<tr><td colspan="7">Aucun emprunt trouvé</td></tr>';
            return;
        }
        
        empruntsToRender.forEach(emprunt => {
            const tr = document.createElement('tr');
            
            const dateEmprunt = new Date(emprunt.dateEmprunt).toLocaleDateString();
            const dateRetourPrevu = new Date(emprunt.dateRetourPrevu).toLocaleDateString();
            
            // Calculate status
            let status = 'En cours';
            let statusClass = 'status-ongoing';
            
            if (emprunt.dateRetourEffectif) {
                status = 'Retourné';
                statusClass = 'status-returned';
            } else if (new Date() > new Date(emprunt.dateRetourPrevu)) {
                status = 'En retard';
                statusClass = 'status-late';
            }
            
            tr.innerHTML = `
                <td>${emprunt.id}</td>
                <td>${emprunt.livre ? emprunt.livre.titre : 'N/A'}</td>
                <td>${emprunt.utilisateur ? emprunt.utilisateur.nom : 'N/A'}</td>
                <td>${dateEmprunt}</td>
                <td>${dateRetourPrevu}</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td class="action-buttons">
                    ${emprunt.dateRetourEffectif ? '' : `
                    <button class="btn-icon btn-edit return-emprunt" data-id="${emprunt.id}">
                        confirmer
                    </button>
                    `}
                    <button class="btn-icon btn-delete delete-emprunt" data-id="${emprunt.id}">
                        supprimer
                    </button>
                </td>
            `;
            
            empruntsTableBody.appendChild(tr);
        });
        
        // Add event listeners to the buttons
        document.querySelectorAll('.return-emprunt').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                if (confirm('Confirmer le retour de ce livre?')) {
                    await returnEmprunt(id);
                }
            });
        });
        
        document.querySelectorAll('.delete-emprunt').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                if (confirm('Êtes-vous sûr de vouloir supprimer cet emprunt?')) {
                    await deleteEmprunt(id);
                }
            });
        });
    };
    
    // Setup event listeners
    const setupEventListeners = () => {
        // Add loan button
        addEmpruntBtn.addEventListener('click', () => {
            resetForm();
            modalTitle.textContent = 'Nouvel emprunt';
            empruntModal.classList.add('active');
        });
        
        // Close modal buttons
        closeModal.addEventListener('click', () => {
            empruntModal.classList.remove('active');
        });
        
        cancelEmprunt.addEventListener('click', () => {
            empruntModal.classList.remove('active');
        });
        
        // Form submission
        empruntForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const empruntData = {
                livreId: parseInt(document.getElementById('livreId').value),
                utilisateurId: parseInt(document.getElementById('utilisateurId').value),
                dateEmprunt: document.getElementById('dateEmprunt').value,
                dateRetourPrevu: document.getElementById('dateRetourPrevu').value
            };
            
            // Create new loan
            await createEmprunt(empruntData);
            
            empruntModal.classList.remove('active');
        });
    };
    
    // Prepare a new loan for a specific book
    const prepareNewLoanForBook = (bookId) => {
        resetForm();
        
        // Set the book ID in the form
        const livreSelect = document.getElementById('livreId');
        if (livreSelect.querySelector(`option[value="${bookId}"]`)) {
            livreSelect.value = bookId;
        }
        
        // Set default dates
        const today = new Date();
        const returnDate = new Date();
        returnDate.setDate(today.getDate() + 14); // 2 weeks loan period
        
        document.getElementById('dateEmprunt').value = formatDateForInput(today);
        document.getElementById('dateRetourPrevu').value = formatDateForInput(returnDate);
        
        modalTitle.textContent = 'Nouvel emprunt';
        empruntModal.classList.add('active');
    };
    
    // Format a date for input field (YYYY-MM-DD)
    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    // Reset form fields
    const resetForm = () => {
        document.getElementById('empruntId').value = '';
        
        // Set default dates
        const today = new Date();
        const returnDate = new Date();
        returnDate.setDate(today.getDate() + 14); // 2 weeks loan period
        
        document.getElementById('dateEmprunt').value = formatDateForInput(today);
        document.getElementById('dateRetourPrevu').value = formatDateForInput(returnDate);
        
        // Reset selects to first option if available
        if (document.getElementById('livreId').options.length > 0) {
            document.getElementById('livreId').selectedIndex = 0;
        }
        
        if (document.getElementById('utilisateurId').options.length > 0) {
            document.getElementById('utilisateurId').selectedIndex = 0;
        }
    };
    
    // Create a new loan
    const createEmprunt = async (empruntData) => {
        try {
            console.log('Creating emprunt with data:', empruntData);
            
            const response = await fetchWithAuth(`${API_URL}/emprunts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(empruntData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`Failed to create loan: ${response.status} ${response.statusText}`);
            }
            
            await fetchEmprunts();
            await fetchLivres(); // Refresh books to update availability
            showToast('Emprunt créé avec succès', 'success');
        } catch (error) {
            console.error('Error creating loan:', error);
            showToast('Erreur lors de la création de l\'emprunt', 'error');
        }
    };
    
    // Return a book
    const returnEmprunt = async (id) => {
        try {
            console.log('Returning book with ID:', id);
            
            const response = await fetchWithAuth(`${API_URL}/emprunts/${id}/return`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`Failed to return book: ${response.status} ${response.statusText}`);
            }
            
            await fetchEmprunts();
            await fetchLivres(); // Refresh books to update availability
            showToast('Livre retourné avec succès', 'success');
        } catch (error) {
            console.error('Error returning book:', error);
            showToast('Erreur lors du retour du livre', 'error');
        }
    };
    
    // Delete a loan
    const deleteEmprunt = async (id) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/emprunts/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete loan');
            }
            
            await fetchEmprunts();
            await fetchLivres(); // Refresh books to update availability
            showToast('Emprunt supprimé avec succès', 'success');
        } catch (error) {
            console.error('Error deleting loan:', error);
            showToast('Erreur lors de la suppression de l\'emprunt', 'error');
        }
    };
    
    // Add some additional styles for status badges
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .status-badge.status-ongoing {
            background-color: #e3f2fd;
            color: #1976d2;
        }
        
        .status-badge.status-returned {
            background-color: #e7f7ef;
            color: #1db954;
        }
        
        .status-badge.status-late {
            background-color: #ffebee;
            color: #f44336;
        }
        
        .filters {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            background-color: #fff;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .filter-group label {
            font-size: 0.85rem;
            color: #666;
        }
    `;
    document.head.appendChild(styleSheet);
    
    // Initialize the page
    loadData();
}); 