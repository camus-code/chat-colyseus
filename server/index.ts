import http from "http";
import express from "express";
import { Server } from "colyseus";
import { monitor } from "@colyseus/monitor";

import { CreateOrJoinRoom } from "./MyRoom";

const port = Number(process.env.PORT || 2567);
const app = express()

const server = http.createServer(app);
const gameServer = new Server({ server });

// register your room handlers
gameServer.register('create_or_join', CreateOrJoinRoom);

// Register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor(gameServer));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
