import { invoke } from '@tauri-apps/api/core';

async function changeMinimum(minimunize: boolean) {
  return invoke('change_minimum', { minimunize });
}

export default changeMinimum;
