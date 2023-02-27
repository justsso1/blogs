
---
title: 利用GitLab自动化部署
date: 2020-03-01

---
我了解到GitLab上面有两种方式可以做到自动化部署，webhooks和GitLab CI/CD。webhooks能完成的事情也比较单一，它的原理就是：webhooks提供一个网络钩子，当你的git仓库
触发某些动作比如push时，会触发执行一个脚本，脚本中会有git pull 重启应用等一些操作。
GitLab CI/CD是持续集成、持续部署，简单来讲持续集成跟多人合作，多个账户提交git有关，持续部署，会经过自动测试，自动打包操作，可以打成能够
部署的状态，所以CI/CD做的事情比webhooks多很多，可以说，二者解决问题的场景时不同的。
在实际的生产中呢，一个项目的部署要考虑到代码合并、环境配置的，所以显而易见，GitLab CI/CD更满足现在的需求。

既然都想自动化部署了，那干脆就搞的彻底一点吧，利用GitLab CI/CD做一套自动化部署，从此远离人肉部署。

CI/CD

什么是CI/CD?
持续集成可以通过自动运行测试来帮助检测代码缺陷，而持续部署可以帮助您向生产环境交付代码。

在这里我想使用shell脚本命令就能达到自动部署项目的目的，暂时不使用docker，虽然docker更好解决环境兼容问题，但是目前服务器上面已经部署了好几个项目了，环境也是搭建好的，所以
暂时跳过docker，把GitLab CI/CD配置好就OK

从8.0版开始，GitLab 持续集成（CI）已完全集成到GitLab本身，并且默认情况下在所有项目上都启用。它具有持续部署和持续交付的功能，可用于构建、测试和部署你的应用程序，下面是GitLab CI/CD
流程图。

![](http://cdn.hixiaoya.com/blogs/imgs/GitLab_CI_CD/GitLabCI.png)
步骤一：
因为GitLab已经集成了CI ，所以我们在项目的根目录下，创建一个.gitlab-ci.yml文件即可，便可触发CI过程

步骤二：
配置GitLab Runner,它相当于一个运行软件，去按照gitlab-ci.yml中写的命令去执行。
GitLab Runner参考文档： https://docs.gitlab.com/runner/
我使用同一台服务器作为Runner,其实最好不要用同一台服务器做Runner,它会占用一些资源，有可能会影响生产环境。

先说明一下我服务器的额环境：ubuntu系统

安装Runner
我选择Repositories方式
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash

sudo apt-get install gitlab-runner

注册Runner
注册时需要你项目的token，先来拿到token，在项目仓库的设置>CI>Runner展开，看到左侧有”指定的Runner”，下面有token
好，服务器上运行如下：

Shell
script
sudo gitlab-runner register
Enter your GitLab instance URL:

Shell
script
Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com )
https://gitlab.com
Shell
script
Please enter the gitlab-ci token for this runner
输入你的token
然后是让你输入description 和 tag，
tag的作用是当你的提交有你设置的tag时，也就是选定这个Runner运行。

输入Runner executor

Shell
script
Please enter the executor: ssh, docker+machine, docker-ssh+machine, kubernetes, docker, parallels, virtualbox, docker-ssh, shell:
shell
这里我选择了shell

然后不出意外就会注册成功

然后回到gitlab仓库查看，runner是否成功

![Runner 注册成功](http://cdn.hixiaoya.com/blogs/imgs/GitLab_CI_CD/runner_register.png)

GitLab Runner 会自动的创建一个gitlab runner用户，然后你的CI 操作会有这个用户运行

好，接下来编写.gitlab-ci.yml 文件：

Yaml


stages:
  - build
  - deploy

cache:
  key: ${CI_BUILD_REF_NAME}
  paths:
    - node_modules


build_all:
  stage: build
  tags:
    - tags
  script:
    - echo 'build_all'
    - pwd


deploy_all:
  stage: deploy
  only:
    - master
  tags:
    - tags
  script:
    - cnpm install
    - pm2 restart qiniu
  when: manual
  allow_failure: false
我每个stage都打了tag tags: - tags这样可以触发你指定的runner，不然的话，gitlab ci就会选运行的最快的那个runner，往往就会选定共享runner
了。

我还做了缓存：

Yaml
cache:
  key: ${CI_BUILD_REF_NAME}
  paths:
    - node_modules
我的项目的nodejs写的后台项目，然后使用pm2维护进程。

deploy阶段我选择，手动触发，不可失败，确保线上不会出现问题。

这样，当push到GitLab时，会自动触发CI/CD

![自动触发一条流水线](http://cdn.hixiaoya.com/blogs/imgs/GitLab_CI_CD/pipeline_1.png)

由于我的deploy需要手动触发，所以得自己去点击按钮

![2个stage](http://cdn.hixiaoya.com/blogs/imgs/GitLab_CI_CD/stage.png)
执行成功

![stage都成功了](http://cdn.hixiaoya.com/blogs/imgs/GitLab_CI_CD/stage_2.png)



流水线也显示成功了

![流水线成功](http://cdn.hixiaoya.com/blogs/imgs/GitLab_CI_CD/pipeline_2.png)