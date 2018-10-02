class FaceDetection {
  constructor (videoEl, Adapter) {
    this.videoEl = videoEl
    this.adapter = new Adapter(this.videoEl)
    this.running = false
  }

  init () {
    return this.adapter.prepare().then(() => {
      this.running = true
      return this.run()
    })
  }

  run = () => {
    if (this.videoEl.paused || this.videoEl.ended || !this.running) {
      return
    }

    this.adapter.process()
    setTimeout(this.run)
  }
}

export default FaceDetection
