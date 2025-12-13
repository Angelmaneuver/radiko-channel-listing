import { useEffect, useState } from 'react';

import { next } from '@/renderer/utils';

import Stations from './_Stations';
import TitleBar from './_TitleBar';

import type { RadioStations } from '@/main/radiko';

const intervalMinute = 5;
const refresh = intervalMinute * 60 * 1000;

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-undef
let intervalEvent: NodeJS.Timeout;

function RadikoScheduleBoard() {
  const [schedule, setSchedule] = useState<RadioStations | undefined>(
    undefined,
  );
  const [isMinimum, setMinimum] = useState(false);
  const [isPinned, setPinned] = useState(false);

  const onMouseEnter = () =>
    window.electron?.ipcRenderer.sendMessage('ipc-mouse-event', true);

  const onMouseLeave = () =>
    window.electron?.ipcRenderer.sendMessage('ipc-mouse-event', false);

  useEffect(() => {
    // calling IPC exposed from preload script
    window.electron?.ipcRenderer.sendMessage('ipc-get-pinned');

    window.electron?.ipcRenderer.once('ipc-get-pinned', (arg) => {
      // eslint-disable-next-line no-console
      console.log(arg);

      setPinned(!!arg);
    });

    window.electron?.ipcRenderer.sendMessage('ipc-schedule');

    window.electron?.ipcRenderer.on('ipc-schedule', (arg) => {
      // eslint-disable-next-line no-console
      console.log(arg);

      setSchedule(arg as RadioStations);
    });

    intervalEvent = setTimeout(() => {
      window.electron?.ipcRenderer.sendMessage('ipc-schedule');

      setInterval(
        () => window.electron?.ipcRenderer.sendMessage('ipc-schedule'),
        refresh,
      );
    }, next(intervalMinute));

    return () => {};
  }, []);

  return (
    <>
      <TitleBar
        isMinimum={isMinimum}
        setMinimum={setMinimum}
        isPinned={isPinned}
        onMouseEnter={isPinned ? onMouseEnter : undefined}
        onMouseLeave={isPinned ? onMouseLeave : undefined}
      />
      {isMinimum ? (
        ''
      ) : (
        <Stations
          schedule={schedule}
          onMouseEnter={isPinned ? onMouseEnter : undefined}
          onMouseLeave={isPinned ? onMouseLeave : undefined}
        />
      )}
    </>
  );
}

export default RadikoScheduleBoard;
