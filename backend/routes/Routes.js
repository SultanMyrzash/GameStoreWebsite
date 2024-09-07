const express = require('express');
const router = express.Router();
const cors = require('cors');
const { getGames, addToLibrary, getUserLibrary, removeFromLibrary, getMyGames, publishMyGame, unpublishMyGame, updateMyGame } = require('../controllers/Controller');

router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173',
    })

)

router.get('/', getGames);
router.post('/add-to-library', addToLibrary);
router.get('/library/:userId', getUserLibrary);
router.post('/library/remove', removeFromLibrary);
router.get('/mygames/:userId', getMyGames);
router.post('/mygames/publish/:user_id', publishMyGame);
router.post('/mygames/delete/:game_id', unpublishMyGame);
router.post('/mygames/update/:game_id', updateMyGame);


module.exports = router;