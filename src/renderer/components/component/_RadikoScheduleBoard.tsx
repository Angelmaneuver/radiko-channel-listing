import { useEffect, useState } from 'react';

import Stations from './_Stations';
import TitleBar from './_TitleBar';

import type { RadioStations } from '@/main/radiko';
import { next } from '@/renderer/utils';

const intervalMinute = 5;
const refresh = intervalMinute * 60 * 1000;

let intervalEvent: NodeJS.Timeout;

function RadikoScheduleBoard() {
  const [schedule, setSchedule] = useState<RadioStations | undefined>(
    undefined,
  );
  const [isMinimum, setMinimum] = useState(false);

  useEffect(() => {
    // calling IPC exposed from preload script
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
      <TitleBar isMinimum={isMinimum} setMinimum={setMinimum} />
      {isMinimum ? '' : <Stations schedule={schedule} />}
    </>
  );
}

export default RadikoScheduleBoard;
