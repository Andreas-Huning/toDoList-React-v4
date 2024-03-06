import React, { useState, useEffect } from 'react';

function Timer({ data }) {
  const [difference, setDifference] = useState('');
  const [isNegative, setIsNegative] = useState(false);

  useEffect(() => {
    let animationFrameId;
    let lastUpdateTime = 0;

    const calculateTimeDifference = () => {
      const now = Date.now();
      const inputDate = new Date(data.date);

      const differenceInMillis = inputDate - now;
      setIsNegative(differenceInMillis < 0);

      if (now - lastUpdateTime >= 1000) {
        const absoluteDifferenceInMillis = Math.abs(differenceInMillis);
        const days = Math.floor(absoluteDifferenceInMillis / (1000 * 60 * 60 * 24));
        const hours = Math.floor((absoluteDifferenceInMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((absoluteDifferenceInMillis % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((absoluteDifferenceInMillis % (1000 * 60)) / 1000);
        const milliseconds = absoluteDifferenceInMillis % 1000;

        let output = '';
        if (days >= 365) {
          const years = Math.floor(days / 365);
          output += `${years}J `;
          if (days % 365 > 0) {
            output += ` ${days % 365}T `;
          }
        } else if (days > 0) {
          output += `${days}T `;
        }
        if (hours > 0) {
          output += ` ${hours}Std `;
        }
        if (minutes > 0) {
          output += ` ${minutes}Min `;
        }
        if (seconds >= 0) {
          let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
          output += ` ${formattedSeconds}Sek`;
        }
        // if (milliseconds >= 0) {
        //   let formattedMilliseconds = ("00" + milliseconds).slice(-3);
        //   output += ` ${formattedMilliseconds}MilliSek`;
        // }

        setDifference(output);
        lastUpdateTime = now;
      }

      animationFrameId = requestAnimationFrame(calculateTimeDifference);
    };

    calculateTimeDifference();

    return () => cancelAnimationFrame(animationFrameId);
  }, [data.date]);

  return (
    <div style={{ color: isNegative ? 'red' : 'inherit' }}>{difference}</div>
  );
}

export default Timer;
