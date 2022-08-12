const express = require("express");
const { exec } = require("child_process");
const http = require("http");
var path = require("path")
var bodyParser = require('body-parser');
const { stdout, stderr } = require("process");

const app = express()

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// serverIP = "containertool.ddns.net";
serverIP = "192.168.2.162";

app.listen(80, () => {
    console.log("Server Started ......")
});
app.use("/homepage", express.static(path.join(__dirname, 'homepage')));
app.use("/homepage/images", express.static(path.join(__dirname, 'homepage/images')));
app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/homepage/index.html")
})
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/homepage/index.html")
})


app.use("/containers/main", express.static(path.join(__dirname, 'containers/main')));
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

            response.write('<body><div id="heading">List of All Containers</div><table><tr><th>Container ID</th><th>Container Name</th><th>Container Image</th><th>State</th><th>Status</th><th>Port</th><th>Command</th></tr>');
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
                    let cPort = parsedData[i].Ports;
                    let portString = "";
                    for (let j = 0; j < cPort.length; j++) {
                        portString = portString + cPort[j].IP + ":" + cPort[j].PublicPort + "->" + cPort[j].PrivatePort + "/" + cPort[j].Type + ",";
                    }

                    response.write("<tr><td>" + cId + "</td><td>" + cName + "</td><td>" + cImage + "</td><td>" + cState + "</td><td>" + cStatus + "</td><td>" + portString + "</td><td>" + cCommand + "</td></tr>");
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

            response.write('<body><div id="heading">List of Runnning Containers</div><table><tr><th>Container ID</th><th>Container Name</th><th>Container Image</th><th>State</th><th>Status</th><th>Port</th><th>Command</th></tr>');
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
                    let cPort = parsedData[i].Ports;
                    let portString = "";
                    for (let j = 0; j < cPort.length; j++) {
                        portString = portString + cPort[j].IP + ":" + cPort[j].PublicPort + "->" + cPort[j].PrivatePort + "/" + cPort[j].Type + ",";
                    }

                    response.write("<tr><td>" + cId + "</td><td>" + cName + "</td><td>" + cImage + "</td><td>" + cState + "</td><td>" + cStatus + "</td><td>" + portString + "</td><td>" + cCommand + "</td></tr>");
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

    command = "docker run -dit -P --name " + cname + " " + cimage;
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


// Docker Hub Section

app.use("/hub/main", express.static(path.join(__dirname, 'hub/main')));
app.use("/hub/search", express.static(path.join(__dirname, 'hub/search')));
app.use("/hub/search/result", express.static(path.join(__dirname, 'hub/search/result')));

app.get("/hub", (req, res) => {
    res.sendFile(__dirname + "/hub/main/index.html");
})
app.get("/hub/search", (req, res) => {
    res.sendFile(__dirname + "/hub/search/index.html");
})
app.get("/hub/search/result", (req, res) => {
    searchTerm = req.query.searchTerm;

    command = "docker search " + searchTerm;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Search Result for : ' + searchTerm + ' !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/hub/login", express.static(path.join(__dirname, 'hub/login')));
app.get("/hub/login", (req, res) => {
    res.sendFile(__dirname + "/hub/login/index.html");
})
app.post("/hub/login/status", (req, res) => {
    username = req.body.username;
    password = req.body.password;

    command = "docker login -u " + username + " -p " + password;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = 'Error response from daemon: Get "https://registry-1.docker.io/v2/": unauthorized: incorrect username or password';
        } else {
            output = "Login Succeeded";
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Docker Login Status !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/hub/logout", express.static(path.join(__dirname, 'hub/logout')));
app.get("/hub/logout", (req, res) => {
    res.sendFile(__dirname + "/hub/logout/index.html");
})
app.get("/hub/logout/status", (req, res) => {
    command = "docker logout";
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Docker Logout Status !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/hub/push", express.static(path.join(__dirname, 'hub/push')));
app.get("/hub/push", (req, res) => {
    res.sendFile(__dirname + "/hub/push/index.html");
})
app.post("/hub/push/status", (req, res) => {
    fullImageName = req.body.imageName;
    command = "docker push " + fullImageName;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Pushing Docker Image to Docker Hub Status !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

// Docker Images Section
app.use("/images", express.static(path.join(__dirname, 'images')));
app.use("/images/list", express.static(path.join(__dirname, 'images/list')));
app.use("/images/main", express.static(path.join(__dirname, 'images/main')));

app.get("/images", (req, res) => {
    res.sendFile(__dirname + "/images/main/index.html");
})

function digits_count(n) {
    var count = 0;
    if (n >= 1) ++count;

    while (n / 10 >= 1) {
        n /= 10;
        ++count;
    }

    return count;
}

app.get("/images/list", (req, response) => {
    response.write(
        '<html><head><link rel="stylesheet" href="/images/list/style.css"><script src="/images/list/script.js"></script><title>Images List</title></head>'
    );

    http.get('http://' + serverIP + ':2375/images/json', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);

            response.write('<body><div id="heading">List of All Containers</div><table><tr><th>Repository</th><th>Tags</th><th>Image ID</th><th>Size</th></tr>');
            if (parsedData.length == 0) {
                response.write("<tr><td colspan=4 >No local images available.</td></tr>");
            }
            else {
                for (let i = 0; i < parsedData.length; i++) {
                    for (let j = 0; j < parsedData[i].RepoTags.length; j++) {
                        let imageId = parsedData[i].Id.slice(8, 19);
                        let currentRepoTag = parsedData[i].RepoTags[j];
                        let splittedRepo = currentRepoTag.split(":");
                        let repoName = splittedRepo[0];
                        let repoTag = splittedRepo[1];

                        let size = parsedData[i].Size;
                        let digitCount = digits_count(size);

                        if (digitCount <= 9) {
                            newsize = (size * 1.0 / Math.pow(10, 6));
                            newsize = newsize.toPrecision(3)
                            newsize = newsize.split("e+")[0];
                            newsize = newsize + "MB";
                        }
                        else {
                            newsize = (size * 1.0 / Math.pow(10, 9));
                            newsize = newsize.toPrecision(3)
                            newsize = newsize.split("e+")[0];
                            newsize = newsize + "GB";
                        }

                        response.write("<tr><td>" + repoName + "</td><td>" + repoTag + "</td><td>" + imageId + "</td><td>" + newsize + "</td></tr>");
                    }
                }
            }

            response.write("</table></body></html>");
            response.send();
        })
    });
})

app.use("/images/pull", express.static(path.join(__dirname, 'images/pull')));
app.get("/images/pull", (req, res) => {
    res.sendFile(__dirname + "/images/pull/index.html");
})
app.get("/images/pull/status", (req, res) => {
    image = req.query.imageName;
    command = "docker pull " + image;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Pulling Docker Image Status !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/images/delete", express.static(path.join(__dirname, 'images/delete')));
app.get("/images/delete", (req, res) => {
    res.sendFile(__dirname + "/images/delete/index.html");
})
app.get("/images/delete/status", (req, res) => {
    image = req.query.imageName;
    command = "docker rmi " + image;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Deleting Docker Image Status !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/images/history", express.static(path.join(__dirname, 'images/history')));
app.get("/images/history", (req, res) => {
    res.sendFile(__dirname + "/images/history/index.html");
})
app.get("/images/history/status", (req, res) => {
    image = req.query.imageName;
    command = "docker history " + image;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        } else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Container Image History  !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    });
});

app.use("/images/inspect", express.static(path.join(__dirname, 'images/inspect')));
app.use("/images/inspect/result", express.static(path.join(__dirname, 'images/inspect/result')));
app.get("/images/inspect", (req, res) => {
    res.sendFile(__dirname + "/images/inspect/index.html");
})

app.get("/images/inspect/result", (req, response) => {
    image = req.query.imageName;

    http.get('http://' + serverIP + ':2375/images/' + image + '/json', (res) => {
        res.on("data", (data) => {
            parsedData = JSON.parse(data);
            parsedData = JSON.stringify(parsedData, null, 4);
            response.send('<html><head><link rel="stylesheet" href="/images/inspect/result/style.css"></head><body><div id="infoPanel"> <h2>!! Image Information !! </h2><hr /> <pre>' + parsedData + '</pre></div></body></html>');
        });
    })
});

app.use("/images/commit", express.static(path.join(__dirname, 'images/commit')));
app.get("/images/commit", (req, res) => {
    res.sendFile(__dirname + "/images/commit/index.html");
})

app.get("/images/commit/status", (req, res) => {
    cname = req.query.cname;
    image = req.query.imageName;

    command = "docker commit " + cname + " " + image;
    exec(command, (err, stdout, stderr) => {
        if (err) {
            output = stderr;
        }
        else {
            output = stdout;
        }
        res.send('<html><head><link rel="stylesheet" href="/hub/search/result/style.css"></head><body><div id="infoPanel"> <h2>!! Commit Image Status  !! </h2><hr /> <pre>' + output + '</pre></div></body></html>');
    })
});
