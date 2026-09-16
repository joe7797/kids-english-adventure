# 🦕 奇奇英语乐园 (Kids English Adventure)

一款专为 3-9 岁儿童打造的现代、轻量、高互动趣味英语启蒙与自然拼读 Web 应用程序。

---

## ✨ 核心特色与功能亮点

1. **生动沉浸的视听体验**：
   - **糖果马卡龙与轻拟物视觉**：色彩柔和明艳、圆角护眼、丰富的呼吸与弹性微动效。
   - **真人级标准美式发音 (TTS)**：内置美音智能朗读，支持“常速小兔子 🐇”与“慢速小乌龟 🐢”两种语速。
   - **自然拼读拆解 (Phonics)**：每个单词提供音标分解与音节逐个拼读（如 `A-P-P-L-E` 逐步发音）。
   - **Web Audio 拟真音效引擎**：自主合成气泡破裂、通关号角、叮当金币等童趣音效，**无需依赖任何外部音频文件，永不失效**。

2. **多维闭环学习体验**：
   - **单词探索大卡片 (Word Explorer)**：
     - 涵盖 6 大高频启蒙主题：动物世界、美味果蔬、缤纷色彩与形状、神奇大自然、生活与玩具、快乐动作。
     - 支持关键字中英实时快速搜索、一键收藏爱心单词。
     - 提供“纯英文沉浸模式”开关，随时切换全英语言环境。
   - **智能麦克风跟读打分 (Speech Coach)**：
     - 孩子对着麦克风发音，程序根据发音相似度即时评出 1~3 颗闪亮金星与热烈鼓励，并在浏览器无麦克风权限时提供温和引导。

3. **三大益智互动小游戏 (Fun Minigames)**：
   - **👂 听音辨图 (Listen & Pick)**：听单词语音从 4 个生动图案中选出正确答案，具备连对 Combo 暴击动效。
   - **🧩 字母积木拼字 (Spelling Blocks)**：打乱字母积木，孩子按序拼出目标单词，锻炼自然拼读与字母认知。
   - **🃏 神奇记忆翻牌 (Memory Match)**：经典 3D 翻牌对对碰，配对单词与图案，培养儿童专注度与短期记忆。

4. **正向激励体系 (Rewards & Stickers)**：
   - 学习单词、玩游戏收集金色星星 ⭐。
   - 解锁多项荣誉勋章（如“森林百晓生”、“拼词小神童”、“地道发音官”等）。
   - 内置炫彩 Canvas 撒花礼花与音效庆祝。
   - 学习记录与星星自动保存至本地浏览器 (LocalStorage)。

---

## 🚀 如何运行

本应用采用现代化免依赖架构，无需安装 Node.js、npm 或任何编译工具！

### 方式 1：一键运行（推荐）
双击目录下的 `run.bat`，即可自动启动本地服务并在默认浏览器中弹出应用。

### 方式 2：Python 本地服务
在项目根目录打开终端，运行：
```powershell
python -m http.server 8000
```
然后在浏览器中访问：`http://localhost:8000`

### 方式 3：直接双击打开
直接双击打开 `index.html` 即可畅玩全部学习功能。

---

## 📱 封装与打包为 Android APK

项目已完整内置**原生 Android Gradle 工程**、**PWA 移动端配置**与**云端自动化构建脚本**，支持多种方式输出 APK：

### 方案 A：Android Studio 一键打包（开发者推荐）
1. 打开 **Android Studio**，选择 `Open` 并选中项目中的 `android` 目录。
2. 等待 Gradle 同步完成后，点击顶部菜单栏：
   `Build` -> `Build Bundle(s) / APK(s)` -> `Build APK(s)`。
3. 编译完成后，点击右下角 `locate` 即可获取生成的 `app-debug.apk`，传输至安卓手机即可安装。

### 方案 B：GitHub Actions 云端自动构建打包（免配置环境推荐 ⭐）
无需在本地安装几十个 G 的 Android SDK 与 Java 环境：
1. 将本项目推送到您个人的 **GitHub 仓库**。
2. 进入仓库页面的 `Actions` 标签页，工作流 `Build Android APK` 会自动运行。
3. 运行完成后，直接在页面底部的 **Artifacts（工件）** 区域点击下载 `奇奇英语乐园-Android安装包.zip`，解压即得 `.apk` 文件！

### 方案 C：基于 PWA 在线一键转换 APK
项目中已配置好标准 [`manifest.json`](manifest.json) 与应用图标：
1. 将项目部署在任何支持 HTTPS 的网站（如 GitHub Pages / Vercel）。
2. 在浏览器中打开 [PWABuilder (pwabuilder.com)](https://www.pwabuilder.com)，输入网站地址。
3. 点击 `Package for Android`，即可直接在线下载打包好的 APK 安装包。

---

## 📁 目录结构

```
kids-english-adventure/
├── index.html                    # 语义化页面结构 (已配置 PWA)
├── manifest.json                 # Web App 移动端与全屏清单
├── run.bat                       # Windows 一键启动脚本
├── README.md                     # 项目说明文档
├── css/
│   ├── style.css                 # 核心视觉规范与色彩变量系统
│   ├── animations.css            # 弹性动效、发光声波与浮动气泡
│   ├── components.css            # 单词卡片、小游戏面板、翻牌 3D 与手帐
│   ├── icon-192.png              # 192x192 应用图标
│   └── icon-512.png              # 512x512 高清启动图标
├── js/
│   ├── data.js                   # 结构化词库（60+ 精选词汇、音标与例句）
│   ├── audio.js                  # Web Audio 音效合成与 TTS 朗读控制器
│   ├── speech.js                 # 麦克风跟读语音识别与智能星级激励
│   ├── rewards.js                # 星星统计、勋章解锁、Canvas 彩带礼花
│   ├── games.js                  # 三大益智小游戏逻辑
│   └── app.js                    # 主程序控制器与事件挂载
├── android/                      # 完整原生 Android Studio 工程
│   ├── build.gradle              # 顶层 Gradle 构建脚本
│   ├── settings.gradle           # 项目模块管理
│   ├── gradlew.bat               # Windows Gradle 包装器
│   └── app/                      # Android 主应用模块
│       ├── build.gradle          # 应用配置 (MinSdk 24, TargetSdk 34)
│       └── src/main/
│           ├── AndroidManifest.xml # 权限配置 (录音/音频/网络)
│           ├── java/             # 原生 WebView 与麦克风权限桥接
│           ├── assets/           # 离线打包的 HTML5/CSS/JS 静态资产
│           └── res/              # 图标、主题与色彩资源
└── .github/workflows/
    └── build-apk.yml             # GitHub Actions 云端全自动打包脚本
```

