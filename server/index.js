const path = require('path')
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const socket = require('socket.io')

const socketRoute = require('./routes/socket')

const port = process.env.PORT || 3000

const app = express()
const server = http.createServer(app)
const io = socket(server)

// Setup logger
app.use(morgan('combined'))

// Serve static files
app.use(express.static(path.resolve(__dirname, '..', 'client')))

server.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})

io.on('connection', socketRoute)
