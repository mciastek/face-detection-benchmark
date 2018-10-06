import Stats from 'stats.js'

export const createFpsStats = (container = document.body) => {
  const stats = new Stats()

  stats.showPanel(0)
  stats.dom.style.position = 'absolute'
  stats.dom.style.left = '10px'
  stats.dom.style.top = '10px'
  container.appendChild(stats.dom)

  return stats
}
