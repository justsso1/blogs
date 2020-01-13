#### 组件作用：

Grid组件主要用来做pc页面布局的，现在PC端页面布局主要使用栅格系统。栅格系统起源于bootstrap，将页面宽度等分成12份。但为了实现更加细致的布局，coconut-ui 把页面分成24份。

Grid组件暴露出Row和Col 两个组件，用来实现栅格系统中的行和列。

#### 实现过程：

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



##### **span属性**

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

##### **offset属性**

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

##### **gutter属性**

设置列之间的间隔，我们要在Row组件中设置参数，它的子组件会遵循这个间隔布局。

间隔我们使用padding来实现，结合box-sizing:border-size; 可以实现间隔。

假如gutter是20，那么padding-left和padding-right就是10



这里有一个小点要说一下，

Row 组件的属性要在Col组件中生成相应的class，我们自然会想到使用属性传递，可问题是，我们在Row组件中使用children来传递Col组件的，这里我们没法再给Col传递我们加工的属性了。所以我们得换种方式传递，这是我使用了React.Context



```react
let RowContext = React.createContext({
    gutter: 0
});



 <RowContext.Provider value={{gutter: gutter}}>
                <div {...otherProps} className={classes} style={rowStyle}>
                    {children}
                </div>
            </RowContext.Provider>
```



然后在Col组件中取gutter

```
 <RowContext.Consumer>
                {
                    ({gutter}) => {
                        let style = {};

                        if (gutter) {
                            style = {
                                paddingLeft: gutter / 2 + 'px',
                                paddingRight: gutter / 2 + 'px'
                            }
                        }
                        return <div {...others} style={style} className={classes}>
                            {children}
                        </div>
                    }
                }

            </RowContext.Consumer>
```



React.Context 上下文提供了一个无需为每层组件手动添加props，就能在组件树间进行数据传递的方法。

Context提供了一种在组件之间共享props的方式，而不必显式地通过组件树的额逐层传递props。

Context.Provider

```react
<MyContext.Provider value={} />
```



Context.Consumer

```react
<MyContext.Consumer>
	{value => /* 基于 context值进行渲染*/}
</MyContext.Consumer>
```





##### type 与justify 、align、order



Row组件的type为flex时，就应用弹性盒模型。

当type=flex时，justify align   order的值设置才会起作用

根据justify align的值生成对应的css

Row.js

```react
const classes = classNames({
            [prefixCls]: !type,
            [`${prefixCls}-${type}`]: type,
            [`${prefixCls}-${type}-${justify}`]: type && justify,
            [`${prefixCls}-${type}-${align}`]: type && align
        }, className);
```



Col.js

```react
 //分析classes
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



index.scss

```scss
//主轴对齐
.#{$coconut-prefix}-row-flex-start {
  justify-content: flex-start;
}

.#{$coconut-prefix}-row-flex-center {
  justify-content: center;
}

.#{$coconut-prefix}-row-flex-end {
  justify-content: flex-end;
}

.#{$coconut-prefix}-row-flex-space-between {
  justify-content: space-between;
}

.#{$coconut-prefix}-row-flex-space-around {
  justify-content: space-around;
}

//纵轴对齐

.#{$coconut-prefix}-row-align-top {
  align-items: flex-start;
}

.#{$coconut-prefix}-row-align-center {
  align-items: center;
}

.#{$coconut-prefix}-row-align-bottom {
  align-items: flex-end;
}



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
  //循环生成order
  .#{$coconut-prefix}-col-order-#{$i} {
    order: $i;
  }

  //  循环生成push

  //  循环生成pull
}

```



##### 响应式



我预设了六个响应式尺寸：`xs`, `sm`, `md`, `lg`, `xl`, `xxl`

css中主要使用media 来自动的响应样式。



首先利用sass的 map，生成六个对应的样式

default.scss

```scss

$--breakpoints: (
        'xs' : (max-width: $screen-sm), //max-width: 576px,包括576px
        'sm' : (min-width: $screen-sm), //min-width: 576px ，不包括576px
        'md' : (min-width: $screen-md),
        'lg' : (min-width: $screen-lg),
        'xl' : (min-width: $screen-xl),
        'xxl': (min-width: $screen-xxl)
);



//$map 有默认值
@mixin res($key, $map: $--breakpoints) {
  @if (map_has_key($map, $key)) {
    @media only screen and #{inspect(map-get($map, $key))} {
      @content;
    }
  } @else {
    @warn "Undefeined points: `#{$map}`";
  }
}
```



index.scss

```scss

//响应式
@include res(xs) {
  .#{$coconut-prefix}-col-xs-0 {
    display: none;
  }
  @for $i from 0 through 24 {

    //span
    .#{$coconut-prefix}-col-xs-#{$i} {
      width: (1/ 24 * $i *100) * 1%;
    }
    //循环生成offset
    .#{$coconut-prefix}-col-xs-offset-#{$i} {
      margin-left: (1/24 * $i *100) * 1%;
    }
    //循环生成order
    .#{$coconut-prefix}-col-xs-order-#{$i} {
      sorder: $i;
    }
  }
}
```



所以使用res函数，生成对应的六种响应式的样式

sm

```scss
@include res(sm) {
  .#{$coconut-prefix}-col-sm-0 {
    display: none;
  }
  @for $i from 0 through 24 {

    //span
    .#{$coconut-prefix}-col-sm-#{$i} {
      width: (1/ 24 * $i *100) * 1%;
    }
    //循环生成offset
    .#{$coconut-prefix}-col-sm-offset-#{$i} {
      margin-left: (1/24 * $i *100) * 1%;
    }
    //循环生成order
    .#{$coconut-prefix}-col-sm-order-#{$i} {
      order: $i;
    }
  }
}
```



md

```scss
@include res(md) {
  .#{$coconut-prefix}-col-md-0 {
    display: none;
  }
  @for $i from 0 through 24 {

    //span
    .#{$coconut-prefix}-col-md-#{$i} {
      width: (1/ 24 * $i *100) * 1%;
    }
    //循环生成offset
    .#{$coconut-prefix}-col-md-offset-#{$i} {
      margin-left: (1/24 * $i *100) * 1%;
    }
    //循环生成order
    .#{$coconut-prefix}-col-md-order-#{$i} {
      order: $i;
    }
  }
}
```



它们会分别编译成对应的css

```css
@media only screen and (max-width: 576px)

.coconut-col-xs-2 {
    width: 8.33333%;
}
```



XS sm md  lg 传入一个数字时，代表着组件的宽度

还可以传入一个对象

```react
<Row gutter={16}>
                <Col xs={{span: 5, offset: 1}} lg={{span: 6, offset: 2}} md={{span: 4}}
                     sm={{span: 3, offset: 3}}>
                    <div className="my-col">1</div>
                </Col>
                <Col xs={{span: 11, offset: 1}} lg={{span: 6, offset: 2}} md={{span: 4, offset: 4}}
                     sm={{span: 3, offset: 3}}>
                    <div className="my-col">1</div>
                </Col>
                <Col xs={{span: 5, offset: 1}} lg={{span: 6, offset: 2}} md={{span: 4, offset: 8}}
                     sm={{span: 3, offset: 3}}>
                    <div className="my-col">1</div>
                </Col>
            </Row>
```



这时，思路是一样的，需要把对应的属性解析出来，生成不同的css

```react
//分析响应式
        let sizeClassObj = {};
        ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(size => {
            let sizeProps: ColSize = {};
            const propSize = (this.props as any)[size];   //取响应式的值
            if (typeof propSize === "number") {
                sizeProps.span = propSize
            } else if (typeof propSize === "object") {
                sizeProps = propSize || {}
            }
            delete (others as any)[size];

            sizeClassObj = {
                ...sizeClassObj,
                [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined,
                [`${prefixCls}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0,
                [`${prefixCls}-${size}-offset-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0,
                [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0,
                [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0
            };
        });
```



```react

 //分析classes
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



响应式生成的class要写在组件的最后，要覆盖掉前面相同的样式属性。

其他的属性支持对象传递的话，也是解析对象，生成对应的class而已。



最本质的地方在通过不同css来实现我们的需求，实现灵活的布局。

此外，对于`sass`中的`@mixin` ，`map`的使用也应该熟练掌握，使用它们可以自动生成代码，对组件代码优化也有很大帮助。

