/* eslint-disable no-console */
export const register = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        console.log('Service worker registered')
      })
  } else {
    console.warn('Service worker is not supported in this browser')
  }
}
/* eslint-enable no-console */
