import '../../css/demo3.scss'
import Experience from './experience'
import { gsap } from 'gsap'

/**
 * Dom elements
 */

const image1 = document.getElementById('image-1')
const image2 = document.getElementById('image-2')
const image3 = document.getElementById('image-3')
const closeBtn = document.querySelector('.close-btn')
const menu = document.querySelector('.menu')
const close = document.querySelector('.close')
const nav = document.querySelector('nav')

/**
 * Events
 */
closeBtn.addEventListener('click', () => {
  gsap.to(['#webgl', '.close-btn', '#loading-progress'], {
    opacity: 0,
    duration: 0.25,
    display: 'none',
    ease: 'power3.out',
  })
})

const handleImageCallback = () => {
  gsap.to(['#webgl', '.close-btn', ' #loading-progress'], {
    opacity: 1,
    duration: 1,
    display: 'block',
    ease: 'power3.out',
  })
}

image1.addEventListener('click', handleImageCallback)
image2.addEventListener('click', handleImageCallback)
image3.addEventListener('click', handleImageCallback)

menu.addEventListener('click', () => {
  nav.classList.add('open-nav')
})

close.addEventListener('click', () => {
  nav.classList.remove('open-nav')
})

Experience.init()
