import ImageProcessor from '../services/image-processor'

export default function (socket) {
  console.log(`Started connection for ${socket.nsp.name}`)

  const imageProcessor = new ImageProcessor()

  socket.on('frame', async ({ data, options }) => {
    try {
      const result = await imageProcessor.process(data, options)
      socket.nsp.emit('frame', { ...result })
    } catch (error) {
      console.error(error)
    }
  })

  socket.on('disconnect', () => {
    console.log(`Disconnected ${socket.nsp.name}`)
  })
}
