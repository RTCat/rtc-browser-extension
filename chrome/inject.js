"use strict";

window.addEventListener("message", function (event) {

    var addonMessage = event.data;

    /**
     * check if screen capturing is enabled
     * window.postMessage({ checkIfScreenCapturingEnabled: true}, "*");
     */
    if (addonMessage && addonMessage.checkIfScreenCapturingEnabled && addonMessage.domains && addonMessage.domains.length) {
        var isScreenCapturingEnabled = false;
        var allowedDomains = chrome.runtime.getManifest().externally_connectable.matches;
        // check if domain is allowed
        allowedDomains = allowedDomains.map((url) => extractRootDomain(url));
        allowedDomains.forEach((domain) => {
            if (addonMessage.domains[0].indexOf(domain) !== -1) {
                isScreenCapturingEnabled = true;
            }
        });
        window.postMessage({
            isScreenCapturingEnabled: isScreenCapturingEnabled
        }, '*');
    }

    function extractRootDomain(url) {
        var domain = extractHostname(url),
            splitArr = domain.split('.'),
            arrLen = splitArr.length;

        //extracting the root domain here
        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        }
        return domain;
    }

    function extractHostname(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get the hostname
        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];

        return hostname;
    }

}, false);
