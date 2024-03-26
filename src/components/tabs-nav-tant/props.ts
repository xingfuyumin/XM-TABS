import { ReactNode } from "react";
import { XM_TAB, XM_TABS_NAV } from "../tabs-nav-base/props";

export interface XM_TABS_NAV_TANT extends XM_TABS_NAV {
  /**
   * 最大tab数，超过不可添加。仅不设置addRender时有效，不对底层数据处理产生限制
   */
  maxTabNum?: number;
  /**
   * 是否展示历史关闭数据，仅不设置moreRender时有效
   */
  showHistory?: boolean;
  /**
   * 语言国际化函数
   * @param str 
   * @param params 
   * @returns 
   */
  onIntl?: (str: string, params?: string[]) => ReactNode;

  onTabAdd?: () => XM_TAB | Promise<XM_TAB>;
  onTabClose?: (tab: XM_TAB) => boolean | Promise<boolean>;
}