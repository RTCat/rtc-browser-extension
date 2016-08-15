
chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        console.log('Got request', request , sender);
        if(request.getVersion)
        {
            sendResponse({version: chrome.runtime.getManifest().version});
            return false;
        }else if(request.getStream){
            chrome.desktopCapture.chooseDesktopMedia(
                ["screen", "window"], sender.tab,
                function(streamId) {
                    sendResponse({ streamId: streamId});
                });
            return true;
        }else{
            console.error("Unknown request");
            sendResponse({ error : "Unknown request" });
            return false;
        }
    }
);