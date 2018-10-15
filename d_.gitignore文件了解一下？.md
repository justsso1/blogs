.gitignore文件里面填写的文件名，在提交时，这些文件会被忽略掉。
.gitignore文件中通常会写 系统自动生成的垃圾文件名、保密性的文件、自动生成的文件或文件夹

通常一个git仓库中，会自动生成.gitignore文件，该文件有一些默认的配置。

下面是一个模版的文件：
```
/node_modules
.idea/
.vscode/
.DS_Store
/routes/public/uploads/
```
/node_modules
文件夹没有必要上传，太大而且还可以根据package.json文件自动生成

.vscode/  
vscode文件夹中有vsCode的配置文件，没有必要提交


.DS_Store 是苹果系统自带的文件

/router/public/uploads 是上传的文件，没有必要上传到仓库