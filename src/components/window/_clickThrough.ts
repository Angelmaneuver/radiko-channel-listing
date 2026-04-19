import { invoke } from '@tauri-apps/api/core';

async function clickThrough(through: boolean) {
  return invoke('set_click_through', { ignore: through });
}

export default clickThrough;
