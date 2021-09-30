function getRandomInt (max) {
  return Math.floor(Math.random() * max)
}

window.onload = function (params) {
  const button = document.querySelector('button')
  button.style.zIndex = 2
  button.style.position = 'relative'

  const img = document.querySelector('img')
  const parent = img.parentNode

  button.onclick = () => {
    const toinsert = img.cloneNode()
    toinsert.style.position = 'absolute'
    toinsert.style.left = `${getRandomInt(window.innerWidth)}px`
    toinsert.style.top = `${getRandomInt(window.innerHeight)}px`
    toinsert.style.zIndex = 1
    parent.appendChild(toinsert)
  }
}
