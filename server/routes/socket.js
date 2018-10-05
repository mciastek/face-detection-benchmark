import { readStream } from '../services/image-processor'

export default function (socket) {
  socket.on('frame', ({ data }) => {
    readStream(data, objects => {
      socket.emit('frame', { objects })
    })
  })
}
