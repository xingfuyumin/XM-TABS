import { ReactNode } from "react";
import { XM_TABS_PANEL_REF } from "../tabs-panel-base/props";


export interface XM_TAB {
  /**
   * 标签的唯一标识
   */
  key: string;
  /**
   * 标签的名称
   */
  label: string;
  /**
   * 标签是否可关闭
   */
  closeable?: boolean;
  /**
   * 标签是否固定
   */
  fixed?: boolean;
  /**
   * 标签是否已编辑
   */
  edited?: boolean;
  [k: string]: any;
}

export interface XM_TABS_NAV_REF {
  /**
   * 新增标签
   * @param tab 
   * @returns 
   */
  addTab?: (tab: XM_TAB) => void | Promise<void>;
  /**
   * 更新标签信息
   * @param oldTab 
   * @param newTab 
   * @returns 
   */
  updateTab?: (tabKey: XM_TAB['key'], newTab: Partial<XM_TAB>) => void | Promise<void>;
  /**
   * 关闭标签
   * @param tab 
   * @param check 
   * @returns 
   */
  closeTab?: (tab: XM_TAB, check: (tab: XM_TAB) => boolean | Promise<boolean>) => boolean | Promise<boolean>;
  /**
   * 固定/取消固定标签
   * @param tab 
   * @param fixed 
   * @returns 
   */
  fixedTab?: (tab: XM_TAB, fixed: boolean) => void | Promise<void>;
  /**
   * 关闭所有标签
   * @param check 
   * @returns 
   */
  closeAll?: (check: (tab: XM_TAB) => boolean | Promise<boolean>) => void | Promise<void>;
  /**
   * 关闭其他标签
   * @param tab 
   * @param check 
   * @returns 
   */
  closeOther?: (tab: XM_TAB, check: (tab: XM_TAB) => boolean | Promise<boolean>) => void | Promise<void>;
  /**
   * 关闭右侧标签
   * @param tab 
   * @param check 
   * @returns 
   */
  closeRight?: (tab: XM_TAB, check: (tab: XM_TAB) => boolean | Promise<boolean>) => void | Promise<void>;
  /**
   * 标签拖拽
   * @returns 
   */
  drag?: (sourceDropId: string, sourceTab: XM_TAB, targetDropId: string, targetTab: XM_TAB) => void | Promise<void>;
}

export  interface XM_TABS_NAV {
  /**
   * 当前活动标签key，需要唯一
   */
  tabKey?: XM_TAB['key'],
  /**
   * 标签列表
   */
  tabList: XM_TAB[],
  /**
   * 组件样式
   */
  className?: string;
  /**
   * 标签样式
   */
  tabClassName?: string;
  /**
   * 最大标签宽度
   */
  maxTabWidth?: number;
  /**
   * 最小标签宽度
   */
  minTabWidth?: number;
  /**
   * 提供标签操作函数，会触发onChange函数提供最新的数据
   */
  ref?: XM_TABS_NAV_REF;
  /**
   * 禁止标签拖拽
   */
  dragDisabled?: boolean;
  /**
   * 面板数据
   */
  panel?: XM_TABS_PANEL_REF | null;
  /**
   * 自定义标签渲染函数
   * @param tab 
   * @returns 
   */
  tabRender?: (tab: XM_TAB) => ReactNode;
  /**
   * 自定义渲染标签添加
   * @returns 
   */
  addRender?: () => ReactNode;
  /**
   * 自定义渲染更多内容
   * @returns 
   */
  moreRender?: () => ReactNode;
  /**
   * 自定义渲染标签页右侧内容
   * @returns 
   */
  extraRender?: () => ReactNode;
  /**
   * 自定义渲染标签关闭按钮
   * @returns 
   */
  tabCloseRender?: (tab: XM_TAB) => ReactNode;
  /**
   * 自定义渲染标签固定按钮
   * @returns 
   */
  tabFixedRender?: (tab: XM_TAB) => ReactNode;
  /**
   * 自定义渲染标签右击下拉组件
   * @returns 
   */
  tabContextMenuRender?: (tab: XM_TAB, tabNode: ReactNode) => ReactNode;
  /**
   * 渲染标签前面的图标
   * @param tab 
   * @returns 
   */
  tabIconRender?: (tab: XM_TAB) => ReactNode;
  /**
   * 渲染标签编辑状态的图标
   * @param tab 
   * @returns 
   */
  tabEditRender?: (tab: XM_TAB) => ReactNode;
  /**
   * 渲染标签的悬浮信息
   * @param tab 
   * @returns 
   */
  tabTipRender?: (tab: XM_TAB, tabNode: ReactNode) => ReactNode;
  /**
   * 数据变动时触发，提供最新选中标签key和列表
   * @returns 
   */
  onChange?: (tabKey: XM_TAB['key'] | undefined, tabList: XM_TAB[]) => void;
  /**
   * 标签拖动后触发
   * @param sourceDropId 
   * @param sourceTab 
   * @param targetDropId 
   * @param targetTab 
   * @returns 
   */
  onDrag?: (sourceDropId: string, sourceTab: XM_TAB, targetDropId: string, targetTab: XM_TAB) => void | Promise<void>;
}