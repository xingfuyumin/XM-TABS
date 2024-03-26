import React, { useImperativeHandle } from "react";
import { useSetState } from "ahooks";
import { XM_TABS_PANEL, XM_TABS_PANEL_REF } from './props'
import { XM_TAB } from "../tabs-nav-base/props";

export default ({
  cacheNum = 5, fixedCacheNum = 10, onChange = () => {}, onInit = () => null,
}: Omit<XM_TABS_PANEL, 'ref'>, ref: React.ForwardedRef<XM_TABS_PANEL_REF>) => {
  const [state, setState] = useSetState<{
    list: XM_TABS_PANEL_REF['list'],
    tabKey: XM_TAB['key'],
  }>({
    list: [],
    tabKey: '',
  });
  const handleOpen = async (tabKey: XM_TAB['key'], tab?: XM_TAB) => {
    const d = state.list.find(d => d.tabKey === tabKey);
    if (!d) {
      const obj = {
        tabKey: tabKey,
        data: null,
        hide: false,
      };
      state.list.push(obj);

      const newList = [];
      let num = 0;
      let fixedNum = 0;
      for (let i = state.list.length - 1; i >= 0; i -= 1) {
        if (state.list[i].fixed && fixedNum < fixedCacheNum) {
          newList.unshift(state.list[i]);
          fixedNum += 1;
          continue;
        }
        if (num < cacheNum) {
          newList.unshift(state.list[i]);
          num += 1;
          continue;
        }
      }
      setState({ list: newList, tabKey });
      onChange(tabKey, obj?.data);
      if (obj.tabKey && tab) {
        obj.data = await onInit(obj.tabKey, tab);
        setState({ list: newList });
        onChange(tabKey, obj?.data);
      }
      return;
    } else {
      d.fixed = tab?.fixed;
      setState({ list: state.list, tabKey });
    }
    onChange(tabKey, d?.data);
  }
  const handleUpdate = async (tabKey: XM_TAB['key'], data: any) => {
    const d = state.list.find(d => d.tabKey === tabKey);
    if (!d) {
      return;
    }
    d.data = data;
    setState({ list: state.list });
    onChange(tabKey, d?.data);
  }
  const handleClose = async (tabKey: XM_TAB['key']) => {
    setState({ list: state.list.filter(d => d.tabKey !== tabKey) });
    onChange(tabKey, null, true);
  }

  useImperativeHandle(ref, () => {
    return {
      list: state.list,
      tabKey: state.tabKey,
      open: handleOpen,
      update: handleUpdate,
      close: handleClose,
    }
  }, [state.list, state.tabKey]);
  return {
    handleUpdate,
    ...state,
  }
}