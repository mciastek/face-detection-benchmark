import imageProcessor from '../services/image-processor'

module.exports = (socket) => {
  socket.on('frame', ({ data }) => {
    imageProcessor.readStream(data, (outputBuffer, coords) => {
      socket.emit('frame', { buffer: outputBuffer, coords })
    })
  })
}
