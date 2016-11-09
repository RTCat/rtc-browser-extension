
chrome.runtime.onMessageExternal.addListener(
    function (request, sender, sendResponse) {
        console.log('Got request', request , sender);
        if(request.getVersion)
        {
            sendResponse({version: chrome.runtime.getManifest().version});
        }else if(request.getStream){
            chrome.desktopCapture.chooseDesktopMedia(
                ["screen", "window"], sender.tab,
                function(sourceId) {
                        if (!sourceId || !sourceId.length) {
                          sendResponse({ error: 'permissionDenied' });
                          return;
                        }            

                    sendResponse({ streamId: sourceId});
                });
            return true;
        }else if(request.isInstalled){
            sendResponse(true);
        }else{
            console.error("Unknown request");
            sendResponse({ error : "Unknown request" });
        }
    }
);