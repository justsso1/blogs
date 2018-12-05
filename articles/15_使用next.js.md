# 使用next.js

当页面初次加载时，getInitialProps只会在服务端执行一次。getInitialProps只有在路由切换的时候（如Link组件跳转或路由自定义跳转）时，客户端的才会被执行。

当页面初始化加载时，getInitialProps只会加载在服务端。只有当路由跳转（Link组件跳转或 API 方法跳转）时，客户端才会执行getInitialProps。
注意：getInitialProps将不能使用在子组件中。只能使用在pages页面中。

```js
// pages/about.js
export default class extends React.Component {
    static async getInitialProps(){
        console.log('about.js执行');
        const res = await axios.get('https://api.github.com/repos/zeit/next.js')
        const json = await res.data;
        console.log(json.stargazers_count)
        return { stars: json.stargazers_count }
        return {}
    }
    render(){
        return (
            <Layout>

                <h1>About页面</h1>
                <p>Next.js has {this.props.stars} ⭐️</p>
                <Link prefetch href='/preact'><a>How about preact?</a></Link>

            </Layout>
        )
    }
}
```

如果是服务端首次加载about.js页面，那么getInitialProps()只会执行一次。并且打印在后台。如果是通过Link组件加载，就是客户端记载，每次客户端加载都会执行一次该方法，打印在浏览器console中。

`Link`

``` js 
import Link from 'next/link';
```

Link组件的属性：

- `href` : 请求的真实的url地址
- `as` :  浏览器中看到的url地址
- `prefetch` : Next.js 将会在后台预加载这些页面
---
#### Router对象

```js
import Router from 'next/router'
```

Router对象的API如下：
push 和 replace 函数的第二个参数as，是为了装饰 URL 作用。如果你在服务器端设置了自定义路由将会起作用。

- route - 当前路由的String类型
- pathname - 不包含查询内容的当前路径，为String类型
- query - 查询内容，被解析成Object类型. 默认为{}
- asPath - 展现在浏览器上的实际路径，包含查询内容，为String类型
- push(url, as=url) - 页面渲染第一个参数 url 的页面，浏览器栏显示的是第二个参数 url
- replace(url, as=url) - performs a replaceState call with the given url
- beforePopState(cb=function) - 在路由器处理事件之前拦截.
- router.prefetch('/dynamic')
  
push 和 replace 函数的第二个参数as，是为了装饰 URL 作用。如果你在服务器端设置了自定义路由将会起作用。
使用例子：
```js
const handleRouteChange = url => {
  console.log('App is changing to: ', url)
}

Router.events.on('routeChangeStart', handleRouteChange)
```