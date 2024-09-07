import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import '../styles/HomeLibrary.css';
import { toast } from 'react-hot-toast';

export default function Home() {
  const [games, setGames] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
      const fetchGames = async () => {
          try {
              const response = await axios.get('/');
              setGames(response.data);
          } catch (error) {
              console.error('Failed to fetch games', error);
          }
      };
      fetchGames();
  }, []);

  const addToLibrary = async (game_id) => {
    try {
      await axios.post('/add-to-library', { user_id: user.id, game_id });
      toast.success('Game added to library successfully');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('An error occurred');
        toast.error(error);
      }
    }
  };

  if (!user) {
    return (
      <div className="container">
      <h1>Games Store</h1>
      <a href="/login">Log in to add games to library</a>
      <table>
        <thead>
          <tr>
            <th>Game</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td>
                <p className="game-name">{game.game_name}</p>
                <p className="created-by">Created by: {game.publisher}</p>
              </td>
              <td>{game.game_description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    );
  }

  return (
    <div className="container">
      <h1>Games Store</h1>
      <p>Welcome, {user.username}!</p>
      <table>
        <thead>
          <tr>
            <th>Game</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td>
                <p className="game-name">{game.game_name}</p>
                <p className="created-by">Created by: {game.publisher}</p>
              </td>
              <td>{game.game_description}</td>
              <td>
                <button className='home-button' onClick={() => addToLibrary(game.id)}>Add to Library</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


