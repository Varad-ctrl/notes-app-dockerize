const express = require('express');
const router = express.Router();

const { body } =
    require('express-validator');

const {
    createNote,
    getAllNotes,
    searchNotes,
    getNoteById,
    updateNote,
    deleteNote
} = require(
    '../controllers/notesController'
);

router.post(
    '/',
    [
        body('title')
            .trim()
            .notEmpty()
            .withMessage(
                'Title is required'
            ),

        body('content')
            .trim()
            .notEmpty()
            .withMessage(
                'Content is required'
            )
    ],
    createNote
);

router.get('/',
    getAllNotes
);

router.get(
    '/search/:keyword',
    searchNotes
);

router.get('/:id',
    getNoteById
);

router.put('/:id',
    updateNote
);

router.delete('/:id',
    deleteNote
);

module.exports = router;