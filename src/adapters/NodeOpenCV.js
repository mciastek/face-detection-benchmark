import io from 'socket.io-client'

import Adapter from './Adapter'
import { drawRect } from './utils'

const DETECTION_OPTIONS = {
  scaleFactor: 1.1,
  minNeighbors: 10
}

const IMAGE_SCALE = 0.25

class NodeOpenCVAdapter extends Adapter {
  constructor (overlayEl, settings) {
    super(overlayEl, settings)

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

  setOverlay (source) {
    super.setOverlay(source)

    this.pixelsCanvas.width = this.overlayWidth * IMAGE_SCALE
    this.pixelsCanvas.height = this.overlayHeight * IMAGE_SCALE
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
    super.process()

    const encodedPixels = this.getPixels(source)
    this.socket.emit('frame', {
      data: encodedPixels,
      options: DETECTION_OPTIONS
    })
  }

  handleFrameReceive = response => {
    const { objects } = response

    this.options.onUpdate()

    objects.forEach(object => {
      drawRect(
        this.overlayCtx,
        {
          x: object.x / IMAGE_SCALE,
          y: object.y / IMAGE_SCALE,
          width: object.width / IMAGE_SCALE,
          height: object.height / IMAGE_SCALE
        },
        this.drawOptions
      )
    })
  }
}

export default NodeOpenCVAdapter
