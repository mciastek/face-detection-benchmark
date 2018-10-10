import ImageProcessor from '../services/image-processor'

export default function (socket) {
  const imageProcessor = new ImageProcessor()

  socket.on('frame', async ({ data, options }) => {
    try {
      const result = await imageProcessor.process(data, options)
      socket.nsp.emit('frame', { ...result })
    } catch (error) {
      console.error(error)
    }
  })
}
