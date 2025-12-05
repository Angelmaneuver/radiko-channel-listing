import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

import { Button } from '@/renderer/components/ui/button';

function TitleBar({
  isMinimum,
  setMinimum,
}: {
  isMinimum: boolean;
  setMinimum: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <section className="titlebar">
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

      <Button className="button" onClick={() => window.close()}>
        <X />
      </Button>
    </section>
  );
}

export default TitleBar;
