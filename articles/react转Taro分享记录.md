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



**页面分享**

小程序规定，只有给当前页面设置了分享参数，点击右上角的三个点才会有”分享转发“，小程序的每一个页面都需要设置分享参数，如果一个个去写，未免太麻烦了些。

我使用了装饰器，给需要的页面多包装一层，装饰器其实就是高阶组件，高阶组件的作用就是组件之间的代码复用。组件可能有着某些相同的逻辑，把这些逻辑抽离出来，放到高阶组件中进行复用。*高阶组件内部的包装组件和被包装组件之间通过 `props` 传递数据*。

而装饰器就是给对象动态地增加职责，装饰器能够在不改变对象自身的基础上，在程序运行期间给对象增加职责。

```react
function withShare(opts = {}) {

  // 设置默认
  const defalutPath = 'pages/Index/Index?';
  const defalutTitle = '发现一个特别好用的背单词小程序，词汇训练营了解一下';
  const defaultImageUrl = defaultShareImg;
  const defaultFromPath = ''; //默认分享页面

  return function demoComponent(Component) {
    // redux里面的用户数据
    @connect(({user}) => ({
      openId: user.openId
    }))
    class WithShare extends Component {
      async componentWillMount() {
        wx.showShareMenu({
          success(res) {
            console.log('success showShareMenu')
          },
          fail(res) {
            console.log('fail showShareMenu')
          },
          complete(res) {
            console.log('complete showShareMenu')
          }
        });

        if (super.componentWillMount) {
          super.componentWillMount();
        }
      }

      // 点击分享的那一刻会进行调用
      onShareAppMessage() {
        const {openId} = this.props;

        let {title, imageUrl, path = null, fromPath = defaultFromPath} = opts;

        // 从继承的组件获取配置
        if (this.$setSharePath && typeof this.$setSharePath === 'function') {
          path = this.$setSharePath();
        }

        // 从继承的组件获取配置
        if (this.$setShareTitle && typeof this.$setShareTitle === 'function') {
          title = this.$setShareTitle();
        }

        // 从继承的组件获取配置
        if (
          this.$setShareImageUrl &&
          typeof this.$setShareImageUrl === 'function'
        ) {
          imageUrl = this.$setShareImageUrl();
        }

        // 从继承的组件获取配置
        if (
          this.$setFromPath && typeof this.$setFromPath === 'function'
        ) {
          fromPath = this.$setFromPath();
        }

        if (!path) {
          path = defalutPath;
        }

        // 每条分享都补充用户的分享id
        // 如果path不带参数，分享出去后解析的params里面会带一个{''： ''}
        const sharePath = `${path}userOpenId=${openId}&fromPath=${fromPath}`;
        console.log('分享路径=>', sharePath);
        return {
          title: title || defalutTitle,
          path: sharePath,
          imageUrl: imageUrl || defaultImageUrl
        };
      }

      render() {
        return super.render();
      }
    }

    return WithShare;
  };
}
```



**分包**

目前小程序分包大小有以下限制：

- 整个小程序所有分包大小不超过 8M
- 单个分包/主包大小不能超过 2M

使用分包

*配置方法*

假设支持分包的小程序目录结构如下：

```text
├── app.js
├── app.json
├── app.wxss
├── packageA
│   └── pages
│       ├── cat
│       └── dog
├── packageB
│   └── pages
│       ├── apple
│       └── banana
├── pages
│   ├── index
│   └── logs
└── utils
```

开发者通过在 app.json `subpackages` 字段声明项目分包结构：

> 写成 subPackages 也支持。

```json
{
  "pages":[
    "pages/index",
    "pages/logs"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/cat",
        "pages/dog"
      ]
    }, {
      "root": "packageB",
      "name": "pack2",
      "pages": [
        "pages/apple",
        "pages/banana"
      ]
    }
  ]
}
```

`subpackages` 中，每个分包的配置有以下几项：

| 字段        | 类型        | 说明                                                         |
| :---------- | :---------- | :----------------------------------------------------------- |
| root        | String      | 分包根目录                                                   |
| name        | String      | 分包别名，[分包预下载](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/preload.html)时可以使用 |
| pages       | StringArray | 分包页面路径，相对与分包根目录                               |
| independent | Boolean     | 分包是否是[独立分包](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages/independent.html) |

*打包原则*

- 声明 `subpackages` 后，将按 `subpackages` 配置路径进行打包，`subpackages` 配置路径外的目录将被打包到 app（主包） 中
- app（主包）也可以有自己的 pages（即最外层的 pages 字段）
- `subpackage` 的根目录不能是另外一个 `subpackage` 内的子目录
- `tabBar` 页面必须在 app（主包）内

*引用原则*

- `packageA` 无法 require `packageB` JS 文件，但可以 require `app`、自己 package 内的 JS 文件
- `packageA` 无法 import `packageB` 的 template，但可以 require `app`、自己 package 内的 template
- `packageA` 无法使用 `packageB` 的资源，但可以使用 `app`、自己 package 内的资源

*低版本兼容*

由微信后台编译来处理旧版本客户端的兼容，后台会编译两份代码包，一份是分包后代码，另外一份是整包的兼容代码。 新客户端用分包，老客户端还是用的整包，完整包会把各个 `subpackage` 里面的路径放到 pages 中。

