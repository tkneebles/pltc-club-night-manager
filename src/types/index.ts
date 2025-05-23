export interface Player {
  id: string;
  name: string;
  onCourtSince: number | null; // timestamp when player went on court
  waitingSince: number | null; // timestamp when player joined queue
}

export interface Court {
  id: string;
  name: string;
  players: Player[];
  maxPlayers: number;
}

export type DragItem = {
  type: 'PLAYER';
  id: string;
  sourceContainer: 'COURT' | 'QUEUE';
  courtId?: string;
}