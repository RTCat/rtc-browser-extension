"use strict";

/**
 * check if chrome extension is installed
 * window.postMessage({ checkIfScreenCapturingEnabled: true}, "*");
 */

window.addEventListener("message", function (event) {

    var addonMessage = event.data;

    if (addonMessage && addonMessage.checkIfScreenCapturingEnabled) {
        window.postMessage({
            isScreenCapturingEnabled: true
        }, '*');
    }

}, false);
