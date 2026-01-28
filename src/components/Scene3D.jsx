import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { elementColors, elementRadii } from "../data/molecules";

export default function Scene3D({ selectedElement = "C" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7fb); // soft white, not harsh

    // Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.8, 7);

    // Renderer (nicer)
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Controls (smooth)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.2;
    controls.maxDistance = 18;

    // Premium lighting setup
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(6, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 0.45);
    fill.position.set(-6, 2, -4);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.35);
    rim.position.set(0, 6, -8);
    scene.add(rim);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    // Floor for soft shadow
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.15 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Subtle “glass box” vibe using LineSegments (cleaner than wireframe mesh)
    const boxGeo = new THREE.BoxGeometry(6, 6, 6);
    const edges = new THREE.EdgesGeometry(boxGeo);
    const boxLines = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x1f2937, transparent: true, opacity: 0.18 })
    );
    scene.add(boxLines);

    // Atom material (smooth + slightly glossy)
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(elementColors[selectedElement] || "#2b2b2b"),
      roughness: 0.25,
      metalness: 0.05,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });

    const geometry = new THREE.SphereGeometry(0.7, 64, 64);
    const atom = new THREE.Mesh(geometry, material);
    atom.castShadow = true;
    scene.add(atom);

    // Apply size from selected element
    const radius = elementRadii[selectedElement] || 0.76;
    const s = radius * 1.15;
    atom.scale.set(s, s, s);

    // Floating animation (looks “expensive”)
    const clock = new THREE.Clock();

    // Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    let raf;
    const animate = () => {
      const t = clock.getElapsedTime();

      // float + gentle spin
      atom.position.y = Math.sin(t * 1.2) * 0.25;
      atom.rotation.y += 0.004;

      // box slowly rotates a tiny bit (subtle premium motion)
      boxLines.rotation.y = Math.sin(t * 0.25) * 0.12;

      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      geometry.dispose();
      material.dispose();
      boxGeo.dispose();
      edges.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [selectedElement]);

  return <div ref={mountRef} className="scene" />;
}
