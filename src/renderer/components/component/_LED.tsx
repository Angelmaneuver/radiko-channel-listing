import { CSSProperties } from 'react';

function LED({
  className = '',
  style = undefined,
  marquee = true,
  text = '',
}: {
  className?: string;
  style?: CSSProperties;
  marquee?: boolean;
  text?: string;
}) {
  return (
    <div
      className={`led ${marquee ? 'marquee' : ''} ${className || ''}`.trim()}
      style={style}
    >
      {text.length > 0 ? (
        <span
          style={marquee ? { animationDuration: `${text.length}s` } : undefined}
        >
          {text}
        </span>
      ) : (
        ''
      )}
    </div>
  );
}

LED.defaultProps = {
  className: '',
  style: undefined,
  marquee: true,
  text: '',
};

export default LED;
