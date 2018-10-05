import io from 'socket.io-client'

import Adapter from './Adapter'
import { drawRect } from './utils'

class NodeOpenCVAdapter extends Adapter {
  constructor (overlayEl) {
    super(overlayEl)

    this.pixelsCanvas = document.createElement('canvas')
    this.pixelsCanvasCtx = this.pixelsCanvas.getContext('2d')

    this.socket = null
  }

  prepare () {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(window.location.href, {
          path: '/ws'
        })
        this.setListener()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  setListener () {
    this.socket.on('frame', this.handleFrameReceive)
  }

  getPixels (source) {
    this.pixelsCanvasCtx.drawImage(
      source,
      0,
      0,
      this.pixelsCanvas.width,
      this.pixelsCanvas.height
    )

    return this.pixelsCanvas.toDataURL('image/jpeg')
  }

  process (source) {
    const encodedPixels = this.getPixels(source)
    this.socket.emit('frame', { data: encodedPixels })
  }

  handleFrameReceive = response => {
    this.overlayCtx.clearRect(0, 0, this.overlayWidth, this.overlayHeight)

    response.objects.forEach(object => {
      drawRect(this.overlayCtx, object)
    })
  }
}

export default NodeOpenCVAdapter
