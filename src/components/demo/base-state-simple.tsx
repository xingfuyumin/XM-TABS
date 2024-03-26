// import { TabsBarBase } from 'xm-tabs';
// import React from 'react';
// import { useSetState } from 'ahooks';
// import { TAB_DATA } from '../tabs-bar-base/hook';

// export default () => {
//   const [state, setState] = useSetState<TAB_DATA>({
//     tabList: [],
//     historyTabList: [],
//     activeTabKey: undefined,
//   });
//   return <TabsBarBase
//     activeTabKey={state.activeTabKey}
//     tabList={state.tabList}
//     historyTabList={state.historyTabList}
//     onTabChange={(activeTabKey, tabList, historyTabList) => {
//       console.log();
//       setState({ activeTabKey, tabList, historyTabList});
//     }}
//     onTabAdd={() => {
//       const k = Date.now();
//       return {
//         name: k,
//         closeable: true,
//         stick: false,
//         key: k,
//         lastOpenTime: k,
//       };
//     }}
//   />
// }