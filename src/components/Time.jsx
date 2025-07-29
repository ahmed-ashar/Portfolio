import React, { useEffect, useState } from 'react';

const Time = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Function to format the time as HH:MM:SS AM/PM
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';

      hours = hours % 12;
      hours = hours ? hours : 12; // 0 => 12

      const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')} ${ampm}`;
      setCurrentTime(formattedTime);
    };

    updateTime(); // Call immediately
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className='z-11 text-zinc-400 text-xs redHatMono'>
      {currentTime}
    </div>
  );
};

export default Time;
