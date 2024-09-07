import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import '../styles/HomeLibrary.css';
import LoadingIndicator from "../components/LoadingIndicator";
import { toast } from 'react-hot-toast';

export default function Library() {
    const { user } = useContext(UserContext);
    const [library, setLibrary] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchLibrary = async () => {
                try {
                    const response = await axios.get(`/library/${user.id}`);
                    setLibrary(response.data);
                } catch (error) {
                    console.error('Failed to fetch library', error);
                    setError('Failed to fetch library');
                } finally {
                    setLoading(false);
                }
            };
            fetchLibrary();
        } else {
            setLoading(false); // In case user is not set, stop loading
        }
    }, [user]);

    const removeFromLibrary = async (game_id) => {
        try {
            await axios.post('/library/remove', { game_id, user_id: user.id });
            setLibrary(library.filter(game => game.id !== game_id));
            setError('');  // Clear any previous error
            toast.success('Game removed from library');
        } catch (error) {
            console.error('Failed to remove game from library', error);
            setError('Failed to remove game from library');
        }
    };

    if (loading) {
        return <div className="container">
            <p>Loading...</p>
            {loading && <LoadingIndicator />}
            </div>;
    }

    if (!user) {
        return <div className="container"><p>Please log in to view your library.</p></div>;
    }

    return (
        <div className='container'>
            <h2>{user.username}'s Library</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Game</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {library.map((game) => (
                        <tr key={game.id}>
                            <td>
                                <p className="game-name">{game.game_name}</p>
                            </td>
                            <td>{game.game_description}</td>
                            <td>
                                <button className='delete-button' onClick={() => removeFromLibrary(game.id)}>Remove from Library</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
