import { Minus, Pin, PinOff, Plus, RotateCcw, X } from 'lucide-react';
import { Dispatch, JSX, SetStateAction } from 'react';

import { Button } from '@/renderer/components/ui/button';

function TitleBar({
  isMinimum,
  setMinimum,
  isPinned,
  onMouseEnter,
  onMouseLeave,
}: {
  isMinimum: boolean;
  setMinimum: Dispatch<SetStateAction<boolean>>;
  isPinned: boolean;
} & Pick<JSX.IntrinsicElements['section'], 'onMouseEnter' | 'onMouseLeave'>) {
  return (
    <section
      className="titlebar"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="title">radiko 番組表</div>

      <Button
        className="button"
        onClick={() => window.electron?.ipcRenderer.sendMessage('ipc-schedule')}
      >
        <RotateCcw />
      </Button>

      <Button className="button" onClick={() => setMinimum(!isMinimum)}>
        {isMinimum ? <Plus /> : <Minus />}
      </Button>

      <Button
        className="button"
        onClick={() =>
          window.electron?.ipcRenderer.sendMessage('ipc-set-pinned', !isPinned)
        }
      >
        {isPinned ? <Pin /> : <PinOff />}
      </Button>

      <Button className="button" onClick={() => window.close()}>
        <X />
      </Button>
    </section>
  );
}

export default TitleBar;
