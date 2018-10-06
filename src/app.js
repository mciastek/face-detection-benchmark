import 'normalize.css'
import 'styles/main.scss'

import M from 'materialize-css'
import find from 'lodash/find'

import {
  FaceApiAdapter,
  NativeFaceDetectorAdapter,
  TrackingAdapter,
  NodeOpenCVAdapter
} from 'adapters'

import WebCamManager from 'services/WebCamManager'
import FaceDetection from 'services/FaceDetection'
import { createFpsStats } from 'utils/stats'
import { register } from 'utils/sw'

const DETECTION_ADAPTERS = [
  {
    name: 'face-api',
    label: 'face-api.js',
    adapter: FaceApiAdapter
  },
  {
    name: 'tracking',
    label: 'tracking.js',
    adapter: TrackingAdapter
  },
  {
    name: 'native',
    label: 'Native Detector',
    adapter: NativeFaceDetectorAdapter
  },
  {
    name: 'opencv',
    label: 'Node.js + OpenCV',
    adapter: NodeOpenCVAdapter
  }
]

const getCurrentAdapter = selectEl => {
  const element = selectEl || document.querySelector('.js-select')
  const selected = element.selectedOptions[0].value

  return find(DETECTION_ADAPTERS, ['name', selected])
}

class App {
  constructor () {
    this.activeTab = 'images-test'
    this.detectionAdapter = null

    this.initSelect()
    this.initTabs()
  }

  initTabs () {
    const tabsEl = document.querySelector('.js-tabs')

    M.Tabs.init(tabsEl, {
      onShow: this.handleTabShow
    })
  }

  initSelect () {
    const selectEl = document.querySelector('.js-select')
    selectEl.addEventListener('change', this.handleAdapterSelect)

    DETECTION_ADAPTERS.forEach((adapterConfig, index) => {
      const optionEl = document.createElement('option')
      optionEl.value = adapterConfig.name
      optionEl.innerText = adapterConfig.label
      optionEl.selected = index === 0

      selectEl.appendChild(optionEl)
    })

    const { adapter } = getCurrentAdapter(selectEl)
    this.detectionAdapter = adapter

    M.FormSelect.init(selectEl)
  }

  handleTabShow = activeTabEl => {
    const id = activeTabEl.getAttribute('id')
    this.activeTab = id

    if (this.activeTab === 'webcam-test') {
      this.initVideo()
    } else if (this.activeTab === 'images-test') {
      this.stopVideo()
    }
  }

  handleAdapterSelect = ({ target }) => {
    const { adapter } = getCurrentAdapter(target)
    this.updateAdapter(adapter)
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
    this.webCamFaceDetection = new FaceDetection(
      this.detectionAdapter,
      overlayEl,
      {
        adapterOptions: {
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
  }

  stopVideo () {
    if (this.webCam) {
      this.webCam.stop()
      this.webCamFaceDetection.stop()
    }
  }

  updateAdapter (adapter) {
    this.detectionAdapter = adapter

    if (this.activeTab === 'webcam-test') {
      this.webCamFaceDetection.changeAdapter(this.detectionAdapter)
    }
  }
}

// eslint-disable-next-line
new App()

if (process.env.NODE_ENV === 'production') {
  register()
}
