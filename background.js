// background script
// for persistent variables and asynchronous work
const state = {
  companies: {},
  contacts: {}
}

const example_data_h = ["id", "val", "name"]
const example_data = [
  [1, 2, "Greg"],
  [3, 4, "John"],
]

const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

const sendMessageToContent = async (message, sender = null) => {
  if (!sender) {
    const tab = await getCurrentTab()
    if (!tab) {
      console.log("tab undefined");
      return;
    }
    sender = tab.id
  }
  const response = await chrome.tabs.sendMessage(sender, message);
  console.log("resp", response);
  return response
}

// listen for messages from popup.js and content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("bg message", message, sender);
  
  if (message.type === 'get_companies') {
    sendResponse(state.companies);
  } else if (message.type === 'set_companies') {
    state.companies = message.payload
    sendResponse({message: "companies set"});
  } else if (message.type === 'get_contacts') {
    sendResponse(state.contacts);
  } else if (message.type === 'set_contacts') {
    state.contacts = message.payload
    sendResponse({message: "contacts set"});
  } else if (message.type === "get_csv") {
    console.log(sender)
    sendMessageToContent({type: "save_csv", payload: [example_data_h, ...example_data]})
    .then(res => {
      sendResponse(res);
    })
    .catch(e => sendResponse(e))
  } else {
    sendResponse({message: "message type not recognized"});
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});