import { ReactNode } from "react";
import { XM_TAB } from "../tabs-nav-base/props";

export interface XM_TABS_PANEL_REF {
  list: {
    tabKey: XM_TAB['key'],
    data: any,
    fixed?: boolean,
  }[];
  tabKey: XM_TAB['key'],
  update: (tabKey: XM_TAB['key'], data: any) => void;
  open: (tabKey: XM_TAB['key'], tab?: XM_TAB) => void;
  close: (tabKey: XM_TAB['key']) => void;
}

export interface XM_TABS_PANEL {
  /**
   * 标签缓存数量，超过的将被清除dom
   */
  cacheNum?: number,
  /**
   * 固定标签缓存数量，超过的将被清除dom
   */
  fixedCacheNum?: number,
  /**
   * 子元素
   */
  children: (tabKey: XM_TAB['key'], data: any, hanleChange: (tabKey: XM_TAB['key'], data: any) => void | Promise<void>) => ReactNode;
  /**
   * 修改标签内容修改时触发
   * @param tabKey 
   * @param data 
   * @returns 
   */
  onChange?: (tabKey: XM_TAB['key'], data: any, isClose?: boolean) => void | Promise<void>;
  /**
   * 切换标签或标签内容修改时触发
   * @param tabKey 
   * @param data 
   * @returns
   */
  onInit?: (tabKey: XM_TAB['key'], tab: XM_TAB) => any | Promise<any>;
  /**
   * 内部缓存数据及操作函数
   */
  ref: XM_TABS_PANEL_REF,
}