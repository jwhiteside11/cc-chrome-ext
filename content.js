// content script
// for interacting w web page content
const sendMessageToBG = async (message) => {
  const response = await chrome.runtime.sendMessage(message);
  console.log("resp", response);
  return response
}

const arrToCSVurl = (arr) => {
  const csvStr = arr.map(row => row.join(',')).join("\r\n")
  const blob = new Blob([csvStr], {type: 'text/csv;charset=utf-8;'});
  return URL.createObjectURL(blob)
}

const saveCSV = (csvContent) => {
  const url = arrToCSVurl(csvContent);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "my_data.csv");
  link.style.visibility = 'hidden';

  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link); // Required for FF
}

// listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "save_csv") {
    saveCSV(message.payload)
    sendResponse({message: "csv saved"})
  } else {
    sendResponse({message: "message type not recognized"});
  }
});