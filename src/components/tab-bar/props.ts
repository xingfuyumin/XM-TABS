import { ReactNode } from "react";
import { TAB_DATA, TAB_INFO } from "./hook";

export interface PROPS {
  storageId: string | number;
  className?: string;

  maxTabWidth?: number;
  minTabWidth?: number;
  maxTabNum?: number;

  showAdd?: boolean;
  showHistory?: boolean;

  tabRender?: (name: TAB_INFO['name']) => ReactNode;
  tabContextMenuRender?: (tab: TAB_INFO) => {
    danger?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
    label?: string;
    title?: ReactNode;
    type?: 'group' | 'divider';
  }[];
  onTabContextMenuClick?: (tab: TAB_INFO, key: string) => void;
  onTabAdd?: () => Promise<void> | void;
  onTabUpdate?: () => Promise<void> | void;
  onTabDelete?: (tabKey: TAB_INFO['key']) => Promise<void> | void;
  onTabClear?: () => Promise<void> | void;
  onTabClearOther?: () => Promise<void> | void;
  onTabClearRight?: () => Promise<void> | void;
  intlRender?: (str: string, params?: string[]) => ReactNode;
  initData?: () => TAB_DATA | Promise<TAB_DATA>
}