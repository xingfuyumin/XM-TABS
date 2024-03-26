import React, { forwardRef } from "react";
import { XM_TABS_NAV_TANT } from "./props";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import { Dropdown, Button, Tooltip } from '@tant/ui-next';
import { TaSticker, TaClose, TaAdd1 } from '@tant/icons'
import { XM_TAB, XM_TABS_NAV_REF } from "../tabs-nav-base/props";
import { TabsNavBase } from "xm-tabs";

const Index = forwardRef<XM_TABS_NAV_REF, Omit<XM_TABS_NAV_TANT, 'ref'>>((props, ref) => {
  const {
    maxTabNum = 9999, className, tabList, tabClassName,
    tabRender, tabIconRender, tabContextMenuRender, tabCloseRender, tabFixedRender, addRender, tabTipRender,
    ...extraProps
  } = props;
  const {
    navRef, hoverOpen, setHoverOpen, contextOpen, setContextOpen,
    handleAdd, handleClose, handleTabContextMenuRender, handleTabContextMenuClick,
  } = useData(props, ref);
  const defaultTabIconRender = (tab: XM_TAB) => {
    if (tabIconRender) {
      return tabIconRender(tab);
    }
    return null;
  };
  const defaultTabRender = (tab: XM_TAB) => {
    if (tabRender) {
      return tabRender(tab);
    }
    return tab.label;
  };
  const defautltTabContextMenuRender = (tab: XM_TAB, tabNode: React.ReactNode) => {
    if (tabContextMenuRender) {
      return tabContextMenuRender(tab, tabNode);
    }
    return (
      <Dropdown
        key={tab.key}
        trigger={["contextMenu"]}
        menu={{
          items: handleTabContextMenuRender(tab) as any,
          onClick: ({ key }) => handleTabContextMenuClick(tab, key),
        }}
        open={contextOpen === tab.key}
        onVisibleChange={v => {
          if (v) {
            setHoverOpen('');
          }
          setContextOpen(v ? tab.key : '')
        }}
      >{tabNode}</Dropdown>
    );
  }
  const defaultTabTipRender = (tab: XM_TAB, tabNode: React.ReactNode) => {
    if (tabTipRender) {
      return tabTipRender(tab, tabNode);
    }
    return (
      <Tooltip
        title={tab.label}
        mouseEnterDelay={0.5}
        open={hoverOpen === tab.key && contextOpen !== tab.key}
        onOpenChange={v => {
          setHoverOpen(v && contextOpen !== tab.key ? tab.key : '')
        }}
      >{tabNode}</Tooltip>
    );
  }
  const defaultTabCloseRender = (tab: XM_TAB) => {
    if (tabCloseRender) {
      return tabCloseRender(tab);
    }
    return <TaClose className="xm-tab-close" onClick={() => handleClose(tab)} />;
  }
  const defaultTabFixedRender = (tab: XM_TAB) => {
    if (tabFixedRender) {
      return tabFixedRender(tab);
    }
    return <TaSticker className="xm-tab-fixed" onClick={() => handleClose(tab)} />;
  }
  const defaultAddRender = () => {
    if (addRender) {
      return addRender();
    }
    return <Button onClick={handleAdd} icon={<TaAdd1 />} type="text" disabled={tabList.length >= maxTabNum} />
  }
  return (
    <TabsNavBase
      ref={navRef}
      tabList={tabList}
      className={classnames(className, 'xm-tabs—nav-tant')}
      tabClassName={classnames(tabClassName, 'xm-tab-tant')}
      tabIconRender={defaultTabIconRender}
      tabRender={defaultTabRender}
      tabContextMenuRender={defautltTabContextMenuRender}
      tabCloseRender={defaultTabCloseRender}
      tabFixedRender={defaultTabFixedRender}
      tabTipRender={defaultTabTipRender}
      addRender={defaultAddRender}
      {...extraProps}
    />
  );
});

export default Index;