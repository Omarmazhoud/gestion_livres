document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = '/api';
    
    // DOM Elements
    const utilisateursTableBody = document.getElementById('utilisateursTableBody');
    const userDetailsModal = document.getElementById('userDetailsModal');
    const closeModal = document.getElementById('closeModal');
    const closeUserDetails = document.getElementById('closeUserDetails');
    
    // Current users data
    let utilisateurs = [];
    
    // Load data
    const loadData = async () => {
        try {
            await fetchUtilisateurs();
            setupEventListeners();
        } catch (error) {
            console.error('Error loading data:', error);
            showToast('Erreur lors du chargement des données', 'error');
        }
    };
    
    // Fetch all users
    const fetchUtilisateurs = async () => {
        try {
            console.log('Fetching users from API...');
            // Use the correct endpoint from the controller
            const response = await fetchWithAuth(`${API_URL}/utilisateurs/getAll`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API error response:', errorText);
                throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
            }
            
            utilisateurs = await response.json();
            console.log('Users fetched successfully:', utilisateurs.length);
            renderUtilisateursTable(utilisateurs);
        } catch (error) {
            console.error('Error fetching users:', error);
            utilisateursTableBody.innerHTML = '<tr><td colspan="7">Erreur lors du chargement des utilisateurs</td></tr>';
        }
    };
    
    // Render users table
    const renderUtilisateursTable = (utilisateursToRender) => {
        utilisateursTableBody.innerHTML = '';
        
        if (utilisateursToRender.length === 0) {
            utilisateursTableBody.innerHTML = '<tr><td colspan="7">Aucun utilisateur trouvé</td></tr>';
            return;
        }
        
        utilisateursToRender.forEach(utilisateur => {
            // Fetch active loans count (this could be optimized in a real app)
            let activeLoansCount = 0;
            if (utilisateur.emprunts) {
                activeLoansCount = utilisateur.emprunts.filter(e => !e.dateRetourEffectif).length;
            }
            
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${utilisateur.id}</td>
                <td>${utilisateur.username}</td>
                <td>${utilisateur.nom || 'N/A'}</td>
                <td>${utilisateur.email || 'N/A'}</td>
                <td>${utilisateur.telephone || 'N/A'}</td>
                <td>${activeLoansCount}</td>
                <td class="action-buttons">
                    <button class="btn-icon btn-delete delete-utilisateur" data-id="${utilisateur.id}">
                        supprimer
                    </button>
                </td>
            `;
            
            utilisateursTableBody.appendChild(tr);
        });
        
        // Add event listeners to the buttons
        document.querySelectorAll('.view-user-details').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                const utilisateur = utilisateurs.find(u => u.id == id);
                if (utilisateur) {
                    await showUserDetails(utilisateur);
                }
            });
        });
        
        document.querySelectorAll('.delete-utilisateur').forEach(button => {
            button.addEventListener('click', async () => {
                const id = button.getAttribute('data-id');
                if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
                    await deleteUtilisateur(id);
                }
            });
        });
    };
    
    // Setup event listeners
    const setupEventListeners = () => {
        // Close modals
        closeModal.addEventListener('click', () => {
            userDetailsModal.classList.remove('active');
        });
        
        closeUserDetails.addEventListener('click', () => {
            userDetailsModal.classList.remove('active');
        });
    };
    
    // Show user details modal
    const showUserDetails = async (utilisateur) => {
        // Update user details in the modal
        document.getElementById('userDetailName').textContent = utilisateur.nom || utilisateur.username;
        document.getElementById('userDetailEmail').textContent = utilisateur.email || 'N/A';
        document.getElementById('userDetailPhone').textContent = utilisateur.telephone || 'N/A';
        
        // Fetch user's active loans
        const userLoansContainer = document.getElementById('userLoans');
        userLoansContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
        
        try {
            // In a real app, you would have an endpoint to get user's loans
            // Here we're simulating it by filtering all loans
            const response = await fetchWithAuth(`${API_URL}/emprunts`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch loans');
            }
            
            const allLoans = await response.json();
            const userLoans = allLoans.filter(loan => loan.utilisateur && loan.utilisateur.id == utilisateur.id);
            
            // Display active loans
            if (userLoans.length === 0) {
                userLoansContainer.innerHTML = '<p class="no-items">Aucun emprunt trouvé</p>';
            } else {
                userLoansContainer.innerHTML = '';
                
                const loansTable = document.createElement('table');
                loansTable.className = 'data-table';
                
                loansTable.innerHTML = `
                    <thead>
                        <tr>
                            <th>Livre</th>
                            <th>Date d'emprunt</th>
                            <th>Date de retour prévue</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `;
                
                const tbody = loansTable.querySelector('tbody');
                
                userLoans.forEach(loan => {
                    const tr = document.createElement('tr');
                    
                    const dateEmprunt = new Date(loan.dateEmprunt).toLocaleDateString();
                    const dateRetourPrevu = new Date(loan.dateRetourPrevu).toLocaleDateString();
                    
                    // Calculate status
                    let status = 'En cours';
                    let statusClass = 'status-ongoing';
                    
                    if (loan.dateRetourEffectif) {
                        status = 'Retourné';
                        statusClass = 'status-returned';
                    } else if (new Date() > new Date(loan.dateRetourPrevu)) {
                        status = 'En retard';
                        statusClass = 'status-late';
                    }
                    
                    tr.innerHTML = `
                        <td>${loan.livre ? loan.livre.titre : 'N/A'}</td>
                        <td>${dateEmprunt}</td>
                        <td>${dateRetourPrevu}</td>
                        <td><span class="status-badge ${statusClass}">${status}</span></td>
                    `;
                    
                    tbody.appendChild(tr);
                });
                
                userLoansContainer.appendChild(loansTable);
            }
        } catch (error) {
            console.error('Error fetching user loans:', error);
            userLoansContainer.innerHTML = '<p class="error-message">Erreur lors du chargement des emprunts</p>';
        }
        
        userDetailsModal.classList.add('active');
    };
    
    // Delete a user
    const deleteUtilisateur = async (id) => {
        try {
            const response = await fetchWithAuth(`${API_URL}/utilisateurs/delete?id=${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Failed to delete user: ${response.status} ${response.statusText}`);
            }
            await fetchUtilisateurs();
            showToast('Utilisateur supprimé avec succès', 'success');
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast(error.message || 'Erreur lors de la suppression de l\'utilisateur', 'error');
        }
    };
    
    // Add some additional styles for user details
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .user-details {
            padding: 1rem 0;
        }
        
        .user-info {
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #eee;
        }
        
        .user-info h4 {
            color: #2e384d;
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }
        
        .user-info p {
            color: #666;
            margin-bottom: 0.25rem;
        }
        
        .no-items, .error-message {
            padding: 1rem;
            text-align: center;
            color: #666;
        }
        
        .error-message {
            color: #f44336;
        }
        
        #userLoans .data-table {
            margin-top: 1rem;
            font-size: 0.9rem;
        }
        
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
    `;
    document.head.appendChild(styleSheet);
    
    // Initialize the page
    loadData();
}); 