import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCw,
  Sparkles,
  Compass,
  Eye,
  RefreshCw,
  Layers,
  Crosshair,
  Lightbulb,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Target,
} from 'lucide-react';
import { RetinalReticle } from './RetinalReticle';

interface Interactive3DRetinalModelProps {
  imageUrl: string;
  className?: string;
  eye?: 'OD' | 'OS';
}

type ModelViewMode = '3d-globe' | '3d-cutaway' | '3d-plate';

interface LandmarkPreset {
  id: string;
  label: string;
  targetPitch: number;
  targetYaw: number;
  description: string;
}

const PRESETS: LandmarkPreset[] = [
  { id: 'fundus', label: 'Retinal Fundus', targetPitch: -5, targetYaw: 15, description: 'Posterior Pole & Diagnostic Zone' },
  { id: 'cornea', label: 'Cornea & Iris', targetPitch: 0, targetYaw: 195, description: 'Anterior Optical Aperture' },
  { id: 'disc', label: 'Optic Disc (CN II)', targetPitch: -12, targetYaw: 42, description: 'Optic Nerve Emergence' },
  { id: 'cutaway', label: 'Lateral Cutaway', targetPitch: 18, targetYaw: 85, description: 'Internal Scleral Stratification' },
];

export const Interactive3DRetinalModel: React.FC<Interactive3DRetinalModelProps> = ({
  imageUrl,
  className = '',
  eye = 'OD',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const telemetryDegreesRef = useRef<HTMLSpanElement>(null);
  const landmarkPillRef = useRef<HTMLDivElement>(null);

  // High-level mode controls (infrequent React re-renders only on user click)
  const [viewMode, setViewMode] = useState<ModelViewMode>('3d-globe');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [activeLighting, setActiveLighting] = useState(true);
  const [activePreset, setActivePreset] = useState<string>('fundus');

  // Fast animation and interaction refs (ZERO React re-renders during 60FPS animation)
  const autoRotateRef = useRef(true);
  const viewModeRef = useRef<ModelViewMode>('3d-globe');
  const activeLightingRef = useRef(true);

  // Keep refs in sync with state
  useEffect(() => {
    autoRotateRef.current = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    activeLightingRef.current = activeLighting;
  }, [activeLighting]);

  // Drag physics state
  const dragRef = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    rotX: -5,
    rotY: 15,
    targetRotX: -5,
    targetRotY: 15,
    velX: 0,
    velY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    isTransitioningToPreset: false,
    zoom: 1.0,
    targetZoom: 1.0,
    touchDist: 0,
  });

  // Three.js instances ref
  const threeRef = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    eyeGroup?: THREE.Group;
    globeMeshGroup?: THREE.Group;
    cutawayMeshGroup?: THREE.Group;
    ophthalmoBeam?: THREE.PointLight;
    dirLight?: THREE.DirectionalLight;
    animId?: number;
  }>({});

  // --------------------------------------------------------------------------
  // 1. High-Fidelity Procedural Textures (Generated Once & Cached)
  // --------------------------------------------------------------------------

  // A. Retinal Fundus Texture
  const retinaTextureRef = useRef<THREE.Texture | null>(null);
  const getRetinaTexture = useCallback(() => {
    if (retinaTextureRef.current) return retinaTextureRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base choroid background gradient (warm reddish-orange with deep vascular tone)
    const baseGrad = ctx.createRadialGradient(512, 512, 40, 512, 512, 512);
    baseGrad.addColorStop(0, '#c2410c');
    baseGrad.addColorStop(0.35, '#9a3412');
    baseGrad.addColorStop(0.7, '#6b1d06');
    baseGrad.addColorStop(0.9, '#3a0c02');
    baseGrad.addColorStop(1.0, '#0c0301');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Fine choroidal granular stroma
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const dist = Math.hypot(x - 512, y - 512);
      if (dist < 500) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(75, 12, 4, 0.45)' : 'rgba(249, 115, 22, 0.22)';
        ctx.fillRect(x, y, 1.6, 1.6);
      }
    }

    // Optic Disc (Nasal side)
    const discX = eye === 'OD' ? 690 : 334;
    const discY = 512;
    const discGrad = ctx.createRadialGradient(discX - 10, discY, 8, discX, discY, 68);
    discGrad.addColorStop(0, '#fffbeb');
    discGrad.addColorStop(0.3, '#fef3c7');
    discGrad.addColorStop(0.65, '#f59e0b');
    discGrad.addColorStop(1, '#92400e');
    ctx.beginPath();
    ctx.ellipse(discX, discY, 58, 72, 0, 0, Math.PI * 2);
    ctx.fillStyle = discGrad;
    ctx.fill();

    // Physiological cup
    ctx.beginPath();
    ctx.ellipse(discX - 8, discY, 26, 38, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#fffdf0';
    ctx.fill();

    // Macular lutea & Fovea (Temporal side)
    const macX = eye === 'OD' ? 440 : 584;
    const macY = 512;
    const macGrad = ctx.createRadialGradient(macX, macY, 6, macX, macY, 95);
    macGrad.addColorStop(0, '#190401');
    macGrad.addColorStop(0.3, '#3d0802');
    macGrad.addColorStop(0.68, '#691906');
    macGrad.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(macX, macY, 95, 0, Math.PI * 2);
    ctx.fillStyle = macGrad;
    ctx.fill();

    // Foveolar reflex
    ctx.beginPath();
    ctx.arc(macX, macY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();

    // Major Retinal Vessels (Arterioles & Venules)
    const drawVessel = (points: [number, number][], width: number, color: string) => {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i][0] + points[i + 1][0]) / 2;
        const yc = (points[i][1] + points[i + 1][1]) / 2;
        ctx.quadraticCurveTo(points[i][0], points[i][1], xc, yc);
      }
      ctx.quadraticCurveTo(
        points[points.length - 1][0],
        points[points.length - 1][1],
        points[points.length - 1][0],
        points[points.length - 1][1]
      );
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    };

    // Superior temporal arcade
    drawVessel(
      [
        [discX, discY],
        [discX - 60, discY - 120],
        [discX - 170, discY - 210],
        [macX - 110, discY - 225],
        [macX - 260, discY - 145],
      ],
      9,
      '#580808'
    );
    drawVessel(
      [
        [discX, discY],
        [discX - 58, discY - 118],
        [discX - 168, discY - 208],
        [macX - 110, discY - 223],
        [macX - 260, discY - 143],
      ],
      5,
      '#991b1b'
    );

    // Inferior temporal arcade
    drawVessel(
      [
        [discX, discY],
        [discX - 60, discY + 120],
        [discX - 170, discY + 210],
        [macX - 110, discY + 230],
        [macX - 250, discY + 155],
      ],
      9,
      '#580808'
    );
    drawVessel(
      [
        [discX, discY],
        [discX - 58, discY + 118],
        [discX - 168, discY + 208],
        [macX - 110, discY + 228],
        [macX - 250, discY + 153],
      ],
      5,
      '#991b1b'
    );

    // Nasal vessels
    drawVessel(
      [
        [discX, discY],
        [discX + 90, discY - 85],
        [discX + 195, discY - 165],
      ],
      5.5,
      '#7f1d1d'
    );
    drawVessel(
      [
        [discX, discY],
        [discX + 90, discY + 85],
        [discX + 195, discY + 165],
      ],
      5.5,
      '#7f1d1d'
    );

    // Moderate NPDR Lesions (Microaneurysms, Blot Hemorrhages, Hard Exudates)
    ctx.fillStyle = '#420606';
    ctx.beginPath();
    ctx.ellipse(discX - 175, discY - 45, 14, 11, 0.35, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(macX - 75, macY + 70, 16, 12, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Microaneurysms
    ctx.fillStyle = '#b91c1c';
    const maCoords = [
      [discX - 135, discY - 30],
      [discX - 185, discY + 45],
      [macX - 65, macY - 55],
      [macX + 45, macY + 65],
      [discX - 210, discY - 95],
      [macX - 140, macY + 20],
    ];
    for (const [mx, my] of maCoords) {
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hard exudates (lipid rings)
    ctx.fillStyle = '#fef08a';
    const exudateCoords = [
      [macX + 70, macY - 60, 5],
      [macX + 78, macY - 55, 4],
      [macX + 66, macY - 52, 4.5],
      [macX + 85, macY - 48, 3.8],
      [macX + 60, macY - 45, 4],
    ];
    for (const [ex, ey, er] of exudateCoords) {
      ctx.beginPath();
      ctx.arc(ex, ey, er, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.generateMipmaps = true;

    // Overlay SVG data URL if provided
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.globalAlpha = 0.6;
        ctx.drawImage(img, 0, 0, 1024, 1024);
        ctx.globalAlpha = 1.0;
        tex.needsUpdate = true;
      };
      img.src = imageUrl;
    }

    retinaTextureRef.current = tex;
    return tex;
  }, [eye, imageUrl]);

  // B. Iris & Pupil Texture
  const irisTextureRef = useRef<THREE.Texture | null>(null);
  const getIrisTexture = useCallback(() => {
    if (irisTextureRef.current) return irisTextureRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Iris hazel/amber ring with radiating collagen fibers
    const irisGrad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
    irisGrad.addColorStop(0, '#000000'); // Central Pupil
    irisGrad.addColorStop(0.34, '#000000');
    irisGrad.addColorStop(0.35, '#78350f'); // Pupillary margin
    irisGrad.addColorStop(0.55, '#b45309'); // Collarette
    irisGrad.addColorStop(0.85, '#d97706'); // Ciliary zone
    irisGrad.addColorStop(0.96, '#451a03'); // Limbal ring
    irisGrad.addColorStop(1.0, '#000000');
    ctx.fillStyle = irisGrad;
    ctx.fillRect(0, 0, 512, 512);

    // Radiating stromal fibers
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 360; i += 1.5) {
      const rad = (i * Math.PI) / 180;
      const rInner = 90 + Math.sin(i * 12) * 8;
      const rOuter = 240 + Math.cos(i * 8) * 6;
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(120, 53, 15, 0.6)';
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(rad) * rInner, 256 + Math.sin(rad) * rInner);
      ctx.lineTo(256 + Math.cos(rad) * rOuter, 256 + Math.sin(rad) * rOuter);
      ctx.stroke();
    }

    // Pupil core
    ctx.beginPath();
    ctx.arc(256, 256, 88, 0, Math.PI * 2);
    ctx.fillStyle = '#050505';
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    irisTextureRef.current = tex;
    return tex;
  }, []);

  // C. Sclera Texture with Episcleral Capillaries & Muscle Pads
  const scleraTextureRef = useRef<THREE.Texture | null>(null);
  const getScleraTexture = useCallback(() => {
    if (scleraTextureRef.current) return scleraTextureRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Porcelain ivory background
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(0.45, '#f1f5f9');
    grad.addColorStop(0.85, '#e2e8f0');
    grad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    // Rectus extraocular muscle insertion bands (faint pinkish-tan)
    const muscleZones = [
      [256, 35, 90, 18], // Superior rectus
      [256, 475, 90, 18], // Inferior rectus
      [35, 256, 18, 85], // Medial rectus
      [475, 256, 18, 85], // Lateral rectus
    ];
    ctx.fillStyle = 'rgba(244, 63, 94, 0.12)';
    for (const [mx, my, mw, mh] of muscleZones) {
      ctx.beginPath();
      ctx.ellipse(mx, my, mw, mh, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Episcleral fine vessels
    ctx.strokeStyle = 'rgba(225, 29, 72, 0.26)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 28; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, Math.random() * 512);
      ctx.bezierCurveTo(
        Math.random() * 512,
        Math.random() * 512,
        Math.random() * 512,
        Math.random() * 512,
        Math.random() * 512,
        Math.random() * 512
      );
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    scleraTextureRef.current = tex;
    return tex;
  }, []);

  // --------------------------------------------------------------------------
  // 2. Build WebGL Three.js Scene (Zero Rebuilds on State Changes)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();

    // Camera (Cinematic 35mm ophthalmic macro perspective)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    // Renderer (Ultra high performance WebGL, hardware antialiasing)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Master Eyeball Group
    const eyeGroup = new THREE.Group();
    scene.add(eyeGroup);

    // Textures
    const retinaTex = getRetinaTexture();
    const irisTex = getIrisTexture();
    const scleraTex = getScleraTexture();

    // ------------------------------------------------------------------------
    // Group A: Standard 3D Anatomical Globe (Full 360° Spherical Eyeball)
    // ------------------------------------------------------------------------
    const globeMeshGroup = new THREE.Group();
    eyeGroup.add(globeMeshGroup);

    // 1. Retina Interior Sphere (Posterior Chamber)
    const retinaGeo = new THREE.SphereGeometry(1.28, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.72);
    const retinaMat = new THREE.MeshStandardMaterial({
      map: retinaTex,
      roughness: 0.42,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const retinaMesh = new THREE.Mesh(retinaGeo, retinaMat);
    retinaMesh.rotation.x = Math.PI * 0.5;
    globeMeshGroup.add(retinaMesh);

    // 2. Sclera Outer Shell
    const scleraGeo = new THREE.SphereGeometry(1.3, 64, 64, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55);
    const scleraMat = new THREE.MeshStandardMaterial({
      map: scleraTex,
      roughness: 0.35,
      metalness: 0.02,
      side: THREE.FrontSide,
    });
    const scleraMesh = new THREE.Mesh(scleraGeo, scleraMat);
    scleraMesh.rotation.x = -Math.PI * 0.5;
    globeMeshGroup.add(scleraMesh);

    // 3. Iris Disc (Anterior pole)
    const irisGeo = new THREE.RingGeometry(0.01, 0.75, 48);
    const irisMat = new THREE.MeshStandardMaterial({
      map: irisTex,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    const irisMesh = new THREE.Mesh(irisGeo, irisMat);
    irisMesh.position.set(0, 0, 1.25);
    globeMeshGroup.add(irisMesh);

    // 4. Cornea Lens Dome (Anterior pole clear bulge)
    const corneaGeo = new THREE.SphereGeometry(0.78, 36, 36, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const corneaMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.45,
    });
    const corneaMesh = new THREE.Mesh(corneaGeo, corneaMat);
    corneaMesh.position.set(0, 0, 1.24);
    globeMeshGroup.add(corneaMesh);

    // 5. Optic Nerve Stump (Posterior pole)
    const nerveGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.55, 24);
    const nerveMat = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      roughness: 0.7,
      metalness: 0.05,
    });
    const nerveMesh = new THREE.Mesh(nerveGeo, nerveMat);
    nerveMesh.position.set(eye === 'OD' ? 0.38 : -0.38, -0.05, -1.35);
    nerveMesh.rotation.x = Math.PI * 0.5;
    globeMeshGroup.add(nerveMesh);

    // ------------------------------------------------------------------------
    // Group B: 3D Anatomical Cutaway Group (Revealing Sclera, Choroid, Vitreous)
    // ------------------------------------------------------------------------
    const cutawayMeshGroup = new THREE.Group();
    eyeGroup.add(cutawayMeshGroup);
    cutawayMeshGroup.visible = false; // Hidden initially

    // 1. Cutaway Sclera Shell (270° with 90° open anatomical window)
    const cutawayScleraGeo = new THREE.SphereGeometry(1.3, 48, 48, 0, Math.PI * 1.55);
    const cutawayScleraMesh = new THREE.Mesh(cutawayScleraGeo, scleraMat);
    cutawayMeshGroup.add(cutawayScleraMesh);

    // 2. Cutaway Choroid & Retina Shell (Interior lining)
    const cutawayRetinaGeo = new THREE.SphereGeometry(1.27, 48, 48, 0, Math.PI * 1.55);
    const cutawayRetinaMesh = new THREE.Mesh(cutawayRetinaGeo, retinaMat);
    cutawayMeshGroup.add(cutawayRetinaMesh);

    // 3. Cutaway Section Cut Walls (Anatomical Tissue Borders)
    const wallGeo = new THREE.RingGeometry(0.2, 1.3, 32, 1, 0, Math.PI * 0.5);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.6,
      side: THREE.DoubleSide,
    });
    const wallMesh1 = new THREE.Mesh(wallGeo, wallMat);
    cutawayMeshGroup.add(wallMesh1);

    // 4. Vitreous Humor Core (Translucent biological core)
    const vitreousGeo = new THREE.SphereGeometry(1.22, 32, 32);
    const vitreousMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
    });
    const vitreousMesh = new THREE.Mesh(vitreousGeo, vitreousMat);
    cutawayMeshGroup.add(vitreousMesh);

    // ------------------------------------------------------------------------
    // Lighting Rig (Ophthalmic Slit-Lamp & Coaxial Examination Light)
    // ------------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    dirLight.position.set(3, 4, 4);
    scene.add(dirLight);

    const ophthalmoBeam = new THREE.PointLight(0xffedd5, 3.2, 10, 1.2);
    ophthalmoBeam.position.set(0, 0, 3.6);
    scene.add(ophthalmoBeam);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    // Soft Contact Drop Shadow (Floating realistic ground plane)
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d')!;
    const sgrad = sctx.createRadialGradient(64, 64, 10, 64, 64, 62);
    sgrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
    sgrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    sgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sctx.fillStyle = sgrad;
    sctx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.set(0, -1.52, 0);
    shadowMesh.rotation.x = -Math.PI * 0.5;
    scene.add(shadowMesh);

    // Initial rotation
    eyeGroup.rotation.x = THREE.MathUtils.degToRad(dragRef.current.rotX);
    eyeGroup.rotation.y = THREE.MathUtils.degToRad(dragRef.current.rotY);

    threeRef.current = {
      scene,
      camera,
      renderer,
      eyeGroup,
      globeMeshGroup,
      cutawayMeshGroup,
      ophthalmoBeam,
      dirLight,
    };

    // ------------------------------------------------------------------------
    // 3. High-Performance 60/120 FPS Animation Loop (Direct DOM Telemetry)
    // ------------------------------------------------------------------------
    let animId = 0;
    let lastRenderTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const dt = Math.min(32, now - lastRenderTime);
      lastRenderTime = now;

      // Handle Preset Smooth Interpolation
      if (dragRef.current.isTransitioningToPreset) {
        const factor = Math.min(1, dt * 0.008);
        dragRef.current.rotX += (dragRef.current.targetRotX - dragRef.current.rotX) * factor;
        dragRef.current.rotY += (dragRef.current.targetRotY - dragRef.current.rotY) * factor;

        if (
          Math.abs(dragRef.current.targetRotX - dragRef.current.rotX) < 0.2 &&
          Math.abs(dragRef.current.targetRotY - dragRef.current.rotY) < 0.2
        ) {
          dragRef.current.rotX = dragRef.current.targetRotX;
          dragRef.current.rotY = dragRef.current.targetRotY;
          dragRef.current.isTransitioningToPreset = false;
        }
      } else if (!dragRef.current.isDown) {
        // Fluid inertia decay
        dragRef.current.rotX += dragRef.current.velX;
        dragRef.current.rotY += dragRef.current.velY;

        dragRef.current.velX *= 0.93;
        dragRef.current.velY *= 0.93;

        // Auto-rotation when idle
        if (autoRotateRef.current && Math.abs(dragRef.current.velX) < 0.01 && Math.abs(dragRef.current.velY) < 0.01) {
          dragRef.current.rotY += 0.35;
        }

        // Clamp pitch to keep fundus and cornea easily readable
        dragRef.current.rotX = Math.max(-75, Math.min(75, dragRef.current.rotX));
      }

      // Smooth zoom interpolation
      dragRef.current.zoom += (dragRef.current.targetZoom - dragRef.current.zoom) * 0.12;
      camera.position.z = 4.4 / dragRef.current.zoom;

      // Apply mode visibility
      if (threeRef.current.globeMeshGroup && threeRef.current.cutawayMeshGroup) {
        const isCutaway = viewModeRef.current === '3d-cutaway';
        threeRef.current.globeMeshGroup.visible = !isCutaway;
        threeRef.current.cutawayMeshGroup.visible = isCutaway;
      }

      // Dynamic Ophthalmoscope light beam toggle
      if (threeRef.current.ophthalmoBeam) {
        threeRef.current.ophthalmoBeam.intensity = activeLightingRef.current ? 3.2 : 0.8;
      }

      // Apply rotation to master group
      if (threeRef.current.eyeGroup) {
        threeRef.current.eyeGroup.rotation.x = THREE.MathUtils.degToRad(dragRef.current.rotX);
        threeRef.current.eyeGroup.rotation.y = THREE.MathUtils.degToRad(dragRef.current.rotY);
      }

      // Fast Direct DOM updates for telemetry (bypasses React state overhead!)
      if (telemetryDegreesRef.current) {
        const pitchVal = Math.round(dragRef.current.rotX);
        const yawVal = Math.round(((dragRef.current.rotY % 360) + 360) % 360);
        telemetryDegreesRef.current.textContent = `P: ${pitchVal > 0 ? `+${pitchVal}` : pitchVal}° | Y: ${yawVal}°`;
      }

      // Render WebGL
      renderer.render(scene, camera);
    };

    animate();
    threeRef.current.animId = animId;

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      if (nw && nh) {
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
      retinaGeo.dispose();
      scleraGeo.dispose();
      irisGeo.dispose();
      corneaGeo.dispose();
      nerveGeo.dispose();
      cutawayScleraGeo.dispose();
      cutawayRetinaGeo.dispose();
      wallGeo.dispose();
      vitreousGeo.dispose();
      shadowGeo.dispose();
    };
  }, [getRetinaTexture, getIrisTexture, getScleraTexture, eye]);

  // --------------------------------------------------------------------------
  // 4. Multi-Touch & Pointer Event Handling (Zero Lag, Instant Response)
  // --------------------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current.isDown = true;
    dragRef.current.isTransitioningToPreset = false;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    dragRef.current.lastTime = performance.now();
    dragRef.current.velX = 0;
    dragRef.current.velY = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDown) return;

    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    const now = performance.now();
    const dt = Math.max(1, now - dragRef.current.lastTime);

    // Responsive sensitivity
    const sensitivity = 0.58;
    dragRef.current.rotY += dx * sensitivity;
    dragRef.current.rotX += dy * sensitivity;
    dragRef.current.rotX = Math.max(-75, Math.min(75, dragRef.current.rotX));

    // Release velocity
    dragRef.current.velY = (dx * sensitivity * 16) / dt;
    dragRef.current.velX = (dy * sensitivity * 16) / dt;

    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    dragRef.current.lastTime = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
    dragRef.current.isDown = false;
  };

  // Pinch Zoom on Mobile & Wheel on Desktop
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.12 : 0.12;
    dragRef.current.targetZoom = Math.min(1.8, Math.max(0.65, dragRef.current.targetZoom + delta));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      dragRef.current.touchDist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && dragRef.current.touchDist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = dist - dragRef.current.touchDist;
      dragRef.current.targetZoom = Math.min(1.8, Math.max(0.65, dragRef.current.targetZoom + diff * 0.005));
      dragRef.current.touchDist = dist;
    }
  };

  // Landmark Preset Transition
  const selectPreset = (preset: LandmarkPreset) => {
    setActivePreset(preset.id);
    dragRef.current.targetRotX = preset.targetPitch;
    dragRef.current.targetRotY = preset.targetYaw;
    dragRef.current.isTransitioningToPreset = true;
    dragRef.current.velX = 0;
    dragRef.current.velY = 0;

    if (preset.id === 'cutaway') {
      setViewMode('3d-cutaway');
    } else if (viewMode === '3d-cutaway') {
      setViewMode('3d-globe');
    }
  };

  // Reset to Diagnostic Origin
  const handleReset = () => {
    selectPreset(PRESETS[0]);
    dragRef.current.targetZoom = 1.0;
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className={`relative w-full h-full select-none cursor-grab active:cursor-grabbing touch-none overflow-hidden ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* 
        Selected Element Preservation:
        img:nth-of-type(1) remains directly present as the first child image.
      */}
      <img
        ref={imgRef}
        src={imageUrl}
        id="hero-fundus-3d-image"
        alt="45-degree Non-Mydriatic Retinal Fundus View"
        className={`w-full h-full object-contain rounded-2xl select-none transition-opacity duration-300 ${
          viewMode === '3d-plate' ? 'opacity-100' : 'sr-only'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.85))',
        }}
        referrerPolicy="no-referrer"
      />

      {/* Primary Hardware-Accelerated 3D WebGL Canvas */}
      <div className="w-full h-full absolute inset-0 flex items-center justify-center pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Reticle guide overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-35">
          <RetinalReticle showReticle={true} eye={eye} />
        </div>
      </div>

      {/* TOP HUD BAR: Mode Selectors & Orientation Telemetry */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Telemetry pill with real-time degrees */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-[11px] font-mono text-slate-300 shadow-xl">
          <Compass className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="font-bold text-white uppercase tracking-wider">3D Eye Model</span>
          <span className="text-slate-600">|</span>
          <span ref={telemetryDegreesRef} className="text-emerald-400 font-semibold min-w-[90px]">
            P: -5° | Y: 15°
          </span>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* 3D Cutaway Toggle */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === '3d-cutaway' ? '3d-globe' : '3d-cutaway')}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-lg ${
              viewMode === '3d-cutaway'
                ? 'bg-rose-600 border-rose-400 text-white font-bold'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Toggle Anatomical Cross-Section Cutaway"
          >
            <Layers className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Cutaway</span>
          </button>

          {/* Ophthalmoscope Light Beam Toggle */}
          <button
            type="button"
            onClick={() => setActiveLighting(!activeLighting)}
            className={`p-1.5 rounded-lg border text-[11px] font-mono backdrop-blur-md transition-all cursor-pointer shadow-lg ${
              activeLighting
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Ophthalmoscope Clinical Light Beam"
          >
            <Lightbulb className="w-3.5 h-3.5" />
          </button>

          {/* Auto-Rotation Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`p-1.5 rounded-lg border text-[11px] font-mono backdrop-blur-md transition-all cursor-pointer shadow-lg ${
              isAutoRotating
                ? 'bg-rose-950/70 border-rose-500/50 text-rose-300'
                : 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Continuous 3D Auto-Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
          </button>

          {/* Reset Orientation */}
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 backdrop-blur-md transition-all cursor-pointer shadow-lg"
            title="Reset 3D Orientation to 45° OD Normal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK ANATOMICAL LANDMARK PRESETS (Floating Bottom Buttons) */}
      <div className="absolute bottom-16 left-3 right-3 z-30 flex items-center justify-center gap-1.5 pointer-events-auto">
        <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-2xl overflow-x-auto max-w-full">
          {PRESETS.map((preset) => {
            const isActive = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title={preset.description}
              >
                <Target className={`w-3 h-3 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* GESTURE INSTRUCTION BADGE & EDUCATIONAL DISCLAIMER */}
      <div className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none flex flex-col items-center gap-1 transition-opacity duration-300">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800/80 text-[10px] font-mono text-slate-300 shadow-xl whitespace-nowrap">
          <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Touch or drag to rotate 360° · Pinch to zoom</span>
        </div>
        <div className="text-[9px] font-mono text-slate-400 text-center px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
          Educational illustration of retinal anatomy · Not patient-specific geometry
        </div>
      </div>
    </div>
  );
};
