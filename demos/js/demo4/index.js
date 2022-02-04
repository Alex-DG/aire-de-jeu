import '../../styles/demo4.scss'

import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

import sneakerSrc from '../../models/sneaker/sneaker2.glb'

const init = () => {
  const loadingManager = new THREE.LoadingManager()
  const gltfLoader = new GLTFLoader(loadingManager)

  let sneaker = null
  gltfLoader.load(sneakerSrc, (gltf) => {
    sneaker = gltf.scene

    const pointLight = new THREE.PointLight(0xffffff, 2)
    sneaker.scale.multiplyScalar(0.17)
    sneaker.add(pointLight)

    // Center sneaker in viewport
    const box = new THREE.Box3().setFromObject(sneaker)
    const center = new THREE.Vector3()
    box.getCenter(center)
    sneaker.position.sub(center)

    document.querySelectorAll('[data-diagram]').forEach((elem, index) => {
      const sceneName = elem.dataset.diagram
      const sceneInitFunction = sceneInitFunctionsByName[sceneName]
      const sceneRenderFunction = sceneInitFunction(elem, index)
      addScene(elem, sceneRenderFunction)
    })
  })

  const canvas = document.createElement('canvas')
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  })
  renderer.setScissorTest(true)

  const sceneElements = []
  const addScene = (elem, fn) => {
    const ctx = document.createElement('canvas').getContext('2d')
    elem.appendChild(ctx.canvas)
    sceneElements.push({ elem, ctx, fn })
  }

  const makeScene = (elem) => {
    const scene = new THREE.Scene()

    const fov = 45
    const aspect = 2 // the canvas default
    const near = 0.1
    const far = 5
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 1, 2)
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    const controls = new TrackballControls(camera, elem)

    controls.noZoom = true
    controls.noPan = false

    {
      const color = 0xffffff
      const intensity = 1
      const light = new THREE.DirectionalLight(color, intensity)
      light.position.set(-1, 2, 4)
      camera.add(light)
    }

    return { scene, camera, controls }
  }

  const sceneInitFunctionsByName = {
    pegasus: (elem, index) => {
      const { scene, camera, controls } = makeScene(elem)
      const mesh = sneaker.clone()
      scene.add(mesh)

      const rotationShiftY = Math.PI - (index + 1)

      return (time, rect) => {
        mesh.rotation.y = time * 0.1 + rotationShiftY
        camera.aspect = rect.width / rect.height
        camera.updateProjectionMatrix()
        controls.handleResize()
        controls.update()
        renderer.render(scene, camera)
      }
    },

    test: (elem) => {
      const { scene, camera, controls } = makeScene(elem)
      const radius = 0.8
      const widthSegments = 4
      const heightSegments = 2
      const geometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments
      )
      const material = new THREE.MeshPhongMaterial({
        color: 'blue',
        flatShading: true,
      })
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)

      return (time, rect) => {
        mesh.rotation.y = time * 0.1
        camera.aspect = rect.width / rect.height
        camera.updateProjectionMatrix()
        controls.handleResize()
        controls.update()
        renderer.render(scene, camera)
      }
    },
  }

  const render = (time) => {
    time *= 0.001

    for (const { elem, fn, ctx } of sceneElements) {
      // get the viewport relative position of this element
      const rect = elem.getBoundingClientRect()
      const { left, right, top, bottom, width, height } = rect
      const rendererCanvas = renderer.domElement

      const isOffscreen =
        bottom < 0 ||
        top > window.innerHeight ||
        right < 0 ||
        left > window.innerWidth

      if (!isOffscreen) {
        // make sure the renderer's canvas is big enough
        if (rendererCanvas.width < width || rendererCanvas.height < height) {
          renderer.setSize(width, height, false)
        }

        // make sure the canvas for this area is the same size as the area
        if (ctx.canvas.width !== width || ctx.canvas.height !== height) {
          ctx.canvas.width = width
          ctx.canvas.height = height
        }

        renderer.setScissor(0, 0, width, height)
        renderer.setViewport(0, 0, width, height)

        fn(time, rect)

        // copy the rendered scene to this element's canvas
        ctx.globalCompositeOperation = 'copy'
        ctx.drawImage(
          rendererCanvas,
          0,
          rendererCanvas.height - height,
          width,
          height, // src rect
          0,
          0,
          width,
          height
        ) // dst rect
      }
    }

    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

init()
