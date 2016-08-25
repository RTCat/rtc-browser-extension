"use strict";

window.addEventListener("message", function(event) {
    var addonMessage = event.data;

    if(addonMessage && addonMessage.checkIfScreenCapturingEnabled && addonMessage.domains && addonMessage.domains.length) {
        self.port.on('is-screen-capturing-enabled-response', function(response) {
            window.postMessage(response, '*');
        });

        self.port.emit('is-screen-capturing-enabled', addonMessage.domains);
    }
}, false);