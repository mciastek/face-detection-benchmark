import io from 'socket.io-client'
import uuid from 'uuid/v4'

import Adapter from './Adapter'
import { drawRect } from './utils'

const { OPENCV_MAX_FPS } = process.env

const DETECTION_OPTIONS = {
  scaleFactor: 1.1,
  minNeighbors: 10
}

const MAX_WIDTH = 160

class NodeOpenCVAdapter extends Adapter {
  constructor (overlayEl, settings) {
    super(overlayEl, settings)

    this.options.maxFps = OPENCV_MAX_FPS

    this.pixelsCanvas = document.createElement('canvas')
    this.pixelsCanvasCtx = this.pixelsCanvas.getContext('2d')

    this.socket = null
    this.scale = 1
    this.uuid = uuid()
  }

  prepare () {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(`/detection-${this.uuid}`, {
          path: '/ws'
        })

        this.setListener()
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  dispose () {
    this.socket.close()
  }

  setOverlay (source) {
    super.setOverlay(source)

    this.scale = MAX_WIDTH / this.overlayWidth

    this.pixelsCanvas.width = this.overlayWidth * this.scale
    this.pixelsCanvas.height = this.overlayHeight * this.scale
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
          x: object.x / this.scale,
          y: object.y / this.scale,
          width: object.width / this.scale,
          height: object.height / this.scale
        },
        this.drawOptions
      )
    })
  }
}

export default NodeOpenCVAdapter
