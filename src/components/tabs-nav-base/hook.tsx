import React, { useEffect, useImperativeHandle } from "react";
import { useSize } from "ahooks";
import { XM_TAB, XM_TABS_NAV, XM_TABS_NAV_REF } from './props'
import { useMemo, useRef } from "react";
import { DropResult } from "react-beautiful-dnd";

export default ({
  tabKey, tabList, maxTabWidth = 240, minTabWidth = 100, onChange = () => { },
  onDrag, panel,
}: XM_TABS_NAV, ref: React.ForwardedRef<XM_TABS_NAV_REF>) => {
  const tabNavRef = useRef(null);
  const tabOperRef = useRef(null);
  const tabNavSize = useSize(tabNavRef);
  const tabOperSize = useSize(tabOperRef);
  const [tabWidth, tabNum] = useMemo(() => {
    if (!tabNavSize?.width || !tabList?.length || !minTabWidth || !maxTabWidth) {
      return [0, 0];
    }
    const length = tabList?.length;
    const width = tabNavSize?.width - (tabOperSize?.width || 0);
    if (length * maxTabWidth <= width) {
      return [maxTabWidth, length];
    }
    if (length * minTabWidth <= width) {
      return [width / length, length];
    }
    const num = Math.floor(width / minTabWidth);
    return [width / num, num];
  }, [tabNavSize?.width, tabOperSize?.width, tabList?.length]);
  const cacheRef = useRef<{
    key: XM_TAB['key'], // 解决闭包问题
    list: XM_TAB[],
  }>({
    key: tabKey || '',
    list: tabList,
  });
  cacheRef.current.key = tabKey || '';
  cacheRef.current.list = tabList;
  const handleFixedTabSort = (list: XM_TAB[]) => {
    const fixedList = list.filter(d => d.fixed);
    const unFixedList = list.filter(d => !d.fixed);
    return [...fixedList, ...unFixedList];
  }
  const showTabList = useMemo(() => tabList.slice(0, tabNum), [tabList, tabNum]);

  const handleUpdate = async (oldTab: XM_TAB, newTab: Partial<XM_TAB>) => {
    let flag = false;
    Object.entries(newTab).forEach(([k, v]) => {
      if ((oldTab as any)[k] === v) {
        return;
      }
      (oldTab as any)[k] = v;
      flag = true;
    });
    if (flag) {
      onChange(cacheRef.current.key, [...cacheRef.current.list]);
    }
  }
  const handleUpdateByKey = async (tabKey: XM_TAB['key'], newTab: Partial<XM_TAB>) => {
    const tab = cacheRef.current.list?.find(t => t.key === tabKey);
    if (!tab) {
      return;
    }
    handleUpdate(tab, newTab);
  }
  const handleAdd = async (tab: XM_TAB) => {
    if (tab.key === null || tab.key === undefined || tab.key === '' || Number.isNaN(tab.key)) { // key无效时跳过
      return;
    }
    const oldTab = cacheRef.current.list.find(t => t.key === tab.key);
    if (oldTab) { // key重复时跳更新并跳转
      handleUpdate(tab, tab);
      onChange(tab.key, [...cacheRef.current.list]);
      return;
    }
    cacheRef.current.list.push(tab);
    onChange(tab.key, [...cacheRef.current.list]);
  }
  const handleClose = async (tab: XM_TAB, check: (tab: XM_TAB) => Promise<boolean> | boolean = () => true) => {
    if (!await check(tab)) {
      return false;
    }
    const idx = cacheRef.current.list.findIndex(t => t.key === tab.key);
    cacheRef.current.list.splice(idx, 1);
    let newKey = cacheRef.current.key;
    const oldIdx = cacheRef.current.list.findIndex(t => t.key === cacheRef.current.key);
    if (oldIdx === -1) {
      if (!cacheRef.current.list[idx]) {
        const newIdx = idx - 1 < 0 ? 0 : idx - 1;
        newKey = cacheRef.current.list[newIdx]?.key;
      } else {
        newKey = cacheRef.current.list[idx]?.key;
      }
    }
    onChange(newKey, [...cacheRef.current.list]);
    panel?.close(tab.key);
    return true;
  }
  const handleCloseAll = async (check: (tab: XM_TAB) => Promise<boolean> | boolean = () => true) => {
    let tabFilterList = cacheRef.current.list.filter(d => !d.fixed);
    while (tabFilterList.length > 0) {
      const t = tabFilterList[0];
      if (!t) {
        break;
      }
      if (!await handleClose(t, check)) {
        break;
      }
      tabFilterList = cacheRef.current.list.filter(d => !d.fixed);
    }
  }
  const handleCloseOther = async (tab: XM_TAB, check: (tab: XM_TAB) => Promise<boolean> | boolean = () => true) => {
    while (cacheRef.current.list.length > 1) {
      const t = cacheRef.current.list.find(t => t.key !== tab.key && !t.fixed);
      if (!t) {
        break;
      }
      if (!await handleClose(t, check)) {
        break;
      }
    }
  }
  const handleCloseRight = async (tab: XM_TAB, check: (tab: XM_TAB) => Promise<boolean> | boolean = () => true) => {
    const idx = cacheRef.current.list.findIndex(t => t.key === tab.key);
    let deleteList = cacheRef.current.list.slice(idx + 1).filter(d => !d.fixed);
    while (deleteList.length > 0) {
      const t = deleteList[0];
      if (!t) {
        break;
      }
      if (!await handleClose(t, check)) {
        break;
      }
      deleteList = cacheRef.current.list.slice(idx + 1);
    }
  }
  const handleFixed = async (tab: XM_TAB, fixed: boolean) => {
    handleUpdate(tab, { fixed });
    panel?.open(cacheRef.current.key, tab);
  }
  const handleDrag = async (sourceDropId: string, sourceTab: XM_TAB, targetDropId: string, targetTab: XM_TAB) => {
    if (!sourceDropId || !sourceTab || !targetDropId || !targetTab) {
      return;
    }
    const sourceIndex = cacheRef.current.list.findIndex(t => t.key === sourceTab.key);
    const targetIndex = cacheRef.current.list.findIndex(t => t.key === targetTab.key);
    if (onDrag) {
      onDrag(sourceDropId, sourceTab, targetDropId, targetTab);
      return;
    }
    cacheRef.current.list.splice(sourceIndex, 1);
    cacheRef.current.list.splice(targetIndex, 0, sourceTab);
    if (sourceTab.fixed && cacheRef.current.list[targetIndex - 1]) {
      targetTab.fixed = cacheRef.current.list[targetIndex - 1].fixed;
    }
    if (!sourceTab.fixed && cacheRef.current.list[targetIndex + 1]) {
      targetTab.fixed = cacheRef.current.list[targetIndex + 1].fixed;
    }
    onChange(tabKey, [...cacheRef.current.list]);
  }
  const handleDragEnd = async (data: DropResult) => {
    const sourceDropId = data?.source?.droppableId;
    const sourceTab = tabList[data?.source?.index];
    const targetDropId = data?.destination?.droppableId || '';
    const targetTab = tabList[data?.destination?.index ?? -1];
    handleDrag(sourceDropId, sourceTab, targetDropId, targetTab);
  }
  useImperativeHandle(ref, () => {
    return {
      addTab: handleAdd,
      updateTab: handleUpdateByKey,
      closeTab: handleClose,
      fixedTab: handleFixed,
      closeAll: handleCloseAll,
      closeOther: handleCloseOther,
      closeRight: handleCloseRight,
      drag: handleDrag,
    };
  }, []);
  useEffect(() => {
    let flag = false;
    tabList.forEach((d, i) => {
      if (d.fixed && (tabList[i - 1] && !tabList[i - 1].fixed)) {
        flag = true;
      }
    });
    if (flag) {
      onChange(tabKey, handleFixedTabSort(tabList));
    }
  }, [tabList]);
  useEffect(() => {
    const tab = tabList.find(t => t.key === tabKey);
    panel?.open(tabKey || '', tab);
  }, [tabKey, panel]);
  return {
    tabWidth,
    tabNavRef,
    tabOperRef,
    showTabList,
    handleDragEnd,
  }
}