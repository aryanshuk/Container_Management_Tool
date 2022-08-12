serverIP = "containertool.ddns.net";

function createVolume() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/volumes/create", true);
    http.send();
}

function inspectVolume() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/volumes/inspect", true);
    http.send();
}

function removeVolume() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/volumes/remove", true);
    http.send();
}