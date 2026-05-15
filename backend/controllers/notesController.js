const noteModel = require('../models/noteModel');
const {
    validationResult
} = require(
    'express-validator'
);

exports.createNote = async (
    req,
    res
) => {

    try {

        const errors =
            validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400)
                .json({
                    errors:
                        errors.array()
                });
        }

        const {
            title,
            content,
            category
        } = req.body;

        const result =
            await noteModel.createNote(
                title,
                content,
                category
            );

        res.status(201).json({
            success: true,
            message:
                'Note created successfully',
            id: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error:
                error.message
        });
    }
};

exports.getAllNotes = async (
    req,
    res
) => {

    try {

        const notes =
            await noteModel.getAllNotes();

        res.json(notes);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

exports.searchNotes =
    async (req, res) => {

        try {

            const notes =
                await noteModel
                    .searchNotes(
                        req.params.keyword
                    );

            res.json(notes);

        } catch (error) {

            res.status(500).json({
                error:
                    error.message
            });
        }
    };

exports.getNoteById = async (
    req,
    res
) => {

    try {

        const note =
            await noteModel.getNoteById(
                req.params.id
            );

        if (!note) {
            return res.status(404)
                .json({
                    message:
                        'Note not found'
                });
        }

        res.json(note);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

exports.updateNote = async (
    req,
    res
) => {

    try {

        const {
            title,
            content,
            category
        } = req.body;

        await noteModel.updateNote(
            req.params.id,
            title,
            content,
            category
        );

        res.json({
            message:
                'Note updated'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};

exports.deleteNote = async (
    req,
    res
) => {

    try {

        await noteModel.deleteNote(
            req.params.id
        );

        res.json({
            message:
                'Note deleted'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
};