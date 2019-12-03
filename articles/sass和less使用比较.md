##### 一、变量的声明

sass:  使用 `$`

```scss
$yellow: #f2bf43;

//使用
.div{
	background: $yellow
}
```



less ,使用`@`

```less
@width: 100px;

//使用
.div {
		width: @width;
}

```



##### 二、类名中使用变量名

sass

```scss
$prefix: apple;

//使用，编译出来就是.apple-ui
.#{$prefix}-ui{
		...
}
```



less

```less
@prefix: apple;

//使用，编译出来就是 .apple-ui
.@{prefix}-ui {
	...
}
```

