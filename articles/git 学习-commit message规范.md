git是现在最流行的版本控制工具，书写良好的commit message能大大提高代码维护的效率。

`commit-message`



1. type 

   `type`为必填项，用于指定commit的类型，约定了`feat`、`fix`两个`主要type`，以及docs、style、build、refactor、revert五个`特殊type`，`其余type`暂不使用。

   ```
   # 主要type
   feat:     增加新功能
   fix:      修复bug
   
   # 特殊type
   docs:     只改动了文档相关的内容
   style:    不影响代码含义的改动，例如去掉空格、改变缩进、增删分号
   build:    构造工具的或者外部依赖的改动，例如webpack，npm
   refactor: 代码重构时使用
   revert:   执行git revert打印的message
   
   # 暂不使用type
   test:     添加测试或者修改现有测试
   perf:     提高性能的改动
   ci:       与CI（持续集成服务）有关的改动
   chore:    不修改src或者test的其余修改，例如构建过程或辅助工具的变动
   ```


   当一次改动包括`主要type`与`特殊type`时，统一采用`主要type`。

2. scope 

   `scope`也为必填项，用于描述改动的范围，格式为项目名/模块名，例如： `node-pc/common` `rrd-h5/activity`，而`we-sdk`不需指定模块名。如果一次commit修改多个模块，建议拆分成多次commit，以便更好追踪和维护。

3. Body

   `body`填写详细描述，主要描述`改动之前的情况`及`修改动机`，对于小的修改不作要求，但是重大需求、更新等必须添加body来作说明。

4. Break changes

   `break changes`指明是否产生了破坏性修改，涉及break changes的改动必须指明该项，类似版本升级、接口参数减少、接口删除、迁移等。

5. affect issues

   `affect issues`指明是否影响了某个问题。例如我们使用jira时，我们在`commit message`中可以填写其影响的`JIRA_ID`，若要开启该功能需要先打通`jira`与`gitlab`。参考文档：[docs.gitlab.com/ee/user/pro…](https://docs.gitlab.com/ee/user/project/integrations/jira.html)

   



