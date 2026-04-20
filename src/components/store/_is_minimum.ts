import { invoke } from '@tauri-apps/api/core';

async function is_minimum(): Promise<boolean> {
  return invoke('is_minimum');
}

export default is_minimum;
