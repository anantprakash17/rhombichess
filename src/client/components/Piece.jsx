import Image from 'next/image';
import React from 'react';

function Piece({ testid, name, className }) {
  const imageURL = `/pieces/${name}.png`;

  if (name) {
    return (
      <div data-testid={testid} className={`w-11 ${className}`} key={name}>
        <Image src={imageURL} alt={name} width={100} height={100} />
      </div>
    );
  }
}

export default Piece;
