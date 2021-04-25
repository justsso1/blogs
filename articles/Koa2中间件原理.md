---
2020.5.29
---
koa2中间价的理论模型是洋葱模式。

```Javascript

async function fn1(next) {
    console.log('fn1 ')
    next && await next()
    console.log('fn1 end')
}

async function fn2(next) {
    console.log('fn2')
    next && await next()
    console.log('fn2 end')
}

async function fn3(next) {
    console.log('fn3')
    next && await next()
    console.log('fn3 end')
}

let middleware = [fn1, fn2, fn3]
//中间件的第二个参数都是next，且是一个函数，函数要返回要传递的函数，这样才不能在第二层传递时执行。 还有函数类型要是一个promise，才可以被await；所以使用了Promise.resolve()
function compose2(middleware) {
    return function () {

        h(0)

        function h(index) {
            let fn = middleware[index]
            if (!fn) {
                return Promise.resolve()
            }

            // return fn(function next() {
            //     return Promise.resolve(h(index + 1))
            // })

            return Promise.resolve(
                fn(function next(){
                    return h(index+1)
                })
            )

        }
    }
}

let finalFn = compose2(middleware)
finalFn()
/*希望打印
fn1
fn2
fn3
fn3 end
fn2 end
fn1 end
 */
```