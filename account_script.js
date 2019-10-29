console.log("running account.js");

let hateListContainer = createEditAccoutContainer("Hate List");
populateHateList(hateListContainer);
let privateTicksContainer = createEditAccoutContainer("Private Ticks");

let container = document.createElement("div");
container.classList.add("table-responsive");
let table = document.createElement("table");
table.classList.add("table", "table-striped", "route-table");
// table.classList.add("table", "table-striped", "route-table", "hidden-sm-up");
let tbody = document.createElement("tbody");

table.appendChild(tbody);
container.appendChild(table);
privateTicksContainer.appendChild(container);

chrome.storage.sync.get('savedTicks', function (data) {
    let savedTicks = (typeof data.savedTicks != 'undefined' && data.savedTicks instanceof Array) ? data.savedTicks : [];
    console.log(savedTicks);
    savedTicks.forEach(function (value, index, array) {
        console.log("evaluating " + value);

        let row = document.createElement("tr");
        row.classList.add("route-row");
        if (index % 2 === 0) { row.classList.add("bg-gray-background"); }
        let col1 = document.createElement("td");
        let link = document.createElement("a");
        let strong = document.createElement("strong");
        strong.appendChild(document.createTextNode(value.route || "Unknown Name"));
        let cancel = document.createElement("span");
        cancel.appendChild(document.createTextNode("  ·  (remove)"));
        cancel.style.cursor = "pointer";
        link.appendChild(strong);
        link.appendChild(cancel);
        col1.appendChild(link);
        row.appendChild(col1);

        let col2 = document.createElement("td");
        let span2 = document.createElement("span");
        span2.appendChild(document.createTextNode(value.grade || "Unknown Grade"));
        col2.appendChild(span2);
        row.appendChild(col2);

        let subRow = document.createElement("tr");
        subRow.classList.add("route-row");
        if (index % 2 === 0) { subRow.classList.add("bg-gray-background"); }

        let subCol = document.createElement("td");
        subCol.classList.add("text-warm", "small", "pt-0");
        subCol.setAttribute("colspan", "2");
        let subInfo = document.createElement("i");
        let dateStr = value.date || "Unknown Date";
        let styleStr = value.style || "Unknown Style";
        let leadstyle = (value.leadstyle)? value.leadstyle + "." : "";
        let comments = (value.comments)? " " + value.comments : "";
        let text = dateStr + "  ·  " + styleStr + "." + leadstyle + comments;
        subInfo.appendChild(document.createTextNode(text));
        subCol.appendChild(subInfo);
        subRow.appendChild(subCol);

        cancel.onclick = function () {
            let removed = savedTicks.splice(index, 1);
            chrome.storage.sync.set({'savedTicks': savedTicks}, function () {
                row.remove();
                subRow.remove();
                console.log("removed " + removed + " from saved ticks");
            });
        };

        tbody.appendChild(row);
        tbody.appendChild(subRow);
    });
});

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
            remove.appendChild(document.createTextNode("  ·  (remove)"));
            hatedContainer.appendChild(hated);
            hatedContainer.appendChild(remove);
            hateListContainer.appendChild(hatedContainer);
        })
    });
}
