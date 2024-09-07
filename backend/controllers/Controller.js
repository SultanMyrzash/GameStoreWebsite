const db = require('../dbConfig');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config({path: '../.env'});

const getGames = (req, res) => {
    try {
        const query = `
            SELECT Games.id, Games.game_name, Games.game_description, Games.user_id, Users.username as publisher
            FROM Games
            JOIN Users ON Games.user_id = Users.id
        `;
        db.query(query, (err, games) => {
            if (err) {
                console.error('Failed to fetch games:', err);
                res.status(500).json({ error: 'Failed to fetch games' });
            }
            res.json(games);
        })
    } catch (error) {
        console.error('Failed to fetch games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
}

const addToLibrary = async (req, res) => {
    try {
        const { user_id, game_id } = req.body;
        if (!user_id || !game_id) {
            return res.status(400).json({ error: 'user_id and game_id are required' });
        }

        console.log(`Adding game_id: ${game_id} to user_id: ${user_id}`);

        // Check if the game is already in the user's library
        db.query('SELECT * FROM UserGames WHERE user_id = ? AND game_id = ?', [user_id, game_id], (err, results) => {
            if (err) {
                console.error('Failed to check game in library:', err);
                return res.status(500).json({ error: 'Failed to check game in library' });
            }
            if (results.length > 0) {
                return res.status(400).json({ error: 'Game already in library' });
            }

            // If not in library, add the game
            db.query('INSERT INTO UserGames (user_id, game_id) VALUES (?, ?)', [user_id, game_id], (err, result) => {
                if (err) {
                    console.error('Failed to add game to library:', err);
                    return res.status(500).json({ error: 'Failed to add game to library' });
                }
                res.json({ message: 'Game added to library successfully', result });
            });
        });
    } catch (error) {
        console.error('Failed to add game to library:', error);
        res.status(500).json({ error: 'Failed to add game to library' });
    }
};

const getUserLibrary = (req, res) => {
    const userId = req.params.userId;
    try {
        db.query('SELECT Games.* FROM Games JOIN UserGames ON Games.id = UserGames.game_id WHERE UserGames.user_id = ?', [userId], (err, games) => {
            if (err) {
                console.error('Failed to fetch user library:', err);
                return res.status(500).json({ error: 'Failed to fetch user library' });
            }
            res.json(games);
        });
    } catch (error) {
        console.error('Failed to fetch user library:', error);
        res.status(500).json({ error: 'Failed to fetch user library' });
    }
};

const removeFromLibrary = async (req, res) => {
    try {
        const { user_id, game_id } = req.body;
        if (!user_id || !game_id) {
            return res.status(400).json({ error: 'user_id and game_id are required' });
        }

        db.query('DELETE FROM UserGames WHERE user_id = ? AND game_id = ?', [user_id, game_id], (err) => {
            if (err) {
                console.error('Failed to remove game from library:', err);
                return res.status(500).json({ error: 'Failed to remove game from library' });
            }
            res.json({ message: 'Game removed from library successfully' });
        });
    } catch (error) {
        console.error('Failed to remove game from library:', error);
        res.status(500).json({ error: 'Failed to remove game from library' });
    }
};

const getMyGames = (req, res) => {
    try {
        const userId = req.params.userId;
        db.query('SELECT Games.* FROM Games WHERE Games.user_id = ?', [userId], (err, games) => {
            if (err) {
                console.error('Failed to fetch user library:', err);
                return res.status(500).json({ error: 'Failed to fetch user library' });
            }
            res.json(games);
        });
    } catch (error) {
        console.error('Failed to fetch publisher games:', error);
        res.status(500).json({ error: 'Failed to fetch publisher games' });
    }
};

const publishMyGame = async (req, res) => {
    try {
        const { game_name, game_description } = req.body;
        const user_id = req.params.user_id;

        if (!game_name || !game_description || !user_id) {
            return res.status(400).json({ error: 'game_name, game_description, and user_id are required' });
        }

        db.query('INSERT INTO Games (game_name, game_description, user_id) VALUES (?, ?, ?)', 
        [game_name, game_description, user_id], 
        (err, result) => {
            if (err) {
                console.error('Failed to publish game:', err);
                return res.status(500).json({ error: 'Failed to publish game' });
            }
            const newGame = { id: result.insertId, game_name, game_description, user_id };
            res.status(201).json(newGame);
        });
    } catch (error) {
        console.error('Failed to publish game:', error);
        res.status(500).json({ error: 'Failed to publish game' });
    }
};


const unpublishMyGame = async (req, res) => {
    try {
        const { game_id } = req.params;

        if (!game_id) {
            return res.status(400).json({ error: 'game_id is required' });
        }

        // First, delete references in UserGames table
        db.query('DELETE FROM UserGames WHERE game_id = ?', [game_id], (err) => {
            if (err) {
                console.error('Failed to remove game references from user library:', err);
                return res.status(500).json({ error: 'Failed to remove game references from user library' });
            }

            // Then, delete the game from Games table
            db.query('DELETE FROM Games WHERE id = ?', [game_id], (err) => {
                if (err) {
                    console.error('Failed to unpublish game:', err);
                    return res.status(500).json({ error: 'Failed to unpublish game' });
                }
                res.json({ message: 'Game unpublished successfully' });
            });
        });
    } catch (error) {
        console.error('Failed to unpublish game:', error);
        res.status(500).json({ error: 'Failed to unpublish game' });
    }
};

const updateMyGame = async (req, res) => {
    try {
        const { game_name, game_description } = req.body;
        const { game_id } = req.params;

        if (!game_name || !game_description || !game_id) {
            return res.status(400).json({ error: 'game_name, game_description, and game_id are required' });
        }

        db.query('UPDATE Games SET game_name = ?, game_description = ? WHERE id = ?', 
        [game_name, game_description, game_id], 
        (err) => {
            if (err) {
                console.error('Failed to update game:', err);
                return res.status(500).json({ error: 'Failed to update game' });
            }
            res.json({ message: 'Game updated successfully' });
        });
    } catch (error) {
        console.error('Failed to update game:', error);
        res.status(500).json({ error: 'Failed to update game' });
    }
};

module.exports = {
    getGames,
    addToLibrary,
    getUserLibrary,
    removeFromLibrary,
    getMyGames,
    publishMyGame,
    unpublishMyGame,
    updateMyGame
};