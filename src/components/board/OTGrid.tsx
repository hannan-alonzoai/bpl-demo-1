import { useEffect, useState } from 'react';
import { rooms } from '../../data/rooms';
import type { Room } from '../../types';
import { perRowForWidth } from '../../utils/classify';
import { OTCard } from './OTCard';

interface Props {
  onViewDetails: (room: Room) => void;
}

export function OTGrid({ onViewDetails }: Props) {
  const [perRow, setPerRow] = useState(3);

  useEffect(() => {
    function update() {
      setPerRow(perRowForWidth(window.innerWidth - 56));
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const rows: typeof rooms[] = [];
  for (let i = 0; i < rooms.length; i += perRow) {
    rows.push(rooms.slice(i, i + perRow));
  }

  return (
    <div className="grid">
      {rows.map((chunk, i) => (
        <div className="row" key={i}>
          {chunk.map(room => (
            <OTCard key={room.id} room={room} onViewDetails={() => onViewDetails(room)} />
          ))}
        </div>
      ))}
    </div>
  );
}
