import { RadioTower } from 'lucide-react';
import { PropsWithChildren } from 'react';

function RadioStation({
  name,
  children,
}: { name: string } & PropsWithChildren) {
  return (
    <section className="station">
      <div className="info">
        <RadioTower height="1.4em" width="1.4em" fill="rgba(230,230,230,.8)" />

        <span className="description">ラジオ局</span>

        <span className="name">{name}</span>
      </div>

      {children}
    </section>
  );
}

export default RadioStation;
