import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import sneakerSrc from '../../models/sneaker/sneaker.glb'

class Experience {
  // Dom
  canvas
  sizes

  // 3D
  renderer
  camera
  scene
  sneaker
  controls

  // Time
  clock
  deltaTime = 0
  lastElapsedTime = 0

  // State/Flag
  isloaded = false

  init() {
    this.setCanvas()
    this.setSizes()
    this.setScene()
    this.setCamera()
    this.setLight()
    this.setResize()
    this.setControls()
    this.setRenderer()
    this.setClock()
    this.setSneaker()

    this.update()
  }

  setControls() {
    const { canvas, camera } = this

    this.controls = new OrbitControls(camera, canvas)
    this.controls.enableDamping = true
  }

  setCanvas() {
    this.canvas = document.getElementById('webgl')
  }

  setSizes() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  setScene() {
    this.scene = new THREE.Scene()
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )

    this.camera.position.x = 1
    this.camera.position.y = 1
    this.camera.position.z = 1

    this.scene.add(this.camera)
  }

  setLight() {
    const color = 0xffffff
    const intensity = 1
    const directionalLight = new THREE.DirectionalLight(color, intensity)

    directionalLight.position.set(-1, 2, 4)
    this.scene.add(directionalLight)
  }

  setResize() {
    window.addEventListener('resize', () => {
      // Update sizes
      this.sizes.width = window.innerWidth
      this.sizes.height = window.innerHeight

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
  }

  setRenderer() {
    const { canvas, sizes } = this

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })

    this.renderer.setSize(sizes.width, sizes.height)

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  setClock() {
    this.clock = new THREE.Clock()
  }

  // setSneakerPosition() {
  //   const { sizes } = this

  //   // Scale sneaker to canvas sizes
  //   const camDistance = this.camera.position.distanceTo(this.sneaker.position)
  //   const fov = (this.camera.fov * Math.PI) / 180 // convert vertical fov to radians
  //   const h = 2 * Math.tan(fov / 2) * camDistance // visible height
  //   const w = h * (sizes.width / sizes.height)
  //   this.sneaker.scale.set(w, h, w)

  //   const box = new THREE.Box3()
  //   box.expandByObject(this.sneaker)

  //   const size = box.getSize(new THREE.Vector3())
  //   const maxSize = Math.max(size.x, size.y, size.z)
  //   const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * fov) / 360))
  //   const fitWidthDistance = fitHeightDistance / this.camera.aspect
  //   const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance)

  //   console.log({ fitHeightDistance, fitWidthDistance, distance })
  //   this.sneaker.position.z = -distance / 100 - 10
  //   this.sneaker.position.x += 1.5
  // }

  setSneaker() {
    const loadingManager = new THREE.LoadingManager()
    const progressText = document.getElementById('loading-progress')
    const gltfLoader = new GLTFLoader(loadingManager)

    // Handel loading progress
    loadingManager.onProgress = (_, loaded, total) => {
      const progress = (loaded / total) * 100
      progressText.innerHTML = `${Number(progress).toFixed(0)}%`
      if (progress === 100) {
        this.isloaded = true
        progressText.style.display = 'none'
      }
      console.log('progress: ', { progress })
    }

    // Load model
    gltfLoader.load(sneakerSrc, (gltf) => {
      this.sneaker = gltf.scene

      this.sneaker.scale.multiplyScalar(0.17)

      // Center sneaker in viewport
      const box = new THREE.Box3().setFromObject(this.sneaker)
      const center = new THREE.Vector3()
      box.getCenter(center)
      this.sneaker.position.sub(center)

      this.scene.add(this.sneaker)
      console.log('Loading sneaker: done!')
    })
  }

  // controlsUpdate(fitRatio = 1) {
  //   const { controls, camera } = this
  //   const box = new THREE.Box3()

  //   const size = box.getSize(new THREE.Vector3())
  //   const center = box.getCenter(new THREE.Vector3())

  //   const maxSize = Math.max(size.x, size.y, size.z)
  //   const fitHeightDistance =
  //     maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360))
  //   const fitWidthDistance = fitHeightDistance / camera.aspect
  //   const distance = fitRatio * Math.max(fitHeightDistance, fitWidthDistance)

  //   const direction = controls.target
  //     .clone()
  //     .sub(camera.position)
  //     .normalize()
  //     .multiplyScalar(distance)

  //   controls.maxDistance = distance * 10
  //   controls.target.copy(center)

  //   camera.near = distance / 100
  //   camera.far = distance * 100
  //   camera.updateProjectionMatrix()

  //   camera.position.copy(controls.target).sub(direction)

  //   controls.update()
  // }

  update() {
    const { clock, scene, camera, renderer, controls } = this

    this.elapsedTime = clock.getElapsedTime()
    this.deltaTime = this.elapsedTime - this.lastElapsedTime
    this.lastElapsedTime = this.elapsedTime

    // Update controls
    controls.update()

    if (this.sneaker) {
      this.sneaker.rotation.y += this.deltaTime * 0.3
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(() => this.update())
  }
}

const experience = new Experience()
export default experience
