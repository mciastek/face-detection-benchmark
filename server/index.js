import path from 'path'
import http from 'http'
import express from 'express'
import morgan from 'morgan'
import socket from 'socket.io'

import socketRoute from './routes/socket'

const port = process.env.PORT || 3001

const app = express()
const server = http.createServer(app)
const io = socket(server, { path: '/ws' })

// Setup logger
app.use(morgan('combined'))

// Serve static files
app.use(express.static(path.resolve(__dirname, '..', 'dist')))

server.listen(port, () => {
  console.log(`App listening on port ${port}!`)
})

const namespacedSocket = io.of(/^\/detection-\S+$/)
namespacedSocket.on('connection', socketRoute)
