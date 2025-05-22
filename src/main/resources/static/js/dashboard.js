document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = '/api';
    
    // Load dashboard data
    const loadDashboardData = async () => {
        try {
            // Fetch counts for dashboard cards
            await fetchCounts();
            
            // Fetch available books
            await fetchAvailableBooks();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showToast('Erreur lors du chargement des données', 'error');
        }
    };
    
    // Fetch counts for the dashboard cards
    const fetchCounts = async () => {
        try {
            // Load books count
            const booksResponse = await fetchWithAuth(`${API_URL}/livres`);
            if (booksResponse.ok) {
                const books = await booksResponse.json();
                document.getElementById('totalBooks').textContent = books.length;
            }
            
            // Load authors count
            const authorsResponse = await fetchWithAuth(`${API_URL}/auteurs`);
            if (authorsResponse.ok) {
                const authors = await authorsResponse.json();
                document.getElementById('totalAuthors').textContent = authors.length;
            }
            
            // Load genres count
            const genresResponse = await fetchWithAuth(`${API_URL}/genres`);
            if (genresResponse.ok) {
                const genres = await genresResponse.json();
                document.getElementById('totalGenres').textContent = genres.length;
            }
            
            // Load loans count
            const loansResponse = await fetchWithAuth(`${API_URL}/emprunts`);
            if (loansResponse.ok) {
                const loans = await loansResponse.json();
                document.getElementById('totalLoans').textContent = loans.length;
            }
        } catch (error) {
            console.error('Error fetching counts:', error);
            // Set default values if there's an error
            document.getElementById('totalBooks').textContent = '0';
            document.getElementById('totalAuthors').textContent = '0';
            document.getElementById('totalGenres').textContent = '0';
            document.getElementById('totalLoans').textContent = '0';
        }
    };
    
    // Fetch available books for the recent books section
    const fetchAvailableBooks = async () => {
        try {
            const response = await fetchWithAuth(`${API_URL}/livres/disponibles`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch available books');
            }
            
            const books = await response.json();
            const booksGrid = document.getElementById('availableBooks');
            
            // Clear loading spinner
            booksGrid.innerHTML = '';
            
            // Display up to 6 books
            const booksToShow = books.slice(0, 6);
            
            if (booksToShow.length === 0) {
                booksGrid.innerHTML = '<p class="no-items">Aucun livre disponible actuellement.</p>';
                return;
            }
            
            booksToShow.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                bookCard.innerHTML = `
                    <div class="book-cover">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="book-info">
                        <h4>${book.titre}</h4>
                        <p>Auteur: ${book.auteur ? book.auteur.nom : 'N/A'}</p>
                        <p>Genre: ${book.genre ? book.genre.nom : 'N/A'}</p>
                        <div class="book-actions">
                            <button class="btn-book" onclick="window.location.href='emprunts.html?bookId=${book.id}'">
                                Emprunter
                            </button>
                            <button class="btn-book secondary" onclick="window.location.href='livres.html?id=${book.id}'">
                                Détails
                            </button>
                        </div>
                    </div>
                `;
                booksGrid.appendChild(bookCard);
            });
        } catch (error) {
            console.error('Error fetching available books:', error);
            const booksGrid = document.getElementById('availableBooks');
            booksGrid.innerHTML = '<p class="error-message">Erreur lors du chargement des livres. Veuillez réessayer.</p>';
        }
    };
    
    // Init the dashboard
    loadDashboardData();
}); 