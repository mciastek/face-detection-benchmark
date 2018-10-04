const isVideo = source => source.nodeName.toLowerCase() === 'video'

class FaceDetection {
  constructor (Adapter, overlayEl) {
    this.overlayEl = overlayEl
    this.adapter = new Adapter(this.overlayEl)
    this.source = null
    this.running = false
  }

  init () {
    return this.adapter.prepare()
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
    setTimeout(this.runInLoop)
  }

  stop () {
    this.running = false
  }
}

export default FaceDetection
