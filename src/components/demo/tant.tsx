
import { TabsNavTant, TabsPanelBase } from 'xm-tabs';
import React, { useEffect, useRef } from 'react';
import { useSetState } from 'ahooks';
import { XM_TABS_PANEL_REF } from '../tabs-panel-base/props';
import { TaAllGroupSm } from '@tant/icons';
import { XM_TABS_NAV_REF } from '../tabs-nav-base/props';

export default () => {
  const [state, setState] = useSetState<any>({
    tabList: [],
    tabKey: '',
  });
  const panelRef = useRef<XM_TABS_PANEL_REF>(null);
  const navRef = useRef<XM_TABS_NAV_REF>(null);
  return (
    <div style={{
      display: 'flex',
      height: 400,
      flexDirection: 'column',
    }}>
      <TabsNavTant
        tabKey={state.tabKey}
        tabList={state.tabList}
        onChange={(tabKey, tabList) => {
          console.log(tabKey, tabList);
          setState({ tabKey, tabList });
        }}
        onTabAdd={() => ({
          label: '空白标签页',
          closeable: true,
          fixed: false,
          key: String(Date.now()),
          lastOpenTime: Date.now(),
        })}
        ref={navRef}
        tabIconRender={() => {
          return <TaAllGroupSm style={{ color: 'blue' }} />
        }}
        panel={panelRef.current}
      />
      <TabsPanelBase
        ref={panelRef}
      >
        {(tabKey, data, handleUpdate) => {
          const tab = state.tabList.find(t => t.key === tabKey);
          return <div
            style={{ height: '100%' }}
            suppressContentEditableWarning
            contentEditable
            onInput={(e) => {
              navRef.current?.updateTab(tabKey, { edited: true })
            }}
          >{tab?.label}</div>;
        }}
      </TabsPanelBase>
    </div>
  );
}