---
title: 从0开始arch Linux
date: 2026-01-25
tags:
  - Arch
category:
  - Linux
---
# 前言

参考了Ivon 的 [我的Linux电脑必装软体 (2025年版)](https://ivonblog.com/posts/linux-recommended-application/) 和 Azure Zeng的[Arch Linux+KDE安装流程和踩坑记录](https://blog.azurezeng.com/installation-guide-for-archlinux-kde/)，以及自己此前使用 Ubuntu 的习惯。

# 安装 arch linux

## 准备镜像

安装前，关闭电脑的安全启动（好像我一直都是关闭安全启动，启动虚拟化）

一个U盘+Ventoy+arch linux iso镜像

> 说明：
> 之前的u盘找不到了，想起本科毕业时学院送的8G u盘，想不到还能派上用场。
> Ventoy使用很简单，在本地打开Ventoy,在u盘内部安装Ventoy，将下载下来的iso文件拖入u盘根目录。
> arch linux 镜像下载：官网推荐用BitTorrent下载，我用motrix作为下载器。

选择U盘启动，在 ventoy 菜单选择arch linux 的iso镜像，接下来都是确认键，直到进入 tty1。

- 接着打开磁盘管理器，格式化硬盘分区，腾出空间安装新系统。
- 重启电脑，按 F12 进入联想thinkbook的启动菜单，选择U盘启动
- 进入Ventoy应用界面，选择arch linux镜像，选择boot in noraml mode,选择Arch Linux install medium (x86_64, UEFI)，然后开始安装，安装完毕，显示蓝色的Welcome to arch，并已经以 root 身份登录。

arch linux安装完毕，此时u盘还不可以取下，u盘作为一个临时的arch linux系统。面前的终端，文档里称之为virtual console，它的shell prompt是zsh，有命令补全功能。

###  连接wifi

使用无线网络：

```zsh
iwctl       # 进入无线网络控制界面
device list # 查看无线网卡信息
```

这里显示的网卡设备名是 wlan0 ，接下来输入如下命令扫描附近的的无线网络：

```zsh
station wlan0 scan # 扫描
station wlan0 get-networks # 显示结果
```

接下来使用 connect 参数进行连接，例如这里假设网络名为 BeastSenbei ：

```zsh
station wlan0 connect BeastSenbei # 如果有密码则会要求你输入
```

之后直接输入 exit 即可退出该界面。使用ping确认网络是否连接成功。

```zsh
ping ping.archlinux.org
```

## 磁盘分区

```zsh
fdisk -l  # 或者 lsblk
cfdisk /dev/nvme0n1
```

可以看到一个 Free Space，选中并选择 `[New]` 即可，默认直接敲两下回车就是用所有的空间，完成之后在下面选择 `[Write]` 然后输入 yes 即可。此时通过 `fdisk -l` 可以看到新分区 `/dev/nvme1n1p4 Linux filesysytem` 。

```zsh
# EFI引导分区格式化，一般分配100MB
mkfs.fat -F 32 /dev/nvme0n1p3
# 将该分区格式化为 ext4 格式
mkfs.ext4 /dev/nvme0n1p4

# 挂载文件系统
mount /dev/nvme0n1p4 /mnt
# 挂载EFI分区
mount --mkdir /dev/nvme0n1p3 /mnt/boot

# 基础安装 base linux base-devel linux-firmware
# 管理声卡 alsa-utils
# 声音相关 pipewire，pipewire-alsa，pipewire-pulse，pipewire-jack，wireplumber
# 网络管理 networkmanager
# 蓝牙支持 bluez，bluez-utils
# SSH协议 openssh
# NTFS读写支持 ntfs-3g
# Arch Linux 镜像站地址获取 reflector
# 微码修正文件 intel-ucode(Intel CPU)，amd-ucode(AMD CPU)
# 命令行软件 gvim git zsh sudo
# 总计1.5GB
pacstrap -K /mnt base linux base-devel linux-firmware alsa-utils pipewire pipewire-alsa pipewire-pulse pipewire-jack wireplumber networkmanager bluez bluez-utils openssh ntfs-3g reflector intel-ucode gvim git zsh sudo
```

> `vim` 包：这是 Arch 默认的轻量版。为了保持极简，它在编译时**禁用了**很多高级功能。
> `gvim` 包：这是“全功能版”。虽然名字叫 GUI Vim，但安装它会同时提供一个**终端版的 `vim` 命令**。

## 配置系统

更新系统时间：systemd-timesyncd服务，默认会同步时间，使用 `timedatectl` 查看时间是否同步。

```bash
# 生成 fstab（文件系统表）文件
genfstab -U /mnt >> /mnt/etc/fstab

# 将根目录切换到/mnt
arch-chroot /mnt

# 设置主机名
# 在/etc/hostname中写入主机名，比如 archlinux。
echo archlinux >> /etc/hostname

# 设置时区
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 生成/etc/adjtime文件
# This command assumes the hardware clock is set to UTC
hwclock --systohc  

# 区域和语言特定的格式
# To use the correct region and language specific formatting
vim /etc/locale.gen  #取消注释 en_US.UTF-8 UTF-8和zh-CN.UTF-8 UTF-8。 
# 生成locales
locale-gen

vim /etc/locale.conf #写入 LANG=en_US.UTF-8

# 设置root密码
passwd

# 启动网络和蓝牙服务
systemctl enable NetworkManager bluetooth

# 添加普通用户
useradd -m liyang # 这里，虽然没有创建liyang group,但arch linux在创建新用户时会自动创建group。
# 设置用户密码 
passwd liyang
# 普通用户添加sudo权限 
export EDITOR=vim # 暂时启用vim作为编辑器
visudo  # 编辑 sudoers，取消 wheel 组的注释 `%wheel ALL=(ALL:ALL) ALL` 。
# wheel 组在 Unix/Linux 系统中传统上是特权组，wheel 组成员可以执行 su 命令切换到 root。
# 将用户添加到 wheel 组
usermod -aG wheel liyang

# GRUB 安装
#GRUB is the boot loader while efibootmgr is used by the GRUB installation script to write boot entries to NVRAM.
# os-prober 自动检测其他操作系统（Windows/Linux），用于GRUB多系统引导配置
pacman -S grub efibootmgr os-prober
# 配置 GRUB 自动启用 os-prober，这个程序用来检测磁盘上的 Windows Boot Manager 并自动创建 Grub entry
vim /etc/default/grub #GRUB_DISABLE_OS_PROBER=false
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=Arch
grub-mkconfig -o /boot/grub/grub.cfg

# 安装 Intel 核显驱动 mesa vulkan-intel xf86-video-intel
# xorg
# KDE：plasma-meta kde-system-meta
# 安装中文字体，解决中文乱码，这里使用 Noto Fonts 
pacman -S mesa vulkan-intel xf86-video-intel xorg plasma-meta kde-system-meta noto-fonts noto-fonts-cjk noto-fonts-emoji

# konsole 终端，
sudo pacman -S konsole 
# kdenlive 视频编辑 kmix KDE声音控制
sudo pacman -S kdenlive kmix
# colord-kde 色彩管理 gwenview 图像查看器 koko 图库 okular 文档查看器 
sudo pacman -S colord-kde gwenview koko okular
# kde-connect kio-extra kio-gdrive kio-zeroconf konqueror 强大的网页浏览器 konversation IRC客户端 
sudo pacman -S kdeconnect kio-extras kio-gdrive kio-zeroconf konqueror konversation
# 选自kde-sdk-meta：dolphin-plugins kde-dev-scripts kde-dev-utils kdesdk-kio kdesdk-thumbnailers poxml 
sudo pacman -S dolphin-plugins kde-dev-scripts kde-dev-utils kdesdk-kio kdesdk-thumbnailers poxml 

# 启用sddm显示管理器
systemctl enable sddm
```

重启电脑：使用 exit 退出chroot环境，使用 reboot 重启机器，并取下u盘。

我安装了gnome后，又卸载了一批gnome组件：

```bash
# decibels声音播放器
# epiphany浏览器
# gnome-software，与 Discover 重复
# gnome-system-monitor，与 System Monitor 重复
# loupe查看图像 
# malcontent家长模式 
# orca 无障碍阅读 
# showtime视频播放器 
# simple-scan打印 
# snapshot照相机 
pacman -Rns gnome-calculator gnome-calendar decibels epiphany gnome-characters gnome-clocks gnome-connections gnome-contacts gnome-disk-utility gnome-maps  gnome-music gnome-software gnome-system-monitor gnome-text-editor gnome-tour gnome-weather loupe malcontent orca showtime simple-scan snapshot 
```

其他软件安装，主要来自 [archwiki安装指南](https://wiki.archlinux.org/title/Installation_guide) ：

```bash
pacman -S dialog wireless_tools wpa_supplicant mtools dosfstools linux-headers
```

网络相关

- `wpa_supplicant`
	- WPA/WPA2 无线网络认证客户端
	- 连接 WiFi 必需的工具
- **`wireless_tools`** 
	- 无线网络配置工具（iwconfig, iwlist 等）
	- 扫描和连接 WiFi 网络的基础工具

引导和分区相关

- **`mtools`** 
	- MS-DOS 文件系统工具（mcopy, mdir 等）
	- 处理 FAT 文件系统，UEFI 引导相关
- **`dosfstools`**
	- FAT/FAT32 文件系统工具（mkfs.fat）
	- 创建 UEFI 引导分区必需

系统工具

- **`dialog`** 
	- 终端图形对话框工具
	- 许多安装脚本和配置工具使用它（如 archinstall）
	- 虽然不是严格必需，但很多工具依赖它

开发工具

- **`linux-headers`**
	- Linux 内核头文件
	- 编译内核模块或某些驱动必需
	- 安装 VirtualBox、NVIDIA DKMS 驱动等需要

# 取下U盘后

连接网络：输入nmtui，其他和平时手机联网差不多。nm 大概是 NetworkManager 的缩写。之后每次重启电脑，无线网络会自动连接。

**添加AUR软件源**：需要安装 base-devel

```bash
mkdir ~/builds && cd ~/builds
# yay-bin是AUR上的yay预编译包
git clone https://aur.archlinux.org/yay-bin.git
cd yay-bin
makepkg -si # 这一步时候没法下载github上的yay.tar.gz，于是先用pacman安装wget,用wget把软件包下载到yay-bin目录下。重新执行makepkg。
```

- [x] 上网 V2rayN

```zsh
yay -S v2rayn-bin
```

简单设置下v2rayN：右上方设置中文界面，设置开机自启、启动后隐藏窗口、关闭窗口时隐藏托盘。

- [x] Obsidian

```zsh
sudo pacman -S obsidian
yay -S pandoc-bin  # ob插件Pandoc Plugin依赖
```

更换Ob字体，界面和文本字体为霞鹜文楷，monospace 字体为 Hack Nerd Font Mono。

```bash
sudo pacman -S ttf-hack-nerd
```

添加 windows系统的字体：把 `C:\Windows\Fonts` 目录下的字体文件拷贝一份，移动到 Linux 的 `/usr/share/fonts/windows_fonts` 目录。接着：

```bash
# 更新字体缓存
fc-cache

# 查看已安装的中文字体
fc-list :lang=zh
```

- [ ] xremap 用于自定义键盘按键映射。根据不同的桌面环境，选择gnome、kde或其他对应版本的 xremap。

```bash
yay -S xremap-kde-bin
```

xremap 中按键在配置文件中的[变量名](https://github.com/emberian/evdev/blob/1d020f11b283b0648427a2844b6b980f1a268221/src/scancodes.rs#LL581)，xremap的按键名对类型不敏感，比如Caps键可以写作 `KEY_CAPSLOCK`, `CAPSLOCK`,  或 `CapsLock` 。

```yml
modmap:
  - name: Global
    remap: 
      # 将CapsLock映射为Ctrl和Esc，点按为Esc，按住为Ctrl_L
      CapsLock:
        held: Esc
        alone: Ctrl_L
        free_hold: true  
      # Replace Ctrl_L with CapsLock
      Ctrl_L: CapsLock
```

以用户模式启动xremap服务，对于 KDE-Plasma Wayland ，xremap 不能以 root 身份运行。

```bash
# 检查是否加载了 uninputk
lsmod | grep uinput

# 若没有加载，则创建uinput.conf，并添加 uinput
sudo vim /etc/modules-load.d/uinput.conf

# 添加用户到 input 组
sudo gpasswd -a YOUR_USER input
# 验证是否已加入组
groups YOUR_USER 

# 添加udev规则
echo 'KERNEL=="uinput", GROUP="input", TAG+="uaccess"' | sudo tee /etc/udev/rules.d/99-input.rules

reboot
```

> 重启后，触控板的二指上下滚动，变成了“同上同下”，用着很别扭，就像顺拐似的。
> 解决：在设置中找到“touchpad”，勾选 Invert scroll direction (Natural scrolling)。

```bash
# 检查USB设备
sudo pacman -S usbutils evtest
lsusb 
sudo evtest
```

> xremap 没搞明白怎么用，暂时在 System Setting > Keyboard，勾选 Configure keyboard options 和 Swap Ctrl and Caps Lock。
> 类似的 System Setting，还有：
> 1. 关闭主板蜂鸣器。Accessibility > System Bell 中，不勾选 enable Audible bell。
> 2. NumLock开机自启。Keyboard > NumLock on startup 中，选择 Turn on。
> 3. 换个壁纸。在 Wallpaper中选择add...
> 4. 换个头像。在 Users 中点击账户头像。
> 5. 关闭系统提示音。在 System Sounds 中不勾选 Enable notification sounds。
> 6. 关闭 KDE wallet service。在 KDE Wallet 中不勾选 Enable the KDE wallet subsystem。如果没找到，安装 kwalletmanager。
> 7. 设置显示器缩放比例时，建议是整数倍。非整数倍的时候，我遇到过屏幕上有一条水平白线，但是在windows上屏幕又是正常的情况。
> 8. 我希望每次开机，不保存上次的会话，避免上次会话未关闭的应用+开机自启应用全部在登录后冒出来。在 Desktop Session > On login, launch apps that were open 中勾选 Start with an empty session。
> 9. 保存文件打开的默认方式：`~/.config/mimeapps.list`
> 10. vim打开文件后窗口最大化：打开系统设置 → 窗口管理 → 窗口规则，点击添加新规则，在窗口匹配标签页，输入vim，在大小和位置标签页，勾选 最大化水平 和 最大化垂直，点击 确定 并应用。

- [x] keyd 实现capslock点按为esc，长按为ctrl。

```zsh
# 安装keyd
sudo pacman -S keyd

# 启用服务
sudo systemctl enable --now keyd

# 在配置文件/etc/keyd/default.conf 写入如下内容
# 可选，调整“点按 / 长按”的判定时间，默认是 200ms
[ids]
*

[settings]
overload_timeout = 200

[main]
capslock = overload(control, esc)
leftctrl = capslock

# 重启 keyd 服务
sudo systemctl restart keyd
```

> 按键名获取：`sudo keyd monitor` 启动后，想知道哪个按键的名字就单击下这个键。

## 浏览器

- [x] Google Chrome

```zsh
yay -S google-chrome 

# 我用于爬虫
yay -S chromedriver
```

在浏览器中尝试播放视频，结果没声音：

```zsh
yay -S sof-firmware alsa-firmware alsa-ucm-conf --needed # 安装声音固件
```

在 vim 中编辑文件时，注意到“将CapsLock映射为Ctrl和Esc”的将字，和平时看到的不一样。之前使用 Ubuntu 的时候也遇到过该问题：Noto Fonts 优先显示日语字体。

```bash
sudo vim /etc/fonts/conf.d/64-language-selector-prefer.conf
```

将 Noto Sans CJK SC 字体优先级提高。

```conf
<?xml version="1.0"?>
<fontconfig>
  <alias>
    <family>sans-serif</family>
    <prefer>
      <family>Noto Sans</family>
      <family>Noto Sans CJK SC</family>
      <family>Noto Sans CJK TC</family>
      <family>Noto Sans CJK JP</family>
      <family>Noto Sans CJK KR</family>
      <family>Noto Color Emoji</family>
      <family>Noto Emoji</family>
    </prefer>
  </alias>
  <alias>
    <family>serif</family>
    <prefer>
      <family>Noto Serif</family>
      <family>Noto Serif CJK SC</family>
      <family>Noto Serif CJK TC</family>
      <family>Noto Serif CJK JP</family>
      <family>Noto Serif CJK KR</family>
      <family>Noto Color Emoji</family>
      <family>Noto Emoji</family>
    </prefer>
  </alias>
  <alias>
    <family>monospace</family>
    <prefer>
      <family>Hack</family>
      <family>Noto Sans Mono CJK SC</family>
      <family>Noto Sans Mono CJK TC</family>
      <family>Noto Sans Mono CJK JP</family>
      <family>Noto Sans Mono CJK KR</family>
      <family>Noto Color Emoji</family>
      <family>Noto Emoji</family>
    </prefer>
  </alias>
</fontconfig>
```

## 输入法 

- [x] 输入法框架 fcitx5

```bash
sudo pacman -S fcitx5-im
```

配置fcitx5的环境变量：编辑/etc/environment文件

```txt
SDL_IM_MODULE=fcitx
XMODIFIERS=@im=fcitx
```

> Detect GTK_IM_MODULE and QT_IM_MODULE being set and Wayland Input method frontend is working. It is recommended to use Wayland input method frontend. For more details see https://fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland#KDE_Plasma
> 不需要设置 `QT_IM_MODULE` 和 `QTK_IM_MODULE` 。
> Run chromium/electron application with `--enable-features=UseOzonePlatform --ozone-platform=wayland --enable-wayland-ime`
> Gtk/Qt application that only works under X11 may still need to set `GTK_IM_MODULE` or `QT_IM_MODULE`

fcitx5 只提供基础的英语支持，想要中文支持，需要安装输入方法引擎 Input Method Engine (IME)，这里用 rime

```bash
sudo pacman -S fcitx5-rime
```

日语输入引擎 fcitx5-mozc：

```zsh
sudo pacman -S fcitx5-mozc
```

- [x] Rime

参考[方寸间的Rime 输入法配置记录](https://www.10101.io/2019/01/30/rime-configuration "提供四个平台下的Rime输入法配置")

Rime输入法的配置文件结构如下：

```shell
~/.local/share/fcitx5/rime
├── build 
├── default.custom.yaml    # 设置字号、候选项、输入法配置文件、按键绑定等
├── double_pinyin_flypy.custom.yaml # 自定义小鹤双拼文件，覆盖官方配置
├── double_pinyin_flypy.schema.yaml # 官方小鹤双拼配置文件
├── luna_pinyin.userdb
├── opencc  # 基于OpenCCDict的加载Emoji
├── symbols.custom.yaml # 自定义标点符号候选，比如输入顿号，会提供全角、半角格式的多种顿号，覆盖官方的symbols.yaml
├── sync 
└── user.yaml
```

`default.custom.yaml` 主要导入下载的输入法文件。

```shell
patch:
  menu/page_size: 5 # 候选栏个数
  font_point: 20    # 字号

  schema_list:
    - schema: double_pinyin_flypy  # 小鹤双拼
    - schema: luna_pinyin          # 保留全拼
	- schema: cangjie5             # 仓颉五代

  "ascii_composer/switch_key":
    Shift_L: commit_code # 中文状态下，shift上屏字符并切换英文状态  
    Shift_R: inline_ascii # 中文状态下，shift需要按enter上屏字符，enter前英文状态，enter后保持中文状态
```

> 在 `default.custom.yaml` 中设置字体无法生效：需要到『系统设置-输入方法-Configure addons - Classic User Interface』中设置字体大小。初始为10号，我设置为14号。

`double_pinyin_flypy.schema.yaml` [gist](https://gist.githubusercontent.com/WithdewHua/ce9b1dc076b191feb6e6a9ec669f71cd/raw/322a1c7bc196606301b49c0688d31fbeea9f5da1/double_pinyin_flypy.schema.yaml)

```yaml
  # 设置符号
  "punctuator/half_shape":
    "[": ["[", "【", "〔", "［" ]
    "]": [ "]", "】", "〕", "］" ]
```

`symbols.custom.yaml` [gist](https://gist.githubusercontent.com/WithdewHua/ce9b1dc076b191feb6e6a9ec669f71cd/raw/322a1c7bc196606301b49c0688d31fbeea9f5da1/symbols.custom.yaml)

`opencc文件夹` [github](https://github.com/WithdewHua/rime-configuration/tree/main/Rime/Common/opencc)

## 通讯相关

- [x] Wechat 。聊天记录默认在 `~/Documents/xwechat_files`
- [x] QQ 。聊天记录默认在 `~/Documents/QQ file`
- [x] Wemeet

```zsh
yay -S wechat-appimage linuxqq wemeet-bin
```

微信频繁出现“运行一段时间就会崩溃”的问题（还是会崩溃）：

```zsh
# 拷贝官方 desktop
cp /usr/share/applications/wechat.desktop ~/.local/share/applications/

# 编辑该文件
vim ~/.local/share/applications/wechat.desktop
# 将Exec=env DESKTOPINTEGRATION=false /usr/bin/wechat %U 替换为
Exec=env DESKTOPINTEGRATION=false GDK_BACKEND=x11 QT_QPA_PLATFORM=xcb /usr/bin/wechat --disable-gpu %U

# 刷新菜单缓存
update-desktop-database ~/.local/share/applications/
```

QQ Xwayland client 泄漏，QQ把256个 client 全吃光。

```zsh
❯ xlsclients
Maximum number of clients reached
xlsclients:  unable to open display ":0"
❯ lsof -U | grep X11 | awk '{print $1}' | sort | uniq -c | sort -nr | head
    256 Xwayland
      2 kwin_wayl
```

在终端打开如下脚本，检测xwayland的变化。此时我将qq关闭，xwayland的 x11 client数量从70减少到35 。

```zsh
while true; do
  clear
  date
  echo "---- X11 clients by process ----"
  lsof -U | grep X11 | awk '{print $1}' | sort | uniq -c | sort -nr | head
  echo
  echo "Total:"
  lsof -U | grep X11 | wc -l
  sleep 2
done
```

[解决方法](https://aur.archlinux.org/packages/linuxqq#comment-1062481)：

```zsh
git clone https://github.com/Jerry-Terrasse/fix-linuxqq-x11-leak 
cd fix-linuxqq-x11-leak 
make build 
make trace # 观察输出，找到重复调用的wrapper.node offset 
make block QQ_X11_TARGET_OFFSET=0x5cb0c6b # 当前版本5:3.2.25_45758-1是这个地址，其他版本可能不同
```

- [x] Telegram、Discord

```zsh
sudo pacman -S telegram-desktop discord
```

- [x] 邮箱管理 Thunderbird

导出配置：打开 Thunderbird，点击右侧的**菜单按钮（三条横线）**，选择 **工具** > **导出**，我习惯保存到 `~/Documents/Thunderbird_profile_backup.zip` 。

导入配置，同上。

```zsh
sudo pacman -S thunderbird
```

- gmail 邮箱，使用当前邮箱的账号、密码进行认证。
- outlook 邮箱，需要一个绑定outlook的其他邮箱，使用绑定邮箱和邮箱验证码进行认证。[参考](https://support.microsoft.com/zh-cn/office/outlook-com-%E7%9A%84-pop-imap-%E5%92%8C-smtp-%E8%AE%BE%E7%BD%AE-d088b986-291d-42b8-9564-9c414e2aa040)。
- qq邮箱，需要qq邮箱+授权码（不是邮箱密码）认证。授权码申请：进入邮箱网页，右上角有一个“账号与安全”，里面的安全设置里，有“POP3/IMAP/SMTP/Exchange/CardDAV 服务”，该服务提供授权码。

Thunderbird 有插件市场，我只用过 BulkDelete，曾经有段时间不常看邮箱，因此每次打开邮箱都有一堆消息，BulkDelete可以帮助我批量删除邮件。

Thunderbird 添加又删除谷歌邮箱后，去除每次开屏都会跳出该邮箱的验证：

1. 进入 `~/.thunderbird/` ，找到一个以 `.default-release` 结尾的文件夹。
2. 进入这个个人配置文件夹，我们需要编辑两个文件 prefs.js 和 `user.js`：这两个文件存储了各种设置。搜索那个Gmail地址，如果找到与之相关的行，可以整行删除。但修改前最好备份原文件。

## 编程

### 编辑器

- [x] Visual Studio Code

从 arch 仓库中下载的 `code` 是 Visual Studio Code - OSS（开源版本），它不包含同步设置功能。

```zsh
yay -S visual-studio-code-bin
```

Monokai Pro 主题激活：打开VS Code的命令面板，输入 Monokai Pro: enter license，回车后输入：`id@chinapyg.com` ，回车后输入lincese key：d055c-36b72-151ce-350f4-a8f69

Java环境扩展插件安装：**Extension Pack for Java** 插件集合，集成了多个与 Java 开发相关的插件，安装后能为开发者提供完整的 Java 开发环境，涵盖从代码编写、调试、测试到项目管理等多方面功能 。其包含的主要插件及作用如下：

- **Language Support for Java(TM) by Red Hat**：提供语法高亮、智能代码补全、代码检查、代码格式化、代码导航以及重构支持等功能，辅助高效编写和优化 Java 代码。
- **Project Manager for Java**：可在编辑器中管理多个 Java 项目，实现快速切换，导入本地 Java 项目，可视化展示项目模块、包和文件结构。
- **Debugger for Java**：实现轻量级 Java 程序调试，可设置断点，调试时查看变量值、对象属性和调用栈，追踪程序执行流程以排查问题。
- **Test Runner for Java**：支持 JUnit 和 TestNG 等测试框架，方便运行和调试 Java 测试用例，展示测试结果及详细日志，助力开发者定位问题。
- **Maven for Java**：用于管理 Maven 项目，能创建新项目，管理项目依赖，执行 Maven 构建任务，如清理、编译、打包项目等。
- **Gradle for Java**：针对 Gradle 构建工具，能创建 Gradle 项目，运行 Gradle 任务，管理项目构建、测试流程，查看 Gradle 任务和工程依赖 。

- [x] Cursor

```zsh
yay -S cursor-bin
```

- [x] IntelliJ IDEA 

```zsh
yay -S intellij-idea-ultimate-edition
```

[激活许可证教程](https://blog.idejihuo.com/jetbrains/pycharm-2025-3-3-permanent-activation-tutorial-free-cracking-tool.html)（已失效，不过网站上有新教程，可以试试）：

在VM配置文件 `~/.config/JetBrains/IntelliJIdea2025.3/idea64.vmoptions` 中粘贴如下内容

```txt
# ja-netfilter 激活
-javaagent:/home/liyang/Downloads/ja-netfilter/ja-netfilter.jar
--add-opens=java.base/jdk.internal.org.objectweb.asm=ALL-UNNAMED
--add-opens=java.base/jdk.internal.org.objectweb.asm.tree=ALL-UNNAMED
```

设置中文界面： File > Settings > Appearance & Behavior > System Settings > Language and Region。

文件和代码模板：

```txt
/**
* ClassName: ${NAME}
* Package: ${PACKAGE_NAME}
* Description:
* @Author pluinyiasnhg
* @Create ${DATE} ${TIME}
* @Version 1.0
*/
```

实时模板：

```txt
bsort
自动生成冒泡排序
for(int $INDEX$ = 1; $INDEX$ < $ARRAY$.length; $INDEX$++) {  
    for(int $INDEX2$ = 0; $INDEX2$ < $ARRAY$.length-$INDEX$; $INDEX2$++) {  
        if($ARRAY$[$INDEX2$] > $ARRAY$[$INDEX2$+1]){  
            $ELEMENT_TYPE$ temp = $ARRAY$[$INDEX2$];  
            $ARRAY$[$INDEX2$] = $ARRAY$[$INDEX2$+1];  
            $ARRAY$[$INDEX2$+1] = temp;  
        }  
    }  
}

newTh
自动创建一个线程
new Thread() {  
    public void run() {  
        $var$  
    }  
};

sop
输出不换行
System.out.print($END$);

test
自动声明单元测试test方法
@Test  
public void test$var1$() {  
    $END$  
}
```

![[Java 基础-基本语法#插件]]

- [x] PyCharm

```zsh
yay -S pycharm
```

> 快捷键：
> 查看文件结构 `Ctrl+0`

安装Jupyter notebook 和 Jupyter lab

```zsh
sudo pacman -S jupyter-notebook jupyterlab
```

> 天杀的，为什么我在Pycharm中打开ipynb文件，字体和单元格都超级大。

- [x] neovim + lazyvim

```bash
sudo pacman -S neovim

# 备份旧配置
mv ~/.config/nvim{,.bak}

# 下载新配置
git clone --depth=1 https://github.com/LazyVim/starter ~/.config/nvim

# 安装插件
nvim
```

- [x] Emacs

配置文件在 `~/.emacs.d`

```bash
sudo pacman -S emacs

# 可选 spacemacs
# 之前的配置文件找不到了，于是先用 spacemacs的配置。
git clone --depth=1 https://github.com/syl20bnr/spacemacs ~/.emacs.d
```

### zsh

[zsh 安装与配置，使用 oh-my-zsh 美化终端](https://www.haoyep.com/posts/zsh-config-oh-my-zsh/#%E5%8D%B8%E8%BD%BD-oh-my-zsh)

```bash
# 设置默认终端为 zsh
chsh -s /bin/zsh

# 安装zsh配置管理框架 on-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# 安装zsh主题 powerlevel10k
# 安装 powerlevel10k 前，需要安装一款nerd font 。比如我已安装的hacker
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

on-my-zsh 会覆盖掉之前的 ~/.zshrc 文件，新的 .zshrc 文件中有不少内容，可供设置：

```txt
# 设置zsh主题为 powerlevel10k
ZSH_THEME="powerlevel10k/powerlevel10k"

# 对连字符不敏感
HYPHEN_INSENSITIVE="true"
```

重启终端后，开始配置 powerlevel10k。如果需要重新配置 powerlevel10k，用命令 `p10k configure`。

插件：插件下载到本地的 `~/.oh-my-zsh/custom/plugins` 目录。

- [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) 命令提示插件，输入命令时，会自动推测你可能需要输入的命令。
- [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) 语法校验插件，输入指令不合法，指令显示为红色，否则显示为绿色。
- `oh-my-zsh` 内置的 `z` 是一个文件夹快捷跳转插件，对于曾经跳转过的目录，只需要输入最终目标文件夹名称，就可以快速跳转。
- `oh-my-zsh` 内置的 `extract` 插件，用于解压任何压缩文件，不必根据压缩文件的后缀名来记忆压缩软件。使用 `x` 命令即可解压文件。
- oh-my-zsh 内置的 `web-search` 插件，能让我们在命令行中使用搜索引擎进行搜索。使用 `搜索引擎关键字+搜索内容` 即可自动打开浏览器进行搜索。
- [zsh-vi-mode](https://github.com/jeffreytse/zsh-vi-mode) vim模式插件，在命令行中使用vim的文本编辑方式。

```zsh
# zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# zsh-vi-mode
git clone https://github.com/jeffreytse/zsh-vi-mode $ZSH_CUSTOM/plugins/zsh-vi-mode

# 在~/.zshrc中启用插件
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract web-search zsh-vi-mode)
```

> 使用 `sudo su` 在 root 用户终端下重新配置以上内容。

```zsh
ZSH_THEME="ys" # 换一套主题，方便区分两种用户身份的终端
plugins=(git zsh-autosuggestions zsh-syntax-highlighting z extract web-search)
```

### Java

- [x] Java 的 JDK

```bash
sudo pacman -S jdk8-openjdk jdk17-openjdk jdk21-openjdk --needed
```

> 不过从 Arch 仓库下载的jdk，似乎没有.java源码，只有.class文件，

在 Arch Linux 中，**严禁手动通过 `ln -s` 修改这些软链接**。官方提供了专门的工具 `archlinux-java` 来安全地切换全局默认 JDK。

```zsh
# 查看系统中已安装的所有 Java 版本
archlinux-java status

# 使用 `set` 参数将默认版本指向 JDK 21
sudo archlinux-java set java-21-openjdk
```

### Python

- [ ] ~~Python 的 [miniconda](https://www.anaconda.com/docs/getting-started/miniconda/install#linux)~~

> 我改用 uv 管理python包

我是先安装并切换到了 zsh，再安装 miniconda。

```zsh
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# 默认安装在 /Users/<USER>/miniconda3
bash ~/Miniconda3-latest-Linux-x86_64.sh

source ~/.zshrc

# 测试安装是否成功
conda list

# 删除虚拟环境
conda env remove -n [虚拟环境名]

# 导出当前激活的环境
conda env export > environment.yaml
# 导出指定环境
conda env export -n myenv > environment.yaml

# 创建新环境
conda env create -f environment.yaml
# 指定环境名称（覆盖YAML中的名称）
conda env create -n newenv -f environment.yaml
```

[卸载 miniconda](https://www.anaconda.com/docs/getting-started/miniconda/uninstall)：

```zsh
# 确定 miniconda 的安装位置
conda info --base

# 确保停用 miniconda 的base环境
conda deactivate

# 安装目录下有卸载脚本 uninstall.sh
~/miniconda3/uninstall.sh --remove-caches --remove-config-files user --remove-user-data
```

- [x] Python 包管理器 uv

```zsh
sudo pacman -S uv
```

### SQL

- [x] DataGrip

```zsh
yay -S datagrip datagrip-jre
```

### node.js

```zsh
# 安装pnpm
sudo pacman -S pnpm

# 添加到PATH中
pnpm setup

# 以安装yuque-dl为例 https://github.com/gxr404/yuque-dl
# npm i -g yuque-dl
pnpm add -g yuque-dl
```

### Julia

[官方推荐 Julia 教程](https://julialang.org/learning/tutorials/)

```zsh
# 安装julia
sudo pacman -S julia

# 验证juila
julia
```

### git

![[Git 入门(1)#2. Git 设置]]

### WindTerm 

- [x] [WindTerm](https://github.com/kingToolbox/WindTerm) 远程登录服务器

配置文件在 `~/.wind`

```zsh
yay -S windterm-bin
```

### tmux


```zsh
sudo pacman -S tmux
```

### 远程登录自家电脑

台式机设置通电自启 + 智能插座（手机远程控制通电）。

## 学术工具

- [x] 文献管理 Zotero

```zsh
yay -S zotero-bin
```

## 文本相关

- [x] WPS Office

```zsh
yay -S wps-office-cn wps-office-mui-zh-cn wps-office-mime-cn
```

由于 WPS 尚未原生支持 Wayland 输入协议（文本输入 v3），它必须通过 **XWayland** 运行。

```zsh
# 复制快捷方式到用户目录
cp /usr/share/applications/wps-office-prometheus.desktop ~/.local/share/applications/

vim ~/.local/share/applications/wps-office-prometheus.desktop

# 添加如下内容后，重启WPS
# 修改前
# Exec=/usr/bin/wps %F
# 修改后
Exec=env QT_IM_MODULE=fcitx /usr/bin/wps %F
```

转载自[wps-office-cn](https://aur.archlinux.org/packages/wps-office-cn) AUR仓库的评论区：

> 如果从Dolphin无法用WPS打开PDF等文件，启动器中无法启动WPS文档、WPS表格等，可能是WPS默认的整合模式导致的，可以进入WPS的 `设置\其他\切换窗口管理模式` 改成`多组件模式`，即可解决问题；其后也可以再改回整合模式。

这个方法实测有效：使用后，我可以双击以wps窗口打开word、ppt、excel等文件，不过多组件模式下，我又没法使用中文输入法了。此时，切换回整合模式，神奇的事情发生了：双击能打开上述文件，且文件内可以使用中文输入。美中不足的是，这没法解决“上述文件图标不是wps图标”的问题。

WPS 即使关闭了界面，后台往往还挂着 `wpscloudsvr`、`wpscenter` 或 `prometheus`。如果这些进程卡死，新开 WPS 就会在初始化 Qt 时直接崩溃。

```zsh
# 强杀所有 WPS 相关进程
killall -9 wps wpsoffice wpscloudsvr wpscenter prometheus
```

当你执行 `killall` 时，你强制清理了这些卡死的组件，所以能短暂打开。但只要 WPS 运行，这些组件就会重新启动并在后台崩溃/卡住，最终导致主程序再次无法初始化。

在 Arch Linux 上，最彻底的解决办法是**禁用 WPS 的后台自动更新和云服务**：

```zsh
# 尝试使用这个环境变量组合启动
export wps_is_no_cloud=true
wps

# 如果上面的方法有效，可以通过修改文件让它永远不启动那个容易卡死的后台
# 找到 wpscloudsvr 和 wpscenter 的路径（通常在 /usr/lib/office6/ 下）
sudo chmod -x /usr/lib/office6/wpscloudsvr
sudo chmod -x /usr/lib/office6/wpscenter
sudo chmod -x /usr/lib/office6/prometheus
```

- [x] 字典 Goldendict-ng，词典文件保存到 `~/.goldendict`目录 。

```zsh
# 安装过程中，需要用到四个Qt应用和cmake
yay -S goldendict-ng
```

默认配置文件在 `~/.config/goldendict` ，它的优先级低于 `~/.goldendict` 。参考[[Goldendict 设置黑夜模式]]添加深色主题，但是 goldendict-ng 本身就有一个“深色阅读模式”选项。

我将字典文件移动到 `~/.goldendict/dicts` 中。

```txt
以下是字典群组划分：

En-Zh：little dict、柯林斯、郎文、OALDPE
En-En：Vocabulary
Zh-Zh：千篇汉语、古汉语、说文解字
Zh-En：朗道、OALD 中文反查
Online：google Translate（我自行添加的“服务”）
```

- [x] 文件阅读器 Okular，要比 Document Viewer（pacman -S papers）设置功能多一些。

```zsh
sudo pacman -S okular
```

[设置深色模式](https://www.reddit.com/r/kde/comments/ljutsj/guide_enable_a_dark_reader_in_okular/?tl=zh-hans)：

```txt
在 setting - configure Okular - Accessibility - change colors - Change dark & light colors

暗色：#c3c7d1
亮色：#161925

在 setting - configure Keyborad Shortcuts - Change dark & light colors

设置快捷键 Ctrl+Shift+I，用于启用/禁用深色

最后在 setting - configure language 中设置中文界面
```

- [x] 电子书阅读器 koreader

```zsh
yay -S koreader-bin
```

配置文件在 `~/.config/koreader`

- [x] 大模型管理客户端 cherry studio

```zsh
yay -S cherry-studio-bin
```

- [x] Typora 0.11，typora最后一个免费版本。 

```zsh
yay -S typora-free-cn
```

Typora 主题的存放位置在 `~/.config/Typora/themes/` 。

- [x] xmind

```zsh
yay -S xmind
```

- calibre

[calibre 电子书库/电子书管理软件--相关配置](https://blog.csdn.net/weixin_44112083/article/details/126311543)
[Docker跑calibre-web，架设远端阅读电子书伺服器](https://ivonblog.com/posts/calibre-web-docker/)

## 图片相关

- [x] 截图 Flameshot、查看图片 Gwenview、画图 drawio

```zsh
sudo pacman -S flameshot gwenview drawio-desktop --needed
```

> [!info] 解决flameshot 截图在wayland无法置顶
> 在系统设置 -> 窗口管理 -> 窗口规则中，添加一条新规则：选择 `精确匹配`，值填写 `flameshot`，点击 `添加属性`，搜索并勾选 “置顶（Keep above）”。

- [x] 图床 PicList 

```zsh
yay -S piclist-bin
```

参照之前写的文档[[PicList 3.0.4 更新]]配置了下 WebDav，注意 PicList 开启监听剪贴板。

- [x] 图片转文字 Umi-OCR

```zsh
yay -S umi-ocr-bin
```

- 剪贴板 CopyQ
- 修图 GIMP
- 3D建模 Blender

## 视频相关

- [x] 视频播放 mpv，可选 Celluloid，封装了 mpv

```zsh
sudo pacman -S mpv
```

![MPV 快捷键|700x0](https://vip.123pan.cn/1844935313/obsidian/20260124111841904.png)

- [x] 视频录制和直播 OBS Studio

```zsh
sudo pacman -S obs-studio
```

- [x] 录制Gif动图 kooha

[项目地址](https://github.com/seadve/kooha)

```zsh
sudo pacman -S kooha
```

- 转换工具 ffmpeg

## 游戏

**开启32位支持**：multilib 包含32位软件和库，如果要安装 Steam ，那么需要开启 multilib。在 `/etc/pacman.conf` 找到对应语句，取消注释：

```txt
[multilib]
Include = /etc/pacman.d/mirrorlist
```

然后更新系统 `sudo pacman -Sy`。

- [x] Steam，需要32位库支持

```zsh
sudo pacman -S steam
```

想在Linux上玩Steam游戏，那么在 Steam > 设置 > 兼容性中选择最新版的Proton。这个 Proton 就是 Steam 的 Wine。

[ProtonUp-QT 和 Protontricks用法，调整 Steam Proton 环境的小工具](https://ivonblog.com/posts/steam-protonup-qt-protontricks-usage/)

ProtonUp-QT 是专门用来切换Steam游戏所使用的Proton版本。ProtonTricks 则是用于给Steam游戏安装额外的Windows exe套件。

Steam启动的游戏的界面窗口太小：[Gamescope缩放游戏解析度+ Linux开机直接进入Steam Big Picture Mode](https://ivonblog.com/posts/steam-gamescope/)

```zsh
sudo pacman -S gamescope
```

在Steam游戏收藏库，对游戏点选右键 → 內容，编辑启动选项。

指令基本格式如下，`%command%`是固定值，不要变更。

```txt
gamescope -W 2560 -H 1600 -r 60 -- %command%
```

- [x] wine

```zsh
sudo pacman -S wine
```

`wine explorer` 指令开启 Wine 的文件管理器，就会看到 `C盘` 和 `Z盘` ，C盘对应的路径是`~/.wine`，而Z盘对应整个Linux系统的根目录。

`wine winecfg` 指令调整 Windows程序的字型大小(DPI)，在 Graphics 中我将 DPI 设置为288。

[Winetricks 安装中文字型](https://ivonblog.com/posts/linux-wine-introduction/)，避免打开 exe 程序中文出现乱码。

```zsh
wget https://raw.githubusercontent.com/Winetricks/winetricks/master/src/winetricks
chmod +x winetricks
sudo mv winetricks /usr/bin
```

[wine 的前端管理程序 Bottles](https://ivonblog.com/posts/setup-linux-bottles/)，每个bottle相当于一个wine容器。

- [x] Moonlight + Sunshine for Linux：云端串流游戏软体，可让你从另一部电脑串流玩游戏。

根据[sunshine官方文档](https://docs.lizardbyte.dev/projects/sunshine/latest/md_docs_2getting__started.html)在 `/etc/pacman.conf` 中添加LizardByte软件源：

```txt
[lizardbyte]
SigLevel = Optional
Server = https://github.com/LizardByte/pacman-repo/releases/latest/download

[lizardbyte-beta]
SigLevel = Optional
Server = https://github.com/LizardByte/pacman-repo/releases/download/beta
```

添加新的软件源后，更新仓库 `sudo pacman -Sy` 。

```zsh
sudo pacman -S sunshine
```

设定Sunshine的服务：

```zsh
# 开启KWS capture
sudo setcap cap_sys_admin+p $(readlink -f $(which sunshine))

# 这一部分，节选自前面配置xremap的内容
# 检查是否加载了 uninputk
lsmod | grep uinput
# 若没有加载，则创建uinput.conf，并添加 uinput
sudo vim /etc/modules-load.d/uinput.conf
# 添加用户到 input 组
sudo gpasswd -a YOUR_USER input
# 验证是否已加入组
groups YOUR_USER 

# 编辑Sunshine规则
sudo vim /etc/udev/rules.d/85-sunshine-input.rules
# 添加以下内容
KERNEL=="uinput", GROUP="input", MODE="0660"

# UFW端口放行
# 不过arch linux默认没防火墙，所以就跳过这一段
sudo ufw allow 47984/tcp
sudo ufw allow 47989/tcp
sudo ufw allow 48010/tcp
sudo ufw allow 47988/udp
sudo ufw allow 47998/udp
sudo ufw allow 47999/udp
sudo ufw allow 48000/udp
sudo ufw allow 48002/udp
sudo ufw allow 48010/udp
sudo ufw reload

# 启用Avahi服务，让 Moonlight 能在局域网里自动发现 Sunshine
sudo systemctl enable --now avahi-daemon

# 启动sunshine服务
systemctl --user start sunshine

# 开机自启sunshine
systemctl --user enable sunshine
```

> sunshine的https签名是自己签的，所以在浏览器中打开时会显示不安全，点击 Advanced > Proceed to localhost (unsafe)后，我们就能看到 sunshine Web UI。下次登录Web UI，浏览器会记住这个例外。
> sunshine 默认用户名是 sunshine。

我用手机连接笔记本，在谷歌商店上为手机安装 moonlight。启动moonlight应用，确保手机和笔记本处于同一个Wifi中，moonlight会自动扫描出sunshine，根据提示，进行连接。

> 连接以后，如果笔记本正在播放音频，那么手机会代替笔记本播放音频。

- RetroArch
- MangoHud：在萤幕上显示显示CPU、GPU、FPS计数器、温度、频率，並有统计FPS报表的功能。（没用过）

## 下载工具

- [x] 百度网盘

```zsh
yay -S baidunetdisk-electron
```

- [x] Motrix：下载管理器，学校校园网用不了，得用手机热点。

```zsh
yay -S motrix-bin
```

- [x] 夸克网盘

```zsh
yay -S deepin-wine-quarkclouddrive
```

如果反复遇到几个包下载失败的情况，编辑 `/etc/makepkg.conf`，找到 DLAGENTS，在 https 所在行的末尾，添加 `--user-agent=APT` 。

如果觉得夸克网盘的UI界面太小，可以编辑 `~/.deepinwine/Deepin-QuarkCloudDrive/scale.txt` ，我将1.0改成2.0。

## 容器与虚拟化

- [x] Docker

```zsh
sudo pacman -S docker
```

- [x] QEMU/KVM + VirtManger 

```zsh
# 检查CPU是否支援虚拟化，回传值不应为0。
sudo grep -E -c '(vmx|svm)' /proc/cpuinfo

# 检查KVM核心模组是否已经载入，会看到`intel_kvm`或是`amd_kvm`出现在列表
lsmod | grep kvm

# 安装QEMU、Libvirt、libguestfs、IPtables、virglrenderer
sudo pacman -S archlinux-keyring qemu-full virt-manager virt-viewer edk2-ovmf dnsmasq vde2 bridge-utils openbsd-netcat libguestfs ebtables iptables virglrenderer

# 开机启动Libvirtd的系统服务，以及开机自启NAT网路卡
sudo systemctl enable --now libvirtd
sudo virsh net-start default
sudo virsh net-autostart default

# 将当前用户加入libvirt和KVM群组
sudo usermod -a -G libvirt $USER
sudo usermod -a -G libvirt root
sudo usermod -a -G kvm $USER
sudo usermod -a -G kvm root
```

编辑`/etc/polkit-1/rules.d/50-libvirt.rules`，让KVM群组的用户也可以管理Libvirt服务：

```txt
/* Allow users in kvm group to manage the libvirt
daemon without authentication */
polkit.addRule(function(action, subject) {
    if (action.id == "org.libvirt.unix.manage" &&
        subject.isInGroup("kvm")) {
            return polkit.Result.YES;
    }
});
```

重新启动 libvirtd 服务 `sudo systemctl restart libvirtd` 。

[使用 QEMU/KVM 创建Win11虚拟机](https://ivonblog.com/posts/install-windows-11-qemu-kvm-on-linux/#3-%E6%96%B0%E5%A2%9Ewindows-11%E8%99%9B%E6%93%AC%E6%A9%9F%E7%B5%84%E6%85%8B)：

| 你手里的东西          | 在虚拟机里是什么 | 关键设置                   |
| --------------- | -------- | ---------------------- |
| **128G disk**   | 系统硬盘     | **Bus = VirtIO**       |
| **Win11 镜像文件**  | 安装光盘     | **CD-ROM（IDE / SATA）** |
| **VirtIO 镜像文件** | 驱动光盘     | **CD-ROM（IDE / SATA）** |

在“选择磁盘”界面，加载驱动程序，进入 VirtIO 光盘，选：viostor\w11\amd6。

> 1. **安装win11跳过账号登录**：无网状态下，在联网界面按下 `Shift + F10`，输入 `start ms-cxh:localonly` 并回车，可直接跳过重启创建本地账户。
> 2. **延迟更新100年**：`win+r` 输入 `regedit` ，打开注册表，进入目录 HEKY_LOCAL_MACHINE > SOFTWARE > Microsoft > WindowsUpdate > UX > Settings，新建一个DWROD（32位值），取名为 `FlightSettingsMaxPauseDays` ，设置值为十进制下的36524。此时打开windows更新界面，设置延迟更新即可。
> 3. **windows系统激活**：确保windows系统是最新状态，重启电脑后，以管理员身份打开终端，输入 `irm https://get.activated.win | iex` ，此时会打开一个小窗口，输入HWID对应的数字1，等待窗口显示激活。
> 4. **激活office工具**：同上，参考[Microsoft Activation Scripts教学，一键启用Windows 11与Office 365金钥的开源指令稿](https://ivonblog.com/posts/microsoft-activation-scripts/)。
> 5. **右键菜单默认显示全部选项**：在命令提示符cmd中粘贴代码 `reg add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f` ，然后打开任务管理器，重启资源管理器（或者直接重启电脑）。

Spice Guest Tools 用于宿主机和虚拟机共享剪贴板，以及让虚拟机自动随窗口大小切换解析度。

1. 在虚拟机中打开[Fedora网站](https://fedorapeople.org/groups/virt/virtio-win/direct-downloads/)，进入stable-virtio的目录，下载 `virtio-win-guest-tools.exe` 。运行该exe文件，此时剪贴板实现共享。
2. wayland 下似乎依然不支持随窗口大小自动切换。

应用：WPS、AutoHotkey、123网盘、图吧工具箱、7z。

挂载虚拟磁盘镜像，在文件管理器（如 Dolphin）里浏览虚拟机的整个硬盘：

```zsh
# 安装nbd模块 
sudo modprobe nbd max_part=8

# 假设镜像路径如下
sudo qemu-nbd --connect=/dev/nbd0 /var/lib/libvirt/images/your_vm.qcow2

# 挂载分区：
# 现在 lsblk 会多出一个 /dev/nbd0p1（或 p2 等），直接挂载它
sudo mount /dev/nbd0p1 /mnt

# 卸载（完成后记得断开）
sudo umount /mnt 
sudo qemu-nbd --disconnect /dev/nbd0
```

## 实用工具

- Utools：堪比瑞士军刀，尝试了下在wayland下用不了，无法打开软件界面。

```zsh
yay -S electron22-bin --needed
yay -S utools-bin
```

```txt
快捷键：Alt+SPC
应用：截图悬浮、取色
```

- RSS 阅读器 Fluent Reader（没用过），可选越来越难用的 Folo，目前我只用 Folo 网页端
- 记忆 Anki
- 应用商店 Sparkstore
- RustDesk：跨平台远程桌面。（没用过）
- Rclone：云端硬盘备份。（没用过）
- Ventoy：多系统安装。
- 乐谱软件 MuseScore（没用过）

## 外接触控板

起因是在某东上买了一块赫扬触控板3代mac触控板，用作我笔记本的外接触控板。这块触控板之前在ubuntu上使用正常，但是在arch linux上，每次系统更新后，外接触控板有时能用，有时不能用，纯看脸。

**【问题描述】**

- **设备**：Apple Magic Trackpad 2 (USB/2.4G 模式)。
- **症状**：`libinput` 能识别设备名，但无法控制鼠标。表现为随机性，有时重启可用，有时失效。手动执行 `modprobe -r` 再重新加载驱动可临时恢复。
- **根源**：内核驱动加载顺序冲突（Race Condition）或硬件初始化不完全。

**【解决方法】**

通过 **udev 规则** 实现“硬件触发式自动重置”。

1. **创建规则文件**：  
    新建 `/etc/udev/rules.d/99-magic-trackpad.rules`。
2. **写入自动化逻辑**：
 
```zsh
# 匹配 Apple 触控板 (ID 05ac:0265)
# 当硬件被系统识别(add)时，强制重启专用驱动 hid_magicmouse
ACTION=="add", SUBSYSTEM=="usb", ATTRS{idVendor}=="05ac", ATTRS{idProduct}=="0265", \
RUN+="/usr/bin/modprobe -r hid_magicmouse", \
RUN+="/usr/bin/modprobe hid_magicmouse"
```

> 在 KDE Plasma Wayland 会话中，大多数能缩放图片的应用（如浏览器、文件管理器、图片查看器）都支持**Ctrl + 两指滚动**来缩放。

## 外接显卡

oculink 外接显卡重启电脑后，`neofetch` 识别出了4070显卡，但是 `nvidia-smi` 显示：

```txt
NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver. Make sure that the latest NVIDIA driver is installed and running.
```

```zsh
❯ lspci | grep -i nvidia
02:00.0 VGA compatible controller: NVIDIA Corporation AD104 [GeForce RTX 4070] (rev a1)
02:00.1 Audio device: NVIDIA Corporation AD104 High Definition Audio Controller (rev a1)k
```

执行下面命令后，如果没有显示 `Kernel driver in use` 行，那么就从三个备选内核模块 nouveau, nvidia_drm, nvidia 中启用 `nvidia`。

```zsh
❯ lspci -k | grep -A 2 -i "NVIDIA"
02:00.0 VGA compatible controller: NVIDIA Corporation AD104 [GeForce RTX 4070] (rev a1)
	Subsystem: NVIDIA Corporation Device 1875
	Kernel driver in use: nvidia
	Kernel modules: nouveau, nvidia_drm, nvidia
...
```

Kernel modules 详解：

- **`nvidia`**: NVIDIA 官方的闭源核心驱动。它负责管理显卡的实际算力、渲染和大部分功能。
- **`nvidia_drm`**: 它是“直接渲染管理器”（Direct Rendering Manager）。作用是让 Linux 内核（尤其是显示管理器，如 X11 或 Wayland）能够正确识别并管理显卡的显示输出。
- **`nouveau`**:  Linux 社区开发的开源驱动。

### 安装nvidia驱动

首先，从 [nouveau NVIDIA代号查询页](https://nouveau.freedesktop.org/CodeNames.html) 中查找外接显卡的系列代号(例如：NV110, NVC0)。我的4070的代号是 NV190，架构是 Ada Lovelace。

```zsh
sudo pacman -Syu
# nvidia-open 是内核模块
# nvidia-utils 提供了驱动正常工作所需的一系列核心组件
# lib32-nvidia-utils 解决游戏兼容性
sudo pacman -S nvidia-dkms nvidia-utils lib32-nvidia-utils linux-headers --needed
```

开启 DRM 模式设置：Wayland 必须在内核启动早期就认出 NVIDIA 驱动，否则会出现“黑屏”或“无法进入桌面”。

```zsh
# 编辑 mkinitcpio.conf
sudo vim /etc/mkinitcpio.conf

# 在 MODULES=(...) 括号内添加驱动名称：
MODULES=(nvidia nvidia_modeset nvidia_uvm nvidia_drm)

# 生成新的镜像
sudo mkinitcpio -P
```

配置内核参数 (Wayland 核心配置)，这一步确保 Wayland 合成器（如 GNOME/KDE）能正确调用显卡，防止不接显卡时驱动卡死。

```zsh
# 编辑 GRUB 配置
sudo vim /etc/default/grub

# 找到 GRUB_CMDLINE_LINUX_DEFAULT，在引号内加入 nvidia-drm.modeset=1
# 例如：GRUB_CMDLINE_LINUX_DEFAULT="loglevel=3 quiet nvidia-drm.modeset=1"

# 更新 GRUB
sudo grub-mkconfig -o /boot/grub/grub.cfg
```

重启电脑后，此时再使用 `nvidia-smi` 就输出正常了。

```zsh
# 测试pytorch gpu 版本能否正常运行
conda create -n pytorch-2.11.0-gpu python=3.12
conda activate pytorch-2.11.0-gpu

pip3 install torch torchvision  # 安装过程中会一并安装cuda_toolkit 和 cudnn

❯ python
>>> import torch
>>> torch.cuda.is_available()
True
```

专业“跑分”Phoronix Test Suite：如果你想获取一个权威的分数，甚至和网上其他人比一比，那么 phoronix-test-suite 就是不二之选。它可以一键运行包含 unigine-heaven、gputest 等在内的众多测试项目，并将结果上传到 OpenBenchmarking.org 网站，方便你和其他配置进行详细对比

- 游戏性能测试 (Real-time Gaming)
	- pts/cs2：最推荐。可以直接反映显卡运行主流竞技游戏的帧数水平。
- 理论性能与计算测试 (Compute & Synthetic)
	- pts/rtiv (Ray Tracing In Vulkan)：光追专项测试。专门测试 Vulkan API 下的光线追踪性能。
	- pts/vkpeak：理论峰值测试。类似甜甜圈，但它不是跑游戏画面，而是直接测试 GPU 的 FP32（单精度浮点）、INT32 等算力极限，用于分析硬件的理论性能。
	- pts/mixbench：混合计算测试，常用于测试 GPU 在混合精度计算下的稳定性。
- AI 测试 (AI & Utilities)
	- pts/hashcat：密码破解测试。测试 GPU 的 OpenCL/CUDA 计算能力。如果显卡在这个测试中分数很高，说明它跑 AI 或渲染任务时算力释放良好。
	- pts/waifu2x-ncnn：图像处理/AI 放大测试。专门测试 Vulkan 加速下的 AI 图像处理速度，反映 GPU 在推理任务中的效率。
	- pts/opencl-benchmark：通用计算测试。测试 OpenCL 驱动的性能表现。

```zsh
yay -S phoronix-test-suite

# 测试
# 这里的 prime-run是让程序在独显下运行
# 不加这一条，我的笔记本会用核显运行
prime-run phoronix-test-suite benchmark pts/vkpeak

# 删除测试结果
phoronix-test-suite remove-result  # 运行后会列出所有保存的结果文件

# 删除测试程序，以 unigine-heaven 为例
phoronix-test-suite remove-installed-test pts/unigine-heaven
```

RTX 4070 vkpeak 性能对比表：

| 测试项目 (单位: GFLOPS/GIOPS)  | 测试结果        | RTX 4070 标准值       | 性能偏差       |
| ------------------------ | ----------- | ------------------ | ---------- |
| **FP32-Scalar (单精度标量)**  | **21,552**  | ~19,800 - 20,500   | **+5%~8%** |
| **FP32-Vec4 (单精度向量)**    | **21,371**  | ~19,500 - 20,200   | **+6%**    |
| **FP16-Scalar (半精度标量)**  | **32,256**  | ~31,000 - 32,500   | 持平         |
| **FP16-Matrix (半精度矩阵)**  | **128,358** | ~118,000 - 125,000 | **+3%**    |
| **FP64-Scalar (双精度标量)**  | **507.72**  | ~310 - 550         | 正常范围       |
| **INT32-Scalar (整型标量)**  | **16,122**  | ~14,500 - 15,500   | **+4%**    |
| **INT16-Scalar (整型标量)**  | **13,347**  | ~12,500 - 13,500   | 持平         |
| **INT8-Dotprod (8位点积)**  | **15,166**  | ~14,000 - 15,000   | 持平         |
| **INT8-Matrix (8位矩阵)**   | **255,336** | ~240,000 - 250,000 | **+2%**    |
| **BF16-Matrix (BF16矩阵)** | **64,159**  | ~60,000 - 63,000   | **+2%**    |

> 注：标准值参考自 OpenBenchmarking (Phoronix Test Suite) 在 Linux 环境下的 RTX 4070 典型运行数据。由谷歌的AI模式搜索提供表中的RTX 4070标准值。

### 按需调用

我在使用 phoronix-test-suite 测试显卡时，发现测试程序在用显卡跑动画。而且重启电脑后，显卡风扇就停止转动了。

```zsh
# prime-run 专门用于切换显卡
sudo pacman -S nvidia-prime
```

```zsh
# 安装切换显卡工具
yay -S envycontrol

# 切换到 NVIDIA 模式
# <MODE> 包括：
# - integrated 集显
# - hybrid 混合
# - nvidia nvidia独显
sudo envycontrol -s <MODE>

# 重置
sudo envycontrol --reset
```

> 不知道为什么，我的笔记本开不了 `nvidia` 模式，一旦开启后，每次系统开机时，都会出现 Failed to start NVIDIA Persistance Daemon。虽然能进入桌面环境，但是无论有无外接显卡，都只能检测出核显。

## gnome 插件商店

- [ ] 触控板手势 touchegg，touchegg 是为 x11 设计的，wayland下几乎没法使用。

```zsh
pacman -S touchegg
yay -S touche
```

tweaks

桌面最小化最大化按钮消失：在 tweak 的Window-Title Buttons 中开启最大化和最小化。

如果 tweak 没有提供设置选项，又不想在命令行中设置gnome，那么可以安装 `dconf-editor` 。

```zsh
pacman -S dconf-editor
```

- org.gnome.desktop.wm.keybindings 在 dconf-editor 中变成目录 `/org/gnome/desktop/wm/keybindings`。进入该目录后，找到 switch-applications 和 switch-windows，交换他们的默认值后，Alt+Tab 从切换应用变成了切换窗口。

```bash
# 为了使用 lsusb 和 evtest 命令
sudo pacman -S usbutils evtestk

# 为了使用 sudo libinput list-devices
sudo pacman -S libinput-tools
```
安装 extension manager：安装后，软件内置了gnome插件商店

```bash
yay -S extension-manager-git
```

- AppIndicator.... 托盘图标
- blur my shell毛玻璃特效
- user theme,配合 tweaks,pacman -S gnome-tweaks........等等若干插件。

- [archwiki安装指南](https://wiki.archlinux.org/title/Installation_guide)
- [arttnba3 图文教程-附系统配置](https://arttnba3.cn/2023/09/25/DISTRO-0X00-INSTALL_ARCH_WINDOWS/)

# Pacman 和 Yay 常用命令指南

## Pacman（Arch Linux 官方包管理器）

### 基本操作

```bash
# 同步包数据库并更新系统
sudo pacman -Syu

# 安装包
sudo pacman -S 包名

# -R 卸载包（保留依赖）
# -Rs 卸载包及其依赖
# -Rns 卸载包、依赖和配置文件
sudo pacman -Rns 包名
```

### 查询操作

```bash
# 搜索包（名称和描述）
pacman -Ss 关键词

# 查看已安装的包
pacman -Qs 关键词

# 查看包信息
pacman -Si 包名  # 远程包信息
pacman -Qi 包名  # 已安装包信息

# 列出已安装的所有包
pacman -Q

# 查看包文件列表
pacman -Ql 包名

# 查找文件属于哪个包
pacman -Qo /路径/文件
```

## Yay（AUR 助手）

[项目地址](https://github.com/jguer/yay)

### 基本操作

```bash
# 同步并更新系统（包括 AUR）
# yay -Syu
yay

# 安装（更新） AUR 包
yay -S 包名

# 搜索包（包括 AUR）
yay 关键词

# 卸载包
yay -R 包名
```

### 查询操作

```bash
# 查看包信息
yay -Si 包名  # 远程包信息
yay -Qi 包名  # 已安装包信息

# 清理构建文件
yay -Yc

# 检查更新状态，查看当前哪些应用可以更新
yay -Ps
```

## 常用组合命令

### 系统更新和清理

```bash
# 完整系统更新
sudo pacman -Syu

# 更新系统并清理孤立包
sudo pacman -Syu && sudo pacman -Rns $(pacman -Qtdq)

# 更新 AUR 包并清理缓存
yay -Sua && yay -Yc
```

### 故障排除

```bash
# 修复损坏的包数据库
sudo pacman -Syy

# 强制重新安装所有包
sudo pacman -S $(pacman -Qnq)  # 仅原生包
```

## 小贴士

1. **定期更新**：建议每周至少更新一次系统

```bash
sudo pacman -Syu
```

2. **备份已安装包列表**：

```bash
pacman -Qqe > pkglist.txt
# 恢复安装
sudo pacman -S - < pkglist.txt
```

3. **查看更新日志**：

```bash
pacman -Qc 包名
```

# CLI

## 文件下载 curl wget

```zsh
curl -LsSf https://example.com/file.txt -o output.txt
```

- **-L, --location**：跟随重定向。如果服务器返回 3xx 重定向响应，curl 会自动请求新的 URL
- **-s, --silent**：静默模式。不显示进度条或错误信息
- **-S, --show-error**：与 `-s` 一起使用时，仍然显示错误信息
- **-f, --fail**：失败时不输出 HTML 错误页面。服务器返回 HTTP 错误时（如 404、500），curl 会以非零状态码退出
- `-o <file>`：指定输出文件名

```zsh
wget -qO output.txt https://example.com/file.txt
```

- **-q, --quiet**：静默模式，不输出任何信息
- `-O <file>, --output-document=<file>`：指定输出文件名。如果不指定，默认使用远程文件名

wget 支持递归下载 `-r, --recursive` ，curl不支持递归下载。

## 压缩解压 zip 7z rar

zip 压缩

```zsh
# 密压缩文件
zip -er archive.zip file1 file2 folder/

# 加密压缩目录
zip -er archive.zip folder/

# 指定密码（明文）
zip -er -P "yourpassword" archive.zip file1
```

unzip 解压

```zsh
# 指定密码
unzip -P "yourpassword" archive.zip

# 解压到指定目录
unzip -d /path/to/destination -P "yourpassword" archive.zip
```

7z 压缩

```zsh
# 加密压缩为7z格式
7z a -p"yourpassword" archive.7z file1 file2 folder/

# 加密ZIP格式
7z a -p"yourpassword" -tzip archive.zip file1

# 分卷压缩（每个100MB）
7z a -v100m -p"yourpassword" archive.7z largefile.iso
```

7z 解压

```zsh
# 交互式输入密码
7z x archive.7z

# 指定密码
7z x -p"yourpassword" archive.7z

# 解压到指定目录
7z x -p"yourpassword" -o/path/to/destination archive.7z

# 列出加密压缩包内容
7z l -p"yourpassword" archive.7z
```

rar 压缩

```zsh
# 加密压缩
rar a -p"yourpassword" archive.rar file1 file2

# 加密并隐藏文件名
rar a -hp"yourpassword" archive.rar folder/
```

unrar 解压

```zsh
# 解压整个文件
unrar x -p"yourpassword" archive.rar

# 解压到当前目录
unrar e -p"yourpassword" archive.rar

# 列出加密文件内容
unrar l -p"yourpassword" archive.rar
```

> zsh 的插件 x 也可以用于解压。

## 文件管理 nnn

[项目地址](https://github.com/jarun/nnn?tab=readme-ov-file)

> `nnn` 可以分析磁盘使用情况、批量重命名、启动应用程序和选择文件。插件仓库拥有大量插件，可以进一步扩展功能，例如实时预览、(卸载)挂载磁盘、查找和列出、文件/目录差异、上传文件。一个补丁框架托管了大量用户提交的、主观性强的补丁。
> `nnn` 也适配 android 系统上的 termux 终端。



## 文件搜索 ripgrep

[项目地址](https://github.com/BurntSushi/ripgrep)

## btop

[项目地址](https://github.com/aristocratos/btop)

```zsh
sudo pacman -S btop
```

> 卸载不了plasma-systemmonitor，[plasma-meta](https://archlinux.org/packages/extra/any/plasma-meta/) 捆绑安装该应用。

## Claude Code

![[AI IDE#Claude Code CLI]]

## codex

```zsh
yay -S openai-codex-bin
```

登录账号：

```zsh
codex auth login
```

## 云文件列表程序 OpenList

[项目地址](https://github.com/OpenListTeam/OpenList)

## 云端文件本地备份 Rclone

[项目地址](https://github.com/rclone/rclone)

## 网站视频下载工具 yt-dlp

[项目地址](https://github.com/yt-dlp/yt-dlp)

## 语书文档导出 yuque-dl

[项目地址](https://github.com/gxr404/yuque-dl)

> 语书在线文档网页打开，实在太卡了，yuque-dl 可以把语书文档导出为markdown文件，方便离线使用。

```zsh
# url 为对应需要的知识库地址
# -t 选项，用于添加token，私人知识库需要token才能下载
# 下载时候关闭代理工具
yuque-dl "https://www.yuque.com/yuque/thyzgp" -t "verified_books的值"
```

