console.log("running forum_script.js");

chrome.storage.sync.get('hateList', function(data) {
    let hateList = getHateList(data);
    console.log("current hateList: " + hateList);

    hateList.forEach(function (userLinkString) {
        hidePosts(userLinkString);
    });
});

let userLinks = document.evaluate('//table//div[contains(@class, "bio")]//a[contains(@href, "mountainproject.com/user/")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
for ( var i=0 ; i < userLinks.snapshotLength; i++ ){
    let userLink = userLinks.snapshotItem(i);

    let userLinkString = userLink.getAttribute("href");

    let bio = userLink.parentElement;
    var hideNode = document.createElement("span");
    hideNode.classList.add("text-warm", "small");
    hideNode.style.cursor = "pointer";
    var textNode = document.createTextNode("Hide Posts");
    hideNode.appendChild(textNode);
    bio.appendChild(document.createTextNode("\n·\n"));
    bio.appendChild(hideNode);
    hideNode.onclick = function() {
        if (confirm("Hide posts from " + userLinkString + "?")) {
            appendHateList(userLinkString);
            hidePosts(userLinkString);
        }
    };
}

function appendHateList(newVal) {
    chrome.storage.sync.get('hateList', function(data) {
        let hateList = getHateList(data);
        hateList.push(newVal);
        chrome.storage.sync.set({'hateList': hateList}, function () {
            console.log("added " + newVal + " to hateList")
        })
    });
}

function getHateList(data) {
    return (typeof data.hateList != 'undefined' && data.hateList instanceof Array) ? data.hateList : [];
}

function hidePosts(userLinkString) {
    var myRegexp = /user\/([0-9]+)\//g;
    var match = myRegexp.exec(userLinkString);
    let userId = match[1];

    var posts = document.evaluate('//table//tr[.//a[contains(@href, "' + userId + '")]]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < posts.snapshotLength; i++) {
        let post = posts.snapshotItem(i);
        post.parentElement.removeChild(post)
        console.log("removed a post from " + userLinkString)
    }
}