const cv = require('opencv4nodejs')

const OPTIONS = {
  scaleFactor: 1.1,
  minNeighbors: 10
}

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2)

const readCamStream = (data, onStream) => {
  const base64String = data.replace('data:image/jpeg;base64', '')
  const decoded = cv.imdecode(Buffer.from(base64String, 'base64'))

  const { objects, numDetections } = classifier.detectMultiScale(
    decoded.bgrToGray(),
    OPTIONS
  )

  onStream(objects)
}

export const readStream = readCamStream
