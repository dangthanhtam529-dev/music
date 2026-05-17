import { useState } from 'react';

export function useScratch() {
  const [revealed, setRevealed] = useState(false);
  return {
    revealed,
    reveal: () => setRevealed(true),
    reset: () => setRevealed(false),
  };
}
