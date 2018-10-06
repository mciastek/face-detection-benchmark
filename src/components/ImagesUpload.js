import noop from 'lodash/noop'

import FaceDetection from 'services/FaceDetection'
import { FaceDetectionError } from 'utils/errors'

const defaults = {
  onError: noop
}

const getPromisifiedImage = (src, containerEl) => {
  const image = new Image()

  image.classList.add('images-upload__image')

  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image)
    image.onerror = error => reject(error)
    image.src = src
    containerEl.appendChild(image)
  })
}

const updateCaptionText = (element, value) => {
  element.innerText = `Done in: ${value}ms`
}

class ImagesUpload {
  constructor (settings) {
    this.previewEl = document.querySelector('.js-images-preview')
    this.fileInput = document.querySelector('.js-images-upload')

    this.options = {
      ...defaults,
      ...settings
    }

    this.detectionAdapter = null
    this.detections = []

    this.attachListeners()
  }

  attachListeners () {
    this.fileInput.addEventListener('change', this.handleFileUpload)
  }

  changeAdapter (adapter) {
    this.detectionAdapter = adapter
    return this.rerunDetections()
  }

  readFile = file => {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)

      reader.readAsDataURL(file)
    })
  }

  renderPreview = src => {
    const figureEl = document.createElement('figure')
    const figCaptionEl = document.createElement('figcaption')
    const containerEl = document.createElement('div')
    const overlayEl = document.createElement('canvas')

    figureEl.classList.add('images-upload__figure', 'col', 's3')
    figCaptionEl.classList.add('images-upload__caption')
    overlayEl.classList.add('images-upload__overlay')
    containerEl.classList.add('images-upload__container')

    containerEl.appendChild(overlayEl)
    figureEl.appendChild(containerEl)
    figureEl.appendChild(figCaptionEl)
    this.previewEl.appendChild(figureEl)

    return getPromisifiedImage(src, containerEl)
  }

  runDetection = (source, index) => {
    const detection = { source }
    this.detections[index] = detection

    const rootEl = source.parentElement.parentElement
    const captionEl = rootEl.querySelector('.images-upload__caption')
    const overlayEl = source.parentElement.querySelector(
      '.images-upload__overlay'
    )

    rootEl.classList.add('loading')

    const controller = new FaceDetection(this.detectionAdapter, overlayEl, {
      adapterOptions: {
        onBeforeUpdate: () => {
          detection.start = Date.now()
        },
        onUpdate: () => {
          detection.end = Date.now()
          detection.time = detection.end - detection.start
          rootEl.classList.remove('loading')
          updateCaptionText(captionEl, detection.time)
        }
      }
    })

    return controller
      .init()
      .then(() => controller.run(source))
      .catch(this.options.onError)
  }

  clearPreview () {
    this.previewEl.innerHTML = ''
  }

  rerunDetections () {
    const promises = this.detections.map(({ source }, index) => {
      if (source) {
        return this.runDetection(source, index)
      }

      return Promise.reject(new FaceDetectionError('Source is not found'))
    })

    return Promise.all(promises)
  }

  handleFileUpload = event => {
    const { files } = event.target
    const promises = [...files].map(this.readFile)

    this.clearPreview()

    Promise.all(promises)
      .then(urls => urls.map(this.renderPreview))
      .then(sources => Promise.all(sources))
      .then(sources => sources.map(this.runDetection))
      .catch(this.options.onError)
  }
}

export default ImagesUpload
