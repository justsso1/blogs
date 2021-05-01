## 前置知识
现代`webkit`内核浏览器提供私有属性
- -webkit-min-device-pixel-ratio
当前设备的物理像素分辨率与CSS像素分辨率比值的最小值
- -webkit-max-device-pixel-ratio
当前设备的物理像素分辨率与CSS像素分辨率比值的最大值

分别可以用标准属性`min-resolution`和`max-resolution`替代
## 方法一：`border-width`

```css
.border {
	border: 1px solid;
}
@media screen and {min-resolution: 2dppx} {
	.border {
		border: 0.5px solid;
	}
}
@media screen and (min-resolution: 3dppx) {
	.border {
		border: 0.333333px solid;
	}
}
```
## 方法二：伪类 + transform

```CSS

div::after {
	content: '';
	display: block;
	border-bottom: 1px solid;
}
@media only screen and (min-resolution: 2dppx) {
	div::after {
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
	}
}
@media only screen and (min-resolution: 3dppx) {
	div::after {
		-webkit-transform: scaleY(.33);
		transform: sacleY(.33);
	}
}
```