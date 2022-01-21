import '../css/demo1.css'

import { gsap } from 'gsap'

/**
 * GSAP
 */

const tl = gsap.timeline()
tl.pause()

tl.to('.menu-left', {
  left: 0,
  duration: 1,
  ease: 'expo.inOut',
})

tl.to(
  '.menu-right',
  {
    right: 0,
    duration: 1,
    ease: 'expo.inOut',
  },
  '-=1'
)

tl.to(
  '.menu-links > div',
  {
    y: 100,
    opacity: 1,
    duration: 0.8,
    ease: 'expo.out',
    stagger: 0.1,
  },
  '-=0.4'
)

tl.to(
  '.mail > div, .socials > div',
  {
    y: 100,
    opacity: 1,
    duration: 0.8,
    ease: 'expo.out',
    stagger: 0.1,
  },
  '-=1'
)

tl.from(
  '.menu-close',
  {
    scale: 0,
    opacity: 1,
    duration: 1,
    ease: 'expo.inOut',
  },
  '-=1'
)

tl.to(
  '.hr',
  {
    scaleY: 1,
    transformOrigin: '0% 50%',
    duration: 0.4,
    ease: 'power2.out',
  },
  '-=2'
)

tl.reverse()

/**
 * Dom elements
 */
const menuOpen = document.querySelector('.menu-open')
const menuClose = document.querySelector('.menu-close')

/**
 * Click on menu-open to open menu
 */
menuOpen.addEventListener('click', () => {
  console.log('open')
  tl.reversed(!tl.reversed())
})
menuClose.addEventListener('click', () => {
  console.log('close')
  tl.reversed(!tl.reversed())
})
