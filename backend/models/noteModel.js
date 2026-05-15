const db = require('../config/db');

const createNote = async (title, content, category) => {
    const [result] = await db.execute(
        `INSERT INTO notes(title, content, category)
         VALUES (?, ?, ?)`,
        [title, content, category]
    );

    return result;
};

const getAllNotes = async () => {
    const [rows] = await db.execute(
        `SELECT * FROM notes
         ORDER BY created_at DESC`
    );

    return rows;
};

const searchNotes = async (
    keyword
) => {

    const [rows] =
        await db.execute(

            `SELECT *
         FROM notes
         WHERE title LIKE ?
         OR content LIKE ?
         ORDER BY created_at DESC`,

            [
                `%${keyword}%`,
                `%${keyword}%`
            ]
        );

    return rows;
};

const getNoteById = async (id) => {
    const [rows] = await db.execute(
        `SELECT * FROM notes WHERE id=?`,
        [id]
    );

    return rows[0];
};

const updateNote = async (
    id,
    title,
    content,
    category
) => {

    const [result] = await db.execute(
        `UPDATE notes
         SET title=?,
         content=?,
         category=?
         WHERE id=?`,
        [title, content, category, id]
    );

    return result;
};

const deleteNote = async (id) => {
    const [result] = await db.execute(
        `DELETE FROM notes WHERE id=?`,
        [id]
    );

    return result;
};

module.exports = {
    createNote,
    getAllNotes,
    searchNotes,
    getNoteById,
    updateNote,
    deleteNote
};