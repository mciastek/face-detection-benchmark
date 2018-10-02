import 'normalize.css'
import 'styles/main.scss'

import WebCamManager from 'services/WebCamManager'
import FaceDetection from 'services/FaceDetection'
import { register } from 'utils/sw'

class App {
  constructor () {
    const video = document.getElementById('stream')

    this.webCam = new WebCamManager(video)
    this.faceDetection = new FaceDetection(video)

    this.init()
  }

  init () {
    this.webCam
      .capture()
      .then(() => this.faceDetection.prepare())
      .then(() => this.faceDetection.run())
  }
}

// eslint-disable-next-line
new App()

if (process.env.NODE_ENV === 'production') {
  register()
}
