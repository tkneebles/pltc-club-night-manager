/**
 * Format milliseconds into a readable time string (HH:MM:SS or MM:SS)
 */
export const formatTime = (ms: number): string => {
  if (!ms) return '00:00';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)));
  
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  
  if (hours > 0) {
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  
  return `${formattedMinutes}:${formattedSeconds}`;
};