
const express = require("express");
const { exec } = require("child_process");
const http = require("http");
var path = require("path")

const app = express()

serverIP = "192.168.0.117";

app.listen(80, () => {
    console.log("Server Started ......")
});

app.use("/containers/main", express.static(path.join(__dirname, 'containers/main')));
app.use("/login", express.static(path.join(__dirname, 'login')));
app.use("/containers/create", express.static(path.join(__dirname, 'containers/create')));
app.use("/containers/list", express.static(path.join(__dirname, 'containers/list')));
app.use("/containers/start", express.static(path.join(__dirname, 'containers/start')));

app.get("/containers", (req, res) => {
    res.sendFile(__dirname + '/containers/main/index.html');
})




app.get("/containers/list/all", (req, response) => {
    console.log("Showing list of containers....");

    response.write(
        '<html><head><link rel="stylesheet" href="/containers/list/style.css"><script src="/containers/list/script.js"></script><title>Containers List</title></head>'
    );

    http.get('http://' + serverIP + ':2375/containers/json?all="true"', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);

            response.write('<body><div id="heading">List of All Containers</div><table><tr><th>Container ID</th><th>Container Name</th><th>Container Image</th><th>State</th><th>Status</th><th>Command</th></tr>');
            if (parsedData.length == 0) {
                response.write("<tr><td colspan=6 >No containers available.</td></tr>");
            }
            else {
                for (let i = 0; i < parsedData.length; i++) {
                    let cId = parsedData[i].Id.slice(0, 12);
                    let cName = parsedData[i].Names[0].slice(1);
                    let cImage = parsedData[i].Image;
                    let cState = parsedData[i].State;
                    let cStatus = parsedData[i].Status;
                    let cCommand = parsedData[i].Command;

                    response.write("<tr><td>" + cId + "</td><td>" + cName + "</td><td>" + cImage + "</td><td>" + cState + "</td><td>" + cStatus + "</td><td>" + cCommand + "</td></tr>");
                }
            }

            response.write("</table></body></html>");
            response.send();
        })
    });
})
app.get("/containers/list/running", (req, response) => {
    console.log("Showing list of containers....");

    response.write(
        '<html><head><link rel="stylesheet" href="/containers/list/style.css"><script src="/containers/list/script.js"></script><title>Containers List</title></head>'
    );

    http.get('http://' + serverIP + ':2375/containers/json', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);

            response.write('<body><div id="heading">List of Runnning Containers</div><table><tr><th>Container ID</th><th>Container Name</th><th>Container Image</th><th>State</th><th>Status</th><th>Command</th></tr>');
            if (parsedData.length == 0) {
                response.write("<tr><td colspan=6 >No running containers available.</td></tr>");
            }
            else {
                for (let i = 0; i < parsedData.length; i++) {
                    let cId = parsedData[i].Id.slice(0, 12);
                    let cName = parsedData[i].Names[0].slice(1);
                    let cImage = parsedData[i].Image;
                    let cState = parsedData[i].State;
                    let cStatus = parsedData[i].Status;
                    let cCommand = parsedData[i].Command;

                    response.write("<tr><td>" + cId + "</td><td>" + cName + "</td><td>" + cImage + "</td><td>" + cState + "</td><td>" + cStatus + "</td><td>" + cCommand + "</td></tr>");
                }
            }

            response.write("</table></body></html>");
            response.send();
        })
    });
})

app.get("/containers/create", (req, res) => {
    res.sendFile(__dirname + "/containers/create/index.html");
})

app.get("/containers/create/launch", (req, res) => {
    cname = req.query.cname;
    cimage = req.query.cimage;

    command = "docker run -dit --name " + cname + " " + cimage;
    exec(command, (err, stdout, stderr) => {
        res.write('<html><body bgcolor="darkgoldenrod">');
        res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
        res.write("<h1>!! Container Launching !! </h1><br /><br /><hr />");
        if (err) {
            res.write("<h3>" + stderr + "</h3>");
        } else {
            res.write("<h3> Container Name : " + cname + "</h3>");
            res.write("<h3> Container ID : " + stdout + "</h3><br /> <br />");
        }


        res.write('</div></body></html>');
        res.send();
    });
});

app.get("/containers/start", (req, res) => {
    res.sendFile(__dirname + "/containers/start/index.html");
})

app.get("/containers/start/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker start " + cname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write('<html><body bgcolor="darkgoldenrod">');
        res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
        res.write("<h1>!! Container Started !! </h1><br /><br /><hr />");
        res.write("<h3> Container ID/Name: " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/restart", express.static(path.join(__dirname, 'containers/restart')));
app.get("/containers/restart", (req, res) => {
    res.sendFile(__dirname + "/containers/restart/index.html");
})

app.get("/containers/restart/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker restart " + cname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write('<html><body bgcolor="darkgoldenrod">');
        res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
        res.write("<h1>!! Container Restarting !! </h1><br /><br /><hr />");
        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/stop", express.static(path.join(__dirname, 'containers/stop')));
app.get("/containers/stop", (req, res) => {
    res.sendFile(__dirname + "/containers/stop/index.html");
})

app.get("/containers/stop/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker stop " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Container Stopping !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/pause", express.static(path.join(__dirname, 'containers/pause')));
app.get("/containers/pause", (req, res) => {
    res.sendFile(__dirname + "/containers/pause/index.html");
})

app.get("/containers/pause/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker pause " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pausing Container !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});


app.use("/containers/unpause", express.static(path.join(__dirname, 'containers/unpause')));
app.get("/containers/unpause", (req, res) => {
    res.sendFile(__dirname + "/containers/unpause/index.html");
})

app.get("/containers/unpause/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker unpause " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Unpausing Container !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/stopAll", express.static(path.join(__dirname, 'containers/stopAll')));
app.get("/containers/stopAll", (req, res) => {
    res.sendFile(__dirname + "/containers/stopAll/index.html");
})

app.get("/containers/stopAll/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker stop $(docker ps -aq) | wc -l";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Stopping  All Containers!! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " containers stopped</h3><br /> <br />");
        }


        res.write('</div></body></html>');
        res.send();
    });
});


app.use("/containers/delete", express.static(path.join(__dirname, 'containers/delete')));
app.get("/containers/delete", (req, res) => {
    res.sendFile(__dirname + "/containers/delete/index.html");
})
app.get("/containers/delete/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker rm -f " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Deleting Container !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/deleteAll", express.static(path.join(__dirname, 'containers/deleteAll')));
app.get("/containers/deleteAll", (req, res) => {
    res.sendFile(__dirname + "/containers/deleteAll/index.html");
})

app.get("/containers/deleteAll/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker rm -f $(docker ps -aq) | wc -l";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Deleting All Containers!! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " containers deleted.</h3><br /> <br />");
        }


        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/inspect", express.static(path.join(__dirname, 'containers/inspect')));
app.use("/containers/inspect/result", express.static(path.join(__dirname, 'containers/inspect/result')));
app.get("/containers/inspect", (req, res) => {
    res.sendFile(__dirname + "/containers/inspect/index.html");
})

app.get("/containers/inspect/result", (req, response) => {
    cname = req.query.cname;

    http.get('http://' + serverIP + ':2375/containers/' + cname + '/json', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);
            parsedData = JSON.stringify(parsedData, null, 4);
            response.send('<html><head><link rel="stylesheet" href="/containers/inspect/result/style.css"></head><body><div id="infoPanel"> <h2>!! Container Information !! </h2><hr /> <pre>' + parsedData + '</pre></div></body></html>');
        });
    })

});

app.use("/containers/log", express.static(path.join(__dirname, 'containers/log')));
app.use("/containers/log/result", express.static(path.join(__dirname, 'containers/log/result')));
app.get("/containers/log", (req, res) => {
    res.sendFile(__dirname + "/containers/log/index.html");
})

app.get("/containers/log/result", (req, res) => {
    cname = req.query.cname;

    command = "docker logs " + cname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/containers/log/result/style.css"></head><body><div id="infoPanel"> <h2>!! Container "' + cname + '" Logs !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/containers/rename", express.static(path.join(__dirname, 'containers/rename')));
app.use("/containers/rename/result", express.static(path.join(__dirname, 'containers/rename/result')));

app.get("/containers/rename", (req, res) => {
    res.sendFile(__dirname + "/containers/rename/index.html");
})

app.get("/containers/rename/result", (req, res) => {
    oldname = req.query.oldname;
    newname = req.query.newname;

    command = "docker rename " + oldname + " " + newname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = "Rename Successful";
        }
        res.send('<html><head><link rel="stylesheet" href="/containers/log/result/style.css"></head><body><div id="infoPanel"> <h2>!! Renaming Container !! </h2><hr /> <br />' + output + '</div></body></html>');
    });
});


// Docker Prune Section
//Remove All Volumes
app.use("/prune/main",express.static(path.join(__dirname,'prune/main')));

app.get("/prune", (req, res) => {
    res.sendFile(__dirname, "/prune/main/index.html");
})

app.use("/prune/rmvVol", express.static(path.join(__dirname,'prune/rmvVol')));


app.get("/prune/rmvVol", (req, res) => {

    command = "docker volume prune -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning Volumes !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

//Clean The Resources Which Are Not Associated

app.use("/prune/rmvSysResource", express.static(path.join(__dirname,'prune/rmvSysResource')));


app.get("/prune/rmvSysResource", (req, res) => {

    command = "docker system prune -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning System Resources !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

//  Remove Stopped And Unused Images 

app.use("/prune/rmvStoppedImg", express.static(path.join(__dirname,'prune/rmvStoppedImg')));


app.get("/prune/rmvStoppedImg", (req, res) => {

    command = "docker system prune -a -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning Stopped And Unused Images !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

// Remove Dangling Docker Images

app.use("/prune/rmvDanglingImg", express.static(path.join(__dirname,'prune/rmvDanglingImg')));


app.get("/prune/rmvDanglingImg", (req, res) => {

    command = "docker image prune -a -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning Dangling Docker Images !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

// Remove All Unused Containers
app.use("/prune/rmvUnusedCont", express.static(path.join(__dirname,'prune/rmvUnusedCont')));


app.get("/prune/rmvUnusedCont", (req, res) => {

    command = "docker container prune -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning Unused Continers !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

// Remove All Unused Docker Networks
app.use("/prune/rmvDockNtwrk", express.static(path.join(__dirname,'prune/rmvDocNtwrk')));


app.get("/prune/rmvDockNtwrk", (req, res) => {

    command = "docker network prune -f ";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pruning Unused Docker Networks !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
    
// TODO: Recheck...
const express = require("express");
const { exec } = require("child_process");
const http = require("http");
var path = require("path")

const app = express()


serverIP = "192.168.254.162";

app.listen(80, () => {
    console.log("Server Started ......")
});

app.use("/containers/main", express.static(path.join(__dirname, 'containers/main')));
app.use("/login", express.static(path.join(__dirname, 'login')));
app.use("/containers/create", express.static(path.join(__dirname, 'containers/create')));
app.use("/containers/list", express.static(path.join(__dirname, 'containers/list')));
app.use("/containers/start", express.static(path.join(__dirname, 'containers/start')));

app.get("/containers", (req, res) => {
    res.sendFile(__dirname + '/containers/main/index.html');
})




app.get("/containers/list/all", (req, response) => {
    console.log("Showing list of containers....");

    response.write(
        '<html><head><link rel="stylesheet" href="/containers/list/style.css"><script src="/containers/list/script.js"></script><title>Containers List</title></head>'
    );

    http.get('http://' + serverIP + ':2375/containers/json?all="true"', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);

            response.write('<body><div id="heading">List of All Containers</div><table><tr><th>Container ID</th><th>Container Name</th><th>Container Image</th><th>State</th><th>Status</th><th>Command</th></tr>');
            if (parsedData.length == 0) {
                response.write("<tr><td colspan=6 >No containers available.</td></tr>");
            }
            else {
                for (let i = 0; i < parsedData.length; i++) {
                    let cId = parsedData[i].Id.slice(0, 12);
                    let cName = parsedData[i].Names[0].slice(1);
                    let cImage = parsedData[i].Image;
                    let cState = parsedData[i].State;
                    let cStatus = parsedData[i].Status;
                    let cCommand = parsedData[i].Command;

                    response.write("<tr><td>" + cId + "</td><td>" + cName + "</td><td>" + cImage + "</td><td>" + cState + "</td><td>" + cStatus + "</td><td>" + cCommand + "</td></tr>");
                }
            }

            response.write("</table></body></html>");
            response.send();
        })
    });
})
app.get("/containers/list/running", (req, response) => {
    console.log("Showing list of containers....");

    response.write(
        '<html><head><link rel="stylesheet" href="/containers/list/style.css"><script src="/containers/list/script.js"></script><title>Containers List</title></head>'
    );

    http.get('http://' + serverIP + ':2375/containers/json', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);

            response.write('<body><div id="heading">List of Runnning Containers</div><table><tr><th>Container ID</th><th>Container Name</th><th>Container Image</th><th>State</th><th>Status</th><th>Command</th></tr>');
            if (parsedData.length == 0) {
                response.write("<tr><td colspan=6 >No running containers available.</td></tr>");
            }
            else {
                for (let i = 0; i < parsedData.length; i++) {
                    let cId = parsedData[i].Id.slice(0, 12);
                    let cName = parsedData[i].Names[0].slice(1);
                    let cImage = parsedData[i].Image;
                    let cState = parsedData[i].State;
                    let cStatus = parsedData[i].Status;
                    let cCommand = parsedData[i].Command;

                    response.write("<tr><td>" + cId + "</td><td>" + cName + "</td><td>" + cImage + "</td><td>" + cState + "</td><td>" + cStatus + "</td><td>" + cCommand + "</td></tr>");
                }
            }

            response.write("</table></body></html>");
            response.send();
        })
    });
})

app.get("/containers/create", (req, res) => {
    res.sendFile(__dirname + "/containers/create/index.html");
})

app.get("/containers/create/launch", (req, res) => {
    cname = req.query.cname;
    cimage = req.query.cimage;

    command = "docker run -dit --name " + cname + " " + cimage;
    exec(command, (err, stdout, stderr) => {
        res.write('<html><body bgcolor="darkgoldenrod">');
        res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
        res.write("<h1>!! Container Launching !! </h1><br /><br /><hr />");
        if (err) {
            res.write("<h3>" + stderr + "</h3>");
        } else {
            res.write("<h3> Container Name : " + cname + "</h3>");
            res.write("<h3> Container ID : " + stdout + "</h3><br /> <br />");
        }


        res.write('</div></body></html>');
        res.send();
    });
});

app.get("/containers/start", (req, res) => {
    res.sendFile(__dirname + "/containers/start/index.html");
})

app.get("/containers/start/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker start " + cname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write('<html><body bgcolor="darkgoldenrod">');
        res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
        res.write("<h1>!! Container Started !! </h1><br /><br /><hr />");
        res.write("<h3> Container ID/Name: " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/restart", express.static(path.join(__dirname, 'containers/restart')));
app.get("/containers/restart", (req, res) => {
    res.sendFile(__dirname + "/containers/restart/index.html");
})

app.get("/containers/restart/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker restart " + cname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write('<html><body bgcolor="darkgoldenrod">');
        res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
        res.write("<h1>!! Container Restarting !! </h1><br /><br /><hr />");
        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/stop", express.static(path.join(__dirname, 'containers/stop')));
app.get("/containers/stop", (req, res) => {
    res.sendFile(__dirname + "/containers/stop/index.html");
})

app.get("/containers/stop/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker stop " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Container Stopping !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/pause", express.static(path.join(__dirname, 'containers/pause')));
app.get("/containers/pause", (req, res) => {
    res.sendFile(__dirname + "/containers/pause/index.html");
})

app.get("/containers/pause/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker pause " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Pausing Container !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});


app.use("/containers/unpause", express.static(path.join(__dirname, 'containers/unpause')));
app.get("/containers/unpause", (req, res) => {
    res.sendFile(__dirname + "/containers/unpause/index.html");
})

app.get("/containers/unpause/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker unpause " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Unpausing Container !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/stopAll", express.static(path.join(__dirname, 'containers/stopAll')));
app.get("/containers/stopAll", (req, res) => {
    res.sendFile(__dirname + "/containers/stopAll/index.html");
})

app.get("/containers/stopAll/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker stop $(docker ps -aq) | wc -l";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Stopping  All Containers!! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " containers stopped</h3><br /> <br />");
        }


        res.write('</div></body></html>');
        res.send();
    });
});


app.use("/containers/delete", express.static(path.join(__dirname, 'containers/delete')));
app.get("/containers/delete", (req, res) => {
    res.sendFile(__dirname + "/containers/delete/index.html");
})
app.get("/containers/delete/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker rm -f " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Deleting Container !! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.write("<h3> Output : " + output + "</h3><br /> <br />");
        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/deleteAll", express.static(path.join(__dirname, 'containers/deleteAll')));
app.get("/containers/deleteAll", (req, res) => {
    res.sendFile(__dirname + "/containers/deleteAll/index.html");
})

app.get("/containers/deleteAll/launch", (req, res) => {
    cname = req.query.cname;

    command = "docker rm -f $(docker ps -aq) | wc -l";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Deleting All Containers!! </h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " containers deleted.</h3><br /> <br />");
        }


        res.write('</div></body></html>');
        res.send();
    });
});

app.use("/containers/inspect", express.static(path.join(__dirname, 'containers/inspect')));
app.use("/containers/inspect/result", express.static(path.join(__dirname, 'containers/inspect/result')));
app.get("/containers/inspect", (req, res) => {
    res.sendFile(__dirname + "/containers/inspect/index.html");
})

app.get("/containers/inspect/result", (req, response) => {
    cname = req.query.cname;

    http.get('http://' + serverIP + ':2375/containers/' + cname + '/json', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);
            parsedData = JSON.stringify(parsedData, null, 4);
            response.send('<html><head><link rel="stylesheet" href="/containers/inspect/result/style.css"></head><body><div id="infoPanel"> <h2>!! Container Information !! </h2><hr /> <pre>' + parsedData + '</pre></div></body></html>');
        });
    })

});

app.use("/containers/log", express.static(path.join(__dirname, 'containers/log')));
app.use("/containers/log/result", express.static(path.join(__dirname, 'containers/log/result')));
app.get("/containers/log", (req, res) => {
    res.sendFile(__dirname + "/containers/log/index.html");
})

app.get("/containers/log/result", (req, res) => {
    cname = req.query.cname;

    command = "docker logs " + cname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/containers/log/result/style.css"></head><body><div id="infoPanel"> <h2>!! Container "' + cname + '" Logs !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/containers/rename", express.static(path.join(__dirname, 'containers/rename')));
app.use("/containers/rename/result", express.static(path.join(__dirname, 'containers/rename/result')));

app.get("/containers/rename", (req, res) => {
    res.sendFile(__dirname + "/containers/rename/index.html");
})

app.get("/containers/rename/result", (req, res) => {
    oldname = req.query.oldname;
    newname = req.query.newname;

    command = "docker rename " + oldname + " " + newname;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = "Rename Successful";
        }
        res.send('<html><head><link rel="stylesheet" href="/containers/log/result/style.css"></head><body><div id="infoPanel"> <h2>!! Renaming Container !! </h2><hr /> <br />' + output + '</div></body></html>');
    });
});


// Docker Networking
app.use("/Networking/main", express.static(path.join(__dirname, 'Networking/main')));
app.use("/Networking/create", express.static(path.join(__dirname, 'Networking/create')));
app.use("/Networking/create/result", express.static(path.join(__dirname, 'Networking/create/result')));




app.get("/Networking", (req, res) => {
    res.sendFile(__dirname + "/Networking/main/index.html");
})
app.get("/Networking/create", (req, res) => {
    res.sendFile(__dirname + "/Networking/create/index.html");
})

app.get("/Networking/create/result", (req, res) => {
    subnet = req.query.subnet;
    net_name = req.query.net_name;

    command = "docker network create --driver=bridge --subnet="+subnet+" "+net_name;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/Networking/create/result/style.css"></head><body><div id="infoPanel"> <h2>"' + net_name + '" Network Created </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/Networking/list", express.static(path.join(__dirname, 'Networking/list')));
app.use("/Networking/list/result", express.static(path.join(__dirname, 'Networking/list/result')));


app.get("/Networking/list", (req, res) => {

    command = "docker network ls";
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.send('<html><head><link rel="stylesheet" href="/Networking/list/style.css"></head><body><div id="infoPanel"> <h2> Docker Networks List </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/Networking/inspect", express.static(path.join(__dirname, 'Networking/inspect')));
app.use("/Networking/inspect/result", express.static(path.join(__dirname, 'Networking/inspect/result')));


app.get("/Networking/inspect", (req, res) => {

    command = "docker network inspect bridge";
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }

        res.send('<html><head><link rel="stylesheet" href="/Networking/inspect/style.css"></head><body><div id="infoPanel"> <h2> Docker Inspect</h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

// Docker Volumes

app.use("/volumes/main", express.static(path.join(__dirname, 'volumes/main')));
app.use("/volumes/create", express.static(path.join(__dirname, 'volumes/create')));
app.use("/volumes/create/result", express.static(path.join(__dirname, 'volumes/create/result')));




app.get("/volumes", (req, res) => {
    res.sendFile(__dirname + "/volumes/main/index.html");
})
app.get("/volumes/create", (req, res) => {
    res.sendFile(__dirname + "/volumes/create/index.html");
})

app.get("/volumes/create/result", (req, res) => {
    v_name = req.query.v_name;

    command = "docker volume create "+v_name
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/volumes/create/result/style.css"></head><body><div id="infoPanel"> <h2>"' + v_name + '" Volume Created </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/volumes/inspect", express.static(path.join(__dirname, 'volumes/inspect')));
app.use("/volumes/inspect/result", express.static(path.join(__dirname, 'volumes/inspect/result')));

app.get("/volumes/inspect/result", (req, res) => {
    v_name = req.query.v_name;

    command = "docker volume inspect "+v_name
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/volumes/inspect/result/style.css"></head><body><div id="infoPanel"> <h2>"' + v_name + '" Volume info </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

});

app.use("/volumes/remove", express.static(path.join(__dirname, 'volumes/remove')));
app.use("/volumes/remove/result", express.static(path.join(__dirname, 'volumes/remove/result')));

app.get("/volumes/remove/result", (req, res) => {
    v_name = req.query.v_name;

    command = "docker volume rm "+v_name
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/volumes/inspect/result/style.css"></head><body><div id="infoPanel"> <h2>"' + v_name + '" Volume deleted </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });

// ################ Addition by Ddhruv ################

// ############## Codes for Services STARTS #############

// Code for Services Main files
app.use("/Services/main", express.static(path.join(__dirname, 'Services/main')));
app.get("/Services", (req, res) => {
    res.sendFile(__dirname + '/Services/main/index.html');
})

// Code for Start Option
app.use("/Services/start", express.static(path.join(__dirname, 'Services/start')));
app.get("/Services/start", (req, res) => {
    res.sendFile(__dirname + "/Services/start/index.html");
})

app.get("/Services/start/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo systemctl start docker";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Starting Docker Services !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " Services Started Successfully</h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});


// Code for Enable Option
app.use("/Services/enable", express.static(path.join(__dirname, 'Services/enable')));
app.get("/Services/enable", (req, res) => {
    res.sendFile(__dirname + "/Services/start/index.html");
})

app.get("/Services/enable/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo systemctl enable docker";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Enabling Docker Services !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " Services Enabled Successfully</h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});

// Code for Restart Option
app.use("/Services/restart", express.static(path.join(__dirname, 'Services/restart')));
app.get("/Services/restart ", (req, res) => {
    res.sendFile(__dirname + "/Services/start/index.html");
})

app.get("/Services/restart/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo systemctl restart docker";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Restarting Docker Services !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " Services Restarted Successfully</h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});


// Code for Stop Option
app.use("/Services/stop", express.static(path.join(__dirname, 'Services/stop')));
app.get("/Services/stop ", (req, res) => {
    res.sendFile(__dirname + "/Services/stop/index.html");
})

app.get("/Services/stop/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo systemctl stop docker";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px" >');
    res.write("<h1>!! Stoppinging Docker Services !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : " + output + " Services Stopped Successfully</h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});


// Code for Status Option
app.use("/Services/status", express.static(path.join(__dirname, 'Services/status')));
app.get("/Services/status ", (req, res) => {
    res.sendFile(__dirname + "/Services/status/index.html");
})

app.get("/Services/status/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo systemctl status docker";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto" >');
    res.write("<h1>!!Getting the Status of Docker Services !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output :<pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});


// ############## Codes for Services ENDS #############

// ############## Codes for Logs STARTS #############

// Code for Logs Main files
app.use("/Logs/main", express.static(path.join(__dirname, 'Logs/main')));
app.get("/Logs", (req, res) => {
    res.sendFile(__dirname + '/Logs/main/index.html');
})

// Code for Version Option
app.use("/Logs/version/", express.static(path.join(__dirname, 'Logs/version/')));
app.get("/Logs/version/", (req, res) => {
    res.sendFile(__dirname + "/Logs/version/index.html");
})

app.get("/Logs/version/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo docker --version";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto;" >');
    res.write("<h1>!! Getting Docker Version Details !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : Current Version:  <pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});

// Code for Events Option
app.use("/Logs/events/", express.static(path.join(__dirname, 'Logs/events/')));
app.get("/Logs/events/", (req, res) => {
    res.sendFile(__dirname + "/Logs/events/index.html");
})

app.get("/Logs/events/launch", (req, res) => {
    //cname = req.query.cname;

    command = "sudo docker events";
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto;" >');
    res.write("<h1>!! Getting Docker Events !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output : " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output : Events:  <pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});

// Code for Top Option
app.use("/Logs/top/", express.static(path.join(__dirname, 'Logs/top/')));
app.get("/Logs/top/", (req, res) => {
    res.sendFile(__dirname + "/Logs/top/index.html");
})

app.get("/Logs/top/launch", (req, res) => {
    cname = req.query.cname;
    command = "sudo docker top" + " " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto;" >');
    res.write("<h1>!! Getting Info. about" + " " + cname + " container !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output: " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output: <pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});

// Code for stats Option
app.use("/Logs/stats/", express.static(path.join(__dirname, 'Logs/stats/')));
app.get("/Logs/stats/", (req, res) => {
    res.sendFile(__dirname + "/Logs/stats/index.html");
})

app.get("/Logs/stats/launch", (req, res) => {
    cname = req.query.cname;
    command = "sudo docker stats" + " " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto;" >');
    res.write("<h1>!! Getting Stats. about" + " " + cname + " container !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output: " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output: <pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });
});

// Code for Port Option
app.use("/Logs/port/", express.static(path.join(__dirname, 'Logs/port/')));
app.get("/Logs/port/", (req, res) => {
    res.sendFile(__dirname + "/Logs/port/index.html");
})

app.get("/Logs/port/launch", (req, res) => {
    cname = req.query.cname;
    command = "sudo docker port" + " " + cname;
    res.write('<html><body bgcolor="darkgoldenrod">');
    res.write('<div style="position: absolute;left: 5%;top: 10%;background-color: rgb(45, 43, 43);border-radius: 10px;width: 80%; height: 70%; color: white; padding: 50px; overflow: auto;" >');
    res.write("<h1>!! Getting Info. about Port on " + " " + cname + " container !!</h1><br /><br /><hr />");
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
            res.write("<h3> Output: " + output + " </h3><br /> <br />");
        } else {
            output = stdout;
            res.write("<h3> Output: <pre>" + output + "</pre> </h3><br /> <br />");
        }
        res.write('</div></body></html>');
        res.send();
    });


});