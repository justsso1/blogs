# 阿里大于短信接口InvalidTimeStamp.Expired错误

#### 异常原因：

| errCode                  | errMessage                                     | 描述                                                         |
| ------------------------ | ---------------------------------------------- | ------------------------------------------------------------ |
| InvalidTimeStamp.Expired | Specified time stamp or date value is expired. | 用户时间和服务器时间不在 15 分钟内请检查您的时间戳设置，确认时间戳和服务器时间的差值是否在 15 分钟内。 |

一般出现该错误都是因为调用代码中时间/时区设置有误导致，请检查下相关设置是否正确。

#### Linux设置和修改时间与时区

>  linux系统时间有两个，一个是硬件时间，即BIOS时间，就是我们进行CMOS设置时看到的时间，另一个是系统时间，是linux系统Kernel时间。当Linux启动时，系统Kernel会去读取硬件时钟的设置，然后系统时钟就会独立于硬件运作。有时我们会发现系统时钟和硬件时钟不一致，因此需要执行时间同步。
>

时区设置用`tzselect` 命令来实现。但是通过`tzselect`命令设置`TZ`这个环境变量来选择的时区，需要将变量添加到`/etc/.profile`文件中。

##### 一、执行**tzselect命令**

*执行tzselect命令* --> *选择Asia* --> *选择China* --> *选择east* *China* - *Beijing*, *Guangdong*, *Shanghai*, *etc*-->*然后输入1。*

执行完tzselect命令选择时区后，时区并没有更改，只是在命令最后提示你可以执行 **TZ=’Asia/Shanghai’; export TZ** 并将这行命令添加到`/etc/.profile`中，然后退出并重新登录。

##### 二、修改配置文件来修改时区

```
[root@linux-node ~]# echo "ZONE=Asia/Shanghai" >> /etc/sysconfig/clock         
[root@linux-node ~]# rm -f /etc/localtime
#链接到上海时区文件       
[root@linux-node ~]# ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

#####三、**hwclock/clock 查看/设置硬件时间**

```bash
//查看系统硬件时钟
hwclock  --show 
//或者
clock  --show


//设置硬件时间
hwclock --set --date="06/14/19 14:55" （月/日/年时:分:秒） 或者
 clock --set --date="06/14/19 14:55" （月/日/年时:分:秒）
```

#####四、**同步系统及硬件时钟**

```shell
[root@linux-node ~]# hwclock --hctosys 或者
[root@linux-node ~]# clock --hctosys  
备注：hc代表硬件时间，sys代表系统时间，以硬件时间为基准，系统时间找硬件时间同步

[root@linux-node ~]# hwclock --systohc或者
[root@linux-node ~]# clock --systohc 
备注：以系统时间为基准，硬件时间找系统时间同步
```

##### 五、服务器重启，时间生效

shutdown命令安全地将系统关机。有些用户会使用直接断掉电源的方式来关闭linux，这是十分危险的。因为linux与windows不同，其后台运行着许多进程，所以强制关机可能会导致进程的数据丢失﹐使系统处于不稳定的状态﹐甚至在有的系统中会损坏硬件设备。而在系统关机前使用shutdown命令﹐系统管理员会通知所有登录的用户系统将要关闭。并且login指令会被冻结﹐即新的用户不能再登录。直接关机或者延迟一定的时间才关机都是可能的﹐还可能重启。这是由所有进程〔process〕都会收到系统所送达的信号〔signal〕决定的。这让像vi之类的程序有时间储存目前正在编辑的文档﹐而像处理邮件〔mail〕和新闻〔news〕的程序则可以正常地离开等等。

```shell
shutdown -r now  //立刻重启系统
```

重启之后，通常会有nginx的重启。

```shell
cd /usr/local/nginx/sbin
./nginx
```

完成以上步骤，阿里大于短信接口就可以正常使用了。



另外附上几个linux实用的命令：

`lsb_release -a` 用于查看自己的系统是ubuntu还是redhat或者其他系统

`date -R` 查看当前时间

`shutdown` 参数说明:

　　[-t] 在改变到其它runlevel之前﹐告诉init多久以后关机。

　　[-r] 重启计算器。

　　[-k] 并不真正关机﹐只是送警告信号给每位登录者〔login〕。

　　[-h] 关机后关闭电源〔halt〕。

　　[-n] 不用init﹐而是自己来关机。不鼓励使用这个选项﹐而且该选项所产生的后果往往不总是你所预期得到的。

　　[-c] cancel current process取消目前正在执行的关机程序。所以这个选项当然没有时间参数﹐但是可以输入一个用来解释的讯息﹐而这信息将会送到每位使用者。

　　[-f] 在重启计算器〔reboot〕时忽略fsck。

　　[-F] 在重启计算器〔reboot〕时强迫fsck。

​		[-time] 设定关机〔shutdown〕前的时间。

