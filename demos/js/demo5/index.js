import '../../styles/demo5.scss'

import * as PIXI from 'pixi.js'

import rippleSrc from '../../img/demo5/ripple.png'
import backgroundSrc from '../../img/demo5/canada.jpg'

/**
 * Custom cursor
 */

const cursor = document.querySelector('.cursor')
const cursorLazy = document.querySelector('.cursor-lazy')

const editCursor = (event) => {
  const { clientX, clientY } = event

  cursor.style.left = `${clientX}px`
  cursor.style.top = `${clientY}px`

  cursorLazy.style.left = `${clientX}px`
  cursorLazy.style.top = `${clientY}px`
}

const expendCursor = (_) => {
  cursor.classList.add('expand')
  cursorLazy.classList.add('expand')

  setTimeout(() => {
    cursor.classList.remove('expand')
    cursorLazy.classList.remove('expand')
  }, 200)
}

window.addEventListener('mousemove', editCursor)
window.addEventListener('click', expendCursor)

/**
 * PIXI.js
 */
const app = new PIXI.Application({
  autoResize: true,
  resolution: devicePixelRatio,
})
const container = new PIXI.Container()

const appLoader = app.loader

let posX = 0
let xVelocity = 0

let displacementSprite = null
let displacementFilter = null

let bg = null
let text = null

/**
 * Init
 */
const init = () => {
  document.body.appendChild(app.view)
  app.stage.interactive = true
  app.stage.addChild(container)

  appLoader
    .add('displacement', rippleSrc)
    .add('bg', backgroundSrc)
    .load(() => setup())
}

init()

/**
 * SETUP
 */
const setDisplacements = () => {
  displacementSprite = new PIXI.Sprite(appLoader.resources.displacement.texture)
  displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite)

  displacementSprite.anchor.set(0.5)
  displacementSprite.x = app.renderer.width / 2
  displacementSprite.y = app.renderer.height / 2

  app.stage.addChild(displacementSprite)

  displacementFilter.scale.x = 0
  displacementFilter.scale.y = 0
}

const background = (bgSize, inputSprite, type, forceSize) => {
  const sprite = inputSprite
  const bgContainer = new PIXI.Container()
  const mask = new PIXI.Graphics()
    .beginFill(0x8bc5ff)
    .drawRect(0, 0, bgSize.x, bgSize.y)
    .endFill()
  bgContainer.mask = mask
  bgContainer.addChild(mask)
  bgContainer.addChild(sprite)

  const sp = { x: sprite.width, y: sprite.height }
  if (forceSize) sp = forceSize

  const winratio = bgSize.x / bgSize.y
  const spratio = sp.x / sp.y

  let scale = 1
  let pos = new PIXI.Point(0, 0)

  if (type == 'cover' ? winratio > spratio : winratio < spratio) {
    // bg is wider than background
    scale = bgSize.x / sp.x
    pos.y = -(sp.y * scale - bgSize.y) / 2
  } else {
    // bg is taller than background
    scale = bgSize.y / sp.y
    pos.x = -(sp.x * scale - bgSize.x) / 2
  }

  sprite.scale = new PIXI.Point(scale, scale)
  sprite.position = pos

  return bgContainer
}
const setBackground = () => {
  bg = background(
    { x: window.innerWidth, y: window.innerHeight },
    new PIXI.Sprite(appLoader.resources.bg.texture),
    'cover'
  )
  bg.zOrder = -1
  container.addChild(bg)
  bg.filters = [displacementFilter]
}

const setText = () => {
  text = new PIXI.Text('CANADA', {
    align: 'center',
    fill: 'rgba(255, 255, 255, .9)',
    fontSize: 30,
    fontWeight: 100,
    fontFamily: 'FuturaICG, Roboto, Tahoma, Geneva, sans-serif',
    letterSpacing: 100,
  })
  text.x = window.innerWidth / 2
  text.y = window.innerHeight / 2
  text.anchor.set(0.5)
  text.zOrder = 10
  container.addChild(text)
}

const onPointerMove = (eventData) => {
  posX = eventData.data.global.x
}
const setListener = () => {
  app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove)
}

const setup = () => {
  posX = app.renderer.width / 2

  setDisplacements()
  setBackground()
  setText()
  setListener()

  update()
}

/**
 * Resize
 */
const resize = () => {
  container.removeChildren()

  app.renderer.resize(window.innerWidth, window.innerHeight)

  if (!!bg) {
    bg = background(
      { x: window.innerWidth, y: window.innerHeight },
      new PIXI.Sprite(appLoader.resources.bg.texture),
      'cover'
    )
    bg.zOrder = 1
    bg.filters = [displacementFilter]

    container.addChild(bg)
  }

  if (!!text) {
    text.x = window.innerWidth / 2
    text.y = window.innerHeight / 2
    text.anchor.set(0.5)
    text.zOrder = 10
    container.addChild(text)
  }
}
window.addEventListener('resize', resize)
resize()

/**
 *  Calculate new displacement
 *
 * @param {*} n - displacement diff on X since last frame
 * @param {*} start1 - start point
 * @param {*} stop1  - break point (window inner width)
 * @param {*} start2 - start point
 * @param {*} stop2  - break point (window inner width)
 * @returns new displacement value
 */
const map = (n, start1, stop1, start2, stop2) => {
  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
  return newval
}

/**
 * Render loop
 */
const update = () => {
  xVelocity += (posX - displacementSprite.x) * 0.095
  displacementSprite.x = xVelocity

  let disp = Math.floor(posX - displacementSprite.x)

  if (disp < 0) disp = -disp

  let displacementSpriteScale = map(disp, 0, window.innerWidth, 0.1, 1.6)
  let displacementFilterScale = map(disp, 0, window.innerWidth, 0, 500)

  displacementSprite.scale.x = displacementSpriteScale
  displacementFilter.scale.x = displacementFilterScale

  requestAnimationFrame(update)
}
