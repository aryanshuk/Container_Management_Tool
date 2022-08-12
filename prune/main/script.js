serverIP = "192.168.0.117";

//remove all the volumes part
function rmvAllVolumes() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/rmvVol", true);
    http.send();
}

//remove unassociated resource part

function rmvSysResource() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/rmvSysResource", true);
    http.send();
}


// remove stopped and unused images 

function rmvStoppedImg() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/rmvStoppedImg", true);
    http.send();
}


// remove dangling docker images 

function rmvDanglingImg() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/rmvDanglingImg", true);
    http.send();
}


// remove all unused containers
function rmvUnusedCont() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/rmvUnusedCont", true);
    http.send();
}

// remove unused docker networks

function rmvDockNtwrk() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/prune/rmvDockNtwrk", true);
    http.send();
}