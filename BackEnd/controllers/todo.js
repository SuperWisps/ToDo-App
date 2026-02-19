//logique CRUD des todos

const Todo = require('../models/Todo');
const Column = require('../models/Column');

exports.createTodo = async (req, res, next) => {
  try {
    console.log('\n==================================================');
    console.log(`📍 ${new Date().toLocaleTimeString('fr-FR')} - POST /api/todos`);
    console.log('📦 Body reçu:', JSON.stringify(req.body, null, 2));
    console.log('✅ User ID:', req.userId);

    const { title, columnId } = req.body;

    if (!columnId) {
      return res.status(400).json({ error: 'columnId requis' });
    }

    // VÉRIFIER QUE LA COLONNE EXISTE ET APPARTIENT À L'USER
    const column = await Column.findOne({ 
      _id: columnId, 
      userId: req.userId  // ✅ CORRIGÉ
    });

    if (!column) {
      return res.status(404).json({ error: 'Colonne invalide ou inexistante !' });
    }

    // Créer la tâche
    const todo = new Todo({
      title,
      columnId,
      userId: req.userId,  // ✅ CORRIGÉ
      completed: false
    });

    await todo.save();
    
    console.log('✅ Tâche créée:', todo._id);
    res.status(201).json({ message: 'Tâche créée !', todo });

  } catch (error) {
    console.error('❌ Erreur createTodo:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllTodos = async (req, res) => {
  try {
    console.log('\n==================================================');
    console.log(`📍 ${new Date().toLocaleTimeString('fr-FR')} - GET /api/todos`);
    console.log('✅ User ID:', req.userId);

    const todos = await Todo.find({ userId: req.userId });

    console.log('📋 Todos trouvées:', todos.length);
    res.status(200).json(todos);

  } catch (error) {
    console.error('❌ Erreur getAllTodos:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.userId  // ✅ CORRIGÉ
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo non trouvée !' });
    }

    await Todo.updateOne(
      { _id: req.params.id },
      { ...req.body, _id: req.params.id }
    );

    res.status(200).json({ message: 'Todo modifiée !' });

  } catch (error) {
    console.error('❌ Erreur updateTodo:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.moveTodo = async (req, res, next) => {
  try {
    const { columnId } = req.body;

    // Vérifier que la tâche existe et appartient à l'user
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.userId  // ✅ CORRIGÉ
    });

    if (!todo) {
      return res.status(404).json({ error: 'Tâche non trouvée !' });
    }

    // Vérifier que la colonne de destination existe
    const column = await Column.findOne({ 
      _id: columnId, 
      userId: req.userId  // ✅ CORRIGÉ
    });

    if (!column) {
      return res.status(404).json({ error: 'Colonne invalide !' });
    }

    // Déplacer la tâche
    todo.columnId = columnId;
    await todo.save();

    res.status(200).json({ message: 'Tâche déplacée !', todo });

  } catch (error) {
    console.error('❌ Erreur moveTodo:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.userId  // ✅ CORRIGÉ
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo non trouvée !' });
    }

    await Todo.deleteOne({ _id: req.params.id });
    
    res.status(200).json({ message: 'Todo supprimée !' });

  } catch (error) {
    console.error('❌ Erreur deleteTodo:', error);
    res.status(500).json({ error: error.message });
  }
};
