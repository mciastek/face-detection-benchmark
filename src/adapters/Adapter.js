import noop from 'lodash/noop'

import { getMediaSize } from './utils'

const defaults = {
  onBeforeUpdate: noop,
  onUpdate: noop
}

class Adapter {
  constructor (overlayEl, settings) {
    this.overlayEl = overlayEl
    this.overlayCtx = this.overlayEl.getContext('2d')

    this.options = {
      ...defaults,
      ...settings
    }

    this.drawOptions = {
      boxColor: this.options.boxColor,
      lineWidth: this.options.lineWidth
    }
  }

  setOverlay (source) {
    const { width, height } = getMediaSize(source)
    this.overlayWidth = width
    this.overlayHeight = height
    this.overlayEl.width = this.overlayWidth
    this.overlayEl.height = this.overlayHeight
  }

  process () {
    this.options.onBeforeUpdate()
    this.overlayCtx.clearRect(0, 0, this.overlayWidth, this.overlayHeight)
  }
}

export default Adapter
