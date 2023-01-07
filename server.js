const express = require('express')
const app = express()

const http = require("http")
const {Server} = require("socket.io")
const cors = require("cors")
app.use(cors())
const server = http.createServer(app)


//invokes the socket.io library and passes it to express server
const io = require('socket.io')(server, { cors: {
    origin: "http://localhost:3000",
    methods: ["GET","POST"]
} });

let connections = [];

//client connection to server
io.on("connection", socket => {
    connections.push(socket)
    console.log(socket.id) //this one 
    
    //broadcasts data to all clients except the one sending data
    socket.on("something", data => {
        console.log(data)
        socket.broadcast.emit("message", data, (res) => {
            console.log(res)
        })
    })
});



server.listen(3001, () =>
console.log("Server is Running")
)