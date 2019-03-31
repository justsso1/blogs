# 使用grid布局

## 概念

> 

什么是grid布局？它和flex布局，定位布局有什么不同？

![grid1](/Users/ssojust/Desktop/grid1.png)

1、2、3、4是纵向网格线，123是横向网格线，平行网格线之间是网格轨道，



## CSS单位

**新单位 fr**

网格系统也引入了一个新的单位，分数`fr`。每一个`fr`单元分配一个可用的空间。比如说，如果两个元素分别被设置为`1fr`和`3fr`，那么空间就会被平均分配为4份；第一个元素占据1/4，第二个元素占据3/4。

分数占比

**当列的宽度采用像素，百分比或者em的单位的时候，其他使用`fr`单位设置的列将会平分剩下的空间。**

**使用z-index控制层级**



grid布局中可以使用的一个单位 **fr** !grid1](/Users/ssojust/Desktop/grid1.png)

轨道可以使用任何长度单位进行定义。 网格还引入了一个另外的长度单位来帮助我们创建灵活的网格轨道。新的`fr`单位代表网格容器中可用空间的一等份。下一个网格定义将创建三个相等宽度的轨道，这些轨道会随着可用空间增长和收缩。



## CSS 属性：

### display: grid

### grid-column-start: 数值 | span 数值

### grid-column-end：数值| span 数值

Gird-column-start 也可以为负值，负值是网格线的编号。一般情况下，列网格线的编号从左往右是1、2、3等等，从右往左就是-1，-2， -3等等。上面的网格的走向永远是顺着文档流的从左向右的。

grid-column-end可以为负值，你可以设置它为-1来指定为右边的第一列。

你可以根据网格的开始和结束位置来定义一个网格项，你也可以用`span`关键词来指定你所要跨越的宽度。请注意`span`只能是正值。

使用的时候，grid-column-start和grid-column-end需要有一个是数值，另一个才能是span 数值的形式，否则咩有意义。

### grid-column: gird-column-start /grid-column-end

举例：

```css
grid-column-start: 2;
grid-column-end: 4;



grid-column： 2/4；
grid-column： 6/4；
```

### grid-area: grid-row-start / grid-column-start / grid-row-end / grid-column-end



### order

默认所有网格项的order都是0,但是顺序也可以被任意设置为正数或者负数，就像`z-index`一样。

### grid-template-rows

### grid-template-columns

```css
grid-template-columns: repeat(8, 12.5%);
grid-template-rows: 20% 20% 20% 20% 20%;

/*或者*/
grid-template-columns: 400px 400px;
```
grid-template-columns不仅仅只接受百分比的值，也接受像像素或em这样的长度单位。你甚至可以将不同的长度单位混合使用。

### grid-template: grid-template-rows / grid-template-columns


- 网格和绝对定位元素

  - 作为包含块的网格容器
  - 作为父级的网格容器
  - 以网格区域作为父级

- 网格和display： contents

  display:contents概念

  > 元素本身不会生成任何盒子，但其子元素和伪元素仍然会像平常一样生成盒子。（用户代理）为了生成盒子和布局，必须将元素视为已在文档树中被其子元素和伪元素替换。

## 推荐

<http://cssgridgarden.com/#zh-cn>

<http://flexboxfroggy.com/>