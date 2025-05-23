import React, { useState, useRef } from 'react';
import { Clock, UserPlus } from 'lucide-react';
import { Player, DragItem } from '../types';
import PlayerCard from './PlayerCard';

interface PlayerQueueProps {
  players: Player[];
  onDrop: (playerId: string, source: 'COURT' | 'QUEUE', sourceCourtId?: string) => void;
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onDragStart: (item: DragItem) => void;
}

const PlayerQueue: React.FC<PlayerQueueProps> = ({ 
  players, 
  onDrop, 
  onAddPlayer, 
  onRemovePlayer,
  onDragStart
}) => {
  const [isOver, setIsOver] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [draggingPlayerId, setDraggingPlayerId] = useState<string | null>(null);
  const queueRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (queueRef.current && !queueRef.current.contains(e.relatedTarget as Node)) {
      setIsOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    
    const data = JSON.parse(e.dataTransfer.getData('application/json')) as DragItem;
    onDrop(data.id, data.sourceContainer, data.courtId);
  };

  const handlePlayerDragStart = (e: React.DragEvent<HTMLDivElement>, player: Player) => {
    setDraggingPlayerId(player.id);
    
    const item: DragItem = {
      type: 'PLAYER',
      id: player.id,
      sourceContainer: 'QUEUE'
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    onDragStart(item);
  };

  const handleDragEnd = () => {
    setDraggingPlayerId(null);
  };

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName('');
    }
  };

  // Group players into batches of 4
  const playerBatches = players.reduce<Player[][]>((acc, player, index) => {
    const batchIndex = Math.floor(index / 4);
    if (!acc[batchIndex]) {
      acc[batchIndex] = [];
    }
    acc[batchIndex].push(player);
    return acc;
  }, []);

  return (
    <div 
      ref={queueRef}
      className={`bg-white rounded-lg p-4 shadow-md transition-all duration-200 border-2 border-blue-500
        ${isOver ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl text-[#0C2340]">Waiting Queue</h3>
        <div className="flex items-center">
          <Clock size={18} className="text-gray-600 mr-1" />
          <span className="text-sm font-medium text-gray-600">
            {players.length} waiting
          </span>
        </div>
      </div>

      <form onSubmit={handleAddPlayer} className="mb-4 flex">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="Player name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-2 rounded-r-lg hover:bg-blue-600 transition-colors flex items-center"
        >
          <UserPlus size={18} className="mr-1" />
          Add
        </button>
      </form>

      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
        {playerBatches.length === 0 ? (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-sm">No players waiting</p>
          </div>
        ) : (
          playerBatches.map((batch, batchIndex) => (
            <div key={batchIndex} className="bg-gray-50 p-2 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Batch {batchIndex + 1}</span>
                <span className="text-sm text-gray-500">{batch.length}/4 players</span>
              </div>
              <div className="space-y-2">
                {batch.map(player => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    isDragging={draggingPlayerId === player.id}
                    onDragStart={(e) => handlePlayerDragStart(e, player)}
                    onDragEnd={handleDragEnd}
                    onRemovePlayer={() => onRemovePlayer(player.id)}
                    location="queue"
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerQueue;