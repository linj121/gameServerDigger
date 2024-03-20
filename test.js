const { GameDig } = require('gamedig')
const { writeFile } = require('fs/promises')

const OUT_PATH = "./out.json"

const serverList = [
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
    "103.219.30.124:27099",
    "103.219.30.124:26620",
    "103.219.30.118:25417",
    "103.219.39.249:37739"
]

const gameDig = new GameDig()

const result = {}

const queries = serverList.map(async (server) => {
    const [host, port] = server.split(":")
    try {
        const queryResult = await gameDig.query({
            type: "l4d2",
            host,
            port
        })
        result[server] = queryResult
    } catch (error) {
        console.log("Error getting info from server: ", server)
    }
})

Promise.allSettled(queries)
    .then(() => {
        console.log("All queries done")
        writeFile(OUT_PATH, JSON.stringify(result), 'utf8')
    })
    .then(() => console.log("File written"))
    .catch(console.error)
