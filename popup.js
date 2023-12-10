// popup script
// for interacting w popup content
const sendMessageToBG = async (message) => {
  const response = await chrome.runtime.sendMessage(message);
  console.log("resp", response);
  return response
}

const getCurrentTab = async () => {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab; // `tab` will either be a `tabs.Tab` instance or `undefined`.
}

const sendMessageToContent = async (message) => {
  const tab = await getCurrentTab()
  console.log(tab)
  if (!tab) {
    console.log("tab undefined")
    return
  }
  const response = await chrome.tabs.sendMessage(tab.id, message);
  console.log("resp", response);
  return response
}

const set_company_n = (n) => { document.querySelector("#companies").innerText = n }
const set_contacts_n = (n) => { document.querySelector("#contacts").innerText = n }

document.querySelector("button").onclick = () => {
  sendMessageToBG({type: "get_csv"})
}

// let con = 1;
// let com = 1;
// document.querySelector("button").onclick = () => {
//   set_contacts_n(con++)
//   set_companies_n(com++)
// }

// let i = 0;
// 
// if (i++ % 3 === 1) {
//   sendMessageToBG({type: "set_m", payload: {0: 'a', 1: 'b', 2: 'c'}})
// } else {
//   sendMessageToBG({type: "get_m"})
// }

