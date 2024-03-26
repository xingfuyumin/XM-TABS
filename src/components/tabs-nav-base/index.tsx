import React, { forwardRef } from "react";
import { XM_TAB, XM_TABS_NAV, XM_TABS_NAV_REF } from "./props";
import './index.less';
import classnames from 'classnames';
import useData from './hook';
import { DragDropContext, Droppable, Draggable, DraggableProvided } from 'react-beautiful-dnd';

const Index = forwardRef<XM_TABS_NAV_REF, Omit<XM_TABS_NAV, 'ref'>>((props, ref) => {
  const {
    className,
    tabClassName,
    tabKey,
    tabList,
    dragDisabled,
    tabRender,
    addRender,
    tabContextMenuRender,
    tabFixedRender,
    tabCloseRender,
    tabEditRender,
    moreRender,
    extraRender,
    onChange = () => { },
    tabIconRender,
    tabTipRender,
  } = props;
  const {
    tabWidth, showTabList, tabNavRef, tabOperRef, handleDragEnd,
  } = useData(props, ref);

  const addNode = addRender ? addRender() : null;
  const moreNode = moreRender ? moreRender() : null;
  const extraNode = extraRender ? extraRender() : null;

  const tabNodeRender = (tab: XM_TAB, dragging: boolean, provided?: DraggableProvided) => {
    const fixedNode = tabFixedRender ? tabFixedRender(tab) : null;
    const closeNode = tabCloseRender ? tabCloseRender(tab) : null;
    const iconNode = tabIconRender ? tabIconRender(tab) : null;
    const editNode = tabEditRender ? tabEditRender(tab) : null;
    const tabNode =
      <div
        className={classnames(
          'xm-tab',
          tabClassName,
          tabKey === tab.key ? 'xm-tab-active' : '',
          dragging ? 'xm-tab-dragging' : '',
        )}
        ref={provided?.innerRef}
        {...(provided?.dragHandleProps || {})}
        {...(provided?.draggableProps || {})}
        style={{ width: tabWidth, ...(provided?.draggableProps?.style || {}) }}
        onClick={() => tabKey === tab.key ? null : onChange(tab.key, tabList)}
      >
        {
          !!iconNode && <div className="xm-tab-icon">
            {iconNode}
          </div>
        }
        <div className="xm-tab-name">
          {tabRender ? tabRender(tab) : tab.label}
        </div>
        {

        }
        <div className="xm-tab-oper" onClick={e => e.stopPropagation()}>
          {
            tab.fixed ? fixedNode :
              <div className="xm-tab-other" >
                {editNode}
                {tab.closeable ? closeNode : null}
              </div>
          }
          {!!tab.edited && <div className="xm-tab-dot" />}
          <div className={classnames('xm-tab-other', tab.edited ? 'xm-tab-other-show' : '')}>{tab.fixed ? fixedNode : tab.closeable ? closeNode : null}</div>
        </div>
      </div>;
    const node = tabContextMenuRender ? tabContextMenuRender(tab, tabNode) : tabNode;
    return tabTipRender ? tabTipRender(tab, node) : node;
  }

  return (
    <div className={classnames('xm-tabs-nav', className)}>
      <DragDropContext
        onDragEnd={handleDragEnd}
      >
        <Droppable
          droppableId="nav"
          direction="horizontal"
          isDropDisabled={dragDisabled}
          renderClone={(provided, snapshot, descriptor) => {
            const index = descriptor?.source?.index;
            const tab = tabList[index];
            if (!tab) {
              return null;
            }
            return tabNodeRender(tab, true, provided) as any
          }}>
          {
            (dropProvided) => {
              return <div className="xm-tabs-bar" ref={(r) => {
                (tabNavRef as any).current = r;
                dropProvided.innerRef(r);
              }}
                {...dropProvided.droppableProps}>
                <div className="xm-tabs-container">
                  {
                    showTabList?.map((tab, index) => {
                      return <Draggable draggableId={tab.key} index={index} key={tab.key} isDragDisabled={dragDisabled}>
                        {
                          (provided) => tabNodeRender(tab, false, provided) as any
                        }
                      </Draggable>
                    })
                  }
                  {
                    dropProvided.placeholder
                  }
                </div>
                <div className="xm-tabs-oper" ref={tabOperRef}>
                  {
                    !!addNode &&
                    <div className="xm-tabs-add">
                      {addNode}
                    </div>
                  }
                  {
                    !!moreNode && !!addNode && <div className="xm-tabs-split" />
                  }
                  {
                    !!moreNode &&
                    <div className="xm-tabs-more">
                      {moreNode}
                    </div>
                  }
                </div>
              </div>
            }
          }
        </Droppable>
        {
          !!extraNode && <div className="xm-tabs-extra">
            {extraNode}
          </div>
        }
      </DragDropContext>
    </div>
  );
});

export default Index;