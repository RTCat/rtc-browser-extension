# rtc-chrome-extension

实时猫屏幕分享插件

## 下载试用

点击下载本扩展的[最新版本](https://github.com/RTCat/rtc-chrome-extension/releases)，在Chrome浏览器中访问[chrome://extensions/](chrome://extensions/)，拖动安装本扩展。

访问实时猫Playground[屏幕分享](https://shishimao.com/playground/screen-sharing)页面试用屏幕分享功能并了解更多。

## 用于个人项目

### 配置

clone项目至本地，修改 `manifest.json` 配置文件中的 `externally_connectable` 为你的域名（必须是https协议，如`https://localhost:3000/*`, 后面的`*`不能少）。

**示例**

```
  "externally_connectable": {
    "matches": [ "https://localhost:3000/*"]
```

### 调试安装

在chrome浏览器中访问`chrome://extensions/`页面，勾选`Developer mode`, 点击`Load unpacked extension...`，选择本插件安装。

## 参考

- 实时猫Playground[屏幕分享](https://shishimao.com/playground/screen-sharing)
