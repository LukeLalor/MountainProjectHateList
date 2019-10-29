console.log("running account.js");

let hateListContainer = createEditAccoutContainer("Hate List");
populateHateList(hateListContainer);

function createEditAccoutContainer(titleStr) {
    let container = document.getElementById("emailForm").parentElement.parentElement.parentElement;
    let inner = document.createElement("div");
    inner.classList.add("col-md-6", "mb-2");
    let background = document.createElement("div");
    background.classList.add("p-2", "bg-gray-background");
    let fieldset = document.createElement("fieldset");
    fieldset.classList.add("form-group");
    let title = document.createElement("label");
    title.classList.add("primary");
    title.appendChild(document.createTextNode(titleStr));
    let hateListContainer = document.createElement("div");

    container.appendChild(inner);
    inner.appendChild(background);
    fieldset.appendChild(title);
    fieldset.appendChild(hateListContainer);
    background.appendChild(fieldset);
    return hateListContainer;
}

function populateHateList(hateListContainer) {
    chrome.storage.sync.get('hateList', function (data) {
        let hateList = (typeof data.hateList != 'undefined' && data.hateList instanceof Array) ? data.hateList : [];
        console.log("adding hate list");

        hateList.forEach(function (value, index, array) {
            let hatedContainer = document.createElement("div");
            hatedContainer.id = value;
            let hated = document.createTextNode(value);
            let remove = document.createElement("span");
            remove.style.cursor = "pointer";
            remove.onclick = function () {
                let removed = hateList.splice(index, 1);
                chrome.storage.sync.set({'hateList': hateList}, function () {
                    document.getElementById(value).remove();
                    console.log("removed " + removed + " from hateList");
                });
            };
            let removeText = document.createTextNode(" (remove)");

            remove.appendChild(removeText);
            hatedContainer.appendChild(hated);
            hatedContainer.appendChild(remove);
            hateListContainer.appendChild(hatedContainer);
        })
    });
}
