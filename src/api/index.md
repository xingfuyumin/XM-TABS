---
nav: {
  title: 文档
}
---
# API

## 导航栏API

参数|是否必填|类型|说明|默认值
-|:-:|:-:|-|:-:
tabKey|<font color="grey">可选</font>|<font color="blue">XM_TAB</font> ['key']|当前活动标签key，需要唯一|-
tabList|<font color="red">必填</font>|<font color="blue">XM_TAB</font> []|标签列表|[]
className|<font color="grey">可选</font>|string|组件样式|''
maxTabWidth|<font color="grey">可选</font>|number|最大标签宽度|240
minTabWidth|<font color="grey">可选</font>|number|最小标签宽度|100
ref|<font color="grey">可选</font>|<font color="blue">XM_TABS_NAV_REF</font>|提供标签操作函数，会触发onChange函数提供最新的数据|-
tabRender|<font color="grey">可选</font>|(tab: <font color="blue">XM_TAB</font>) => ReactNode|自定义标签渲染函数|-
addRender|<font color="grey">可选</font>|() => ReactNode|自定义渲染标签添加|-
moreRender|<font color="grey">可选</font>|() => ReactNode|自定义渲染更多内容|-
extraRender|<font color="grey">可选</font>|() => ReactNode|自定义渲染标签页右侧内容|-
tabCloseRender|<font color="grey">可选</font>|(tab: <font color="blue">XM_TAB</font>) => ReactNode|自定义渲染标签固定按钮|-
tabFixedRender|<font color="grey">可选</font>|(tab: <font color="blue">XM_TAB</font>) => ReactNode|自定义渲染标签右击下拉组件|-
tabContextMenuRender|<font color="grey">可选</font>|(tab: <font color="blue">XM_TAB</font>, tabNode: ReactNode) => ReactNode|自定义渲染标签右击下拉组件|-
onChange|<font color="grey">可选</font>|(tabKey: <font color="blue">XM_TAB</font> ['key'] \| undefined, tabList: XM_TAB[]) => void|数据变动时触发，提供最新选中标签key和列表|-
onDrag|<font color="grey">可选</font>|sourceDropId: string, sourceTab: <font color="blue">XM_TAB</font>, targetDropId: string, targetTab: <font color="blue">XM_TAB</font>) => void \| Promise\<void\>|标签拖动后触发|-

## 标签内容 (XM_TAB)
参数|是否必填|类型|说明|默认值
-|:-:|:-:|-|:-:
key|<font color="red">必填</font>|string|当标签的唯一标识|''
label|<font color="red">必填</font>|string|标签的名称|''
closeable|<font color="grey">可选</font>|boolean|标签是否可关闭|true
fixed|<font color="grey">可选</font>|boolean|标签是否固定|false
edited|<font color="grey">可选</font>|boolean|标签是否已编辑|false

## 内置函数 (XM_TABS_NAV_REF)
参数|类型|说明
-|:-:|-
addTab|(tab: XM_TAB) => void \| Promise\<void\>|新增标签
updateTab|(oldTab: XM_TAB, newTab: Partial<XM_TAB>) => void \| Promise\<void\>|更新标签信息
closeTab|(tab: XM_TAB, check: (tab: XM_TAB) => Promise\<boolean\>) => boolean \| Promise\<boolean\>|关闭标签，返回结果告知是否需要中断后续操作，当关闭未保存标签可能会用到
closeAll|(check: (tab: XM_TAB) => Promise\<boolean\>) => void \| Promise\<void\>|关闭所有标签，不包含固定标签
closeOther|(tab: XM_TAB, ccheck: (tab: XM_TAB) => Promise\<boolean\>) => void \| Promise\<void\>|关闭其他标签，不包含固定标签
fixedTab|(tab: XM_TAB, fixed: boolean) => void \| Promise\<void\>|固定/取消固定标签
closeRight|(tab: XM_TAB, ccheck: (tab: XM_TAB) => Promise\<boolean\>) => void \| Promise\<void\>|关闭右侧标签，不包含固定标签
drag|(sourceDropId: string, sourceTab: XM_TAB, targetDropId: string, targetTab: XM_TAB) => void \| Promise\<void\>|标签拖拽<br />1、如果将固定标签拖到非固定位置则会将标签设为未固定<br />2、如果将非固定标签拖到固定位置则会将标签设为固定