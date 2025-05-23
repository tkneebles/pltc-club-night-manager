import React, { useState, useRef } from 'react';
import { Users } from 'lucide-react';
import { Court as CourtType, Player, DragItem } from '../types';
import PlayerCard from './PlayerCard';

interface CourtProps {
  court: CourtType;
  onDrop: (playerId: string, source: 'COURT' | 'QUEUE', sourceCourtId?: string) => void;
  onRemovePlayer: (playerId: string) => void;
  onDragStart: (item: DragItem) => void;
}

const Court: React.FC<CourtProps> = ({ court, onDrop, onRemovePlayer, onDragStart }) => {
  const [isOver, setIsOver] = useState(false);
  const [draggingPlayerId, setDraggingPlayerId] = useState<string | null>(null);
  const courtRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isOver && court.players.length < court.maxPlayers) {
      setIsOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (courtRef.current && !courtRef.current.contains(e.relatedTarget as Node)) {
      setIsOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    
    const data = JSON.parse(e.dataTransfer.getData('application/json')) as DragItem;
    
    if (court.players.length < court.maxPlayers) {
      onDrop(data.id, data.sourceContainer, court.id);
    }
  };

  const handlePlayerDragStart = (e: React.DragEvent<HTMLDivElement>, player: Player) => {
    setDraggingPlayerId(player.id);
    
    const item: DragItem = {
      type: 'PLAYER',
      id: player.id,
      sourceContainer: 'COURT',
      courtId: court.id
    };
    
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    onDragStart(item);
  };

  const handleDragEnd = () => {
    setDraggingPlayerId(null);
  };

  const availability = court.players.length < court.maxPlayers 
    ? 'available' 
    : 'full';

  return (
    <div 
      ref={courtRef}
      className={`bg-[#E8F5E9] rounded-lg p-3 shadow-md transition-all duration-200
        ${isOver && court.players.length < court.maxPlayers ? 'ring-2 ring-green-500 shadow-lg' : ''}
        ${availability === 'available' ? 'border-green-500' : 'border-yellow-500'} border-2`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-lg text-[#0C2340]">{court.name}</h3>
        <div className="flex items-center">
          <Users size={16} className="text-gray-600 mr-1" />
          <span className={`text-sm font-medium ${court.players.length >= court.maxPlayers ? 'text-yellow-600' : 'text-green-600'}`}>
            {court.players.length}/{court.maxPlayers}
          </span>
        </div>
      </div>
      
      <div className="space-y-1 min-h-16">
        {court.players.map(player => (
          <PlayerCard
            key={player.id}
            player={player}
            isDragging={draggingPlayerId === player.id}
            onDragStart={(e) => handlePlayerDragStart(e, player)}
            onDragEnd={handleDragEnd}
            onRemovePlayer={() => onRemovePlayer(player.id)}
            location="court"
          />
        ))}
        
        {court.players.length === 0 && (
          <div className="flex items-center justify-center h-16 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 text-xs">Drag players here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Court;