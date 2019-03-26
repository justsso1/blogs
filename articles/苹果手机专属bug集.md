# 苹果手机专属bug集

1.键盘弹起后页面上滑，导致弹框（使用了position:fixed）中按钮响应区域错位，被挤压的页面没有恢复成原来的样子

系统： IOS 12

解决方案：

在点击按钮那里加下面其中一个即可解决.

```javascript
//滚动到顶部
window.scrollTo(0, 0);
//滚动到底部
window.scrollTo(0, document.documentElement.clientHeight);

```

2.苹果手机上不能自动播放音频

 由于 iOS Safari 限制不允许 audio autoplay, 必须用户主动交互(例如 click)后才能播放 audio, 因此我们通过一个用户交互事件来主动 play 一下 audio.

iOS 9 还需要额外的 load 一下, 否则直接 play 不能让 audio 开始播放

解决方案：

```react
play() {
        const node = this.audio.current;
        clearTimeout(a);
        console.log(node.readyState, 'readyState 4');

        if (!node.ended) {
            // 没有结束,第一次点击
            node.play();
            this.setState({
                VolumeColor: green
            });
            var that = this;
            setTimeout(() => {
                that.setState({
                    VolumeColor: grey
                })
            }, 1000)
        } else {
            //    第2..n次点击
            node.currentTime = 0;
            node.load(); //先load一下
            node.play();
            this.setState({
                VolumeColor: green
            });
            var that = this;
            var a = setTimeout(() => {
                that.setState({
                    VolumeColor: grey
                })
            }, 1000)
        }
    }
```

