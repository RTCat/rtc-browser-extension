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
        //todo: check if domain is supported
        window.postMessage({
            isScreenCapturingEnabled: true
        }, '*');
    }

}, false);
