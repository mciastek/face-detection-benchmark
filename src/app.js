import 'normalize.css'
import 'styles/main.scss'

import M from 'materialize-css'

import { NodeOpenCVAdapter } from 'adapters'

import WebCamManager from 'services/WebCamManager'
import FaceDetection from 'services/FaceDetection'
import { createFpsStats } from 'utils/stats'
import { register } from 'utils/sw'

class App {
  constructor () {
    this.initTabs()
  }

  initTabs () {
    const tabsEl = document.querySelector('.js-tabs')

    M.Tabs.init(tabsEl, {
      onShow: this.handleTabShow
    })
  }

  handleTabShow = activeTab => {
    const id = activeTab.getAttribute('id')

    if (id === 'webcam-test') {
      this.initVideo()
    } else if (id === 'images-test') {
      this.stopVideo()
    }
  }

  handleWebCamBeforeUpdate = () => {
    if (this.webCamStats) {
      this.webCamStats.begin()
    }
  }

  handleWebCamUpdate = () => {
    if (this.webCamStats) {
      this.webCamStats.end()
    }
  }

  initVideo () {
    const videoEl = document.getElementById('stream')
    const overlayEl = document.getElementById('overlay')
    const videoContainer = videoEl.parentElement

    this.webCam = new WebCamManager(videoEl)
    this.webCamFaceDetection = new FaceDetection(NodeOpenCVAdapter, overlayEl, {
      adapterOptions: {
        onUpdate: this.handleWebCamUpdate
      }
    })

    if (!this.webCamStats) {
      this.webCamStats = createFpsStats(videoContainer)
    }

    this.webCam
      .capture()
      .then(() => this.webCamFaceDetection.init())
      .then(() => this.webCamFaceDetection.run(videoEl))
  }

  stopVideo () {
    if (this.webCam) {
      this.webCam.stop()
      this.webCamFaceDetection.stop()
    }
  }
}

// eslint-disable-next-line
new App()

if (process.env.NODE_ENV === 'production') {
  register()
}
