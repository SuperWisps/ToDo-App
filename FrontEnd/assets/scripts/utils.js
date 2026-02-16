// Sauvegarder le token
function saveToken(token) {
    localStorage.setItem('token', token);
}

// Récupérer le token
function getToken() {
    return localStorage.getItem('token');
}

function removeToken() {
    localStorage.removeItem('token');
}

// Vérifier si l'utilisateur est connecté
function isLoggedIn() {
    return !!getToken(); // Convertit en boolean
}

// Rediriger si pas connecté
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
    }
}

// ========== FETCH AVEC TOKEN ==========

// Faire une requête avec le token automatiquement
async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    
    // Ajouter le header Authorization
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    // Si 401 (non autorisé), rediriger vers login
    if (response.status === 401) {
        removeToken();
        window.location.href = 'index.html';
        throw new Error('Session expirée');
    }
    
    return response;
}

// ========== AFFICHAGE DES MESSAGES ==========

// Afficher un message d'erreur
function showError(message, elementId = 'error-message') {
    const errorDiv = document.getElementById(elementId);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Masquer après 5 secondes
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message); // Fallback
    }
}

// Afficher un message de succès
function showSuccess(message, elementId = 'success-message') {
    const successDiv = document.getElementById(elementId);
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // Masquer après 3 secondes
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    } else {
        alert(message); // Fallback
    }
}
