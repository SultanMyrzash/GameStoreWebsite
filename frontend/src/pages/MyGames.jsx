import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import '../styles/HomeLibrary.css';
import LoadingIndicator from "../components/LoadingIndicator";
import Modal from '../components/Modal';
import { toast } from 'react-hot-toast';

export default function MyGames() {
    const { user } = useContext(UserContext);
    const is_gamepublisher = user && user.is_gamepublisher === 1;
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentGame, setCurrentGame] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            const fetchGames = async () => {
                try {
                    const response = await axios.get(`/mygames/${user.id}`);
                    setGames(response.data);
                } catch (error) {
                    console.error('Failed to fetch library', error);
                    setError('Failed to fetch library');
                } finally {
                    setLoading(false);
                }
            };
            fetchGames();
        } else {
            setLoading(false); // In case user is not set, stop loading
        }
    }, [user]);

    const openModal = (game = null) => {
        setCurrentGame(game);
        setIsEditing(!!game);
        setModalOpen(true);
    };

    const closeModal = () => {
        setCurrentGame(null);
        setModalOpen(false);
    };

    const handleModalSubmit = async (game) => {
      try {
          if (game.delete) {
              try {
                  await axios.post(`/mygames/delete/${game.id}`);
                  setGames(games.filter(g => g.id !== game.id));
                  toast.success('Game deleted successfully');
              } catch (error) {
                  console.error('Failed to delete game:', error);
                  toast.error('Failed to delete game');
              }
          } else if (isEditing) {
              try {
                  await axios.post(`/mygames/update/${game.id}`, game);
                  setGames(games.map(g => (g.id === game.id ? game : g)));
                  toast.success('Game updated successfully');
              } catch (error) {
                  console.error('Failed to update game:', error);
                  toast.error('Failed to update game');
              }
          } else {
              try {
                  const response = await axios.post(`/mygames/publish/${user.id}`, game);
                  setGames([...games, response.data]);
                  toast.success('Game published successfully');
              } catch (error) {
                  console.error('Failed to publish game:', error);
                  toast.error('Failed to publish game');
              }
          }
      } catch (error) {
          console.error('An unexpected error occurred:', error);
          toast.error('An unexpected error occurred');
      } finally {
          closeModal();
      }
  };
    if (loading) {
      return (
        <div className="container">
          <p>Loading...</p>
          {loading && <LoadingIndicator />}
        </div>
      );
    }

    if (!is_gamepublisher) {
        return <div className="container"><p>This page is only for game developers or publishers.</p></div>;
    }

    return (
        <div className='container'>
            <h1>My Games</h1>
            <p>Welcome, {user.username}!<br /> Here you can publish and manage your own games.</p>
            <table>
                <thead>
                    <tr>
                        <th>Game's Name</th>
                        <th>Game's Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id}>
                            <td>
                                <p className="game-name">{game.game_name}</p>
                            </td>
                            <td>{game.game_description}</td>
                            <td>
                                <button className='home-button' onClick={() => openModal(game)}>Change</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className='home-button' onClick={() => openModal()}>Publish a New Game</button>
            <Modal
                isOpen={modalOpen}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                game={currentGame}
                isEditing={isEditing}
            />
        </div>
    );
}
