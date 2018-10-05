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

export const drawRect = (ctx, coords, color = '#ff0000') => {
  ctx.strokeStyle = color
  ctx.lineWidth = 4
  ctx.strokeRect(coords.x, coords.y, coords.width, coords.height)
}
