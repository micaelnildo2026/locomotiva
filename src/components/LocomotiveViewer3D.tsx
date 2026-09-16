import { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { LOCOMOTIVE_PARTS } from '../data/locomotiveParts';
import { LocomotivePart } from '../types';
import { 
  Box, 
  Layers, 
  Eye, 
  RotateCw, 
  Download, 
  Code, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Info, 
  CheckCircle2, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { playSteamWhistle } from '../utils/soundEffects';

interface Props {
  onOpenFreeCad: () => void;
  onSelectPart?: (part: LocomotivePart) => void;
}

export default function LocomotiveViewer3D({ onOpenFreeCad, onSelectPart }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPartId, setSelectedPartId] = useState<string>('caldeira');
  const [explodedPercent, setExplodedPercent] = useState<number>(0);
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'xray'>('solid');
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const [cameraView, setCameraView] = useState<'iso' | 'side' | 'front' | 'top'>('iso');

  // Three.js instances stored in refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshesGroupRef = useRef<THREE.Group | null>(null);
  const partsMeshesMap = useRef<Map<string, THREE.Object3D>>(new Map());
  const mouseState = useRef({ isDown: false, prevX: 0, prevY: 0, rotX: 0.35, rotY: -0.75, distance: 22 });

  const activePart = useMemo(() => {
    return LOCOMOTIVE_PARTS.find(p => p.id === selectedPartId) || LOCOMOTIVE_PARTS[0];
  }, [selectedPartId]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(renderMode === 'xray' ? 0x0f172a : 0xf1f5f9);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(16, 10, 18);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(15, 25, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const blueLight = new THREE.DirectionalLight(0x38bdf8, 0.5);
    blueLight.position.set(-15, 10, -15);
    scene.add(blueLight);

    // Ground Grid & Tracks
    const gridHelper = new THREE.GridHelper(40, 40, 0x94a3b8, 0xe2e8f0);
    gridHelper.position.y = -1.6;
    scene.add(gridHelper);

    // Rails
    const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.85, roughness: 0.25 });
    const railGeom = new THREE.BoxGeometry(0.12, 0.15, 36);
    const railLeft = new THREE.Mesh(railGeom, railMat);
    railLeft.position.set(-0.75, -1.45, 0);
    const railRight = new THREE.Mesh(railGeom, railMat);
    railRight.position.set(0.75, -1.45, 0);
    scene.add(railLeft);
    scene.add(railRight);

    // Sleepers (Dormentes)
    const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const sleeperGeom = new THREE.BoxGeometry(2.2, 0.12, 0.35);
    for (let z = -17; z <= 17; z += 1.0) {
      const sleeper = new THREE.Mesh(sleeperGeom, sleeperMat);
      sleeper.position.set(0, -1.55, z);
      scene.add(sleeper);
    }

    // Assembly Group
    const rootGroup = new THREE.Group();
    meshesGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Materials Palette
    const steelDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.35 });
    const chassisRed = new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.4, roughness: 0.4 });
    const brassGold = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const ironWheel = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.75, roughness: 0.3 });
    const cabGreen = new THREE.MeshStandardMaterial({ color: 0x064e3b, metalness: 0.3, roughness: 0.45 });
    const tenderMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5, roughness: 0.4 });

    partsMeshesMap.current.clear();

    // 1. CALDEIRA (Boiler)
    const boilerGroup = new THREE.Group();
    boilerGroup.userData = { id: 'caldeira' };
    const boilerCyl = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 6.2, 32), steelDark);
    boilerCyl.rotation.x = Math.PI / 2;
    boilerCyl.position.set(0, 0.8, 0.4);
    boilerCyl.castShadow = true;
    boilerGroup.add(boilerCyl);

    // Steam dome & Sand dome
    const dome1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 0.6, 20), brassGold);
    dome1.position.set(0, 2.1, 0.8);
    const dome2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 0.5, 20), brassGold);
    dome2.position.set(0, 2.05, -0.8);
    boilerGroup.add(dome1);
    boilerGroup.add(dome2);

    // Firebox
    const firebox = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.0, 1.8), steelDark);
    firebox.position.set(0, 0.5, -2.5);
    boilerGroup.add(firebox);

    rootGroup.add(boilerGroup);
    partsMeshesMap.current.set('caldeira', boilerGroup);

    // 2. CHASSI (Chassis & Frame)
    const chassisGroup = new THREE.Group();
    chassisGroup.userData = { id: 'chassis_longarinas' };
    const frameBeamLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 9.8), chassisRed);
    frameBeamLeft.position.set(-0.65, -0.3, 0);
    const frameBeamRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 9.8), chassisRed);
    frameBeamRight.position.set(0.65, -0.3, 0);
    chassisGroup.add(frameBeamLeft);
    chassisGroup.add(frameBeamRight);

    // Cowcatcher (limpa-trilhos dianteiro)
    const cowcatcherGeom = new THREE.ConeGeometry(1.1, 1.0, 4);
    const cowcatcher = new THREE.Mesh(cowcatcherGeom, chassisRed);
    cowcatcher.rotation.x = -Math.PI / 2;
    cowcatcher.position.set(0, -0.8, 5.0);
    chassisGroup.add(cowcatcher);

    rootGroup.add(chassisGroup);
    partsMeshesMap.current.set('chassis_longarinas', chassisGroup);

    // 3. RODEIROS (Wheels & Axles)
    const wheelsGroup = new THREE.Group();
    wheelsGroup.userData = { id: 'rodeiros_eixos' };

    const wheelRadius = 0.95;
    const wheelZPositions = [-1.4, 0.4, 2.2];

    wheelZPositions.forEach((zPos) => {
      // Axle
      const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.7, 16), steelDark);
      axle.rotation.z = Math.PI / 2;
      axle.position.set(0, -0.5, zPos);
      wheelsGroup.add(axle);

      // Left & Right Wheels
      [-0.78, 0.78].forEach((xSide) => {
        const wheel = new THREE.Mesh(new THREE.CylinderGeometry(wheelRadius, wheelRadius, 0.12, 28), ironWheel);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(xSide, -0.5, zPos);
        wheel.castShadow = true;

        // Counterweight
        const counterweight = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.45, 0.55), steelDark);
        counterweight.position.set(xSide * 1.02, -0.25, zPos + 0.25);
        wheelsGroup.add(wheel);
        wheelsGroup.add(counterweight);
      });
    });

    rootGroup.add(wheelsGroup);
    partsMeshesMap.current.set('rodeiros_eixos', wheelsGroup);

    // 4. BIELA & CILINDROS (Walschaerts Valve Gear)
    const gearGroup = new THREE.Group();
    gearGroup.userData = { id: 'biela_walschaerts' };

    // Cylinders
    [-1.05, 1.05].forEach((xSide) => {
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.3, 20), steelDark);
      cyl.rotation.x = Math.PI / 2;
      cyl.position.set(xSide, -0.4, 3.8);
      gearGroup.add(cyl);

      // Main driving rod
      const rod = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 2.9), brassGold);
      rod.position.set(xSide * 1.02, -0.42, 1.8);
      gearGroup.add(rod);

      // Valve gear links
      const link = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, 0.08), brassGold);
      link.position.set(xSide * 1.03, -0.2, 0.8);
      gearGroup.add(link);
    });

    rootGroup.add(gearGroup);
    partsMeshesMap.current.set('biela_walschaerts', gearGroup);

    // 5. CABINE (Driver Cab)
    const cabGroup = new THREE.Group();
    cabGroup.userData = { id: 'cabine_comando' };
    const cabBody = new THREE.Mesh(new THREE.BoxGeometry(2.3, 2.3, 1.9), cabGreen);
    cabBody.position.set(0, 1.2, -3.2);
    cabBody.castShadow = true;
    cabGroup.add(cabBody);

    // Cab Roof Curve
    const roofGeom = new THREE.CylinderGeometry(1.25, 1.25, 2.0, 24, 1, false, 0, Math.PI);
    const cabRoof = new THREE.Mesh(roofGeom, steelDark);
    cabRoof.rotation.z = Math.PI / 2;
    cabRoof.position.set(0, 2.35, -3.2);
    cabGroup.add(cabRoof);

    // Windows
    const windowMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, roughness: 0.1, metalness: 0.9, opacity: 0.8, transparent: true });
    const winLeft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.9), windowMat);
    winLeft.position.set(-1.16, 1.4, -3.2);
    const winRight = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.7, 0.9), windowMat);
    winRight.position.set(1.16, 1.4, -3.2);
    cabGroup.add(winLeft);
    cabGroup.add(winRight);

    rootGroup.add(cabGroup);
    partsMeshesMap.current.set('cabine_comando', cabGroup);

    // 6. CHAMINÉ & CAIXA DE FUMAÇA (Chimney & Headlight)
    const chimneyGroup = new THREE.Group();
    chimneyGroup.userData = { id: 'chamine_exaustor' };

    // Smokebox Front Cap
    const frontCap = new THREE.Mesh(new THREE.SphereGeometry(1.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), steelDark);
    frontCap.rotation.x = -Math.PI / 2;
    frontCap.position.set(0, 0.8, 3.5);
    chimneyGroup.add(frontCap);

    // Chimney Stack
    const chimneyCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 1.1, 24), steelDark);
    chimneyCyl.position.set(0, 2.35, 2.9);
    const chimneyLip = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.06, 12, 24), brassGold);
    chimneyLip.rotation.x = Math.PI / 2;
    chimneyLip.position.set(0, 2.9, 2.9);
    chimneyGroup.add(chimneyCyl);
    chimneyGroup.add(chimneyLip);

    // Headlight (Farol de milha)
    const headlight = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.45, 20), brassGold);
    headlight.rotation.x = Math.PI / 2;
    headlight.position.set(0, 1.1, 4.3);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.28, 20), new THREE.MeshBasicMaterial({ color: 0xfef08a }));
    lens.position.set(0, 1.1, 4.53);
    chimneyGroup.add(headlight);
    chimneyGroup.add(lens);

    rootGroup.add(chimneyGroup);
    partsMeshesMap.current.set('chamine_exaustor', chimneyGroup);

    // 7. FREIOS WESTINGHOUSE (Brake reservoirs & piping)
    const brakeGroup = new THREE.Group();
    brakeGroup.userData = { id: 'freios_westinghouse' };
    const tank1 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2.2, 16), steelDark);
    tank1.rotation.x = Math.PI / 2;
    tank1.position.set(-0.95, 0.1, -1.2);
    const tank2 = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 2.2, 16), steelDark);
    tank2.rotation.x = Math.PI / 2;
    tank2.position.set(0.95, 0.1, -1.2);
    brakeGroup.add(tank1);
    brakeGroup.add(tank2);

    rootGroup.add(brakeGroup);
    partsMeshesMap.current.set('freios_westinghouse', brakeGroup);

    // 8. TENDER (Coal / Water tender wagon)
    const tenderGroup = new THREE.Group();
    tenderGroup.userData = { id: 'tender_suprimentos' };
    const tenderBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 4.8), tenderMat);
    tenderBody.position.set(0, 0.7, -6.8);
    tenderBody.castShadow = true;
    tenderGroup.add(tenderBody);

    // Coal mound
    const coal = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.95 }));
    coal.scale.set(1.2, 0.6, 1.8);
    coal.position.set(0, 1.6, -6.2);
    tenderGroup.add(coal);

    // Tender wheels
    [-5.4, -7.8].forEach(zPos => {
      [-0.8, 0.8].forEach(xSide => {
        const tWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 20), ironWheel);
        tWheel.rotation.z = Math.PI / 2;
        tWheel.position.set(xSide, -0.85, zPos);
        tenderGroup.add(tWheel);
      });
    });

    rootGroup.add(tenderGroup);
    partsMeshesMap.current.set('tender_suprimentos', tenderGroup);

    // Interaction / Raycasting for Part Selection
    const raycaster = new THREE.Raycaster();
    const mousePos = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      mouseState.current.isDown = true;
      mouseState.current.prevX = e.clientX;
      mouseState.current.prevY = e.clientY;

      // Check click raycast
      const rect = container.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mousePos, camera);

      const intersects = raycaster.intersectObjects(rootGroup.children, true);
      if (intersects.length > 0) {
        let hitObj: THREE.Object3D | null = intersects[0].object;
        while (hitObj && hitObj.parent !== rootGroup) {
          hitObj = hitObj.parent;
        }
        if (hitObj && hitObj.userData && hitObj.userData.id) {
          const clickedId = hitObj.userData.id;
          setSelectedPartId(clickedId);
          const foundPart = LOCOMOTIVE_PARTS.find(p => p.id === clickedId);
          if (foundPart && onSelectPart) {
            onSelectPart(foundPart);
          }
        }
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!mouseState.current.isDown) return;
      const deltaX = e.clientX - mouseState.current.prevX;
      const deltaY = e.clientY - mouseState.current.prevY;
      mouseState.current.prevX = e.clientX;
      mouseState.current.prevY = e.clientY;

      mouseState.current.rotY += deltaX * 0.008;
      mouseState.current.rotX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, mouseState.current.rotX + deltaY * 0.008));
    };

    const handlePointerUp = () => {
      mouseState.current.isDown = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      mouseState.current.distance = Math.max(8, Math.min(45, mouseState.current.distance + e.deltaY * 0.03));
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating) {
        mouseState.current.rotY += 0.005;
      }

      // Camera positioning based on spherical coordinates
      const dist = mouseState.current.distance;
      const rx = mouseState.current.rotX;
      const ry = mouseState.current.rotY;

      camera.position.x = dist * Math.cos(rx) * Math.sin(ry);
      camera.position.y = Math.max(-0.5, dist * Math.sin(rx) + 2);
      camera.position.z = dist * Math.cos(rx) * Math.cos(ry);
      camera.lookAt(0, 0.8, -0.5);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      renderer.dispose();
    };
  }, [renderMode, isRotating]);

  // Update exploded view positions smoothly
  useEffect(() => {
    const factor = explodedPercent / 100;
    LOCOMOTIVE_PARTS.forEach((part) => {
      const obj = partsMeshesMap.current.get(part.id);
      if (obj) {
        const offset = part.explodedOffset;
        obj.position.set(offset[0] * factor, offset[1] * factor, offset[2] * factor);
      }
    });
  }, [explodedPercent]);

  // Camera presets
  const handleSetView = (view: 'iso' | 'side' | 'front' | 'top') => {
    setCameraView(view);
    if (view === 'iso') {
      mouseState.current.rotX = 0.35;
      mouseState.current.rotY = -0.75;
      mouseState.current.distance = 22;
    } else if (view === 'side') {
      mouseState.current.rotX = 0.05;
      mouseState.current.rotY = Math.PI / 2;
      mouseState.current.distance = 18;
    } else if (view === 'front') {
      mouseState.current.rotX = 0.1;
      mouseState.current.rotY = 0;
      mouseState.current.distance = 16;
    } else if (view === 'top') {
      mouseState.current.rotX = Math.PI / 2.1;
      mouseState.current.rotY = 0;
      mouseState.current.distance = 24;
    }
  };

  const handleSelectPartClick = (part: LocomotivePart) => {
    setSelectedPartId(part.id);
    if (onSelectPart) onSelectPart(part);
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6">
      {/* 3D Canvas Card */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-sm">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Modelo 3D Paramétrico da Locomotiva
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  CAD / FreeCAD
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Padrão Estrada de Ferro Santa Catarina (Bitola 1.000 mm • 2-6-2)
              </div>
            </div>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-medium text-slate-700">
            <button
              onClick={() => handleSetView('iso')}
              className={`px-2.5 py-1 rounded-lg transition ${cameraView === 'iso' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:bg-slate-300/60'}`}
            >
              Isométrica
            </button>
            <button
              onClick={() => handleSetView('side')}
              className={`px-2.5 py-1 rounded-lg transition ${cameraView === 'side' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:bg-slate-300/60'}`}
            >
              Lateral
            </button>
            <button
              onClick={() => handleSetView('front')}
              className={`px-2.5 py-1 rounded-lg transition ${cameraView === 'front' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:bg-slate-300/60'}`}
            >
              Frontal
            </button>
            <button
              onClick={() => handleSetView('top')}
              className={`px-2.5 py-1 rounded-lg transition ${cameraView === 'top' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:bg-slate-300/60'}`}
            >
              Superior
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => playSteamWhistle()}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              title="Apito a Vapor"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Apito
            </button>
            <button
              onClick={() => setIsRotating(!isRotating)}
              className={`p-2 rounded-xl border text-xs font-medium transition ${isRotating ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              title="Giro Automático"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenFreeCad}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Code className="w-3.5 h-3.5 text-amber-400" />
              Script FreeCAD Python
            </button>
          </div>
        </div>

        {/* 3D Canvas Stage */}
        <div className="relative w-full h-[460px] bg-gradient-to-b from-slate-100 to-slate-200 cursor-grab active:cursor-grabbing">
          <div ref={containerRef} className="w-full h-full" />

          {/* Canvas Floating Controls */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Clique em qualquer peça para inspecionar
            </div>
            <div className="text-slate-500 text-[11px]">
              Arraste para rotacionar • Rolar para zoom
            </div>
          </div>

          {/* Exploded View Slider Overlay */}
          <div className="absolute bottom-4 left-4 right-4 max-w-md mx-auto bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-200 shadow-md flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 whitespace-nowrap">
              <Layers className="w-4 h-4 text-indigo-600" />
              Vista Explodida CAD:
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={explodedPercent}
              onChange={(e) => setExplodedPercent(Number(e.target.value))}
              className="flex-1 accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <span className="text-xs font-mono font-bold text-indigo-600 min-w-9 text-right">
              {explodedPercent}%
            </span>
          </div>
        </div>

        {/* Bottom Parts Badges */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap px-1">
            Componentes:
          </span>
          {LOCOMOTIVE_PARTS.map((part) => {
            const isSel = part.id === selectedPartId;
            return (
              <button
                key={part.id}
                onClick={() => handleSelectPartClick(part)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSel
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {isSel && <CheckCircle2 className="w-3.5 h-3.5" />}
                {part.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Engineering Inspector Sidebar */}
      <div className="w-full xl:w-96 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {activePart.category.toUpperCase()}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {activePart.name}
              </h3>
              <p className="text-xs font-mono text-slate-500">
                {activePart.technicalName}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                ★ {activePart.importanceRating}/5 Crítico
              </span>
            </div>
          </div>

          {/* Technical Image */}
          {activePart.imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900">
              <img
                src={activePart.imageUrl}
                alt={activePart.imageAlt || activePart.name}
                className="w-full h-40 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 text-[10px] text-white font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs">
                {activePart.materials.split(',')[0]}
              </div>
            </div>
          )}

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div>
              <span className="font-semibold text-slate-900 block mb-1">
                Função na Locomotiva:
              </span>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {activePart.description}
              </p>
            </div>

            <div>
              <span className="font-semibold text-slate-900 block mb-1">
                Princípio Físico / Termodinâmico:
              </span>
              <p className="text-slate-600 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/60">
                {activePart.engineeringPrinciples}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Dimensões de Projeto:
                </span>
                <span className="font-mono text-xs font-medium text-slate-800">
                  {activePart.dimensions}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">
                  Materiais e Metalurgia:
                </span>
                <span className="text-xs text-slate-800">
                  {activePart.materials}
                </span>
              </div>

              <div className="bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                <span className="text-[11px] font-bold text-amber-800 uppercase block">
                  Bancada FreeCAD Recomendada:
                </span>
                <span className="font-mono text-xs font-semibold text-amber-950">
                  {activePart.freecadWorkbench}
                </span>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  Operação: {activePart.freecadOperation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inspector Footer CTA */}
        <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
          <button
            onClick={onOpenFreeCad}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Gerar Macro no FreeCAD (.py)
          </button>
        </div>
      </div>
    </div>
  );
}
