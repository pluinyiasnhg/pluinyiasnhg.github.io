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

> **`vim` 包**：这是 Arch 默认的轻量版。为了保持极简，它在编译时**禁用了**很多高级功能。
> **`gvim` 包**：这是“全功能版”。虽然名字叫 GUI Vim，但安装它会同时提供一个**终端版的 `vim` 命令**。

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
> 9. 保存文件打开的默认方式：~/.config/mimeapps.list
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
```

## 浏览器

- [x] Google Chrome

```zsh
yay -S google-chrome
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

- [x] 中文输入框架 fcitx5

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

fcitx5 只提供基础的英语支持，想要中文支持，需要安装输入方法引擎 Input Method Engine (IME)，这里用 rime

```bash
sudo pacman -S fcitx5-rime
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

`symbols.custom.yaml` [gist](https://gist.githubusercontent.com/WithdewHua/ce9b1dc076b191feb6e6a9ec669f71cd/raw/322a1c7bc196606301b49c0688d31fbeea9f5da1/symbols.custom.yaml)

## 通讯相关

- [x] Wechat 。聊天记录默认在 `~/Documents/xwechat_files`
- [x] QQ 。聊天记录默认在 `~/Documents/QQ file`
- [x] Wemeet

```zsh
yay -S wechat-appimage linuxqq-appimage wemeet-bin
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
- outlook 邮箱，需要一个绑定outlook的其他邮箱，使用绑定邮箱和邮箱验证码进行认证。
- qq邮箱，需要qq邮箱+授权码（不是邮箱密码）认证。授权码申请：进入邮箱网页，右上角有一个“账号与安全”，里面的安全设置里，有“POP3/IMAP/SMTP/Exchange/CardDAV 服务”，该服务提供授权码。

Thunderbird 有插件市场，我只用过 BulkDelete，曾经有段时间不常看邮箱，因此每次打开邮箱都有一堆消息，BulkDelete可以帮助我批量删除邮件。

## 编程

### 编辑器

- [x] Visual Studio Code

从 arch 仓库中下载的 `code` 是 Visual Studio Code - OSS（开源版本），它不包含同步设置功能。

```zsh
yay -S visual-studio-code-bin
```

Monokai Pro 主题激活：打开VS Code的命令面板，输入 Monokai Pro: enter license，回车后输入：`id@chinapyg.com` ，回车后输入lincese key：d055c-36b72-151ce-350f4-a8f69

- [x] IntelliJ IDEA 

```zsh
yay -S intellij-idea-ultimate-edition
```

[激活许可证教程](https://blog.idejihuo.com/jetbrains/pycharm-2025-3-3-permanent-activation-tutorial-free-cracking-tool.html)：

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

```zsh
7z a -tzip -p[你的密码] 压缩包名称.zip 要压缩的文件或目录路径
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

- [x] Python 的 [miniconda](https://www.anaconda.com/docs/getting-started/miniconda/install#linux)

我是先安装并切换到了 zsh，再安装 miniconda。

```zsh
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh

# 默认安装在 /Users/<USER>/miniconda3
bash ~/Miniconda3-latest-Linux-x86_64.sh

source ~/.zshrc

# 测试安装是否成功
conda list
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


### git

![[Git 入门(1)#2. Git 设置]]

### WindTerm 

- [x] [WindTerm](https://github.com/kingToolbox/WindTerm) 远程登录服务器

配置文件在 `~/.wind`

```zsh
yay -S windterm-bin
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

- [x] chatbox

```zsh
yay -S chatbox-bin
```

- [x] Typora 0.11，typora最后一个免费版本。 

```zsh
yay -S typora-free-cn
```

- [x] xmind

```zsh
yay -S xmind
```

- 阅读器 [KOReader](https://github.com/koreader/koreader?tab=readme-ov-file) 

```zsh
yay -S koreader-bin
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

### 基本操作

```bash
# 同步并更新系统（包括 AUR）
yay -Syu

# 安装 AUR 包
yay -S 包名

# 搜索包（包括 AUR）
yay 关键词

# 搜索并安装
yay -Ss 关键词

# 卸载包
yay -R 包名
```

### 查询操作

```bash
# 查看已安装的包（包括 AUR）
yay -Q

# 查看包信息
yay -Si 包名

# 清理构建文件
yay -Yc

# 查看统计数据
yay -Ps

# 查看新闻
yay -Pw
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

### 搜索和安装

```bash
# 搜索并选择性安装
yay 包名  # 会显示交互式列表

# 清理缓存后重新安装包
sudo pacman -Scc && sudo pacman -S 包名
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

## 文件管理器 nnn

[项目地址](https://github.com/jarun/nnn?tab=readme-ov-file)

> `nnn` 可以分析磁盘使用情况、批量重命名、启动应用程序和选择文件。插件仓库拥有大量插件，可以进一步扩展功能，例如实时预览、(卸载)挂载磁盘、查找和列出、文件/目录差异、上传文件。一个补丁框架托管了大量用户提交的、主观性强的补丁。

`nnn` 也适配 android 系统上的 termux 终端。

## 文件搜索 ripgrep

[项目地址](https://github.com/BurntSushi/ripgrep)

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
