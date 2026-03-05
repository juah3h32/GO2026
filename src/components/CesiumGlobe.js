// CesiumGlobe.js
import * as Cesium from 'https://cdn.jsdelivr.net/npm/cesium@1.109.0/Build/Cesium/Cesium.js';
import 'https://cdn.jsdelivr.net/npm/cesium@1.109.0/Build/Cesium/Widgets/widgets.css';
// GlobeZoom.js en public/js
import * as THREE from 'https://cdn.skypack.dev/three@0.161.0';

// Opcional: si necesitas GLTFLoader
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.161.0/examples/jsm/loaders/GLTFLoader.js';

// Tu código de Three.js sigue igual...


export function initCesium(containerId) {
  Cesium.Ion.defaultAccessToken = 'TU_TOKEN_AQUI';

  const viewer = new Cesium.Viewer(containerId, {
    terrainProvider: Cesium.createWorldTerrain(),
    imageryProvider: Cesium.IonWorldImagery(),
    baseLayerPicker: false,
    geocoder: false,
    timeline: false,
    animation: false,
    sceneModePicker: false
  });

  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 30000000),
    orientation: {
      heading: 0,
      pitch: -Cesium.Math.PI_OVER_TWO + 0.1,
      roll: 0
    }
  });

  viewer.clock.shouldAnimate = true;
  viewer.clock.multiplier = 60;

  return viewer;
}
