interface ChannelData {
  channels: Array<Channel>;
}

interface Channel {
  id: string;
  name: string;
  programs: Array<Program>;
}

interface Program {
  title: string;
  time: string;
  img: string;
  info: string;
  pfm: string;
}

export type { Channel, ChannelData, Program };
