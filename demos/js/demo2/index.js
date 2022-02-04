import '../../styles/demo2.css'

import { gsap } from 'gsap'

import * as PIXI from 'pixi.js'

import imgone from '../../img/demo2/image-one.jpg'
import imgtwo from '../../img/demo2/image-two.jpg'
import imgthree from '../../img/demo2/image-three.jpg'
import imgfour from '../../img/demo2/image-four.jpg'
import imgfive from '../../img/demo2/image-five.jpg'
import imgsix from '../../img/demo2/image-six.jpg'
import imgseven from '../../img/demo2/image-seven.jpg'
import imgheight from '../../img/demo2/image-height.jpg'

import displacementMap from '../../img/demo2/displacement_map_repeat.jpg'

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Data
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const images = [
  imgone,
  imgtwo,
  imgthree,
  imgfour,
  imgfive,
  imgsix,
  imgseven,
  imgheight,
]

const allCanvas = []

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Dom elements
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const allcontainer = gsap.utils.toArray('.container-item')
const venueImageWrap = document.querySelector('.container-img-wrap')
const venueImage = document.querySelector('.container-img')

const devicePixelRatio = Math.min(window.devicePixelRatio, 2)

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Init
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const initcontainer = () => {
  allcontainer.forEach((link) => {
    link.addEventListener('mouseenter', venueHover)
    link.addEventListener('mouseleave', venueHover)
    link.addEventListener('mousemove', moveVenueImage)
  })
}

const moveVenueImage = (e) => {
  const isLastItem = e.target.innerText === '8'

  const offset = isLastItem ? -250 : 0

  const xpos = e.clientX + offset
  const ypos = e.clientY / 2

  const tl = gsap.timeline()

  tl.to(venueImageWrap, {
    x: xpos,
    y: ypos,
  })
}

const venueHover = (e) => {
  const index = Number(e.target.dataset.img)
  const canvas = allCanvas[index]

  if (e.type === 'mouseenter') {
    const targetImage = images[index]

    venueImage.appendChild(canvas)

    const tl = gsap.timeline()
    tl.set(venueImage, {
      backgroundImage: `url(${targetImage})`,
    }).to(venueImageWrap, {
      duration: 0.5,
      autoAlpha: 1,
    })
  } else if (e.type === 'mouseleave') {
    const tl = gsap.timeline()

    venueImage.removeChild(canvas)

    tl.to(venueImageWrap, {
      duration: 0.5,
      autoAlpha: 0,
    })
  }
}

const init = () => initcontainer()

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Pixi
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
images.forEach((img, _) => {
  const { clientHeight, clientWidth } = venueImage

  const options = {
    width: clientWidth,
    height: clientHeight,
    antialias: true,
    autoResize: true,
    resolution: devicePixelRatio,
  }

  const app = new PIXI.Application(options)
  const canvas = app.view

  app.stage.interactive = true

  const container = new PIXI.Container()
  app.stage.addChild(container)

  const image = PIXI.Sprite.from(img)

  image.width = clientWidth
  image.height = clientHeight

  container.addChild(image)

  const displacementSprite = PIXI.Sprite.from(displacementMap)
  // Make sure the sprite is wrapping.
  displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT
  const displacementFilter = new PIXI.filters.DisplacementFilter(
    displacementSprite
  )
  displacementFilter.padding = 10

  displacementSprite.position = image.position

  app.stage.addChild(displacementSprite)

  image.filters = [displacementFilter]

  displacementFilter.scale.x = 30
  displacementFilter.scale.y = 60

  allCanvas.push(canvas)

  app.ticker.add(() => {
    // Offset the sprite position to make vFilterCoord update to larger value. Repeat wrapping makes sure there's still pixels on the coordinates.
    displacementSprite.x++
    // Reset x to 0 when it's over width to keep values from going to very huge numbers.
    if (displacementSprite.x > displacementSprite.width) {
      displacementSprite.x = 0
    }
  })
})

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Events
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
window.addEventListener('load', function () {
  init()
})

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Timeline
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
const tl = gsap.timeline()

tl.from('.navbar > div', {
  opacity: 0,
  y: 60,
  ease: 'expo.inOut',
  duration: 1.25,
  delay: 0.5,
  stagger: 0.5,
  onStart: () => {
    gsap.from('.site-menu > div', {
      opacity: 1,
      y: 40,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.6,
    })
  },
})

tl.from(
  '.site-logo',
  {
    opacity: 1,
    y: 40,
    duration: 1.5,
    ease: 'expo.inOut',
  },
  '-=1.6'
)

tl.to(['.header', '.header > div'], {
  opacity: 1,
  y: 30,
  duration: 1,
  ease: 'power2.out',
  delay: -0.5,
})

tl.to('.item', {
  flexGrow: 2,
  bottom: '+=80%',
  duration: 0.6,
  ease: 'power2.in',
  delay: -1,
  stagger: 0.25,
  onStart: () => {
    gsap.to('.container-items', {
      opacity: 1,
      duration: 1,
      delay: 0.8,
      ease: 'power2.out',
    })
  },
})
