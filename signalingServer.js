const WEBSOCKET = require("ws");

const WSS = new WEBSOCKET.Server({ port: 8080 });

const CLIENTS = {};

WSS.on("connection", (ws) => {
    ws.on("message", (message) => {
        const DATA = JSON.parse(message);
        console.log(DATA.type);

        switch (DATA.type) {
            case "register":
                // Register the client with its ID
                CLIENTS[DATA.clientId] = ws;
                console.log("client registered");
                break;
            case "offer":
            case "answer":
            case "candidate":
                // Relay the offer, answer, or candidate to the specified peer
                const peer = CLIENTS[DATA.targetId];
                if (peer) {
                    peer.send(JSON.stringify(DATA));
                }
                break;
        }
    });

    ws.on("close", () => {
        for (const clientId in CLIENTS) {
            if (CLIENTS[clientId] === ws) {
                delete CLIENTS[clientId];
                console.log("client gone");

                break;
            }
        }
    });
});

console.log("listening");
