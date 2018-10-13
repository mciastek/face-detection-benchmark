# Face Detection Benchmark [![CircleCI](https://circleci.com/gh/mciastek/face-detection-benchmark/tree/master.svg?style=svg)](https://circleci.com/gh/mciastek/face-detection-benchmark/tree/master)

This projects aims to compare four methods of detecting a face in the browser:

- [face-api.js][face-api]
- [tracking.js][tracking]
- [Shape Detection API][native]
- [Node.js + OpenCV][opencv]

*Face Detection Benchmark* allows to check each of face detection method in single image test and web camera stream.

**Note**: Shape Detection API requires [Chrome][chrome] in at least 69 version. To enable experimental Shape Detection API you need to go to `chrome://flags/#enable-experimental-web-platform-features` and enable the flag.

## Requirements
- [Node.js][node.js] (8.12.0)

## Usage
- `yarn install` (or `npm install` if you use NPM)

Development
- `yarn dev:server` - runs the server
- `yarn dev` - runs the front-end server
- Go to http://localhost:3000

Production
- `yarn start` - runs server with front-end

## Build
- `yarn build`

[node.js]: https://nodejs.org/en/
[chrome]: https://www.google.com/chrome/
[face-api]: https://github.com/justadudewhohacks/face-api.js
[tracking]: https://github.com/eduardolundgren/tracking.js
[native]: https://wicg.github.io/shape-detection-api/
[opencv]: https://github.com/justadudewhohacks/opencv4nodejs
