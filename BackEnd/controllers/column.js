// controllers/column.js
// Logique CRUD colonnes

const Column = require('../models/Column');
const Todo = require('../models/Todo');

// RÉCUPÉRER TOUTES LES COLONNES (avec création auto si vide)
exports.getAllColumns = async (req, res) => {
    try {
        console.log('\n==================================================');
        console.log(`📍 ${new Date().toLocaleTimeString('fr-FR')} - GET /api/columns`);
        console.log('✅ User authentifié:', req.userId);

        let columns = await Column.find({ userId: req.userId })
            .sort({ order: 1 });

        console.log(`📊 Colonnes trouvées: ${columns.length}`);

        // Si aucune colonne n'existe, créer les colonnes par défaut
        if (columns.length === 0) {
            console.log('📋 Création des colonnes par défaut...');

            columns = await Column.create([
                {
                    title: 'À faire',
                    order: 0,
                    userId: req.userId
                },
                {
                    title: 'En cours',
                    order: 1,
                    userId: req.userId
                },
                {
                    title: 'Terminé',
                    order: 2,
                    userId: req.userId
                }
            ]);

            console.log('✅ Colonnes par défaut créées:', columns.length);
        }

        res.status(200).json(columns);

    } catch (error) {
        console.error('❌ Erreur getAllColumns:', error);
        res.status(500).json({ error: error.message });
    }
};

// CRÉER UNE COLONNE (avec order automatique)
exports.createColumn = async (req, res) => {
    try {
        const { title } = req.body;

        // Calculer automatiquement le prochain order
        const lastColumn = await Column.findOne({ userId: req.userId })
            .sort({ order: -1 });

        const newOrder = lastColumn ? lastColumn.order + 1 : 0;

        const column = await Column.create({
            title,
            order: newOrder,
            userId: req.userId  // ← CORRIGÉ
        });

        res.status(201).json({ message: 'Colonne créée !', column });

    } catch (error) {
        console.error('❌ Erreur createColumn:', error);
        res.status(400).json({ error: error.message });
    }
};

// MODIFIER UNE COLONNE
exports.updateColumn = async (req, res) => {
    try {
        const { title } = req.body;

        const column = await Column.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },  // ← CORRIGÉ
            { title },
            { new: true }
        );

        if (!column) {
            return res.status(404).json({ error: 'Colonne non trouvée !' });
        }

        res.status(200).json({ message: 'Colonne modifiée !', column });

    } catch (error) {
        console.error('❌ Erreur updateColumn:', error);
        res.status(400).json({ error: error.message });
    }
};

// SUPPRIMER UNE COLONNE
exports.deleteColumn = async (req, res) => {
    try {
        // Vérifier que la colonne appartient à l'user
        const column = await Column.findOne({ 
            _id: req.params.id, 
            userId: req.userId  // ← CORRIGÉ
        });

        if (!column) {
            return res.status(404).json({ error: 'Colonne non trouvée !' });
        }

        // VÉRIFIER SI DES TÂCHES UTILISENT CETTE COLONNE
        const tasksInColumn = await Todo.countDocuments({ 
            columnId: req.params.id 
        });

        if (tasksInColumn > 0) {
            return res.status(400).json({ 
                error: `Impossible de supprimer : ${tasksInColumn} tâche(s) présente(s)` 
            });
        }

        // Supprimer la colonne
        await Column.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'Colonne supprimée !' });

    } catch (error) {
        console.error('❌ Erreur deleteColumn:', error);
        res.status(500).json({ error: error.message });
    }
};

// RÉORGANISER LES COLONNES (drag & drop)
exports.reorderColumns = async (req, res) => {
    try {
        const { columns } = req.body;

        // Vérifier que toutes les colonnes appartiennent à l'utilisateur
        const userColumns = await Column.find({ 
            _id: { $in: columns.map(c => c.id) },
            userId: req.userId  // ← CORRIGÉ
        });

        if (userColumns.length !== columns.length) {
            return res.status(403).json({ 
                error: 'Certaines colonnes ne vous appartiennent pas' 
            });
        }

        // Mettre à jour tous les ordres en parallèle
        const updates = columns.map(col => 
            Column.updateOne(
                { _id: col.id, userId: req.userId },  // ← CORRIGÉ
                { order: col.order }
            )
        );

        await Promise.all(updates);
        res.status(200).json({ message: 'Colonnes réorganisées !' });

    } catch (error) {
        console.error('❌ Erreur reorderColumns:', error);
        res.status(400).json({ error: error.message });
    }
};
