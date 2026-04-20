import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import { Dispatch, JSX, SetStateAction } from 'react';

import { Button } from '@/components/ui/button';
import { changeMinimum, close } from '@/components/window';

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

      <Button
        className="button"
        onClick={async () => {
          const is_minimum = !isMinimum;

          setMinimum(is_minimum);
          changeMinimum(is_minimum);
        }}
      >
        {isMinimum ? <Plus /> : <Minus />}
      </Button>

      <Button className="button" onClick={async () => close()}>
        <X />
      </Button>
    </section>
  );
}

export default TitleBar;
