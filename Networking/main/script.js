serverIP = "192.168.16.227";

function createNetwork() {
    const http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        if (this.readyState == 4) {
            document.getElementById("mainPanel").innerHTML = http.responseText;
        }
    }

    http.open("GET", "http://" + serverIP + "/Networking/create" , true);
    http.send();
}
