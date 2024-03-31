"use strict";

const express = require("express");
const logger = require("morgan");
const app = express();
const PORT = 3000;

const { GameDig } = require("gamedig");

const sockets = [
  "103.219.30.118:11543",
  "103.219.30.118:12963",
  "103.219.30.118:13433",
  "103.219.30.118:18560",
  "103.219.30.118:19863",
  "103.219.30.118:22716",
  "106.55.254.89:27015",
  "103.219.39.249:30040",
  "103.219.39.249:32537",
  "103.219.39.249:30452",
  "49.232.122.146:27015",
  "49.232.122.146:27016",
  "106.55.254.89:27016",
  //"103.219.30.124:27099",
  //"103.219.30.124:26620",
  "103.219.30.118:25417",
  "103.219.39.249:37739",
];

async function getServerList(list) {
  const result = [];
  const queries = list.map(async (server) => {
    const [host, port] = server.split(":");
    try {
      const queryResult = await GameDig.query({
        type: "l4d2",
        host,
        port,
      });
      queryResult["server"] = server;
      result.push(queryResult);
    } catch (error) {
      console.log("Error getting info from server: ", server);
    }
  });

  try {
    await Promise.allSettled(queries);
    return result;
  } catch (error) {
    console.error(error);
  }
}

const parseServerName = (name) => {
  let res = name.match(/#(\d+)/);
  return res ? parseInt(res[1], 10) : null;
};

app.use(logger("dev"));
app.get("/", (req, res) => res.send("Puniavo!"));

app.get("/servers", async (req, res) => {
  const serverList = await getServerList(sockets);
  serverList.sort((a, b) => {
    [a, b] = [parseServerName(a.name), parseServerName(b.name)];
    return a - b;
  });
  res.json(serverList);
});

app.listen(PORT, () => console.log(`Now listening on port ${PORT}!`));
