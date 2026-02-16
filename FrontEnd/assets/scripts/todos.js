const API_URL = 'http://localhost:3000/api';

// Vérifier l'authentification au chargement
requireAuth();

async function loadTodos() {
    try {
        const response = await fetchWithAuth(`${API_URL}/todos`);
        
        // Vérifier le statut de la réponse
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        // Le backend retourne directement un tableau
        const todos = await response.json();
        
        console.log('Todos reçues:', todos); // DEBUG
        
        // Vérifier que c'est bien un tableau
        if (!Array.isArray(todos)) {
            throw new Error('Format de réponse invalide');
        }
        
        displayTodos(todos); // Passer directement le tableau
        
    } catch (error) {
        console.error('Erreur détaillée:', error);
        showError('Impossible de charger les tâches: ' + error.message);
        displayTodos([]); // Afficher une liste vide
    }
}

function displayTodos(todos) {
    const todoList = document.getElementById('todo-list');
    
    // Vérifier que todos est bien un tableau
    if (!todos || !Array.isArray(todos)) {
        console.warn('todos n\'est pas un tableau:', todos);
        todos = [];
    }
    
    if (todos.length === 0) {
        todoList.innerHTML = '<p class="empty-message">📝 Aucune tâche. Ajoutez-en une !</p>';
        return;
    }
    
    // Afficher les tâches
    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item ${todo.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                ${todo.completed ? 'checked' : ''} 
                onchange="toggleTodo('${todo._id}', ${!todo.completed})"
            >
            <span class="todo-title">${escapeHtml(todo.title)}</span>
            <button class="delete-btn" onclick="deleteTodo('${todo._id}')">🗑️</button>
        </div>
    `).join('');
}

async function createTodo(event) {
    event.preventDefault();
    
    const titleInput = document.getElementById('todo-title');
    const title = titleInput.value.trim();
    
    if (!title) {
        showError('Le titre ne peut pas être vide');
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${API_URL}/todos`, {
            method: 'POST',
            body: JSON.stringify({ title })
        });
        
        if (response.ok) {
            titleInput.value = ''; // Vider le champ
            loadTodos();
            showSuccess('Tâche ajoutée !');
        } else {
            const data = await response.json();
            showError(data.error || 'Erreur lors de l\'ajout');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion au serveur');
    }
}

async function toggleTodo(id, completed) {
    try {
        const response = await fetchWithAuth(`${API_URL}/todos/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ completed })
        });
        
        if (response.ok) {
            loadTodos();
        } else {
            const data = await response.json();
            showError(data.error || 'Erreur lors de la modification');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion au serveur');
    }
}

async function deleteTodo(id) {
    if (!confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${API_URL}/todos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadTodos();
            showSuccess('Tâche supprimée !');
        } else {
            const data = await response.json();
            showError(data.error || 'Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion au serveur');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Charger les tâches au chargement de la page
document.addEventListener('DOMContentLoaded', loadTodos);
