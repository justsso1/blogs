# bootstrap4的使用

默认font-size: 16px

## 布局

## 文本

**标签**

1. `h1`到`h6` 全部重写
2. display显示更大更粗的文字
3. `<small>`显示字号更小的颜色更浅的文本
4. `<mark>`为黄色背景及有一定的内边距
5. `<abbr>`元素的样式为显示在文本底部的一条虚线边框
6. 对于引用的内容可以在 `<blockquote>` 上添加 .blockquote 类
7. `<dl>` `<dt>` `<dd>`
8. `<code>` 粉红色
9. `<kbd>` 黑色背景
10. `<pre>`文字字体变了

**排版**

类名 | 描述
----|------|----
.font-weight-bold | 加粗文本  
.font-weight-normal  | 普通文本
.font-weight-light | 更细的文本
.font-italic | 斜体文本
.lead | 让段落更突出
.small |    指定更小文本 (为父元素的 85% )
.text-left | 左对齐
.text-center | 居中
.text-right | 右对齐
.text-justify | 设定文本对齐,段落中超出屏幕部分文字自动换行
.text-nowrap | 段落中超出屏幕部分不换行
.text-lowercase | 设定文本小写
.text-uppercase  | 设定文本大写	
.text-capitalize | 设定单词首字母大写
.initialism | 显示在 `<abbr>` 元素中的文本以小号字体展示，且可以将小写字母转换为大写字母	
.list-unstyled | 移除默认的列表样式，列表项中左对齐 ( `<ul>` 和 `<ol>` 中)。 这个类仅适用于直接子列表项 (如果需要移除嵌套的列表项，你需要在嵌套的列表中使用该样式)	
.list-inline | 将所有列表项放置同一行
.pre-scrollable | 使`<pre>`元素可滚动，代码块区域最大高度为340px,一旦超出这个高度,就会在Y轴出现滚动条

## 颜色

**注意：️背景颜色不会设置文本的颜色，在一些实例中你需要与 .text-* 类一起使用**

**文本颜色**

``` html
 <a href="#" class="text-muted">柔和的链接。</a>
  <a href="#" class="text-primary">主要链接。</a>
  <a href="#" class="text-success">成功链接。</a>
  <a href="#" class="text-info">信息文本链接。</a>
  <a href="#" class="text-warning">警告链接。</a>
  <a href="#" class="text-danger">危险链接。</a>
  <a href="#" class="text-secondary">副标题链接。</a>
  <a href="#" class="text-dark">深灰色链接。</a>
  <a href="#" class="text-light
```

**背景颜色**

```html
<p class="bg-primary text-white">重要的背景颜色。</p>
  <p class="bg-success text-white">执行成功背景颜色。</p>
  <p class="bg-info text-white">信息提示背景颜色。</p>
  <p class="bg-warning text-white">警告背景颜色</p>
  <p class="bg-danger text-white">危险背景颜色。</p>
  <p class="bg-secondary text-white">副标题背景颜色。</p>
  <p class="bg-dark text-white">深灰背景颜色。</p>
  <p class="bg-light text-dark">浅灰背景颜色。</p>
```