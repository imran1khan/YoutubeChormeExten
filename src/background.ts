// console.log('hi')
chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
  if (changeInfo.status==='complete') {    
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      console.log(tab.url)
    }
  }
});











//   chrome.tabs.move(activeInfo.tabId, { index: 0 }, () => {
//     if (chrome.runtime.lastError) {
//       const error = chrome.runtime.lastError;
//       if (error == "Error: Tabs cannot be edited right now (user may be dragging a tab).") {
//         setTimeout(() => moveToFirstPositionMV2(activeInfo), 50);
//       } else {
//         console.error(error);
//       }
//     } else {
//       console.log("Success.");
//     }
//   });
// }

// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//   console.log(`message is ${msg}`)
//   if (msg.color) {
//     console.log("Receive color = " + msg.color);
//     document.body.style.backgroundColor = msg.color;
//     sendResponse("Change color to " + msg.color);
//   } else {
//     sendResponse("Color message is none.");
//   }
//   return;
// });

// function polling() {
//   console.log("polling");
//   setTimeout(polling, 1000 * 30);
// }

// polling();
