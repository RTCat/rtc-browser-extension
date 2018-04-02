document.body.dataset.rtcExtensionId = chrome.runtime.id;

const port = chrome.runtime.connect(chrome.runtime.id);
port.onMessage.addListener(msg => {
  window.postMessage(msg, '*');
});

window.addEventListener(
  'message',
  event => {
    // Only accept messages from ourselves
    if (event.source !== window) {
      return;
    }
    // Only accept events with a data type
    if (!event.data.type) {
      return;
    }

    if (['STREAM_REQUEST', 'STREAM_CANCEL'].includes(event.data.type)) {
      port.postMessage(event.data);
    }
  },
  false
);

