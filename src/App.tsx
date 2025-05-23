import React, { useState, useEffect } from 'react';
import { Court as CourtType, Player, DragItem } from './types';
import Court from './components/Court';
import PlayerQueue from './components/PlayerQueue';
import Header from './components/Header';

function App() {
  const [courts, setCourts] = useState<CourtType[]>([
    { id: 'court1', name: 'Court 1', players: [], maxPlayers: 4 },
    { id: 'court2', name: 'Court 2', players: [], maxPlayers: 4 },
    { id: 'court3', name: 'Court 3', players: [], maxPlayers: 4 },
    { id: 'court4', name: 'Court 4', players: [], maxPlayers: 4 },
    { id: 'court5', name: 'Court 5', players: [], maxPlayers: 4 },
    { id: 'court6', name: 'Court 6', players: [], maxPlayers: 4 },
    { id: 'court7', name: 'Court 7', players: [], maxPlayers: 4 },
    { id: 'court8', name: 'Court 8', players: [], maxPlayers: 4 },
    { id: 'court9', name: 'Court 9', players: [], maxPlayers: 4 },
    { id: 'court10', name: 'Court 10', players: [], maxPlayers: 4 },
    { id: 'courta', name: 'Next 1', players: [], maxPlayers: 4 },
    { id: 'courtb', name: 'Next 2', players: [], maxPlayers: 4 },
    { id: 'courtc', name: 'Next 3', players: [], maxPlayers: 4 },
    { id: 'courtd', name: 'Next 4', players: [], maxPlayers: 4 },
    { id: 'courte', name: 'Next 5', players: [], maxPlayers: 4 },
  ]);
  
  const [queuePlayers, setQueuePlayers] = useState<Player[]>([]);
  const [currentDrag, setCurrentDrag] = useState<DragItem | null>(null);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCourts([...courts]);
      setQueuePlayers([...queuePlayers]);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [courts, queuePlayers]);

  const handleAddPlayerToQueue = (name: string) => {
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name,
      onCourtSince: null,
      waitingSince: Date.now(),
    };
    
    setQueuePlayers([...queuePlayers, newPlayer]);
  };

  const handleRemovePlayer = (playerId: string) => {
    const queuePlayer = queuePlayers.find(p => p.id === playerId);
    if (queuePlayer) {
      setQueuePlayers(queuePlayers.filter(p => p.id !== playerId));
      return;
    }
    
    setCourts(courts.map(court => ({
      ...court,
      players: court.players.filter(p => p.id !== playerId)
    })));
  };

  const handleDragStart = (item: DragItem) => {
    setCurrentDrag(item);
  };

  const handleDrop = (playerId: string, sourceContainer: 'COURT' | 'QUEUE', targetCourtId?: string) => {
    if (!currentDrag) return;
    
    if (sourceContainer === 'QUEUE' && targetCourtId) {
      const player = queuePlayers.find(p => p.id === playerId);
      if (!player) return;
      
      const targetCourt = courts.find(c => c.id === targetCourtId);
      if (!targetCourt || targetCourt.players.length >= targetCourt.maxPlayers) return;
      
      setQueuePlayers(queuePlayers.filter(p => p.id !== playerId));
      
      const updatedPlayer = {
        ...player,
        waitingSince: null,
        onCourtSince: Date.now(),
      };
      
      setCourts(courts.map(court => {
        if (court.id === targetCourtId) {
          return {
            ...court,
            players: [...court.players, updatedPlayer]
          };
        }
        return court;
      }));
    } else if (sourceContainer === 'COURT') {
      const sourceCourt = courts.find(court => 
        court.players.some(p => p.id === playerId)
      );
      
      if (!sourceCourt) return;
      
      const player = sourceCourt.players.find(p => p.id === playerId);
      if (!player) return;
      
      const updatedCourts = courts.map(court => ({
        ...court,
        players: court.players.filter(p => p.id !== playerId)
      }));
      
      const updatedPlayer = {
        ...player,
        onCourtSince: null,
        waitingSince: Date.now(),
      };
      
      setQueuePlayers([...queuePlayers, updatedPlayer]);
      setCourts(updatedCourts);
    }
    
    setCurrentDrag(null);
  };

  // Split courts into two rows
  const firstRowCourts = courts.slice(0, 5);
  const secondRowCourts = courts.slice(5);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold mb-4 text-[#0C2340]">Tennis Courts</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {firstRowCourts.map(court => (
                  <Court 
                    key={court.id}
                    court={court}
                    onDrop={handleDrop}
                    onRemovePlayer={handleRemovePlayer}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {secondRowCourts.map(court => (
                  <Court 
                    key={court.id}
                    court={court}
                    onDrop={handleDrop}
                    onRemovePlayer={handleRemovePlayer}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <PlayerQueue 
              players={queuePlayers}
              onDrop={handleDrop}
              onAddPlayer={handleAddPlayerToQueue}
              onRemovePlayer={handleRemovePlayer}
              onDragStart={handleDragStart}
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-[#0C2340] text-white py-3 text-center text-sm">
        <p>CourtManager &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;