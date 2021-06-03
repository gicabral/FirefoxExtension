function showCookiesForTab(tabs) {
  //get the first tab object in the array
  let tab = tabs.pop();
  let sessionStorage = window.sessionStorage;

  //get all cookies in the domain
  var gettingAllCookies = browser.cookies.getAll({url: tab.url});
  var gettingAllConnections = browser.storage.local.get();

  // Execute script in the current tab

  gettingAllConnections.then((connections) => {
    gettingAllCookies.then((cookies) => {
      //set the header of the panel
      var activeTabUrlHeader = document.getElementById('header-title');
      var textHeader = document.createTextNode(tab.title);
      activeTabUrlHeader.appendChild(textHeader);

      browser.tabs.executeScript(tab.id, { code: `var _lsTotal = 0, _xLen, _x; for (_x in localStorage) { _xLen = (((localStorage[_x].length || 0) + (_x.length || 0)) * 2); _lsTotal += _xLen; console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB") }; (_lsTotal / 1024).toFixed(2) + " KB";` },
      function(result){
        var activeTabUrlHea = document.getElementById('storage-title');
        let textH = document.createTextNode("Total Storage " + "(" + result + ")");
        activeTabUrlHea.appendChild(textH);
      });

      //set the header of the panel
      var activeTabUrl = document.getElementById('cookie-header-title');
      var text = document.createTextNode("Cookies " + "(" + cookies.length + "):");
      var cookieList = document.getElementById('cookie-list');
      activeTabUrl.appendChild(text);

      //set the header of the panel
      var activeTabUrlConn = document.getElementById('connection-header-title');
      var textConn = document.createTextNode("External Connections");
      var connectionList = document.getElementById('connection-list');
      activeTabUrlConn.appendChild(textConn);

      if (cookies.length > 0) {
        //add an <li> item with the name and value of the cookie to the list
        for (let cookie of cookies) {
          let li = document.createElement("li");
          let content = document.createTextNode(cookie.name + ": "+ cookie.value);
      
          li.appendChild(content);
          cookieList.appendChild(li);
        }
      } else {
        let p = document.createElement("p");
        let content = document.createTextNode("No cookies in this tab.");

        p.appendChild(content);
        cookieList.appendChild(p);
      }


      // var archive = [],
      //   keys = Object.keys(localStorage),
      //   i = 0, key;

      // for (; key = keys[i]; i++) {
      //     archive.push( key + '=' + localStorage.getItem(key));
      // }


      // let storagecookies = document.getElementById('storage');
      // let li = document.createElement("li");
      // let li2 = document.createElement("li");
      // let content = document.createTextNode(JSON.stringify(keys));
      // let content2 = document.createTextNode("Original URL: " + connections[tab.url].usesStorage);

      // li2.appendChild(content2);
      // li.appendChild(content);
      // storagecookies.appendChild(li2);
      // storagecookies.appendChild(li);
      
      
      if(tabs[0]){

        for ([k,v] of Object.entries(localStorage)) {
          let storagecookies = document.getElementById('storage');
          let li = document.createElement("li");
          let li2 = document.createElement("li");
          let content = document.createTextNode(`<span>${k} : ${v}</span><br>`);
          let content2 = document.createTextNode("Original URL: " + connections[tab.url].usesStorage);

          li2.appendChild(content2);
          li.appendChild(content);
          storagecookies.appendChild(li2);
          storagecookies.appendChild(li);
        }
      }else{
        let storagecookies = document.getElementById('storage');
        let li = document.createElement("li");
        let li2 = document.createElement("li");
        let content = document.createTextNode("No storage details to show");
        let content2 = document.createTextNode("Original URL: " + connections[tab.url].usesStorage);
    
        li2.appendChild(content2);
        li.appendChild(content);
        storagecookies.appendChild(li2);
        storagecookies.appendChild(li);
      }

      if (connections[tab.url].urlList.length > 0) {
        //add an <li> item with the name and value of the cookie to the list
        for (let c of connections[tab.url].urlList) {
          console.log(c)
          let li = document.createElement("li");
          let content = document.createTextNode(c);
          li.appendChild(content);
          connectionList.appendChild(li);
        }
      } else {
        let p = document.createElement("p");
        let content = document.createTextNode("No external connections in this tab.");
        let parent = connectionList.parentNode;

        p.appendChild(content);
        parent.appendChild(p);
      }
    })
  });
  
}

//Listen for the event
window.addEventListener("PassToBackground", function(evt) {
  browser.runtime.sendMessage(evt.detail);
}, false);

//get active tab to run an callback function.
//it sends to our callback an array of tab objects
function getActiveTab() {
  return browser.tabs.query({currentWindow: true, active: true});
}
getActiveTab().then(showCookiesForTab);
