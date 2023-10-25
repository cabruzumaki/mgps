const express = require("express"),
    cors = require("cors"),
    http = require("http"),
    https = require("https"),
    path = require('path'),
    paths = require("./paths.json"),
    fs = require("fs"),
    dotenv = require('dotenv').config,
    date = require("./lib/timestamp.js");
const app = express(),
    PORT = 8000;
const SecurityMethod = require("./lib/security/securityMethod.js")
const { Rijndael } = require("./lib/security/rijndael.js")
const { MObject } = require("./lib/mobject.js")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors())
if (process.env.SSL == 1) {
    const options = {
        cert: atob(process.env.CERT),
        key: atob(process.env.PRIVKEY),
    };
    http.createServer(options, app).listen(PORT, () => {
        date.print(`[SERVER] Running server at ${PORT}`)
    });
    https.createServer(options, app).listen(PORT + 1, () => {
        date.print(`[SERVER/SSL] Running server at ${PORT + 1}`)
    });
} else {
    app.listen(PORT, () => {
        date.print(`[SERVER] Running server at ${PORT}`)
    });
}

for (const module in paths.modules) {
    app.use(`/${module}`, require(`.${paths.modules[module]}`))
}

app.use(cors())

app.get("/", (req, res) => {
    date.print(`/ (GET): ${JSON.stringify(req.body)}`)
    res.json({ "success": "true" })
})
app.post("/", (req, res) => {
    date.print(`/ (POST): ${JSON.stringify(req.body)}`)
    res.json({ "success": "true" })
});

app.post("/sul", (req, res) => {
    date.print(`/sul (POST): ${JSON.stringify(req.body)}`)
    res.json({ "success": "true" })
});
app.post("/screenshot", (req, res) => {
    date.print(`/screenshot (POST): ${JSON.stringify(req.body)}`)
    res.json({ "success": "true" })
});

app.post("/debug", (req, res) => {
    var debug, cookiesObj;
    if (req.body.cookies) cookiesObj = {
        iframe: Object.fromEntries(req.body.cookies.iframe.split(";").map(cookie => cookie.trim().split("="))),
        nav: Object.fromEntries(req.body.cookies.nav.split(";").map(cookie => cookie.trim().split("=")))
    };
    debug = {
        user_agent: req.get('user-agent'),
        swf: req.body.swf,
        url: req.body.url,
        cookies: cookiesObj
    }

    fs.writeFileSync(`${__dirname}/debug/${req.body.swf ? "swf_" : ""}${debug.user_agent}-${date.datetime().replaceAll(":", "-")}.json`, JSON.stringify(debug, null, 2));
    date.print(`/debug (POST): ${JSON.stringify(debug)}) `)
    res.json({ "success": "true" })
});

app.get("/signature", (req, res) => {
    date.print(`/signature (GET): ${JSON.stringify(req.body)}`)
    res.json({ "success": "true" })
});


app.get("/crossdomain.xml", (req, res) => {
    date.print(`/crossdomain.xml (GET): ${JSON.stringify(req.body)}`)
    const filePath = path.join(__dirname, 'crossdomain.xml');
    res.sendFile(filePath);
});
app.get("/client", (req, res) => {
    const filePath = path.join(`${__dirname}/game/index.html`);
    res.sendFile(filePath);
});
app.get("/servers", (req, res) => {
    var servers = []
    for (let i = 0; i <= 11; i++) {
        count = i
        servers.push({
            host: "juegosg01.mundogaturro.com",
            port: "9898",
            usage: 0.01,
            name: `NS_${String(count).padStart(2, "0")}`
        })
    }
    date.print(`/server: ${JSON.stringify({ request: req.body, response: servers.length })}`)
    return res.json(servers)
})

app.get("/locale/:lang", (req, res) => {
    const filePath = path.join(__dirname, `./langs/${req.params.lang}.json`);
    res.sendFile(filePath);
})


app.get("/npc", (req, res) => {
    date.print(`/npc: ${JSON.stringify([req.connection.remoteAddress, req.connection.remotePort])}`)
    const filePath = path.join(`${__dirname}/command.npc`);
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        res.send(btoa(data));
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/swftrucado", (req, res) => {
    const filePath = path.join(__dirname, `./newwww.swf`);
    res.sendFile(filePath);
})
app.get("/black", (req, res) => {
    const filePath = path.join(__dirname, `./hairdressing.swf`);
    res.sendFile(filePath);
})
//value = new SecurityMethod().createValidationDigest("kno9", "ABDpIUDlKDABDpIU")
console.log(new Rijndael().decrypt("5dc8e4fd14e8f1656aee8ce85e48eeeb7387e3ad24f2a95a0b563afc1cb0f6ec14097270cbd1f188eb59578872e0a4c0", "ABDpIUDlKDABDpIU"))