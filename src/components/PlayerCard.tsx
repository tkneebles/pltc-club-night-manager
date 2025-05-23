import React from 'react';
import { Clock } from 'lucide-react';
import { Player } from '../types';
import { formatTime } from '../utils/timeUtils';

interface PlayerCardProps {
  player: Player;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onRemovePlayer: () => void;
  location: 'court' | 'queue';
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  isDragging, 
  onDragStart,
  onDragEnd,
  onRemovePlayer,
  location
}) => {
  const time = location === 'court' 
    ? player.onCourtSince ? Date.now() - player.onCourtSince : 0
    : player.waitingSince ? Date.now() - player.waitingSince : 0;
  
  const getTimeColor = () => {
    const minutes = Math.floor(time / (1000 * 60));
    
    if (location === 'court') {
      if (minutes < 30) return 'text-green-500';
      if (minutes < 60) return 'text-yellow-500';
      return 'text-red-500';
    } else {
      if (minutes < 10) return 'text-green-500';
      if (minutes < 20) return 'text-yellow-500';
      return 'text-red-500';
    }
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`relative flex items-center justify-between bg-white p-2 rounded-lg shadow-sm mb-1 cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${location === 'court' ? 'border-l-4 border-green-500' : 'border-l-4 border-blue-500'}
        hover:shadow-md text-sm`}
    >
      <div className="flex items-center">
        <div className="font-medium truncate">{player.name}</div>
      </div>
      <div className="flex items-center gap-1">
        <div className={`flex items-center ${getTimeColor()}`}>
          <Clock size={14} className="mr-1" />
          <span className="text-xs font-medium">{formatTime(time)}</span>
        </div>
        <button 
          onClick={onRemovePlayer}
          className="ml-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default PlayerCard;