### 安装Taro

我们线上的背单词项目从SPA转到小程序也是有一段时间了，总结一下react转taro的经验。

那就按时间线的顺序写吧，也就是我所踩坑的时间。

**使用Taro脚手架**

切换到taro框架，首先是使用taro的脚手架 [文档地址](https://nervjs.github.io/taro/docs/GETTING-STARTED.html)

项目的启动还是顺利的，但是每隔几天莫名其妙的出现编译不成功的情况，然后重启编译器就可以了，我也就没放在心上。但是使用了大概2周多的时候，这情况越来越多，已经干扰到正常的工作进度了，然后我实在是受不了了，开始找问题的原因。终于找到了，原来是使用了脚手架安装的，依赖包都是beta版本的，我没想到竟然是这个原因，然后我使用的yarn的相关命令进行升级，升级之后，项目正常运行了，再也没有报过莫名其妙就是编译不了的问题，世界终于清净了！

**使用Taro UI**

之前的项目使用的是react 和antd mobile，样式选用的是less。转成小程序之后，选了Taro官方推荐的UI库，也就是Taro UI。但是Taro UI样式使用的是scss，没办法，这个就得手动去改了，这个时候要使用编译器快捷键结合纯手工的方式哦～还有Taro UI 不支持按需加载，如果想实现按需加载，就只能单个scss文件引入，从而减小打包体积。

**配置问题**

Taro项目目录结构

```
├── dist                   编译结果目录
├── config                 配置目录
|   ├── dev.js             开发时配置
|   ├── index.js           默认配置
|   └── prod.js            打包时配置
├── src                    源码目录
|   ├── pages              页面文件目录
|   |   ├── index          index 页面目录
|   |   |   ├── index.js   index 页面逻辑
|   |   |   └── index.css  index 页面样式
|   ├── app.css            项目总通用样式
|   └── app.js             项目入口文件
└── package.json
```

在尺寸单位上我 遇到了坑。Taro默认会对所有的单位进行换算，在 Taro 中书写尺寸按照 1:1 的关系来进行书写，即从设计稿上量的长度 `100px`，那么尺寸书写就是 `100px`，当转成微信小程序的时候，尺寸将默认转换为 `100rpx`，当转成 H5 时将默认转换为以 `rem` 为单位的值。 

由于我使用了TaroUI，所以有些组件是可以正常展示的，但是部分我自己写的组件，就显示的比例失常。

```json
const config = {
  projectName: 'wordcamp_taro',
  date: '2019-6-19',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1 ,
    '828': 1.81 / 2
  }
}
```

当我修改deviceRatio时，我自己的组件显示正常了，但是TaroUI显示比例失常了，比一般的组件都大很多。

所以没有办法，我只能对自己写的组件修改px了，我把px改为Px，这样，单位会被转换插件忽略掉。

**建议封装ajax请求函数**

在react中，我们有axios帮我们做接口请求是很方便的，但是由于Taro是比较新的框架，所以各方面生态没有那么健全，我为了方便，封装了一个请求函数。

```
export default {
  baseOptions(params, method = 'GET') {
    let {url, data} = params;
    // let token = getApp().globalData.token
    // if (!token) login()
    // let contentType = 'application/x-www-form-urlencoded';
    let skey = Taro.getStorageSync('skey');

    let contentType = 'application/json';
    contentType = params.contentType || contentType;
    const option = {
      isShowLoading: false,
      loadingText: '正在加载',
      url: url,
      data: data,
      method: method,
      header: {
        "content-type": contentType,
        "skey": skey,
      },
      success(res) {
        return res.data
      },
      error(e) {
        console.log('api', '请求接口出现问题', e)
      }
    };

    return Taro.request(option).catch((err) => {
      Taro.showToast({title: err.errMsg, image: FailPng});
      Taro.onNetworkStatusChange(res => {
        if(res.isConnected === false){
          Taro.showToast({title: '网络异常请重试', image: FailPng, duration: 3000})
        }
        Taro.showToast({title: '当前网络状态： ' + res.networkType+ ', 尝试刷新', icon: 'none', duration: 3000})
      });
      Taro.getNetworkType({
        success: function (res) {
          if(res.networkType === 'none'){
            Taro.showToast({title: '网络异常请重试', image: FailPng, duration: 3000})
          }else {
            Taro.showToast({title: '当前网络状态： ' + res.networkType, icon: 'none', duration: 4000})
          }
        }
      })
    })
  },
  get(url, data = '') {
    let option = {url, data};
    return this.baseOptions(option)
  },
  post: function (url, data, contentType) {
    let params = {url, data, contentType};
    return this.baseOptions(params, 'POST')
  }
}
```



**增加的生命周期函数**

componentDidshow

曾经在这个函数上踩过坑，当你从页面栈中退回到这个页面时，会触发该页面的`componentDidShow`生命周期，react组件渲染只有两个原因，一个是props改变了，一个是state变了且使用了setState，如果只是修改了state的状态，没有使用setState方法，依然是不会触发组件重新渲染的，这个道理在Taro中依然适用。