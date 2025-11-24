---
title: Docker 速通
date: 2025-11-24
tags:
  - Docker
category:
  - 代码效率
---
# 前言

学习[《尚硅谷3小时速通Docker教程》](https://www.bilibili.com/video/BV1Zn4y1X7AZ) ，视频配速 1.5。写的乱糟糟的，因为当时觉得这个3小时速通教程，只是打个草稿，后续会看尚硅谷另一个14小时左右的教程补全。

<!-- more -->

# docker 安装

阿里云容器镜像服务 ACR 提供了官方的镜像加速器，从而加速官方镜像的下载，参考[官方文档](https://help.aliyun.com/zh/acr/user-guide/accelerate-the-pulls-of-docker-official-images)配置镜像加速器。

```zsh
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["<镜像加速器地址>"]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
```

参考 [Docker 官方文档](https://docs.docker.com/engine/install/ubuntu/)在 Ubuntu 上安装 Docker：

```zsh
# Add Docker's official GPG key:
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Signed-By: /etc/apt/keyrings/docker.asc
EOF

sudo apt update

# 安装 docker
# 执行这一步的时候，用校园网不行，开手机热点就行，在云服务器上就没这个问题
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 安装后，docker会自动运行
# 查看docker是否安装成功
sudo systemctl status docker

# 启动docker
sudo systemctl start docker

# docker开机自启
sudo systemctl enable docker
```

报错 `permission denied while trying to connect to the docker API at unix:///var/run/docker.sock`

解决：将用户加入docker组。执行 `sudo usermod -aG docker $USER`，然后**注销并重新登录** 。

# docker 命令

镜像的完整名称是 镜像名:版本
[Docker Hub](https://hub.docker.com/) Docker 镜像的应用市场，可以查看并下载指定版本的镜像文件。

- docker search 检索
- docker pull 下载
- docker images 已下载的镜像列表，images 即 image ls
- docker rmi 删除镜像，rmi 即 remove image

- 运行：docker run
- 查看：docker ps
	- docker ps 查看正在运行的容器，
	- docker ps -a 查看运行中和已停止的容器
- 停止：docker stop
- 启动：docker start
- 重启：`docker restart`
- 状态：docker stats
- 日志：docker logs
- 进入：docker exec
- 删除：docker rm

> 容器与镜像，就像是进程与程序的关系

## 创建容器

docker run

- -d 后台启动
- --name 指定容器名字，默认为随机名字
- `-p 主机端口:容器端口` 端口映射，容器中有一套独立于主机的文件系统。不同容器可以共享一个端口号，互不干扰；但是主机端口号不能重复。
- `--restart always` 容器开机自启

容器创建后，`docker ps` 确认容器创建是否正在运行，输出内容没有新容器，则用 `docker ps -a` 查看容器的状态，以及 `docker logs 容器名` 查看容器日志。

批量移除（删除）容器：

`docker ps -aq` 会打印所有容器的 ID。`docker rm -f $(docker ps -aq)` 强制移除所有容器，包括正在运行中的（-f 保证）。

docker exec
进入容器 `docker exec -it mynginx bash` ，指定容器，除了用容器名，还可以用容器 ID。ID 长度很长，可以只用前3位指定容器。

## 保存镜像

提交：docker commit，用法上与 git commit 相似
保存：docker save
加载：docker load，加载别人发给我们的镜像压缩包。

## 分享社区

登录：docker login，使用 docker hub网页注册的帐号，在终端登录
命名：docker tag，为镜像打上 tag 标签，也就是更新版本
推送：docker push，推送到 docker hub 帐号。

```zsh
# 对nginx官方镜像进行更改后，上传到社区
docker tag nginx:v1.0 yonglu/mynginx:v1.0
docker push yonglu/mynginx:v1.0

# 更新最新版本，方便用户没指定 tag 时也能下载到最新版本镜像
docker tag mynginx:v1.0 yonglu/mynginx:latest
docker push yonglu/mynginx:latest
```

# docker 存储

每次 docker 启动容器，都是打开一个全新容器，之前做的修改都消失了。此外，正在运行的容器如果突然崩溃，我们做的修改也会丢失。于是需要像文档一样随时保存容器数据。

目录挂载 `-v 主机文件位置:容器文件位置` ，如果主机上该路径不存在，则自动创建。相当于主机文件挂载到容器上，主机与容器共享文件。因此，可以直接在主机上修改文件，然后同步到容器中。

目录挂载容器的配置文件时，会失败，查看日志 `docker logs 容器ID` ，得知主机文件初始为空，挂载后，容器的配置文件也为空，容器启动失败。除非一开始就在主机上放好容器配置文件，但这很不方便。

解决之道是卷映射。容器的配置文件可以在主机的 `/var/lib/docker/volumes/<volume-name>` 处找到。

```zsh
# 目录挂载
# nghtml 是主机文件，html 是容器nginx的首页配置文件
-v /app/nghtml:/usr/share/nginx/html

# 卷映射
# /etc/nginx目录下的文件，可以在/var/lib/docker/volumes/ngconf/_data目录下找到
-v ngconf:/etc/nginx
```

dokcer volume 有一组有关卷映射的命令。

- `docker volume ls` 查看已有的卷。
- `docker create` 除了启动时创建，可以自行创建卷。
- `docker volume rm` 删除卷。
- `docker volume rm $(docker volumn ls -q)` 删除全部卷。
- `docker inspect` 查看已有卷的详细信息，比如挂载点。这个命令的全称是 `docker container inspect` 。

删除容器，和容器关联的卷会保留，下次创建容器，依然可以挂载上次的数据。

容器之间访问。前面讲了利用端口映射，外部设备通过公网访问容器。容器之间可以直接用 容器IP+容器端口 互相访问，而不是一个容器通过机器的公网IP，通过公网访问另一个容器。
docker 会为每个容器分配一个唯一的容器 IP，通过命令 `ip a` 可以看到一张名为 docker0 的网卡。

# docker 网络

但是 docker0 分配的IP由于各种原因可能会变化，参考现实中人们访问网站是通过域名而非 IP，docker 提供了类似功能的自定义网络。

docker network --help

- `docker network ls`，查看网络，其中有我们新建的网络，以及默认的 docker0 网络 `bridge` 。
- `docker network create` 创建自定义网络。
- `docker network rm` 删除网络。

```zsh
# 容器启动时，添加网络选项 --network
docker run -d -p 88:80 --name app1 --network mynet nginx
docker run -d -p 99:80 --name app2 --network mynet nginx

# 容器app1通过自定义网络访问app2，容器名即容器域名
# 依然可以用 IP 访问，IP 是新建网络分配的IP，而不是 docker0
curl http://app2:80
curl http://172.20.0.3:80
```

> 通过dockr0 网络访问容器，方向从公网到容器，此时是公网IP+公网端口，比如 88、99 。
> 通过自定义网络访问容器，方向是从容器到容器，与公网无关，此时是容器IP（容器名）+容器端口，比如 80 。

自定义网络更加安全，容器之间访问畅通无阻，而且没有向公网暴露端口。

# 配置容器环境变量

![一台主机上进行Redis主从同步集群](https://vip.123pan.cn/1844935313/obsidian/20251122084509638.png)

使用 [bitnami/redis](https://hub.docker.com/r/bitnami/redis) 镜像启动容器，配置端口、存储（数据、配置文件）、环境变量、网络：

```zsh
docker run -d -p 6379:6379 \
-v /app/rd1:/bitnami/redis/data \
-e REDIS_REPLICATION_MODE=master \
-e REDIS_PASSWORD=123456 \
--network mynet --name redis01 \
bitnami/redis
```

redis 容器一创建就停止，查看容器日志，最新一条信息显示 `1:M 24 Nov 2025 07:17:58.908 # Can't open the append-only file: Permission denied` 。原因是挂载目录 `/app/rd1` ，rd1目录的权限为 `rwxr-xr-x` ，只有 root 用户可以在该目录下创建文件。

```zsh
# 递归修改权限
chmod -R 777 /app/rd1
# 重启docker
docker restart redis01
```

同理，创建 redis02 容器：

```zsh
docker run -d -p 6380:6379 \
-v /app/rd2:/bitnami/redis/data \
-e REDIS_REPLICATION_MODE=slave \
-e REDIS_MASTER_HOST=redis01 \
-e REDIS_MASTER_PORT_NUMBER=6379 \
-e REDIS_MASTER_PASSWORD=123456 \
-e REDIS_PASSWORD=123456 \
--network mynet --name redis02 \
bitnami/redis
```

通过 Redis图形化界面 [Another Redis Manager](https://github.com/qishibo/AnotherRedisDesktopManager) ，连接云服务器上的两个容器。注意，云服务器需要在入方向开放 6379、6380端口。

在主容器中添加一条记录，从容器也会同步添加这条记录。

> MySQL图形化界面 [HeidiSQL](https://github.com/HeidiSQL/HeidiSQL) 。

# 批量管理容器

docker compress

- `docker compose up -d` 上线，即首次启动，`-d` 后台启动。
- `docker compose down` 下线，即移除容器。
- `docker compose start x1 x2 x3` 批量启动容器x1、x2、x3 。
- `docker compose stop x1 x3` 停止。
- `docker compose scale x2=3` 扩容，应用实例启动3份。

![实战演练：安装 WordPress 博客系统](https://vip.123pan.cn/1844935313/obsidian/20251124180752703.png)

创建一个 `compose.yaml` ，这个文件可以一次将图中的 MySQL 和 WordPress 启动容器。

```yaml
name: myblog

services:
  mysql:
    container_name: mysql
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=123456
      - MYSQL_DATABASE=wordpress
    volumes:
      - mysql-data:/var/lib/mysql
      - /app/myconf:/etc/mysql/conf.d
    restart: always
    networks:
      - blog
	  
  wordpress:
    container_name: wordpress-app
    image: wordpress
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_USER: root
      WORDPRESS_DB_PASSWORD: 123456
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wordpress:/var/www/html
    restart: always
    networks:
      - blog
    depends_on:
      - mysql

volumes:
  mysql-data:
  wordpress:

networks:
  blog:
```

参考 [Docker compose 配置文档](https://docs.docker.com/reference/compose-file/) ，文档中提到一些顶级元素：name、services、nwtworks、volumes、configs、secrets。顶级元素类似手机设置里的选项。

`- "3306:3306"` 中 `-` 表示数组。每个容器可以配置自己的 `volumes` 元素，如果容器用到卷映射，比如 `mysql-data` ，则需要额外在顶级元素 `volumes` 下添加该卷（可以详细配置卷的信息）。

环境变量的两种写法都可以。

```zsh
# 默认根据compose.yaml启动
docker compose up -d
# -f 指定文件名
docker compose -f compose.yaml up -d

# 下线容器，但是数据还在
# docker compose down --help 可以找到下线容器并删除卷的选项
docker compose -f compose.yaml down
```

# 制作镜像

常见指令，参考 [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/) ：

- FROM 指定镜像基础环境
- RUN 运行自定义命令
- CMD 容器启动命令或参数
- LABEL 自定义标签
- EXPOSE 指定暴露端口
- ENV 环境变量
- ADD 添加文件到镜像
- COPY 复制文件到镜像
- ENTRYPOINT 容器固定启动命令
- VOLUME 数据卷
- USER 指定用户和用户组
- WORKDIR 指定默认工作目录
- ARG 指定构建参数

镜像文件 `Dockfile` 内容如下所示，其中 `COPY` 的第一个参数是 `app.jar` 在本机的位置，第二个参数是 `app.jar` 在容器中的位置。镜像生成的容器，里面也有一套路径，就像是虚拟机。 `ENTRYPOINT` 中的启动命令，可以写成数组形式。

```dockerfile
FROM openjdk:21

LABEL author=yonglu

COPY app.jar /app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","/app.jar"]
```

```zsh
# 构建镜像命令，末尾的点号表示镜像的上下文环境在当前目录下
docker build -f Dockfile -t myjavaapp:v1.0 .

# 查看新镜像
docker images
```

Docker 的镜像分层机制。我们下载某一个镜像的多个版本，比如 Java，这时候 docker 会利用该机制，将不同版本镜像启动的容器能共用的镜像部分，共用起来，以降低容器所占磁盘空间。
