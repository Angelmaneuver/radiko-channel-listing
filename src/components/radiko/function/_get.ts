import { invoke } from '@tauri-apps/api/core';

import { ChannelData } from '../interface';

async function get(): Promise<[ChannelData, undefined] | [undefined, string]> {
  const data = await invoke<ChannelData | string>('fetch');

  if (typeof data === 'string') {
    return [undefined, data];
  } else {
    return [data, undefined];
  }
}

export default get;
