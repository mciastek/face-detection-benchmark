const cv = require('opencv');

const lowThresh = 100;
const highThresh = 200;
const nIters = 2;
const minArea = 2000;

const defaultRectProps = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

function getRectangle(imgCanny) {
  const contours = imgCanny.findContours()

  for (let i = 0; i < contours.size(); i += 1) {
    if (contours.area(i) < minArea) continue

    const arcLength = contours.arcLength(i, true);
    contours.approxPolyDP(i, 0.01 * arcLength, true);

    if (contours.cornerCount(i) === 4) {
      return contours.boundingRect(i);
    }
  }

  return defaultRectProps;
}

function readCamStream(data, onStream) {
  const base64String = data.split(',')[1];
  cv.readImage(new Buffer(base64String, 'base64'), (err, img) => {
    if (err) throw err;

    const out = img.copy();

    img.convertGrayscale();

    const imgCanny = img.copy();
    imgCanny.canny(lowThresh, highThresh);
    imgCanny.dilate(nIters);

    const rectProps = getRectangle(imgCanny);

    onStream(out.toBuffer(), rectProps);
  });
}

module.exports = {
  readStream: readCamStream,
};
