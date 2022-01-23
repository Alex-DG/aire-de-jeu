import '../../css/demo3.scss'
import Experience from './experience'
import { gsap } from 'gsap'

/**
 * Dom elements
 */
const closeBtn = document.querySelector('.close-btn')
const viewer = document.querySelector('.viewer')
const images = document.querySelectorAll('img')
const menu = document.querySelector('.menu')
const close = document.querySelector('.close')
const nav = document.querySelector('nav')

/**
 * Events
 */
closeBtn.addEventListener('click', () => {
  gsap.to(['#webgl', '.close-btn'], {
    opacity: 0,
    display: 'none',
    duration: 0.5,
    ease: 'power3.out',
  })
})

// link.addEventListener('mouseenter', venueHover)
// link.addEventListener('mouseleave', venueHover)
// link.addEventListener('mousemove', moveVenueImage)

images.forEach((imgage) => {
  imgage.addEventListener('click', () => {
    gsap.to(['#webgl', '.close-btn'], {
      opacity: 1,
      display: 'block',
      duration: 1,
      ease: 'power3.out',
    })
  })
})

menu.addEventListener('click', () => {
  nav.classList.add('open-nav')
})

close.addEventListener('click', () => {
  nav.classList.remove('open-nav')
})

window.addEventListener('load', () => {
  Experience.init()
})
