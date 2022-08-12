serverIP = "containertool.ddns.net";

function createNetwork() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/Networking/create", true);
    http.send();
}

function listNetwork() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Networking/list", true);
    http.send();
}

function inspectBridge() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Networking/inspect", true);
    http.send();
}