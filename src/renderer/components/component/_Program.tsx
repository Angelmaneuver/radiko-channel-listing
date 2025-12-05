import { Data } from '@/main/radiko';

import LED from './_LED';

function Program({ programs }: { programs: Array<Data> }) {
  const time = `${programs[0].time.slice(0, 2)}:${programs[0].time.slice(2)}`;

  const outline = new DOMParser().parseFromString(
    programs[0].info,
    'text/html',
  );

  return (
    <section className="programs">
      <div className="program">
        <img src={programs[0].img} />

        <div className="information">
          <div className="flex-column">
            <div className="description">放送情報</div>
            <LED style={{ width: '25em' }} text={programs[0].title} />
          </div>

          <div className="flex-row">
            <div
              className="flex-column"
              style={{ width: '3.5em', textAlign: 'center' }}
            >
              <div className="description">開始時間</div>
              <LED style={{ width: '4em' }} marquee={false} text={time} />
            </div>

            <div className="flex-column" style={{ width: '20.85em' }}>
              <div className="description">概要</div>
              <LED
                style={{ width: '20.5em', height: '100%' }}
                text={outline.body.textContent}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Program;
