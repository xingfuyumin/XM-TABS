
import { useSetState } from 'ahooks';
import localforage from 'localforage';
import { useCallback, useEffect } from 'react';

export interface TAB_INFO {
  name: string | object;
  closeable?: boolean;
  stick?: boolean;
  key: string | number;
  hasEdited?: boolean;
  lastOpenTime?: number;
}

interface DB_INFO {
  activeTabKey?: TAB_INFO['key'],
  tabList: TAB_INFO[],
}

const UPDATE_MAP: Record<string, any[]> = {};

export const TAB_PREFIX = (id: TAB_INFO['key']) => `XM_TABS_TAB_${id}`;

export const CONTENT_PREFIX = (id: TAB_INFO['key'], tabKey: TAB_INFO['key']) => `XM_TABS_${id}_CONTENT_${tabKey}`;

export default (id: string | number) => {
  const [state, setState] = useSetState<DB_INFO>({ tabList: [] });

  const updateFunc = useCallback(setState, [])
  const init = async (data?: DB_INFO) => {
    if (data) {
      await localforage.setItem(TAB_PREFIX(id), data);
    }
    let db: DB_INFO | null = await localforage.getItem(TAB_PREFIX(id));
    if (!db) {
      db = {
        tabList: [],
      };
      await localforage.setItem(TAB_PREFIX(id), db);
    }
    setState(db);
  }
  const addTab = async (tab: TAB_INFO, focus?: boolean) => {
    let db: DB_INFO | null = await localforage.getItem(TAB_PREFIX(id));
    if (!db) {
      return;
    }
    db.tabList.push(tab);
    if (focus) {
      db.activeTabKey = tab.key;
    }
    await localforage.setItem(TAB_PREFIX(id), db);
    UPDATE_MAP[id]?.forEach(func => {
      func(db);
    });
  }
  const deleteTab = async (tabKey: TAB_INFO['key'], focus: 'last' | 'lastOpen' = 'last') => {
    let db: DB_INFO | null = await localforage.getItem(TAB_PREFIX(id));
    if (!db) {
      return;
    }
    const idx = db.tabList?.findIndex(d => d.key === tabKey);
    if (idx > -1) {
      db.tabList.splice(idx, 1);
    }
    const oldIdx = db.tabList?.findIndex(d => d.key === db.activeTabKey);
    if (oldIdx === -1 || oldIdx === undefined) {
      if (focus === 'last') {
        const newIdx = idx - 1 < 0 ? 0 : idx - 1;
        db.activeTabKey = db.tabList?.[newIdx]?.key;
      } else if (focus === 'lastOpen') {
        const sortKeyList = db.tabList?.sort((a, b) => (a.lastOpenTime || 0) - (b.lastOpenTime || 0))?.map(d => d.key);
        db.activeTabKey = db.tabList?.[sortKeyList.length - 1]?.key;
      }
    }
    await localforage.setItem(TAB_PREFIX(id), db);
    await localforage.removeItem(CONTENT_PREFIX(id, tabKey));
    UPDATE_MAP[id]?.forEach(func => {
      func(db);
    });
  }
  const updateTab = async (tabKey: TAB_INFO['key'], tab: Omit<Partial<TAB_INFO>, 'key'>) => {
    let db: DB_INFO | null = await localforage.getItem(TAB_PREFIX(id));
    if (!db) {
      return;
    }
    const oldTab: TAB_INFO | undefined = db.tabList?.find(d => d.key === tabKey);
    if (!oldTab) {
      return;
    }
    Object.entries(tab).forEach(([k, v]: any[]) => {
      (oldTab as any)[k] = v;
    })
    await localforage.setItem(TAB_PREFIX(id), db);
    UPDATE_MAP[id]?.forEach(func => {
      func(db);
    });
  }
  const moveTab = async (oldIndex: number, newIndex: number) => {
    let db: DB_INFO | null = await localforage.getItem(TAB_PREFIX(id));
    if (!db) {
      return;
    }
    const tab = db.tabList?.[oldIndex];
    if (!tab) {
      return;
    }
    db.tabList.splice(oldIndex, 1);
    db.tabList.splice(newIndex, 0, tab);
    await localforage.setItem(TAB_PREFIX(id), db);
    UPDATE_MAP[id]?.forEach(func => {
      func(db);
    });
  }
  const clear = async () => {
    let db: DB_INFO | null = await localforage.getItem(TAB_PREFIX(id));
    if (!db) {
      return;
    }
    // todo 删除提醒
    db.activeTabKey = undefined;
    db.tabList = [];
    await localforage.setItem(TAB_PREFIX(id), db);
    UPDATE_MAP[id]?.forEach(func => {
      func(db);
    });
  }
  const clearOther = async (tabKey: TAB_INFO['key']) => {
    let db: DB_INFO | null = await localforage.getItem(TAB_PREFIX(id));
    if (!db) {
      return;
    }
    const oldTab: TAB_INFO | undefined = db.tabList?.find(d => d.key === tabKey);
    if (!oldTab) {
      return;
    }
    // todo 删除提醒
    db.activeTabKey = oldTab.key;
    db.tabList = [oldTab];
    await localforage.setItem(TAB_PREFIX(id), db);
    UPDATE_MAP[id]?.forEach(func => {
      func(db);
    });
  }
  const clearRight = async (tabKey: TAB_INFO['key']) => {
    let db: DB_INFO | null = await localforage.getItem(TAB_PREFIX(id));
    if (!db) {
      return;
    }
    const oldTab: TAB_INFO | undefined = db.tabList?.find(d => d.key === tabKey);
    if (!oldTab) {
      return;
    }
    const idx = db.tabList.findIndex(d => d.key === tabKey);

    db.tabList = [...db.tabList.slice(0, idx + 1), ...db.tabList.slice(idx + 1).filter(d => !d.stick)]
    // todo 删除提醒
    if (!oldTab) {
      return;
    }
    db.activeTabKey = oldTab.key;
    db.tabList = [oldTab];
    await localforage.setItem(TAB_PREFIX(id), db);
    UPDATE_MAP[id]?.forEach(func => {
      func(db);
    });
  }
  useEffect(() => {
    init();
    if (!UPDATE_MAP[id]) {
      UPDATE_MAP[id] = [];
    }
    UPDATE_MAP[id].push(updateFunc);
    return () => {
      const idx = UPDATE_MAP[id]?.findIndex(d => d === updateFunc);
      if (idx > -1) {
        UPDATE_MAP[id].splice(idx, 1);
      }
    }
  }, []);
  return {
    ...state,
    addTab,
    deleteTab,
    updateTab,
    moveTab,
    clear,
    clearOther,
    clearRight,
  }
}