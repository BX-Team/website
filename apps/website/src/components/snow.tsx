'use client';

import { useEffect, useState } from 'react';
import Snowfall from 'react-snowfall';

function isWinterSeason(): boolean {
  const month = new Date().getMonth();
  return month === 11 || month === 0 || month === 1;
}

export default function SnowEffect() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isWinter, setIsWinter] = useState(true);

  useEffect(() => {
    setIsWinter(isWinterSeason());

    const stored = localStorage.getItem('snowEnabled');
    if (stored !== null) {
      setIsEnabled(stored === 'true');
    }

    const handleStorageChange = () => {
      const value = localStorage.getItem('snowEnabled');
      setIsEnabled(value !== 'false');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('snowToggle', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('snowToggle', handleStorageChange);
    };
  }, []);

  if (!isWinter || !isEnabled) return null;

  return (
    <div
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 50, pointerEvents: 'none' }}
    >
      <Snowfall snowflakeCount={50} color='#fff' />
    </div>
  );
}
