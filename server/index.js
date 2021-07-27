const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)
const cors = require('cors')
// app.options('*', cors())
app.use(cors())
io.on('connection', onConnection)

var roomdata = {}

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

function onConnection(socket){
    console.log("new socket connected -> ", socket)
    socket.on('join', (nickname, roomname) => {
        socket.nickname = nickname
        socket.roomname = roomname
        if(!roomdata[roomname]) {
            roomdata[roomname] = {
                roomname,
                users : [socket],
                drawingData : []
            }
        }
        roomdata[roomname]["users"].push(socket)
        socket.join(roomname)
        if(roomdata["drawingData"].length){
            socket.emit("drawing_history_data", roomdata["drawingData"])
        }
    })
    socket.on('drawing', (data, roomname) => {
        socket.to(roomname).emit('drawing', data)
        if(roomdata["drawingData"])roomdata["drawingData"].push(data)
        else roomdata["drawingData"] = [data]
        console.log("new data = ", data)
        console.log(`drawing in ${roomname}`)
    })
    socket.on('disconnect', () => {
        roomdata[socket.roomname]["users"].splice(roomdata[socket.roomname]["users"].indexOf(socket), 1)
        socket.to(socket.roomname).emit("connected_user_list", roomdata[socket.roomname]["users"])
    })
}

const PORT = 8080
server.listen(PORT, () => console.log(`listeninig on port ${PORT}`))