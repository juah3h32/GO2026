import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('scene-3d')
  if (!container) {
    console.error('No existe #scene-3d')
    return
  }

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  camera.position.set(0, 1.2, 3)

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)

  // LUCES
  scene.add(new THREE.AmbientLight(0xffffff, 1.5))

  const light = new THREE.DirectionalLight(0xffffff, 1)
  light.position.set(5, 10, 5)
  scene.add(light)

  // MODELO
  const loader = new GLTFLoader()
  loader.load(
    '/models/yo.glb',
    (gltf) => {
      const model = gltf.scene
      model.scale.set(1, 1, 1)
      model.position.set(0, -0.5, 0)
      scene.add(model)
      animate()
    },
    undefined,
    (error) => {
      console.error('Error cargando el modelo:', error)
    }
  )

  function animate() {
    requestAnimationFrame(animate)
    scene.rotation.y += 0.003
    renderer.render(scene, camera)
  }

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
  })
})
