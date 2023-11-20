import React from 'react';

function Tile({
  children, orientation, colour, onClick, disabled,
}) {
  let tile;

  const colours = ['#FDE047', '#67E8F9', '#F472B6'];

  const tileStyle = disabled ? '' : 'group-hover:fill-gray-800 pointer-events-auto';

  if (orientation === 0) {
    tile = (
      <svg width="87.5" height="50" viewBox="0 0 136 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M90.786 78.2122L135.869 0.126416L45.7051 0.127557L0.622276 78.2134L90.786 78.2122Z" fill={colours[colours.length - colour - 1]} className={tileStyle} />
      </svg>
    );
  } else if (orientation === 1) {
    tile = (
      <svg width="58" height="100" viewBox="0 0 91 157" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M90.7052 78.0858L45.6223 -7.62939e-06L0.541431 78.0847L45.6243 156.17L90.7052 78.0858Z" fill={colours[colour]} className={tileStyle} />
      </svg>
    );
  } else if (orientation === 2) {
    tile = (
      <svg width="88" height="50" viewBox="0 0 136 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M90.1648 0.0434989L-0.000979976 0.0435028L45.0819 78.127L135.248 78.127L90.1648 0.0434989Z" fill={colours[colours.length - colour - 1]} className={tileStyle} />
      </svg>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} type="button" className="group relative hover:cursor-pointer hover:z-50 pointer-events-none select-none">
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        {children}
      </div>
      <div>
        {tile}
      </div>
    </button>
  );
}

export default Tile;
