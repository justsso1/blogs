组件作用：

Grid组件主要用来做pc页面布局的，现在PC端页面布局主要使用栅格系统。栅格系统起源于bootstrap，将页面宽度等分成12份。但为了实现更加细致的布局，coconut-ui 把页面分成24份。

Grid组件暴露出Row和Col 两个组件，用来实现栅格系统中的行和列。

实现过程：

 `Row`组件

Row组件，代表栅格系统中的行，Col组件代表栅格系统中的列。Col组件只能是Row组件的子组件，Row组件的子组件只能是Col组件。



默认情况下，Row组件是独占一行的。



下面看组件的具体属性：

<Row>组件

| 成员    | 说明     | 类型   | 默认值 |
| ------- | -------- | ------ | ------ |
| gutter  | 栅格间隔 | number | 0      |
| type    | 布局模式 |        |        |
| justify |          |        |        |
| align   |          |        |        |

<Col>组件

| 成员   | 说明     | 类型           | 默认值  |
| ------ | -------- | -------------- | ------- |
| span   | 宽度     | number         | 0       |
| offset | 布局模式 |                |         |
| order  | 显示顺序 | 值越小的在前面 | 默认：0 |
| align  |          |                |         |



**span属性**

Col组件的宽度

栅格系统将页面平分24份，那么1份就是1/24，3份就是1/8，以此类推。

宽度主要是根据传入的span参数，生成对应的宽度百分比。

内联样式写百分比，太不灵活了，而且Col的属性还有很多，都写内联样式的话，非常不方便代码维护，所以，根据span参数，生成对应的class。其他的属性，也是生成相应的class，再来渲染样式。



```react
import classNames from 'classnames';

const classes = classNames(
            prefixCls,
            {
                [`${prefixCls}-span-${span}`]: span !== undefined
            }
        );


<div {...others} style={style} className={classes}>
     {children}
</div>
```



```scss
@for $i from 0 through 24 {
  //through 包括 0 和 24
  //循环生成span
  .#{$coconut-prefix}-col-span-#{$i} {
    width: (1/ 24 * $i *100) * 1%;
  }
 
}
```

**offset属性**

Col组件的偏移

偏移主要是使用margin属性， offset的值代表偏移指定的列数，也就是宽度的百分比。



```react
 const classes = classNames(
            prefixCls,
            {
                [`${prefixCls}-span-${span}`]: span !== undefined,
                [`${prefixCls}-offset-${offset}`]: offset,
                [`${prefixCls}-order-${order}`]: order,
                [`${prefixCls}-push-${push}`]: push,
                [`${prefixCls}-pull-${pull}`]: pull
            },
            className,
            sizeClassObj   //响应式要覆盖前面的 span offset order push pull 属性，响应式优先级高
        );
```



```scss
@for $i from 0 through 24 {
  //through 包括 0 和 24
   //循环生成span
  .#{$coconut-prefix}-col-span-#{$i} {
    width: (1/ 24 * $i *100) * 1%;
  }
  //循环生成offset
  .#{$coconut-prefix}-col-offset-#{$i} {
    margin-left: (1/24 * $i *100) * 1%;
  }
 
}
```

**gutter属性**

