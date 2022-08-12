// serverIP = "containertool.ddns.net";
serverIP = "192.168.19.162";

//remove all the volumes part
function removeAllVolumes() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/allVolumes", true);
    http.send();
}

//remove unassociated resource part

function removeSystemResource() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/sysResources", true);
    http.send();
}


// remove stopped and unused images 

function removeStoppedImages() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/stoppedImages", true);
    http.send();
}


// remove dangling docker images 

function removeDanglingImages() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/danglingImages", true);
    http.send();
}


// remove all unused containers
function removeUnusedContainers() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/unusedContainers", true);
    http.send();
}

// remove unused docker networks

function removeUnusedNetworks() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/unusedNetworks", true);
    http.send();
}