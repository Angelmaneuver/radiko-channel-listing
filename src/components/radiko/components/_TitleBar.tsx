import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import { Dispatch, JSX, SetStateAction } from 'react';

import { Button } from '@/components/ui/button';
import { close } from '@/components/window';

function TitleBar({
  isMinimum,
  setMinimum,
  reload,
  onMouseEnter,
  onMouseLeave,
}: {
  isMinimum: boolean;
  setMinimum: Dispatch<SetStateAction<boolean>>;
  reload: () => void;
} & Pick<JSX.IntrinsicElements['section'], 'onMouseEnter' | 'onMouseLeave'>) {
  return (
    <section className="titlebar" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="title" data-tauri-drag-region draggable="true">
        radiko 番組表
      </div>

      <Button className="button" onClick={reload}>
        <RotateCcw />
      </Button>

      <Button className="button" onClick={() => setMinimum(!isMinimum)}>
        {isMinimum ? <Plus /> : <Minus />}
      </Button>

      <Button className="button" onClick={async () => close()}>
        <X />
      </Button>
    </section>
  );
}

export default TitleBar;
