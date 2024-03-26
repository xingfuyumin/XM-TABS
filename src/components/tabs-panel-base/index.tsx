import React, { forwardRef } from "react";
import { XM_TABS_PANEL, XM_TABS_PANEL_REF } from "./props";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
const Index = forwardRef<XM_TABS_PANEL_REF, Omit<XM_TABS_PANEL, 'ref'>>((props, ref) => {
  const {
    children,
  } = props;
  const {
    list, tabKey, handleUpdate,
  } = useData(props, ref);

  return (
    <div className={classnames(
      'xm-tabs-panels',
    )}>
      {
        list.map(d => {
          return <div
            key={d.tabKey}
            className={classnames(
              'xm-tabs-panel',
              tabKey === d.tabKey ? 'xm-tabs-panel-active' : ''
            )}
          >
            {children(d.tabKey, d.data, handleUpdate)}
          </div>;
        })
      }
    </div>
  );
});

export default Index;