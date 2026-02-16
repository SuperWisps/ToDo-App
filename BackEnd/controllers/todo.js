//logique CRUD des todos

const Todo = require('../models/Todo');

exports.createTodo = (req, res, next) => {
  const todo = new Todo({
    title: req.body.title,
    description: req.body.description,
    userId: req.auth.userId
  });
  
  todo.save()
    .then(() => res.status(201).json({ message: '✅ Todo créée !', todo }))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllTodos = (req, res, next) => {
  Todo.find({ userId: req.auth.userId })
    .sort({ createdAt: -1 })  // Plus récentes en premier
    .then(todos => res.status(200).json(todos))
    .catch(error => res.status(400).json({ error }));
};

exports.updateTodo = (req, res, next) => {
  Todo.findOne({ _id: req.params.id, userId: req.auth.userId })
    .then(todo => {
      if (!todo) {
        return res.status(404).json({ error: '❌ Todo non trouvée !' });
      }
      
      Todo.updateOne(
        { _id: req.params.id },
        { ...req.body, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: '✅ Todo modifiée !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.deleteTodo = (req, res, next) => {
  Todo.findOne({ _id: req.params.id, userId: req.auth.userId })
    .then(todo => {
      if (!todo) {
        return res.status(404).json({ error: '❌ Todo non trouvée !' });
      }
      
      Todo.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: '✅ Todo supprimée !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
