# CSS3中 animation 与 js中的animationEvent

### css3中的animation

animation表示一组或多组动画，每组之间用逗号相隔。
每组动画可以分为两部分：1. `@keyframes` 2.时间、时长及其他动画接的的配置

#### 1. `@keyframes`

> 描述动画样式规则，定义动画序列

通过使用 `@keyframes` 建立两个或两个以上关键帧来实现。每一个关键帧都描述了动画元素在给定的时间点上应该如何渲染。

因为动画的时间设置是通过CSS样式定义的，关键帧使用percentage来指定动画发生的时间点。0%表示动画的第一时刻，100%表示动画的最终时刻。因为这两个时间点十分重要，所以还有特殊的别名：from和to。这两个都是可选的，若from/0%或to/100%未指定，则浏览器使用计算值开始或结束动画。

#### 2. 配置动画

- animation-name: (值为 `@keyframes`的名字 )
- animation-duration ( 动画是否反向播放 )
  - normal
  - alternate
  - reverse
  - alternate-reverse

- animation-delay （动画的延迟时间，单位为秒或毫秒。如果只有一个值，那么起始时间是隐藏的，则从动画应用于元素的那一刻就获取起始时间）
  
  ``` css
    animation-delay: 3s;
    animation-delay: 2s, 4ms;
  ```

- animation-iteration-count

    动画重复次数。

- animation-timing-function 缓动函数
  - 关键字类的 
    - ease
    - ease-in
    - ease-out
    - linear
    - step-start
    - step-end

  - 运动函数类的 
    - cubic-bezier
    - steps(4, end)
    - frames(10)

- animation-fill-mode

  设置css动画在执行之前和执行之后如何将样式应用于其目标。
    - none
    - forwards，目标将保留执行期间遇到的最后一个关键帧计算值。（备注： 动画结束后，保持状态不变）
    - backwards，动画将在应用于目标时立即应用第一个关键帧的值。（备注：动画结束后立即回到第一帧）
    - both，动画将遵循forwards和backwards的规则，从而在两个方向上扩展动画属性

- animation-play-state
  
  定义一个动画是否运行或暂停。可以通过查询它来确定动画是否在运行。另外，它的值可以被设置为暂停和恢复的动画的重放。

### css3动画的优点

1. 简单。
2. 流畅。动画运行效果良好，甚至在低性能的系统上。渲染引擎会使用跳帧或者其他技术以保证动画表现尽可能的流畅。而使用javascript实现的动画通常表现不佳（除非经过很好的设计）。
3. 让浏览器控制动画序列，允许浏览器优化性能和效果，如降低于隐藏选项卡中的动画更新频率。

### 动画事件监听器

1. animationstart
2. animationend
3. animationiteration

`AnimationEvent`事件继承`Event`,`AnimationEvent`是提供与动画相关的信息的事件。

`AnimationEvent`事件的属性：

- AnimationEvent.animationName
- AnimationEvent.elapsedTime 动画运行的时间，不包括暂停的时间
- AnimationEvent.pseudoElement 伪元素

### 检测css动画的支持性
