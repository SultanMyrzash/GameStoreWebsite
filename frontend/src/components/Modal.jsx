import React, { useState } from 'react';
import '../styles/Modal.css';

export default function Modal({ isOpen, onClose, onSubmit, game, isEditing }) {
  const [gameName, setGameName] = useState(game ? game.game_name : '');
  const [gameDescription, setGameDescription] = useState(game ? game.game_description : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: game?.id, game_name: gameName, game_description: gameDescription });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal">
      <div className="modal-content">
      <div className="modal-header"> 
        <h2>{isEditing ? 'Edit Game' : 'Publish a New Game'}</h2>
        <button className="close" onClick={onClose}>&#x2716;</button>
      </div>
        <form onSubmit={handleSubmit}>
          <label>
            Game Name
            <input
              type="text"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              required
            />
          </label>
          <label>
            Game Description
            <textarea
              value={gameDescription}
              onChange={(e) => setGameDescription(e.target.value)}
              required
            />
          </label>
          <div className="button-group">
            <button className="home-button" type="submit">{isEditing ? 'Save Changes' : 'Publish'}</button>
            {isEditing && <button className="delete-button" type="button" onClick={() => onSubmit({ id: game.id, delete: true })}>Delete Game</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
