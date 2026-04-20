import { useEffect, useState } from 'react';

import { is_minimum } from '@/components/store';
import { next } from '@/lib/utils';

import { get } from '../function';
import type { ChannelData } from '../interface';

import Stations from './_Stations';
import TitleBar from './_TitleBar';

const intervalMinute = 5;
const refresh = intervalMinute * 60 * 1000;

function RadikoScheduleBoard() {
  const [schedule, setSchedule] = useState<ChannelData | undefined>(undefined);
  const [isMinimum, setMinimum] = useState(false);

  const load = () => {
    get().then(([data, _]) => {
      if (data) {
        setSchedule(data);
      }
    });
  };

  const onMouseEnter = () => {};
  const onMouseLeave = () => {};

  useEffect(() => {
    load();

    is_minimum().then((value) => {
      setMinimum(value);
    });

    let intervalEvent: NodeJS.Timeout;

    const timeoutEvent = setTimeout(() => {
      load();

      intervalEvent = setInterval(load, refresh);
    }, next(intervalMinute));

    return () => {
      clearTimeout(timeoutEvent);
      clearInterval(intervalEvent);
    };
  }, []);

  return (
    <>
      <TitleBar
        isMinimum={isMinimum}
        setMinimum={setMinimum}
        reload={load}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      {isMinimum ? (
        ''
      ) : (
        <Stations
          channels={schedule?.channels}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      )}
    </>
  );
}

export default RadikoScheduleBoard;
