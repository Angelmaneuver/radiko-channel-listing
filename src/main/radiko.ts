import { XMLParser } from 'fast-xml-parser';

const URL = 'https://radiko.jp/v3/program/now/JP13.xml' as const;

const Parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
});

async function request(): Promise<
  { data: string; error: undefined } | { data: undefined; error: Error }
> {
  try {
    const response = await fetch(URL);

    const text = await response.text();

    if (!response.ok) {
      return {
        data: undefined,
        error: new Error(`Response error. status:${response.statusText}`),
      };
    }

    return { data: text, error: undefined };
  } catch (error) {
    return { data: undefined, error: error as Error };
  }
}

function now(): string {
  const datetime = new Date();
  const hour =
    datetime.getHours() >= 0 && datetime.getHours() < 5
      ? 24 + datetime.getHours()
      : datetime.getHours();

  return `${hour.toString().padStart(2, '0')}${datetime.getMinutes().toString().padStart(2, '0')}`;
}

interface Program {
  id: string;
  master_id: string;
  ft: string;
  to: string;
  ftl: string;
  tol: string;
  dur: string;
  title: string;
  url: string;
  url_link: string;
  failed_record: number;
  ts_in_ng: number;
  tsplus_in_ng: number;
  ts_out_ng: number;
  tsplus_out_ng: number;
  info: string;
  pfm: string;
  img: string;
  tag: Array<{ item: { name: string } }>;
  genre: {
    personality: { id: number; name: string };
    program: { id: number; name: string };
  };
  metas: Array<{ meta: { name: string; value: string } }>;
}

interface Station {
  id: string;
  name: string;
  progs: {
    date: string;
    prog: Array<Program>;
  };
}

interface Data {
  title: string;
  time: string;
  img: string;
  info: string;
  pfm: string;
}

interface RadioStations {
  [index: string]: Array<Data>;
}

function analysis(xml: string): RadioStations {
  const data: RadioStations = {};

  const datetime = now();
  const stations = Parser.parse(xml).radiko.stations.station as Array<Station>;

  stations.forEach((station) => {
    const temporary: Array<Data> = [];

    station.progs.prog.forEach((program) => {
      if (program.ftl <= datetime && datetime < program.tol) {
        temporary.push({
          title: program.title,
          time: program.ftl,
          img: program.img,
          info: program.info,
          pfm: program.pfm,
        });
      }
    });

    if (temporary.length === 0 && station.progs.prog.length > 0) {
      const program = station.progs.prog[station.progs.prog.length - 1];

      temporary.push({
        title: program.title,
        time: program.ftl,
        img: program.img,
        info: program.info,
        pfm: program.pfm,
      });
    }

    data[station.name] = temporary;
  });

  return data;
}

async function getSchedule() {
  const { data, error } = await request();
  if (error) {
    throw error;
  }

  const schedule = analysis(data);

  return schedule;
}

export { getSchedule };

export type { Data, RadioStations };
