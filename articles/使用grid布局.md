# 使用grid布局

## 概念

> 

什么是grid布局？它和flex布局，定位布局有什么不同？

![grid1](/Users/ssojust/Desktop/grid1.png)

1、2、3、4是纵向网格线，123是横向网格线，平行网格线之间是网格轨道，



## 属性

**新单位 fr**



**使用z-index控制层级**



grid布局中可以使用的一个单位 **fr** !grid1](/Users/ssojust/Desktop/grid1.png)

轨道可以使用任何长度单位进行定义。 网格还引入了一个另外的长度单位来帮助我们创建灵活的网格轨道。新的`fr`单位代表网格容器中可用空间的一等份。下一个网格定义将创建三个相等宽度的轨道，这些轨道会随着可用空间增长和收缩。



## CSS 属性：

### display: grid

### grid-column-start

### grid-column-end

Gird-column-start 也可以为负值，负值是网格线的编号。一般情况下，列网格线的编号从左往右是1、2、3等等，从右往左就是-1，-2， -3等等。上面的网格的走向永远是顺着文档流的从左向右的。

grid-column-end可以为负值，你可以设置它为-1来指定为右边的第一列。





举例：

```css
grid-column-start: 2;
grid-column-end: 4;
```

- 网格和绝对定位元素

  - 作为包含块的网格容器
  - 作为父级的网格容器
  - 以网格区域作为父级

- 网格和display： contents

  display:contents概念

  > 元素本身不会生成任何盒子，但其子元素和伪元素仍然会像平常一样生成盒子。（用户代理）为了生成盒子和布局，必须将元素视为已在文档树中被其子元素和伪元素替换。

## 推荐

<http://cssgridgarden.com/#zh-cn>