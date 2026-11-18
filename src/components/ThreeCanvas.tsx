import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ViewMode, ColorTheme, Node3DData } from '../types.ts';
import { sound } from '../utils/audio.ts';

interface ThreeCanvasProps {
  viewMode: ViewMode;
  colorTheme: ColorTheme;
  activeNodeId: string | null;
  onSelectNode: (node: Node3DData | null) => void;
  isRotating: boolean;
}

// Module-level reusable math objects to prevent garbage collection inside render loop
const _pointer = new THREE.Vector2();
const _raycaster = new THREE.Raycaster();
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _tempMatrix = new THREE.Matrix4();
const _tempPos = new THREE.Vector3();

export const NODES_DATA: Node3DData[] = [
  {
    id: 'tutorias',
    title: 'Programa de Tutorías',
    subtitle: 'Gestión Institucional ITD',
    color: '#00b4ff',
    accentColor: '#00e5c0',
    position: [-5.2, 1.2, 2.5],
    radius: 1.1,
    type: 'tutorias',
    description: 'Seguimiento y registro del programa institucional de tutoría. Formatos ITD-AC-PO-04-03 y ITD-AC-PO-04-02 para coordinadores y tutores docentes.',
    actionUrl: 'https://da-itd.github.io/C/ITD-AC-PO-04-03-app.html',
    actionText: 'Ingresar a Tutorías'
  },
  {
    id: 'actualizacion',
    title: 'Actualización Docente',
    subtitle: 'Formación Continua y Cursos',
    color: '#3a6fff',
    accentColor: '#f5c842',
    position: [5.2, 1.4, 2.2],
    radius: 1.1,
    type: 'actualizacion',
    description: 'Plataforma oficial de registro, constancias y consulta de actividades de formación y actualización del personal académico del ITD.',
    actionUrl: 'https://act-doc-itd.vercel.app',
    actionText: 'Acceder a Actualización'
  },
  {
    id: 'estadisticas',
    title: 'Reportes y Estadísticas',
    subtitle: 'Métricas de Impacto Académico',
    color: '#f59e0b',
    accentColor: '#ef4444',
    position: [-3.8, 2.8, -4.5],
    radius: 0.9,
    type: 'estadisticas',
    description: 'Módulo de análisis estadístico de reprobación, retención e impacto de la tutoría en los departamentos académicos.',
    actionUrl: 'https://da-itd.github.io/C/reportes.html',
    actionText: 'Consultar Estadísticas'
  },
  {
    id: 'calidad',
    title: 'Sistema de Gestión (SGI)',
    subtitle: 'Rumbo al SGI ISO 9001:2026',
    color: '#a855f7',
    accentColor: '#38bdf8',
    position: [3.8, 2.6, -4.5],
    radius: 0.9,
    type: 'calidad',
    description: 'Procedimientos rumbo al SGI Norma ISO 9001:2026 para el aseguramiento del servicio académico y docente.',
    actionUrl: 'https://www.itdurango.edu.mx/',
    actionText: 'Ver Normativa ITD'
  },
  {
    id: 'siape',
    title: 'SIAPE-ITD',
    subtitle: 'Atención Psicológica Estudiantil',
    color: '#6ee7b7',
    accentColor: '#34d399',
    position: [0, 1.3, 5.6],
    radius: 0.95,
    type: 'siape',
    description: 'Sistema Integral de Atención Psicológica Estudiantil · Oficina de Psicología ITD.',
    actionUrl: 'https://siape-itd.vercel.app',
    actionText: 'Acceder a SIAPE-ITD'
  }
];

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  viewMode,
  colorTheme,
  activeNodeId,
  onSelectNode,
  isRotating
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    viewMode,
    colorTheme,
    activeNodeId,
    isRotating,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    isDragging: false,
    prevPointerX: 0,
    prevPointerY: 0,
    orbitTheta: 0,
    orbitPhi: Math.PI / 3.8,
    orbitRadius: 18,
    hoveredNodeId: null as string | null
  });

  // Keep stateRef in sync with props
  useEffect(() => {
    stateRef.current.viewMode = viewMode;
    stateRef.current.colorTheme = colorTheme;
    stateRef.current.activeNodeId = activeNodeId;
    stateRef.current.isRotating = isRotating;
  }, [viewMode, colorTheme, activeNodeId, isRotating]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Software WebGL Guard (per Three.js skill)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05080f, 0.028);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 5, 20);

    // 4. Environment Map for realistic PBR reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig (3-Point Studio + Ground Fill)
    const ambientLight = new THREE.AmbientLight(0x0c1b33, 1.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x00b4ff, 0x05080f, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0x60a5fa, 2.8);
    keyLight.position.set(12, 18, 14);
    keyLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00e5c0, 2.0);
    rimLight.position.set(-14, 10, -10);
    scene.add(rimLight);

    const centerPointLight = new THREE.PointLight(0x00b4ff, 3.5, 18);
    centerPointLight.position.set(0, 1.5, 0);
    scene.add(centerPointLight);

    // 6. Multi-Part Technological Dais / Ground Platform
    const daisGroup = new THREE.Group();

    // Base cylinder with bevel
    const baseGeo = new THREE.CylinderGeometry(8.5, 9.2, 0.4, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0a1426,
      roughness: 0.28,
      metalness: 0.82
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.2;
    baseMesh.receiveShadow = !isSoftwareGl;
    daisGroup.add(baseMesh);

    // Outer neon ring on ground
    const outerRingGeo = new THREE.RingGeometry(8.2, 8.45, 64);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00b4ff,
      side: THREE.DoubleSide
    });
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRingMesh.rotation.x = -Math.PI / 2;
    outerRingMesh.position.y = 0.02;
    daisGroup.add(outerRingMesh);

    // Inner glowing ring
    const innerRingGeo = new THREE.RingGeometry(4.4, 4.6, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00e5c0,
      side: THREE.DoubleSide
    });
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRingMesh.rotation.x = -Math.PI / 2;
    innerRingMesh.position.y = 0.025;
    daisGroup.add(innerRingMesh);

    // Ground tech grid (coplanar safe)
    const gridHelper = new THREE.GridHelper(30, 30, 0x00b4ff, 0x0b2545);
    gridHelper.position.y = -0.42;
    daisGroup.add(gridHelper);

    // Soft radial contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(24, 24);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const grad = shadowCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = grad;
    shadowCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.65
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.43;
    daisGroup.add(shadowMesh);

    scene.add(daisGroup);

    // 7. Central Holographic Core (TecNM / ITD Node)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 2.2, 0);

    // Central Polyhedral Crystal Core
    const crystalGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x00e5c0,
      emissive: 0x005577,
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.2,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.6 : 0.9,
      ior: 1.52,
      thickness: 1.2
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    coreGroup.add(crystalMesh);

    // Inner wireframe sphere
    const wireGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00b4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // Gyroscopic Ring 1 (Horizontal tilt)
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.08, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x00b4ff,
      roughness: 0.2,
      metalness: 0.9
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 4;
    coreGroup.add(ring1Mesh);

    // Gyroscopic Ring 2 (Vertical counter-tilt, gold accent)
    const ring2Geo = new THREE.TorusGeometry(3.1, 0.06, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xf5c842,
      roughness: 0.25,
      metalness: 0.85
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 3;
    coreGroup.add(ring2Mesh);

    // Gyroscopic Ring 3 (Equatorial thin track)
    const ring3Geo = new THREE.TorusGeometry(3.7, 0.04, 16, 64);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x3a6fff,
      roughness: 0.3,
      metalness: 0.8
    });
    const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
    coreGroup.add(ring3Mesh);

    scene.add(coreGroup);

    // 8. Satellite Interactive Nodes
    const satelliteMeshes: {
      id: string;
      group: THREE.Group;
      mesh: THREE.Mesh;
      ring: THREE.Mesh;
      beam: THREE.Mesh;
      halo: THREE.Mesh;
      data: Node3DData;
    }[] = [];

    const raycastTargets: THREE.Object3D[] = [];

    NODES_DATA.forEach((node) => {
      const sGroup = new THREE.Group();
      sGroup.position.set(...node.position);

      // Node crystal shape
      let sGeo: THREE.BufferGeometry;
      if (node.type === 'tutorias') {
        sGeo = new THREE.OctahedronGeometry(node.radius, 0);
      } else if (node.type === 'actualizacion') {
        sGeo = new THREE.DodecahedronGeometry(node.radius, 0);
      } else if (node.type === 'estadisticas') {
        sGeo = new THREE.BoxGeometry(node.radius * 1.4, node.radius * 1.4, node.radius * 1.4);
      } else if (node.type === 'siape') {
        sGeo = new THREE.TorusKnotGeometry(node.radius * 0.6, node.radius * 0.2, 64, 16);
      } else {
        sGeo = new THREE.ConeGeometry(node.radius * 1.2, node.radius * 2, 6);
      }

      const sMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        roughness: 0.2,
        metalness: 0.75,
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.35
      });

      const sMesh = new THREE.Mesh(sGeo, sMat);
      sMesh.userData = { nodeId: node.id, isNode: true, data: node };
      sGroup.add(sMesh);
      raycastTargets.push(sMesh);

      // Orbiting energy halo ring
      const haloGeo = new THREE.TorusGeometry(node.radius * 1.7, 0.04, 16, 48);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.accentColor),
        transparent: true,
        opacity: 0.75
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI / 2;
      sGroup.add(haloMesh);

      // Vertical energy conduit beam connecting to ground
      const beamHeight = node.position[1] + 0.4;
      const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, beamHeight, 12);
      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        transparent: true,
        opacity: 0.35
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.y = -beamHeight / 2;
      sGroup.add(beamMesh);

      // Base footprint ring on dais
      const footGeo = new THREE.RingGeometry(0.4, 0.55, 32);
      const footMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        side: THREE.DoubleSide
      });
      const footMesh = new THREE.Mesh(footGeo, footMat);
      footMesh.rotation.x = -Math.PI / 2;
      footMesh.position.y = -node.position[1] + 0.03;
      sGroup.add(footMesh);

      scene.add(sGroup);

      satelliteMeshes.push({
        id: node.id,
        group: sGroup,
        mesh: sMesh,
        ring: footMesh,
        beam: beamMesh,
        halo: haloMesh,
        data: node
      });
    });

    // 9. Floating Data Particles (InstancedMesh for high performance)
    const particleCount = 160;
    const particleGeo = new THREE.BoxGeometry(0.09, 0.09, 0.09);
    const particleMat = new THREE.MeshBasicMaterial({
      color: 0x00e5c0,
      transparent: true,
      opacity: 0.8
    });
    const instancedParticles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);

    const particleSpeeds: { radius: number; speed: number; y: number; angle: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 8.5;
      const angle = Math.random() * Math.PI * 2;
      const y = 0.5 + Math.random() * 6;
      const speed = (0.2 + Math.random() * 0.4) * (Math.random() > 0.5 ? 1 : -1);
      particleSpeeds.push({ radius, speed, y, angle });

      _tempPos.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      _tempMatrix.setPosition(_tempPos);
      instancedParticles.setMatrixAt(i, _tempMatrix);
    }
    instancedParticles.instanceMatrix.needsUpdate = true;
    instancedParticles.computeBoundingSphere();
    scene.add(instancedParticles);

    // 10. Pointer and Interaction Handlers
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _pointer.x = x;
      _pointer.y = y;

      stateRef.current.targetMouseX = x;
      stateRef.current.targetMouseY = y;

      if (stateRef.current.isDragging && stateRef.current.viewMode === 'space3d') {
        const deltaX = e.clientX - stateRef.current.prevPointerX;
        const deltaY = e.clientY - stateRef.current.prevPointerY;
        stateRef.current.orbitTheta -= deltaX * 0.007;
        stateRef.current.orbitPhi = Math.max(
          0.15,
          Math.min(Math.PI / 2.1, stateRef.current.orbitPhi - deltaY * 0.007)
        );
        stateRef.current.prevPointerX = e.clientX;
        stateRef.current.prevPointerY = e.clientY;
      }

      // Raycasting for hover highlighting
      _raycaster.setFromCamera(_pointer, camera);
      const intersects = _raycaster.intersectObjects(raycastTargets);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const nodeId = hit.userData.nodeId;
        if (stateRef.current.hoveredNodeId !== nodeId) {
          stateRef.current.hoveredNodeId = nodeId;
          container.style.cursor = 'pointer';
          sound.playHover();
        }
      } else {
        if (stateRef.current.hoveredNodeId !== null) {
          stateRef.current.hoveredNodeId = null;
          container.style.cursor = stateRef.current.viewMode === 'space3d' ? 'grab' : 'default';
        }
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      stateRef.current.isDragging = true;
      stateRef.current.prevPointerX = e.clientX;
      stateRef.current.prevPointerY = e.clientY;
      if (stateRef.current.viewMode === 'space3d') {
        container.style.cursor = 'grabbing';
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      stateRef.current.isDragging = false;
      container.style.cursor = stateRef.current.hoveredNodeId ? 'pointer' : 'default';

      // Check click raycast
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      _pointer.x = x;
      _pointer.y = y;
      _raycaster.setFromCamera(_pointer, camera);
      const intersects = _raycaster.intersectObjects(raycastTargets);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const hitData = hit.userData.data as Node3DData;
        sound.playSelect();
        onSelectNode(hitData);
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (stateRef.current.viewMode === 'space3d') {
        e.preventDefault();
        stateRef.current.orbitRadius = Math.max(
          8,
          Math.min(32, stateRef.current.orbitRadius + e.deltaY * 0.02)
        );
      }
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 11. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 12. Paced Render Loop (per Three.js skill rules)
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const current = stateRef.current;

      // Mouse smoothing
      current.mouseX = THREE.MathUtils.damp(current.mouseX, current.targetMouseX, 4.0, delta);
      current.mouseY = THREE.MathUtils.damp(current.mouseY, current.targetMouseY, 4.0, delta);

      // Auto rotation
      if (current.isRotating) {
        coreGroup.rotation.y += delta * 0.45;
        ring1Mesh.rotation.z += delta * 0.3;
        ring2Mesh.rotation.x += delta * 0.25;
        daisGroup.rotation.y += delta * 0.05;
      }

      // Crystal breathing pulse
      const pulseScale = 1 + Math.sin(elapsed * 2.2) * 0.04;
      crystalMesh.scale.set(pulseScale, pulseScale, pulseScale);
      centerPointLight.intensity = 3.2 + Math.sin(elapsed * 3.5) * 0.8;

      // Dynamic color theme adjustment
      if (current.colorTheme === 'cyber') {
        centerPointLight.color.setHex(0x00e5c0);
        keyLight.color.setHex(0x00b4ff);
        rimLight.color.setHex(0xff007f);
      } else if (current.colorTheme === 'gold') {
        centerPointLight.color.setHex(0xf5c842);
        keyLight.color.setHex(0xffb703);
        rimLight.color.setHex(0x00b4ff);
      } else {
        // TecNM Default
        centerPointLight.color.setHex(0x00b4ff);
        keyLight.color.setHex(0x60a5fa);
        rimLight.color.setHex(0x00e5c0);
      }

      // Satellite nodes animation
      satelliteMeshes.forEach((item, idx) => {
        const nodeYOffset = Math.sin(elapsed * 1.8 + idx * 1.2) * 0.18;
        item.group.position.y = item.data.position[1] + nodeYOffset;
        item.mesh.rotation.y += delta * 0.7;
        item.mesh.rotation.x += delta * 0.35;
        item.halo.rotation.z += delta * 1.2;

        const isHovered = current.hoveredNodeId === item.id;
        const isSelected = current.activeNodeId === item.id;

        const targetScale = isSelected ? 1.4 : isHovered ? 1.22 : 1.0;
        item.mesh.scale.setScalar(
          THREE.MathUtils.damp(item.mesh.scale.x, targetScale, 8.0, delta)
        );

        // Enhance emissive on hover
        const targetEmissive = isSelected ? 0.9 : isHovered ? 0.7 : 0.35;
        const mat = item.mesh.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = THREE.MathUtils.damp(
          mat.emissiveIntensity,
          targetEmissive,
          8.0,
          delta
        );
      });

      // Update particle stream
      for (let i = 0; i < particleCount; i++) {
        const p = particleSpeeds[i];
        p.angle += delta * p.speed * 0.6;
        const px = Math.cos(p.angle) * p.radius;
        const pz = Math.sin(p.angle) * p.radius;
        const py = p.y + Math.sin(elapsed * 1.5 + i) * 0.3;

        _tempPos.set(px, py, pz);
        _tempMatrix.setPosition(_tempPos);
        instancedParticles.setMatrixAt(i, _tempMatrix);
      }
      instancedParticles.instanceMatrix.needsUpdate = true;

      // Camera positioning logic
      if (current.viewMode === 'space3d') {
        if (current.activeNodeId) {
          // Focus on active node
          const targetNode = NODES_DATA.find((n) => n.id === current.activeNodeId);
          if (targetNode) {
            _targetLookAt.set(...targetNode.position);
            _targetCamPos.set(
              targetNode.position[0] * 1.6 + 1.5,
              targetNode.position[1] + 1.2,
              targetNode.position[2] * 1.6 + 4.5
            );
          }
        } else {
          // Orbit view
          const sinPhi = Math.sin(current.orbitPhi);
          const cosPhi = Math.cos(current.orbitPhi);
          const sinTheta = Math.sin(current.orbitTheta);
          const cosTheta = Math.cos(current.orbitTheta);

          _targetCamPos.set(
            current.orbitRadius * sinPhi * sinTheta,
            current.orbitRadius * cosPhi,
            current.orbitRadius * sinPhi * cosTheta
          );
          _targetLookAt.set(0, 1.8, 0);
        }
      } else {
        // Portal background mode: Gentle tilt and parallax following mouse
        _targetCamPos.set(
          current.mouseX * 3.5,
          4.5 - current.mouseY * 2.0,
          19 + Math.sin(elapsed * 0.3) * 0.8
        );
        _targetLookAt.set(current.mouseX * 0.8, 2.0, 0);
      }

      // Smooth camera interpolation
      camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 3.5, delta);

      _tempPos.set(
        THREE.MathUtils.damp(camera.position.x, _targetLookAt.x, 3.5, delta),
        THREE.MathUtils.damp(camera.position.y, _targetLookAt.y, 3.5, delta),
        THREE.MathUtils.damp(camera.position.z, _targetLookAt.z, 3.5, delta)
      );
      camera.lookAt(_targetLookAt);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // 13. Resource Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);

      // Dispose geometries and materials
      [
        baseGeo,
        outerRingGeo,
        innerRingGeo,
        shadowGeo,
        crystalGeo,
        wireGeo,
        ring1Geo,
        ring2Geo,
        ring3Geo,
        particleGeo
      ].forEach((g) => g.dispose());

      [
        baseMat,
        outerRingMat,
        innerRingMat,
        shadowMat,
        crystalMat,
        wireMat,
        ring1Mat,
        ring2Mat,
        ring3Mat,
        particleMat
      ].forEach((m) => m.dispose());

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectNode]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto"
      style={{
        zIndex: viewMode === 'space3d' ? 10 : 0,
        opacity: viewMode === 'space3d' ? 1 : 0.88,
        transition: 'opacity 0.6s ease'
      }}
    />
  );
};
