'use strict'

chrome.runtime.onMessageExternal.addListener(
  function (request, sender, sendResponse) {
    console.log('Got request', request, sender)
    if (request.getVersion) {
      sendResponse({version: chrome.runtime.getManifest().version})
    } else if (request.getStream) {
      chrome.desktopCapture.chooseDesktopMedia(
        ['window', 'screen', 'tab'], sender.tab,
        function (sourceId) {
          if (!sourceId || !sourceId.length) {
            sendResponse({error: 'Permission denied'})
            return
          }

          sendResponse({streamId: sourceId})
        })
      return true
    } else if (request.isInstalled) {
      sendResponse(true)
    } else {
      console.error('Unknown request')
      sendResponse({error: 'Unknown request'})
    }
  }
)

let desktopMediaRequestId = ''

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(msg => {
    if (msg.type === 'STREAM_REQUEST') {
      requestScreenSharing(port, msg)
    }
    if (msg.type === 'STREAM_CANCEL') {
      cancelScreenSharing(msg)
    }
  })
})

function requestScreenSharing (port, msg) {
  // https://developer.chrome.com/extensions/desktopCapture
  // params:
  //  - 'data_sources' Set of sources that should be shown to the user.
  //  - 'targetTab' Tab for which the stream is created.
  //  - 'streamId' String that can be passed to getUserMedia() API
  // Also available:
  //  ['screen', 'window', 'tab', 'audio']
  const sources = ['window', 'screen', 'tab']
  const tab = port.sender.tab

  desktopMediaRequestId = chrome.desktopCapture.chooseDesktopMedia(
    sources,
    tab,
    streamId => {
      if (!streamId || !streamId.length) {
        msg.type = 'STREAM_ERROR'
        msg.error = 'Permission Denied'
      } else {
        msg.type = 'STREAM_SUCCESS'
        msg.streamId = streamId
      }
      port.postMessage(msg)
    }
  )
}

function cancelScreenSharing (msg) {
  if (desktopMediaRequestId) {
    chrome.desktopCapture.cancelChooseDesktopMedia(desktopMediaRequestId)
  }
}

/**
 * @param String input  A match pattern
 * @returns  null if input is invalid
 * @returns  String to be passed to the RegExp constructor */
function parse_match_pattern(input) {
  if (typeof input !== 'string') return null;
  var match_pattern = '(?:^'
    , regEscape = function(s) {return s.replace(/[[^$.|?*+(){}\\]/g, '\\$&');}
    , result = /^(\*|https?|file|ftp|chrome-extension):\/\//.exec(input);

  // Parse scheme
  if (!result) return null;
  input = input.substr(result[0].length);
  match_pattern += result[1] === '*' ? 'https?://' : result[1] + '://';

  // Parse host if scheme is not `file`
  if (result[1] !== 'file') {
    if (!(result = /^(?:\*|(\*\.)?([^\/*]+))(?=\/)/.exec(input))) return null;
    input = input.substr(result[0].length);
    if (result[0] === '*') {    // host is '*'
      match_pattern += '[^/]+';
    } else {
      if (result[1]) {         // Subdomain wildcard exists
        match_pattern += '(?:[^/]+\\.)?';
      }
      // Append host (escape special regex characters)
      match_pattern += regEscape(result[2]);
    }
  }
  // Add remainder (path)
  match_pattern += input.split('*').map(regEscape).join('.*');
  match_pattern += '$)';
  return match_pattern;
}

// This avoids a reload after an installation
let content_scripts = chrome.runtime.getManifest().content_scripts;
// Exclude CSS files - CSS is automatically inserted.
content_scripts = content_scripts.filter(function(content_script) {
  return content_script.js && content_script.js.length > 0;
});
content_scripts.forEach(function(content_script) {
  function injectScripts(tabs) {
    tabs.forEach(function(tab) {
      content_script.js.forEach(function(js) {
        chrome.tabs.executeScript(tab.id, {
          file: js
        });
      });
    });
  }
  try {
    // NOTE: an array of patterns is only supported in Chrome 39+
    chrome.tabs.query({
      url: content_script.matches
    }, injectScripts);
  } catch (e) {
    // NOTE: This requires the "tabs" permission!
    chrome.tabs.query({
    }, function(tabs) {
      let parsed = content_script.matches.map(parse_match_pattern);
      let pattern = new RegExp(parsed.join('|'));
      tabs = tabs.filter(function(tab) {
        return pattern.test(tab.url);
      });
      injectScripts(tabs);
    });
  }
});






