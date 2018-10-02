import 'normalize.css'
import 'styles/main.scss'

import WebCamManager from 'services/WebCamManager'
import FaceRecognition from 'services/FaceRecognition'
import { register } from 'utils/sw'

class App {
  constructor () {
    const video = document.getElementById('stream')

    this.webCam = new WebCamManager(video)
    this.faceRecognition = new FaceRecognition(video)

    this.init()
  }

  init () {
    this.webCam
      .capture()
      .then(() => this.faceRecognition.prepare())
      .then(() => this.faceRecognition.run())
  }
}

// eslint-disable-next-line
new App()

if (process.env.NODE_ENV === 'production') {
  register()
}
