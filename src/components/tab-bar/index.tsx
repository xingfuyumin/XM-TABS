import React, { FC } from "react";
import { PROPS } from "./props";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import { Dropdown, Button } from '@tant/ui-next';
import { TaSticker, TaClose, TaAdd1 } from '@tant/icons'

const Index: FC<PROPS> = (props) => {
  const {
    maxTabNum = 9999, className,
    showAdd = true,
    tabRender = () => null,
  } = props;
  const {
    tabWidth, tabNum, showTabList,
    tabList, activeTabKey, tabNavRef, tabOperRef,
    handleAdd, handleDelete, handleTabContextMenuRender, handleTabContextMenuClick,
  } = useData(props);
  return (
    <div className={classnames('xm-tabs-bar', className)}>
      <div className="xm-tabs-nav" ref={tabNavRef}>
        <div className="xm-tabs-container">
          {
            showTabList?.map(tab => {
              return (
                <Dropdown
                  key={tab.key}
                  trigger={["contextMenu"]}
                  menu={{
                    items: handleTabContextMenuRender(tab) as any,
                    onClick: ({ key }) => handleTabContextMenuClick(tab, key),
                  }}
                >
                  <div
                    className={classnames(
                      'xm-tab',
                      activeTabKey === tab.key ? 'xm-tab-active' : ''
                    )}
                    style={{ width: tabWidth }}
                  >
                    <div className="xm-tab-name">
                      {tabRender(tab.name) || tab.name.toString()}
                    </div>
                    <div className="xm-tab-oper">
                      {tab.stick ? <TaSticker className="xm-tab-stick" /> : tab.closeable ? <TaClose className="xm-tab-close" onClick={() => handleDelete(tab.key)} /> : null}
                    </div>
                  </div>
                </Dropdown>
              );
            })
          }
        </div>
        <div className="xm-tabs-oper" ref={tabOperRef}>
          {
            showAdd &&
            <div className="xm-tabs-add">
              <Button onClick={handleAdd} icon={<TaAdd1 />} type="text" disabled={tabList.length >= maxTabNum}/>
            </div>
          }
          {
            showAdd && <div className="xm-tabs-split" />
          }
          <div className="xm-tabs-more">

          </div>
        </div>
      </div>
      <div className="xm-tabs-extra">

      </div>
    </div>
  );
};

export default Index;