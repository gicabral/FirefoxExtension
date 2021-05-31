function isEmpty(myObject) {
  for(var key in myObject) {
      if (myObject.hasOwnProperty(key)) {
          return false;
      }
  }

  return true;
}

function Key(myObject) {
  for(var key in myObject) {
    return key;
  }
}

function handleRemoved(tabId, removeInfo) {
  // browser.storage.local.remove(browser.tabs.get(tabId).originUrl) 
  browser.storage.local.clear() //TODO - FIX REMOVE
}

function logStorageChange(changes, area) {
  if(area !== "local"){
    console.log("Change in storage area: " + area);
   
    var changedItems = Object.keys(changes);
  
    for (var item of changedItems) {
      console.log(item + " has changed:");
      console.log("Old value: ");
      console.log(changes[item].oldValue);
      console.log("New value: ");
      console.log(changes[item].newValue);
    }
  }
}

browser.storage.onChanged.addListener(logStorageChange);
function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  console.log(details)
  console.log(details.url)
  
  
  var gettingAllConnections = browser.storage.local.get();
  gettingAllConnections.then((connections) => {
    console.log(connections)
    if(typeof details.originUrl !== "undefined"){
      if(isEmpty(connections[details.originUrl])){
        var value = {
          urlList : [details.url],
          usesStorage : "none"
        }
        var conn = {
          [details.originUrl] : value
        }
        console.log(conn)
        browser.storage.local.set(conn);
      }else{
        connections[details.originUrl].urlList.push(details.url)
        browser.storage.local.set(connections);
      }
    }
  });

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: true});
    filter.write(encoder.encode(str));
    filter.disconnect();
  }

  return {};
}

browser.tabs.onRemoved.addListener(handleRemoved);

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["*://*/*"], types: ["main_frame", "websocket", "script"]},
);
