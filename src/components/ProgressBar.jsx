import React from 'react';

function ProgressBar(props) {
  
  const getProgressColor = (value) => {
    if (value >= 0 && value <= 50) {
      return 'red';
    } else if (value > 50 && value <= 75) {
      return 'orange';
    } else if (value > 75 && value <= 90) {
      return 'yellow';
    } else  {
      return 'green';
    }
  };

  const getText = (value) => {
    if (value === 100) {
      return 'erledigt';
    } else {
      return `${value}%`;
    }
  };

  return (
    <div className='progressbar-container'>
      <div className='progressbar-balken' style={{ width: `${props.value}%`,  backgroundColor: getProgressColor(props.value) }}></div>
      <div className='progressbar-text' >{getText(props.value)}</div>
    </div>
  );
}

export default ProgressBar;
