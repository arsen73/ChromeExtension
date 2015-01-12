var entryToLoad = null;
var chr = null;

function init(launchData) {
  var fileEntry = null
  if (launchData && launchData['items'] && launchData['items'].length > 0) {
    entryToLoad = launchData['items'][0]['entry']
  }

  var options = {
    id: 'trackW',
    innerBounds:{
      minWidth: 1000,
      minHeight: 600
    }
  };
  chr = chrome;
  chrome.app.window.create('index.html', options);
  chrome.storage.local.set({'dw': 'dddd'});
}
chrome.app.runtime.onLaunched.addListener(init);