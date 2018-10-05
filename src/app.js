import 'normalize.css'
import 'styles/main.scss'

import { NodeOpenCVAdapter } from 'adapters'

import WebCamManager from 'services/WebCamManager'
import FaceDetection from 'services/FaceDetection'
import { register } from 'utils/sw'

class App {
  constructor () {
    this.videoEl = document.getElementById('stream')
    this.overlayEl = document.getElementById('overlay')

    this.webCam = new WebCamManager(this.videoEl)
    this.faceDetection = new FaceDetection(NodeOpenCVAdapter, this.overlayEl)

    this.init()
  }

  init () {
    this.webCam
      .capture()
      .then(() => this.faceDetection.init())
      .then(() => this.faceDetection.run(this.videoEl))
  }
}

// eslint-disable-next-line
new App()

if (process.env.NODE_ENV === 'production') {
  register()
}
