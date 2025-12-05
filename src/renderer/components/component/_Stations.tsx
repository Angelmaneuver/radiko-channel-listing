import { JSX } from 'react';

import Program from './_Program';
import RadioStation from './_RadioStation';

import type { RadioStations } from '@/main/radiko';

function Stations({
  schedule,
  onMouseEnter,
  onMouseLeave,
}: { schedule: RadioStations | undefined } & Pick<
  JSX.IntrinsicElements['div'],
  'onMouseEnter' | 'onMouseLeave'
>) {
  const stations = Object.entries(schedule ?? {}).map(([name, programs]) => {
    return (
      <RadioStation key={name} name={name}>
        {programs.length > 0 ? <Program programs={programs} /> : ''}
      </RadioStation>
    );
  });

  return schedule ? (
    <div
      className="stations"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {stations}
    </div>
  ) : (
    ''
  );
}

export default Stations;
