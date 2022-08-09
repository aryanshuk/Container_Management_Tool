const express = require("express");
const { exec } = require("child_process");
const http = require("http");
var path = require("path")

const app = express()

app.listen(80, () => {
    console.log("Server Started ......")
});


app.use("/main", express.static(path.join(__dirname, 'main')));
app.use("/login", express.static(path.join(__dirname, 'login')));
app.use("/containers/create", express.static(path.join(__dirname, 'containers/create')));
app.use("/containers/list", express.static(path.join(__dirname, 'containers/list')));

app.get("/", (req, res) => {
    // serverip = req.ip;
    res.sendFile(__dirname + '/main/index.html');
})
app.get("/containers/create", (req, res) => {
    res.sendFile(__dirname + "/containers/create/index.html");
})

app.get("/containers/list", (req, response) => {
    console.log("Showing list of containers....");

    response.write(
        '<html><head><link rel="stylesheet" href="/containers/list/style.css"><title>Containers List</title></head>'
    );

    http.get('http://192.168.43.134:2375/containers/json?all="true"', (res) => {
        // console.log(res.statusCode);
        res.on("data", (data) => {
            parsedData = JSON.parse(data);

            response.write('<body><div id="heading">List of Containers</div><table><tr><th>Container ID</th><th>Container Name</th><th>Container Image</th><th>State</th><th>Status</th><th>Command</th></tr>');
            for (let i = 0; i < parsedData.length; i++) {
                let cId = parsedData[i].Id.slice(0, 12);
                let cName = parsedData[i].Names[0].slice(1);
                let cImage = parsedData[i].Image;
                let cState = parsedData[i].State;
                let cStatus = parsedData[i].Status;
                let cCommand = parsedData[i].Command;

                response.write("<tr><td>" + cId + "</td><td>" + cName + "</td><td>" + cImage + "</td><td>" + cState + "</td><td>" + cStatus + "</td><td>" + cCommand + "</td></tr>");
            }

            response.write("</table></body></html>");
            response.send();
        })
    });
})
app.get("/containers/create/launch", (req, res) => {
    cname = req.query.cname;
    cimage = req.query.cimage;

    command = "docker run -dit --name " + cname + " " + cimage;
    exec(command, (err, stdout, stderr) => {
        console.log(stdout);
        res.write("<h1>!! Container Launched !! </h1><br /><br /><hr />");
        res.write("<h3> Container Name : " + cname + "</h3>");
        res.write("<h3> Container ID : " + stdout + "</h3>");
        res.send();
    });
});

