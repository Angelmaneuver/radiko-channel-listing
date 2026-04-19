import { JSX } from 'react';

import type { Channel } from '../interface';

import Program from './_Program';
import RadioStation from './_RadioStation';

function Stations({
  channels,
  onMouseEnter,
  onMouseLeave,
}: { channels: Array<Channel> | undefined } & Pick<
  JSX.IntrinsicElements['div'],
  'onMouseEnter' | 'onMouseLeave'
>) {
  const stations = (channels ?? []).map((channel) => {
    return (
      <RadioStation key={channel.id} name={channel.name}>
        {channel.programs.length > 0 ? <Program programs={channel.programs} /> : ''}
      </RadioStation>
    );
  });

  return channels ? (
    <div className="stations" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {stations}
    </div>
  ) : (
    ''
  );
}

export default Stations;
