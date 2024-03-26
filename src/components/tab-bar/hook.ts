import { useSetState, useSize } from "ahooks";
import useTabs from "../hooks/useTabs"
import { PROPS } from "./props";
import { useEffect, useMemo, useRef } from "react";

export interface TAB_INFO {
  name: string | object;
  closeable?: boolean;
  stick?: boolean;
  key: string | number;
  hasEdited?: boolean;
  lastOpenTime?: number;
}

export interface TAB_DATA {
  activeTabKey?: TAB_INFO['key'],
  tabList: TAB_INFO[],
}

export default (props: PROPS) => {
  const {
    storageId,
    maxTabWidth = 240, minTabWidth = 100,
    showAdd = true, showMore = true, showHistory = true,
    tabRender = () => null, intlRender = (v) => v,
    onTabAdd, onTabDelete, tabContextMenuRender, onTabContextMenuClick,
  } = props;
  const {
    activeTabKey,
    tabList,
    addTab,
    updateTab,
    clearOther,
    clearRight,
    clear,
    deleteTab,
  } = useTabs(storageId);
  const [state, setState] = useSetState<TAB_DATA>({ tabList: [] });
  const tabNavRef = useRef(null);
  const tabOperRef = useRef(null);
  const tabNavSize = useSize(tabNavRef);
  const tabOperSize = useSize(tabOperRef);
  const handleAdd = async () => {
    if (onTabAdd) {
      await onTabAdd();
      return;
    }
    addTab({
      name: '空白标签页',
      closeable: true,
      stick: false,
      key: Date.now(),
      lastOpenTime: Date.now(),
    }, true);
  }
  const handleDelete = async (tabKey: TAB_INFO['key']) => {
    if (onTabDelete) {
      await onTabDelete(tabKey);
      return;
    }
    deleteTab(tabKey);
  }
  const handleTabContextMenuRender = (tab: TAB_INFO) => {
    if (tabContextMenuRender) {
      return tabContextMenuRender(tab);
    }
    const contextMenus = [
      {
        key: 'stick',
        label: intlRender(tab.stick ? '取消固定' : '固定标签页'),
      },
      {
        type: 'divider',
      },
      {
        key: 'closeAll',
        label: intlRender('关闭所有标签页'),
      },
      {
        key: 'closeOther',
        label: intlRender('关闭其他标签页'),
      },
      {
        key: 'closeRight',
        label: intlRender('关闭右侧标签页'),
      },
    ];
    if (tab.closeable) {
      contextMenus.splice(2, 0, {
        key: 'close',
        label: intlRender('关闭当前标签页'),
      });
    }
    return contextMenus;
  }
  const handleTabContextMenuClick = (tab: TAB_INFO, key: string) => {
    if (onTabContextMenuClick) {
      onTabContextMenuClick(tab, key);
      return;
    }
    if (key === 'stick') {
      updateTab(tab.key, {
        stick: !tab.stick,
      });
      return;
    }
    if (key === 'closeAll') {
      clear();
      return;
    }
    if (key === 'closeOther') {
      clearOther(tab.key);
      return;
    }
    if (key === 'closeRight') {
      clearRight(tab.key);
      return;
    }
    if (key === 'close') {
      handleDelete(tab.key);
      return;
    }
  }
  const [tabWidth, tabNum] = useMemo(() => {
    if (!tabNavSize?.width || !tabList?.length) {
      return [0, 0];
    }
    const maxWidth = props.maxTabWidth || 240;
    const minWidth = props.minTabWidth || 100;
    const length = tabList?.length;
    const width = tabNavSize?.width - (tabOperSize?.width || 0);
    if (length * maxWidth <= width) {
      return [maxWidth, length];
    }
    if (length * minWidth <= width) {
      return [width / length, length];
    }
    return [minWidth, Math.floor(width / minWidth)];
  }, [tabNavSize?.width, tabOperSize?.width, tabList?.length]);
  const showTabList = useMemo(() => tabList.slice(0, tabNum), [tabList, tabNum]);
  useEffect(() => {
    
  }, []);
  return {
    activeTabKey,
    tabList,
    tabWidth,
    handleAdd,
    handleDelete,
    tabNavRef,
    tabOperRef,
    tabNum,
    showTabList,
    handleTabContextMenuRender,
    handleTabContextMenuClick,
  }
}