"use strict";

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
                          sendResponse({ error: 'Permission denied' });
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

let desktopMediaRequestId = '';

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    if (msg.type === 'STREAM_REQUEST') {
      requestScreenSharing(port, msg);
    }
    if (msg.type === 'STREAM_CANCEL') {
      cancelScreenSharing(msg);
    }
  });
});

function requestScreenSharing(port, msg) {
  // https://developer.chrome.com/extensions/desktopCapture
  // params:
  //  - 'data_sources' Set of sources that should be shown to the user.
  //  - 'targetTab' Tab for which the stream is created.
  //  - 'streamId' String that can be passed to getUserMedia() API
  // Also available:
  //  ['screen', 'window', 'tab', 'audio']
  const sources = ['screen', 'window'];
  const tab = port.sender.tab;

  desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia(
    sources,
    tab,
    streamId => {
      if (!streamId || !streamId.length) {
        msg.type = 'STREAM_ERROR';
        msg.error = 'Permission Denied'
      } else {
        msg.type = 'STREAM_SUCCESS';
        msg.streamId = streamId;
      }
      port.postMessage(msg);
    }
  );
}

function cancelScreenSharing(msg) {
  if (desktopMediaRequestId) {
    chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId);
  }
}





