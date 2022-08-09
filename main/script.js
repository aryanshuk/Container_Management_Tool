serverIP = "192.168.43.134";

function listContainers() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/containers/list", true);
    http.send();
}
function createContainers() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/containers/create", true)
    http.send();
}