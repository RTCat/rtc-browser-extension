"use strict";

window.addEventListener("message", function (event) {

    var addonMessage = event.data;

    /**
     * check if screen capturing is enabled
     * window.postMessage({ checkIfScreenCapturingEnabled: true}, "*");
     */
    if (addonMessage && addonMessage.checkIfScreenCapturingEnabled) {
        window.postMessage({
            isScreenCapturingEnabled: true
        }, '*');
    }

}, false);
