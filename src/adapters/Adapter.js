import { getMediaSize } from './utils'

class Adapter {
  constructor (overlayEl) {
    this.overlayEl = overlayEl
    this.overlayCtx = this.overlayEl.getContext('2d')
  }

  setOverlay (source) {
    const { width, height } = getMediaSize(source)
    this.overlayWidth = width
    this.overlayHeight = height
    this.overlayEl.width = this.overlayWidth
    this.overlayEl.height = this.overlayHeight
  }
}

export default Adapter
