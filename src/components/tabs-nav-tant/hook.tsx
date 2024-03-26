import { XM_TABS_NAV_TANT } from "./props";
import { useImperativeHandle, useRef, useState } from "react";
import { XM_TAB, XM_TABS_NAV_REF } from "../tabs-nav-base/props";


export default (props: XM_TABS_NAV_TANT, ref: React.ForwardedRef<XM_TABS_NAV_REF>) => {
  const {
    onTabAdd, onTabClose = () => true, onIntl = v => v,
  } = props;
  const navRef = useRef<XM_TABS_NAV_REF>({});
  const [hoverOpen, setHoverOpen] = useState('');
  const [contextOpen, setContextOpen] = useState('');

  const closeAll = () => navRef.current.closeAll ? navRef.current.closeAll(onTabClose) : undefined;
  const closeOther = (tab: XM_TAB) => navRef.current.closeOther ? navRef.current.closeOther(tab, onTabClose) : undefined;
  const closeRight = (tab: XM_TAB) => navRef.current.closeRight ? navRef.current.closeRight(tab, onTabClose) : undefined;
  const handleAdd = async () => {
    const tab = onTabAdd ? await onTabAdd() : null;
    if (tab && navRef?.current?.addTab) {
      navRef.current.addTab(tab);
    }
  }
  const handleClose = async (tab: XM_TAB) => {
    if (tab && navRef?.current?.closeTab) {
      return navRef?.current?.closeTab(tab, onTabClose);
    }
    return true;
  }
  const handleTabContextMenuRender = (tab: XM_TAB) => {
    const contextMenus = [
      {
        key: 'tab-fixed',
        label: onIntl(tab.fixed ? '取消固定' : '固定标签页'),
      },
      {
        type: 'divider',
      },
      {
        key: 'tab-close-all',
        label: onIntl('关闭所有标签页'),
      },
      {
        key: 'tab-close-other',
        label: onIntl('关闭其他标签页'),
      },
      {
        key: 'tab-close-right',
        label: onIntl('关闭右侧标签页'),
      },
    ];
    if (tab.closeable) {
      contextMenus.splice(2, 0, {
        key: 'tab-close',
        label: onIntl('关闭当前标签页'),
      });
    }
    return contextMenus;
  }
  const handleTabContextMenuClick = (tab: XM_TAB, key: string) => {
    if (key === 'tab-fixed' && navRef.current?.fixedTab) {
      navRef.current.fixedTab(tab, !tab.stick);
      return;
    }
    if (key === 'tab-close-all') {
      closeAll();
      return;
    }
    if (key === 'tab-close-other') {
      closeOther(tab);
      return;
    }
    if (key === 'tab-close-right') {
      closeRight(tab);
      return;
    }
    if (key === 'tab-close') {
      handleClose(tab);
      return;
    }
  }

  useImperativeHandle(ref, () => {
    return {
      ...navRef.current,
      closeAll: () => navRef.current.closeAll ? navRef.current.closeAll(onTabClose) : undefined,
      closeOther: (tab: XM_TAB) => navRef.current.closeOther ? navRef.current.closeOther(tab, onTabClose) : undefined,
      closeRight: (tab: XM_TAB) => navRef.current.closeRight ? navRef.current.closeRight(tab, onTabClose) : undefined,
      closeTab: handleClose,
    };
  }, []);
  return {
    handleAdd,
    handleClose,
    handleTabContextMenuRender,
    handleTabContextMenuClick,
    navRef,
    hoverOpen,
    contextOpen,
    setHoverOpen,
    setContextOpen,
  }
}