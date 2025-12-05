async function getStore() {
  const Store = (await import('electron-store')).default;

  // eslint-disable-next-line no-undef
  const store = new Store<StoreType>({
    defaults: { pinned: false },
  });

  return store;
}

export default getStore;
