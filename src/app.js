import 'normalize.css'
import 'styles/main.scss'

import M from 'materialize-css'
import find from 'lodash/find'
import clone from 'lodash/clone'

import {
  FaceApiAdapter,
  NativeFaceDetectorAdapter,
  TrackingAdapter,
  NodeOpenCVAdapter
} from 'adapters'

import WebCamManager from 'services/WebCamManager'
import FaceDetection from 'services/FaceDetection'

import ImagesUpload from 'components/ImagesUpload'

import { createFpsStats } from 'utils/stats'
import { WebCamError, FaceDetectionError, UploadError } from 'utils/errors'
import { register } from 'utils/sw'

const DEFAULT_ERROR_MESSAGE = 'Something went wrong! Reload the page.'

const DETECTION_ADAPTERS = [
  {
    name: 'face-api',
    label: 'face-api.js',
    adapter: FaceApiAdapter,
    color: '#fb8c00',
    active: true
  },
  {
    name: 'tracking',
    label: 'tracking.js',
    adapter: TrackingAdapter,
    color: '#ff5722',
    active: false
  },
  {
    name: 'native',
    label: 'Native',
    adapter: NativeFaceDetectorAdapter,
    color: '#03a9f4',
    active: false
  },
  {
    name: 'opencv',
    label: 'OpenCV',
    adapter: NodeOpenCVAdapter,
    color: '#9c27b0',
    active: false
  }
]

const getOptionIcon = color => {
  const content = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">',
    `<circle cx="20" cy="20" r="20" fill="${color}" />`,
    '</svg>'
  ]
    .map(encodeURIComponent)
    .join('')

  return `data:image/svg+xml,${content}`
}

class App {
  constructor () {
    this.activeTab = 'images-test'

    this.adapters = clone(DETECTION_ADAPTERS)

    this.detectionAdapter = null
    this.detectionAdapterOptions = {
      lineWidth: 4
    }

    this.uploadComponent = new ImagesUpload({
      onError: this.handleError
    })

    this.initSelect()
    this.initTabs()
  }

  get currentAdapterConfig () {
    return find(this.adapters, 'active')
  }

  initTabs () {
    const tabsEl = document.querySelector('.js-tabs')

    const tabsInstance = M.Tabs.init(tabsEl, {
      onShow: this.handleTabShow
    })

    const id = tabsInstance.$content[0].getAttribute('id')
    this.activeTab = id
    this.initCurrentTest()
  }

  initSelect () {
    const selectEl = document.querySelector('.js-select')
    selectEl.addEventListener('change', this.handleAdapterSelect)

    this.adapters.forEach(config => {
      const { name, label, color, active } = config
      const optionEl = document.createElement('option')
      optionEl.value = name
      optionEl.innerText = label
      optionEl.selected = active
      optionEl.setAttribute('data-icon', getOptionIcon(color))

      selectEl.appendChild(optionEl)
    })

    const { adapter, color } = this.currentAdapterConfig
    this.detectionAdapter = adapter
    this.detectionAdapterOptions.boxColor = color

    M.FormSelect.init(selectEl)
  }

  initVideo () {
    const videoEl = document.getElementById('stream')
    const overlayEl = document.getElementById('overlay')
    const videoContainer = videoEl.parentElement

    this.webCam = new WebCamManager(videoEl)
    this.webCamFaceDetection = new FaceDetection(
      this.detectionAdapter,
      overlayEl,
      {
        adapterOptions: {
          ...this.detectionAdapterOptions,
          onUpdate: this.handleWebCamUpdate
        }
      }
    )

    if (!this.webCamStats) {
      this.webCamStats = createFpsStats(videoContainer)
    }

    this.webCam
      .capture()
      .then(() => this.webCamFaceDetection.init())
      .then(() => this.webCamFaceDetection.run(videoEl))
      .catch(this.handleError)
  }

  stopVideo () {
    if (this.webCam) {
      this.webCam.stop()
      this.webCamFaceDetection.stop()
    }
  }

  initCurrentTest () {
    if (this.activeTab === 'webcam-test') {
      this.uploadComponent.stopDetections()
      this.initVideo()
    } else if (this.activeTab === 'images-test') {
      this.stopVideo()
      this.uploadComponent.changeAdapter(
        this.detectionAdapter,
        this.detectionAdapterOptions
      )
    }
  }

  updateAdapter (adapter, options) {
    this.detectionAdapter = adapter
    this.detectionAdapterOptions = {
      ...this.detectionAdapterOptions,
      ...options
    }

    if (this.activeTab === 'webcam-test') {
      this.webCamFaceDetection
        .changeAdapter(this.detectionAdapter, {
          ...this.detectionAdapterOptions,
          onUpdate: this.handleWebCamUpdate
        })
        .catch(this.handleError)
    } else if (this.activeTab === 'images-test') {
      this.uploadComponent.changeAdapter(
        this.detectionAdapter,
        this.detectionAdapterOptions
      )
    }
  }

  showError (error) {
    if (
      error instanceof WebCamError ||
      error instanceof FaceDetectionError ||
      error instanceof UploadError
    ) {
      const message = error.message || DEFAULT_ERROR_MESSAGE
      return M.toast({ html: message, classes: 'rounded' })
    }

    console.error(error)
  }

  handleTabShow = activeTabEl => {
    const id = activeTabEl.getAttribute('id')
    this.activeTab = id
    this.initCurrentTest()
  }

  handleAdapterSelect = ({ target }) => {
    const selected = target.selectedOptions[0].value

    this.adapters = this.adapters.map(config => ({
      ...config,
      active: config.name === selected
    }))

    const { adapter, color } = this.currentAdapterConfig
    const options = {
      boxColor: color
    }

    this.updateAdapter(adapter, options)
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

  handleError = error => {
    this.showError(error)
  }
}

// eslint-disable-next-line
new App()

if (process.env.NODE_ENV === 'production') {
  register()
}
