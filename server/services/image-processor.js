const cv = require('opencv4nodejs')

const DEFAULT_OPTIONS = {
  scaleFactor: 1.1,
  minNeighbors: 10
}

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2)

const readCamStream = async (data, options) => {
  const base64String = data.replace('data:image/jpeg;base64', '')
  const decoded = cv.imdecode(Buffer.from(base64String, 'base64'))
  const start = Date.now()

  try {
    const { objects } = await classifier.detectMultiScaleAsync(
      decoded.bgrToGray(),
      options || DEFAULT_OPTIONS
    )

    return {
      objects,
      time: Date.now() - start
    }
  } catch (error) {
    throw error
  }
}

export const readStream = readCamStream
