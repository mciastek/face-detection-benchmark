import noop from 'lodash/noop'

import { FaceDetectionError } from 'utils/errors'

const isVideo = source => source.nodeName.toLowerCase() === 'video'

const defaults = {
  adapterOptions: {
    onBeforeUpdate: noop,
    onUpdate: noop
  }
}

class FaceDetection {
  constructor (Adapter, overlayEl, settings) {
    this.overlayEl = overlayEl
    this.options = {
      ...defaults,
      ...settings
    }

    this.adapter = new Adapter(this.overlayEl, this.options.adapterOptions)

    this.source = null
    this.running = false

    this.loopTimer = null
  }

  init () {
    return this.adapter.prepare().catch(this.handleDetectionError)
  }

  run = source => {
    if (!source) return

    if (source !== this.source) {
      this.running = false
      this.source = source
      this.adapter.setOverlay(this.source)
    }

    if (isVideo(this.source)) {
      this.running = true
      this.runInLoop()
    } else {
      this.adapter.process(this.source)
    }
  }

  runInLoop = () => {
    if (this.source.paused || this.source.ended || !this.running) {
      return
    }

    this.adapter.process(this.source)
    this.loopTimer = setTimeout(this.runInLoop)
  }

  stop () {
    clearTimeout(this.loopTimer)
    this.running = false
  }

  changeAdapter (Adapter, adapterOptions = this.options.adapterOptions) {
    this.stop()
    this.adapter = new Adapter(this.overlayEl, adapterOptions)

    return this.init()
      .then(() => {
        this.adapter.setOverlay(this.source)
        this.run(this.source)
      })
      .catch(this.handleDetectionError)
  }

  handleDetectionError = error => {
    throw new FaceDetectionError(error.message)
  }
}

export default FaceDetection
