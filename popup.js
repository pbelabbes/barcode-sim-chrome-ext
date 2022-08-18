// Initialize button with user's preferred color
let barcodeInput = document.getElementById("barcodeInput");
let barcodeInputButton = document.getElementById("runInput");
let barcodeHistory = [];
chrome.storage.sync.get(["barcodeHistory"], (res) => {
  const storageBarcodeHistory = res.barcodeHistory;
  console.log("Barcode history is currently : ", storageBarcodeHistory);
  if (storageBarcodeHistory.length > 0) {
    barcodeHistory = storageBarcodeHistory;
    displayHistory();
  }
});

barcodeInput.focus();

// When the button is clicked, inject setPageBackgroundColor into current page
barcodeInputButton.addEventListener("click", async (e) => {
  console.log(barcodeInput.value);
  const newBarcode = barcodeInput.value;
  console.log("Enter :", newBarcode);
  simulateBarCode(newBarcode);
  barcodeHistory = [newBarcode].concat(barcodeHistory);
  chrome.storage.sync.set({ barcodeHistory });
  displayHistory();
});

async function simulateBarCode(newBarcode) {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: simulatebarCodeKeyboardInput,
    args: [newBarcode],
  });
}

function displayHistory() {
  console.log(barcodeHistory);
  let historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";
  for (const barcode of barcodeHistory) {
    const barcodeDiv = displayBarcodeItem(barcode);
    historyDiv.appendChild(barcodeDiv);
  }
}

function displayBarcodeItem(barcode) {
  const barcodeItem = document.createElement("div");
  const barcodeLabel = document.createElement("div");
  const runBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");

  barcodeLabel.className = "barcodeLabel";

  barcodeLabel.textContent = barcode;
  runBtn.textContent = "run";
  deleteBtn.textContent = "delete";

  runBtn.className = "launch-btn";
  deleteBtn.className = "delete-btn";

  runBtn.addEventListener("click", async () => simulateBarCode(barcode));
  deleteBtn.addEventListener("click", () => deleteBarCode(barcode));

  barcodeItem.appendChild(barcodeLabel);
  barcodeItem.appendChild(runBtn);
  barcodeItem.appendChild(deleteBtn);
  barcodeItem.className = "barcodeItem";

  return barcodeItem;
}

function deleteBarCode(barcodeToDelete) {
  barcodeHistory = barcodeHistory.filter(
    (barcode) => barcode !== barcodeToDelete
  );
  chrome.storage.sync.set({ barcodeHistory });
  displayHistory();
}

function pressKey(letter) {
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: letter,
    })
  );
}

function simulatebarCodeKeyboardInput(barCode) {
  const pressKey = (letter) => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: letter,
      })
    );
  };

  console.log(barCode);
  barCode.split("").forEach((letter) => {
    pressKey(letter);
  });
}
