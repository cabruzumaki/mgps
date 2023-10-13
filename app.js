const express = require("express"),
    cors = require("cors"),
    http = require("http"),
    https = require("https"),
    path = require('path'),
    paths = require("./paths.json"),
    fs = require("fs"),
    dotenv = require('dotenv').config;
const app = express(),
    PORT = 8000;
const SecurityMethod = require("./lib/security/securityMethod.js")
const {MObject} = require("./lib/mobject.js")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
if (process.env.SSL == 1) {
    const options = {
        cert: atob(process.env.CERT),
        key: atob(process.env.PRIVKEY),
    };
    http.createServer(options, app).listen(PORT, () => {
        console.log(`[SERVER] Running server at ${PORT}`)
    });
    https.createServer(options, app).listen(PORT + 1, () => {
        console.log(`[SERVER/SSL] Running server at ${PORT + 1}`)
    });
} else {
    app.listen(PORT, () => {
        console.log(`[SERVER] Running server at ${PORT}`)
    });
}

for (const module in paths.modules) {
    app.use(`/${module}`, require(`.${paths.modules[module]}`))
}

app.use(cors())

app.get("/", (req, res) => {
    console.log(`get: ${JSON.stringify(req.body)}`)
    res.json({ "success": "true" })
})
app.post("/", (req, res) => {
    console.log(`post: ${JSON.stringify(req.body)}`)
    res.json({ "success": "true" })
});



app.get("/crossdomain.xml", (req, res) => {
    const filePath = path.join(__dirname, 'crossdomain.xml');
    res.sendFile(filePath);
});
app.get("/server", (req, res) => {
    var servers = []
    for (let i = 0; i <= 50; i++) {
        count = i
        servers.push({
            host: "localhost",
            port: "13985",
            usage: 0.02,
            name: `CAMILOW_${String(count).padStart(2, "0")}`
        })
    }
    console.log(`/server: ${JSON.stringify(req.body)}`)
    return res.json(servers)
})

app.get("/locale/:lang", (req, res) => {
    const filePath = path.join(__dirname, `./langs/${req.params.lang}.json`);
    res.sendFile(filePath);
})


app.get("/npc", (req, res) => {
    const date = new Date();
    const timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    console.log(`[${timestamp}] /npc: ${JSON.stringify(req.body)}`)
    const filePath = path.join(`${__dirname}/command.npc`);
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        res.send(btoa(data));
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

value = new SecurityMethod().createValidationDigest("kno9", "ABDpIUDlKDABDpIU")
console.log(typeof (value), value)