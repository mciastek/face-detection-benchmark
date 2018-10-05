import { readStream } from '../services/image-processor'

export default function (socket) {
  socket.on('frame', async ({ data, options }) => {
    try {
      const result = await readStream(data, options)
      socket.emit('frame', result)
    } catch (error) {
      console.error(error)
    }
  })
}
