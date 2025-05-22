// Auth Service Module
const authService = (() => {
    const API_URL = '/api';
    
    // Get the stored token from localStorage
    const getToken = () => {
        return localStorage.getItem('auth_token');
    };
    
    // Save token to localStorage
    const setToken = (token) => {
        localStorage.setItem('auth_token', token);
    };
    
    // Remove token from localStorage
    const removeToken = () => {
        localStorage.removeItem('auth_token');
    };
    
    // Check if user is authenticated
    const isAuthenticated = () => {
        const token = getToken();
        return !!token;
    };
    
    // Handle login
    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Erreur de connexion');
            }
            
            const data = await response.json();
            setToken(data.token);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };
    
    // Handle register
    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Erreur d\'inscription');
            }
            
            const data = await response.json();
            setToken(data.token);
            return data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    };
    
    // Handle logout
    const logout = () => {
        removeToken();
        window.location.href = '/login.html';
    };
    
    // Create authorized headers for API requests
    const getAuthHeaders = () => {
        const token = getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    };
    
    // Fetch the current user's information
    const getCurrentUser = async () => {
        // For now, we'll just return a successful authentication status
        // since the specific endpoint to get current user doesn't exist
        if (isAuthenticated()) {
            return { authenticated: true };
        }
        return null;
    };
    
    return {
        getToken,
        setToken,
        removeToken,
        isAuthenticated,
        login,
        register,
        logout,
        getAuthHeaders,
        getCurrentUser
    };
})();

// UI handling for auth state
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize toast container if it doesn't exist
    if (!document.getElementById('toastContainer')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Update UI based on auth state
    const updateAuthUI = async () => {
        const userInfoElement = document.getElementById('userInfo');
        const topMenu = document.getElementById('topMenu');
        if (!userInfoElement || !topMenu) return;
        
        try {
            if (authService.isAuthenticated()) {
                const token = authService.getToken();
                let username = '';
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    username = payload && payload.sub ? payload.sub : '';
                }
                userInfoElement.innerHTML = `
                    <p>${username ? username : 'Connecté'}</p>
                `;
                let isAdmin = false;
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    isAdmin = payload && payload.role === 'ADMIN';
                }
                let menu = `
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="catalogue.html">Catalogue</a></li>
                    <li><a href="livres.html">Livres</a></li>
                    <li><a href="auteurs.html">Auteurs</a></li>
                    <li><a href="genres.html">Genres</a></li>
                `;
                if (isAdmin) {
                    menu += `<li><a href="emprunts.html">Emprunts</a></li>`;
                    menu += `<li><a href="utilisateurs.html">Utilisateurs</a></li>`;
                }
                menu += `<li><button id="logoutBtnMenu">Déconnexion</button></li>`;
                topMenu.innerHTML = menu;
                // Gestion du bouton Déconnexion dans le menu
                const logoutBtnMenu = document.getElementById('logoutBtnMenu');
                if (logoutBtnMenu) {
                  logoutBtnMenu.addEventListener('click', () => {
                    authService.logout();
                  });
                }
            } else {
                userInfoElement.innerHTML = `
                    <p>Non connecté</p>
                `;
                // Menu limité
                topMenu.innerHTML = `
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="catalogue.html">Catalogue</a></li>
                    <li><a href="login.html">Se connecter</a></li>
                    <li><a href="register.html">Inscription</a></li>
                `;
            }
        } catch (error) {
            console.error('Error updating auth UI:', error);
            userInfoElement.innerHTML = `
                <p>Non connecté</p>
            `;
        }
    };
    
    // Initialize login form if it exists
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            try {
                await authService.login(username, password);
                showToast('Connexion réussie', 'success');
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
            } catch (error) {
                showToast(error.message || 'Échec de la connexion', 'error');
            }
        });
    }
    
    // Initialize register form if it exists
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                nom: document.getElementById('nom').value,
                email: document.getElementById('email').value,
                telephone: document.getElementById('telephone').value,
                role: document.getElementById('role').value
            };
            
            try {
                await authService.register(userData);
                showToast('Inscription réussie', 'success');
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 1000);
            } catch (error) {
                showToast(error.message || 'Échec de l\'inscription', 'error');
            }
        });
    }
    
    // Check if user is already connected when the page loads
    if (authService.isAuthenticated()) {
        // If they try to access login page while already logged in, redirect to home
        const isLoginPage = window.location.pathname.includes('login.html');
        if (isLoginPage) {
            window.location.href = '/index.html';
            return;
        }
    } else {
        // If they try to access protected pages without being logged in, redirect to login
        const isAuthPage = window.location.pathname.includes('login.html') || 
                          window.location.pathname.includes('register.html') ||
                          window.location.pathname === '/' ||
                          window.location.pathname === '/index.html' ||
                          window.location.pathname === '/catalogue.html';
        
        if (!isAuthPage) {
            window.location.href = '/login.html';
            return;
        }
    }
    
    // Update auth UI on page load
    updateAuthUI();
});

// Toast notification helper
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    
    const container = document.getElementById('toastContainer');
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// API fetch helper with auth headers
async function fetchWithAuth(url, options = {}) {
    const headers = authService.getAuthHeaders();
    
    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {})
        }
    });
    
    if (response.status === 401) {
        authService.removeToken();
        window.location.href = '/login.html';
        throw new Error('Session expired. Please login again.');
    }
    
    return response;
} 