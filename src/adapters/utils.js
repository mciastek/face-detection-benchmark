const DRAW_DEFAULTS = {
  boxColor: '#ff0000',
  lineWidth: 4
}

export const getMediaSize = media => {
  if (media instanceof HTMLVideoElement) {
    return {
      width: media.videoWidth,
      height: media.videoHeight
    }
  }
  return {
    width: media.width,
    height: media.height
  }
}

export const drawRect = (ctx, coords, settings) => {
  const options = {
    ...DRAW_DEFAULTS,
    ...settings
  }
  ctx.strokeStyle = options.boxColor
  ctx.lineWidth = options.lineWidth
  ctx.strokeRect(coords.x, coords.y, coords.width, coords.height)
}
