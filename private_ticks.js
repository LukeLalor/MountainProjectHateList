// add private tick row to account dropdown
let privateTickRow = createPrivateTickRow();

const popupHtml = chrome.runtime.getURL('./tick_popup.html');
// load html tick snippet and scripts to make it work better
console.log("Loading html snippet from " + popupHtml);

fetch(popupHtml).then((response) => response.text()).then((text) => {
    loadPopup(text);
    privateTickRow.onclick = openPopup;
    let closeButton = document.getElementById("tickPopupClose");
    closeButton.onclick = closePopup;
    handleLeadOptionsToggle();
    let saveButton = document.getElementById("privateTickButton");
    saveButton.onclick = function () { saveForm(); closePopup(); }
});

function createPrivateTickRow() {
    let privateTickRow = document.createElement("a");
    privateTickRow.className += "dropdown-item";
    privateTickRow.appendChild(document.createTextNode("New Private Tick"));
    document.getElementById("user-dropdown-menu").appendChild(privateTickRow);
    return privateTickRow;
}

function mapToObj(map){
    const obj = {};
    for (let [k,v] of map)
        obj[k] = v;
    return obj
}

function loadPopup(text) {
    let body = document.getElementsByTagName("BODY")[0];
    let container = document.createElement("div");
    container.innerHTML = text;
    body.append(container);
}

function openPopup() {
    let popup = document.getElementById("tickPopupSnippet");
    popup.classList.add("in");
    popup.removeAttribute("aria-hidden");
    popup.setAttribute("style", "display: block;");
}

function closePopup() {
    let popup = document.getElementById("tickPopupSnippet");
    popup.classList.remove("in");
    popup.setAttribute("aria-hidden", "true");
    popup.setAttribute("style", "display: none;");
}

function handleLeadOptionsToggle() {
    let leadSubOptions = document.getElementById("lead-suboptions");
    let leadRadio = document.getElementById("private-lead-toggle");
    leadRadio.parentElement.parentElement.onclick = function () {
        if (leadRadio.checked) {
            leadSubOptions.classList.remove("text-muted");
        } else {
            leadSubOptions.classList.add("text-muted");
            let subOptions = document.getElementsByClassName("lead-suboption");
            for (i = 0; i < subOptions.length; i++) {
                subOptions.item(i).checked = false
            }
        }
    };
}

function saveForm() {
    let savedValues = new Map();
    storeValuesForTag("input", savedValues);
    storeValuesForTag("textarea", savedValues);

    chrome.storage.sync.get('savedTicks', function (data) {
        let saved = getSavedTicks(data);
        let obj = mapToObj(savedValues);
        saved.push(obj);
        chrome.storage.sync.set({'savedTicks': saved}, function () {
            console.log("added " + obj + " to saved ticks");
        });
    });
}

function getSavedTicks(data) {
    return (typeof data.savedTicks != 'undefined' && data.savedTicks instanceof Array) ? data.savedTicks : []
}

function storeValuesForTag(qualifiedName, savedValues) {
    let inputs = document.getElementById("tickPopupSnippet").getElementsByTagName(qualifiedName);
    for (i = 0; i < inputs.length; ++i) {
        let input = inputs.item(i);
        let name = input.getAttribute("name");
        let value = input.value;
        if ((value && input.type !== "radio") || input.checked) {
            savedValues.set(name, value);
        }
    }
}
