serverIP = "192.168.254.162";

function startDockerServices() {
    const http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }
    http.open("GET", "http://" + serverIP + "/Services/start/", true)
    http.send();
}