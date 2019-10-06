# es6-ArrayBuffer

### ArrayBuffer对象是什么

ArrayBuffer对象代表存储二进制数据的一段内存，它不能直接读写，只能通过视图（DataView视图或者TypedArray视图）来读写，视图的作用是以指定格式解读二进制数据。

ArrayBuffer也是一个构造函数，可以分配一段存储数据的连续内存区域。

``` javascript
const buf = new ArrayBuffer(32);
```

上面代码生成了一段 32 字节的内存区域，每个字节的值默认都是 0。可以看到，ArrayBuffer构造函数的参数是所需要的内存大小（单位字节）。

为了读写这段内容，需要为它指定视图。DataView视图的创建，需要提供ArrayBuffer对象实例作为参数。

``` javascript
const buf = new ArrayBuffer(32);
const dataView = new DataView(buf);
dataView.getUint8(0) // 0
```

上面代码对一段 32 字节的内存，建立DataView视图，然后以不带符号的 8 位整数格式，从头读取 8 位二进制数据，结果得到 0，因为原始内存的ArrayBuffer对象，默认所有位都是 0。

另一种TypedArray视图，与DataView视图的一个区别是，它不是一个构造函数，而是一组构造函数，代表不同的数据格式。

``` javascript
const buffer = new ArrayBuffer(12);

const x1 = new Int32Array(buffer);
x1[0] = 1;
const x2 = new Uint8Array(buffer);
x2[0]  = 2;

x1[0] // 2
```

上面代码对同一段内存，分别建立两种视图：32 位带符号整数（Int32Array构造函数）和 8 位不带符号整数（Uint8Array构造函数）。由于两个视图对应的是同一段内存，一个视图修改底层内存，会影响到另一个视图。

TypedArray视图的构造函数，除了接受ArrayBuffer实例作为参数，还可以接受普通数组作为参数，直接分配内存生成底层的ArrayBuffer实例，并同时完成对这段内存的赋值。

``` javascript
const typedArray = new Uint8Array([0,1,2]);
typedArray.length // 3

typedArray[0] = 5;
typedArray // [5, 1, 2]
```

上面代码使用TypedArray视图的Uint8Array构造函数，新建一个不带符号的 8 位整数视图。可以看到，Uint8Array直接使用普通数组作为参数，对底层内存的赋值同时完成。

### 存储单位换算





### ArrayBuffer的实例方法

- ArrayBuffer.prototype.byteLength
- ArrayBuffer.prototype.slice(start,end)

### ArrayBuffer的静态方法

- ArrayBuffer.isView()

ArrayBuffer有一个静态方法isView，返回一个布尔值，表示参数是否为ArrayBuffer的视图实例。这个方法大致相当于判断参数，是否为TypedArray实例或DataView实例。

``` js
const buffer = new ArrayBuffer(8);
ArrayBuffer.isView(buffer) // false

const v = new Int32Array(buffer);
ArrayBuffer.isView(v) // true
```

### 二进制数组的应用

#### FileApi

`File`接口和`FileReader`对象。

准备工作

``` html
<input type="file" id="files" multiple />
<div id="list"></div>
<div id="images"></div>
<!-- File API相关操作写在了script.js中 -->
<script src="./script.js"></script>
```

`File`对象是特殊类型的blob。需要在浏览器中检测其兼容性。

``` js
if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
  throw new Error("当前浏览器对FileAPI的支持不完善");
}
```

**文件属性-File**
event.target.files 是一个FileList对象，它是一个由File对象组成的列表。

每个 File 对象，保存着选中的对应文件的属性。常用的有：

name：文件名
type：文件类型
size：文件大小
下面，通过 type 属性，过滤掉非图片类型的文件，只展示图片类型文件的信息：

`fileReader`对应的event的详细内容在console控制台打印如下：

``` js
ProgressEvent {isTrusted: true, lengthComputable: true, loaded: 6121, total: 6121, type: "load", …}
bubbles: false
cancelBubble: false
cancelable: false
composed: false
currentTarget: FileReader {readyState: 2, result: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…iM0kREBEWWjOecYRokiIgIiICIiCpFJE2jQiIiRERSl//2Q==", error: null, onprogress: null, onloadstart: ƒ, …}
defaultPrevented: false
eventPhase: 0
isTrusted: true
lengthComputable: true
loaded: 6121
path: []
returnValue: true
srcElement: FileReader {readyState: 2, result: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…iM0kREBEWWjOecYRokiIgIiICIiCpFJE2jQiIiRERSl//2Q==", error: null, onprogress: null, onloadstart: ƒ, …}
target: FileReader {readyState: 2, result: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…iM0kREBEWWjOecYRokiIgIiICIiCpFJE2jQiIiRERSl//2Q==", error: null, onprogress: null, onloadstart: ƒ, …}
timeStamp: 4294.750000000931
total: 6121
type: "load"
__proto__: ProgressEvent
```


FileReader有以下几个监听事件。

- onloadstart
- onload
- onloadend
- onprgress

通过 `lengthComputable``total``loaded`这几个属性可以做到监听文件加载进度。

### 监听文件加载进度

``` js
if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
    throw new Error("当前浏览器对FileApi支持不完善");
}

function handleFileSelect(e) {
    const {files} = e.target;
    console.log('选取文件个数：', files.length);
    console.log(files);


    let vm = document.createDocumentFragment();


    let innerHtml = '';
    let loaded = 0, total = files.length;

    for (let file of files) {
        innerHtml += `<li>
            <strong>${file.name}</strong>
            <span>${file.type}</span>
            <span>${file.size} bytes</span>
        </li>`;

        const reader = new FileReader();
        reader.onloadstart = function (ev) {
            handleLoadStart(ev, file)
        };
        reader.onload = function (ev) {
            handleOnLoad(ev, file)
        };
        reader.onprogress = ev => handleOnProgress(ev, file);

        reader.onloadend = function (ev) {
            handleLoadEnd(ev, file)
        };
        reader.readAsDataURL(file);

    }

    const handleLoadStart = function (ev, file) {
        console.log('>>> start load', file.name)
    };

    const handleOnLoad = function (ev, file) {
        console.log('>>>  Load file', file.name);
        const img = document.createElement('img');

        img.height = 150;
        img.width = 250;
        img.src = ev.target.result;
        vm.appendChild(img);
        loaded++;
        if (loaded === total) {
            document.querySelector('#images').appendChild(vm);
        }
    };
    const handleOnProgress = function (ev, file) {
        if (!ev.lengthComputable) {
            return;
        }
        console.log(ev);
        //计算进度，展示百分比
        let percent = Math.round((ev.loaded / ev.total) * 100);
        console.log('>>> Loading', file.name, 'progress is ', percent, '%');
    };

    const handleLoadEnd = function (ev, file) {
        console.log('>>> End Load', file.name)
    };


    document.querySelector('#list').innerHTML = `<ul>${innerHtml}</ul>`;
}


document.querySelector('#files').addEventListener('change', handleFileSelect, false);

```

### 大文件分片

File是Blob对象的一个特例，可以使用slice()来截取文件
### 拖拽上传

拖拽上传主要会用到的知识点有：拖拽drog|drop，FileAPI 读取文件，formData

#### H5原生的Drag和Drop事件

H5原生提供拖拽操作，不必使用鼠标事件来模拟。
