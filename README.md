# rtc-browser-extension
实时猫屏幕分享chrome及火狐浏览器插件

## 下载实时猫官方插件

- Chrome web store [RealTimeCat ScreenSharing Extension](https://chrome.google.com/webstore/detail/realtimecat-screensharing/kopddpjmdlllnpkpcphndjiaohbakkjb)
- Firefox addons [RealTimeCat ScreenSharing](https://addons.mozilla.org/en-US/firefox/addon/realtimecat-screensharing/)

## 用于个人项目

### Chrome插件

clone项目至本地，修改 `chrome/manifest.json` 配置文件中的 `externally_connectable` 为你的域名（必须是https协议，如`https://localhost:3000/*`, 后面的`*`不能少）。

**示例**

```
  "externally_connectable": {
    "matches": [ "https://localhost:3000/*"]
```

在chrome浏览器中访问`chrome://extensions/`页面，勾选`Developer mode`, 点击`Load unpacked extension...`，选择本插件安装。

你可以将调试好的插件发布至[Chrome web store](https://chrome.google.com/webstore/developer/dashboard)

### Firefox插件

1. 注册火狐Addons中心账号: [https://addons.mozilla.org/en-US/firefox/users/register](https://addons.mozilla.org/en-US/firefox/users/register)
2. 更改本插件名称: [./firefox/package.json#L4](./package.json#L4)
3. 将你的域名添加至此: [./firefox/index.js#L8](./index.js#L8)
4. 生成 XPI。
```
[sudo] npm install jpm --global

cd firefox

jpm run -b nightly      # test in Firefox Nightly without making the XPI

jpm xpi                 # it will create xpi file
```
5. 提交XPI:[https://addons.mozilla.org/en-US/developers/addon/submit/1](https://addons.mozilla.org/en-US/developers
