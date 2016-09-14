"use strict";

var mod = require("sdk/page-mod");
var prefsService = require('sdk/preferences/service');

var allowDomainsPrefKey = 'media.getusermedia.screensharing.allowed_domains';
var enabledPrefKey = 'media.getusermedia.screensharing.enabled';

// replace your own domains with below array
var myDomains = [
    "localhost",
    "shishimao.com",
    "rtcat.io",
    "rtcat.io:4001",
    "ecloudeal.com",
    "rtc-rooms.com",
    "sishuedu.com"
];

// if(prefsService.has(enabledPrefKey)) {}
// this flag is enabled by default since Firefox version 37 or 38.
// it maybe get removed in version 47-48. (As far as I can assume)
// i.e. screen capturing will always be allowed to list of allowed_domains.
prefsService.set(enabledPrefKey, true);

exports.main = function (options) {

    if (options.loadReason !== 'startup') {
        var curPrefs = prefsService.get(allowDomainsPrefKey).replace(/\s/g, '').split(',');

        myDomains.forEach(function(domain){
            if (curPrefs.indexOf(domain) !== -1) {
                return;
            }
            curPrefs.push(domain);
        });
        prefsService.set(allowDomainsPrefKey, curPrefs.join(','));
    }
};

exports.onUnload = function (reason) {
    if (reason === 'uninstall' || reason === 'disable') {
        myDomains.forEach(function(domain){
            var curPref = prefsService.get(allowDomainsPrefKey);
            var newPref = curPref.split(',').filter((pref) => pref.trim() != domain).join(',');
            prefsService.set(allowDomainsPrefKey, newPref);
        });

    }
};

/*
 * connect with webpage using postMessage
 * a webpage can use following API to check if screen capturing is enabled for his domains
 * @example window.postMessage({ checkIfScreenCapturingEnabled: true, domains: ['localhost']}, "*");
 */

var pageMod = mod.PageMod({
    include: myDomains.map(domain => domain[0] === '*' ? domain : `https://${domain}/*`),
    contentScriptFile: "./../inject.js",
    contentScriptWhen: "start", // or "ready"
    onAttach: function(worker) {

        worker.port.on("is-screen-capturing-enabled", function(domains) {
            var isScreenCapturingEnabled = false;

            prefsService.get(allowDomainsPrefKey).split(',').forEach(function(domain) {
                if(domains.indexOf(domain) !== -1) {
                    isScreenCapturingEnabled = true;
                }
            });

            worker.port.emit('is-screen-capturing-enabled-response', {
                isScreenCapturingEnabled: isScreenCapturingEnabled,
                domains: domains
            });
        });
    }
});