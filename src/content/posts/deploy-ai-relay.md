---
title: 如何从零开始搭建一个属于自己的AI中转站
published: 2026-04-09
description: 从零开始，搭建一个中转站
image: ''
tags: [AI, 中转站, VPS, 教程]
category: '折腾'
draft: false
lang: 'zh_CN'
---

> 一篇记录搭建中转站的帖子。

## 前言

这篇文章从在雨云购买服务器开始，记录如何部署，会用到的两个开源项目：

- `sub2api`：<https://github.com/Wei-Shaw/sub2api>
- `CPA`：<https://github.com/router-for-me/CLIProxyAPI>

---

## 一、准备工作

正式开始之前，需要有这些：

- 一台服务器，这里以雨云为例
- codex账号认证文件，这里不提供渠道

---

## 二、在雨云购买服务器

雨云链接，新人可以领取一张五折优惠券（）：

[雨云官网](https://www.rainyun.com/MTAwOTEzOQ==_)

### 1. 选择云服务器

- 地区：推荐香港，不用备案
- 系统：推荐使用 `Ubuntu 22.04/24.04` 选择的时候可以选择安装一个1Panel
- ![1Panel](/images/posts/deploy-ai-relay/1panel_chose.png)
- 配置：个人自用的话2核2G完全足够了
- ![雨云配置截图](/images/posts/deploy-ai-relay/rainyun-kvm.png)
- 新人五折优惠券19块钱即可拿下

### 2. 购买后等待服务器初始化完毕

- 继续等待1Panel面板安装成功
- ![雨云安装完成](/images/posts/deploy-ai-relay/1panel_complete.png)
- 记录下你的1Panel面板访问信息

### 3. 根据信息登录1Panel面板

- ![1Panel面板](/images/posts/deploy-ai-relay/Screenshot_2026-04-09_02-17-37.png)

点击左侧的“系统”，进入防火墙页面，我们打开防火墙。
然后创建两个规则，端口分别填8317和8080

![1Panel防火墙](/images/posts/deploy-ai-relay/Screenshot_2026-04-09_13-57-42.png)

---

## 三、部署sub2api

### 1. 部署准备脚本

点击左侧菜单栏中的“终端”，来到终端页面

![终端页面](/images/posts/deploy-ai-relay/Screenshot_2026-04-09_10-53-24.png)

因为1Panel自带Docker，我们可以直接使用Docker安装sub2api

```bash
# 创建部署目录
mkdir -p /opt/sub2api && cd /opt/sub2api

# 下载并运行部署准备脚本
curl -sSL https://raw.githubusercontent.com/Wei-Shaw/sub2api/main/deploy/docker-deploy.sh | bash
```

### 2. 修改登录密码

部署完准备脚本后，可以来到 `/opt/sub2api/.env` 第 178 行左右修改管理员账号和密码

![账号密码修改部分](/images/posts/deploy-ai-relay/Screenshot_2026-04-09_11-42-53.png)

### 3. 开始部署

修改完成后继续启动

```bash
# 启动服务
cd /opt/sub2api
docker compose up -d

# 查看日志
docker compose logs -f sub2api
```

等待部署完成后，来到容器页面应该能看到多了三个容器

![容器页面](/images/posts/deploy-ai-relay/Screenshot_2026-04-09_11-28-05.png)

到此已经安装好 sub2api 了，可以通过 <http://公网IP:8080> 访问。
但现在这个网站只是一个壳子，还不能提供AI服务，所以接下来继续安装 CPA。

---

## 四、安装CPA

这里推荐 **Docker Compose** 方式部署。

### 1. 拉取仓库

```bash
mkdir -p /opt/cpa && cd /opt/cpa
git clone https://github.com/router-for-me/CLIProxyAPI.git .
```

### 2. 准备配置文件

```bash
cp config.example.yaml config.yaml
```

然后编辑 `config.yaml`，打开远程管理并设置登录密钥：

```yaml
remote-management:
  allow-remote: true
  secret-key: "apikey"
```

### 3. 启动服务

```bash
cd /opt/cpa
docker compose up -d
```

现在反代后台也已经搭建好了，访问 <http://公网IP:8317/management.html> 登录到反代后台，然后进入认证文件页面上传准备好的 Codex 认证文件。

![CPA认证文件](/images/posts/deploy-ai-relay/Screenshot_2026-04-09_13-33-44.png)

来到配置面板，删除这里的三个 API 密钥，然后重新生成一个新的密钥，最后不要忘记点击底部的保存
![CPA密钥管理](/images/posts/deploy-ai-relay/Screenshot_2026-04-09_13-38-33.png)

---

## 五、连通 sub2api 与 CPA

### 1. 接入网络

现在 sub2api 和 CPA 是隔开的，无法访问到 CPA，所以需要将两个 Docker 接入到同一个网络。
来到容器页面，点击编辑CPA容器：

![编辑CPA](/images/posts/deploy-ai-relay/Screenshot_2026-04-09_17-04-19.png)

再把 sub2api 的网络添加到 CPA：

![接入网络](/images/posts/deploy-ai-relay/Screenshot_2026-04-09_17-22-00.png)

其他地方不需要修改，点击确认后等待容器重建完成就好了

---

## 六、在 sub2api 添加 CPA 账号

### 1. 添加账号

打开 sub2api 网站，点击账号管理，添加一个账号
选择OpenAI和API Key

![添加账号](/images/posts/deploy-ai-relay/Screenshot_2026-04-09_17-52-00.png)

地址填 `http://cli-proxy-api:8317/v1`
密钥填写之前在 CPA 管理面板生成的密钥，下滑把池模式打开，点击确定。

### 2. 测试连接

点击测试，选择 GPT-5.4 模型看看能否正常返回内容，成功了的话恭喜你，已经搭建好一个自己的中转站了。
