import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  Camera, 
  Maximize2, 
  CheckCircle2, 
  Sparkles, 
  User, 
  Award, 
  Navigation,
  Keyboard,
  Smartphone,
  ShieldCheck,
  Bell,
  Gamepad2,
  Info,
  CircleDot,
  Droplets,
  Leaf,
  BookOpen,
  Cog,
  Wrench,
  Zap,
  Layers,
  ChevronRight,
  ChevronLeft,
  Eye,
  ZoomIn,
  Flame,
  Check,
  Lock,
  HeartPulse
} from 'lucide-react';
import { playSteamWhistle, playBrakeHiss, playSteamChuff, playStationBell } from '../utils/soundEffects';
import { JOINVILLE_STATIONS, CLEAN_STEAM_TECHNOLOGY } from '../data/joinvilleProject';
import { LOCOMOTIVE_PARTS } from '../data/locomotiveParts';
import { LocomotivePart } from '../types';
import { CHARACTERS, MISSIONS_LIST } from '../data/characters';
import confetti from 'canvas-confetti';

interface Props {
  onOpenDialog?: (charId: string) => void;
}

export default function PlayableWebGame3D({ onOpenDialog }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [trackProgress, setTrackProgress] = useState<number>(0.05); // 0 to 1
  const [cameraMode, setCameraMode] = useState<'chase' | 'cab' | 'side' | 'station'>('chase');
  const [throttle, setThrottle] = useState<number>(30); // 0 to 100
  const [brakeApplied, setBrakeApplied] = useState<boolean>(false);
  const [currentStationIdx, setCurrentStationIdx] = useState<number>(0);
  const [stationAlignmentFeedback, setStationAlignmentFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number>(1200);
  const [currentDialogBanner, setCurrentDialogBanner] = useState<{ name: string; text: string; avatarColor: string } | null>({
    name: 'Dona Helena',
    text: 'Que passeio gostoso! O trem está suave. Continue assim até a Estação Central!',
    avatarColor: '#ea580c'
  });

  // Locomotive Anatomy & Real-Time Educational Explanations
  const [discoveredParts, setDiscoveredParts] = useState<string[]>(['regulador_cupula']);
  const [activeInspectedPart, setActiveInspectedPart] = useState<LocomotivePart | null>(null);
  const [showLocomotiveGuideModal, setShowLocomotiveGuideModal] = useState<boolean>(false);
  const [showCleanSteamModal, setShowCleanSteamModal] = useState<boolean>(false);
  const [showRoutePartsDrawer, setShowRoutePartsDrawer] = useState<boolean>(true);
  const [livePartAlert, setLivePartAlert] = useState<{
    part: LocomotivePart;
    message: string;
    actionTrigger: string;
  } | null>(null);

  const discoveredPartsRef = useRef<string[]>(['regulador_cupula']);

  // Gamepad State (PS4 DualShock 4 & PS5 DualSense)
  const [isGamepadConnected, setIsGamepadConnected] = useState<boolean>(false);
  const [gamepadName, setGamepadName] = useState<string>('Nenhum controle detectado');
  const [showGamepadGuide, setShowGamepadGuide] = useState<boolean>(false);
  const [activeGamepadButtons, setActiveGamepadButtons] = useState<{ [btn: string]: boolean }>({});

  // Refs for animation & input
  const gameLoopRef = useRef<number | null>(null);
  const prevGamepadButtonsRef = useRef<{ [btnIdx: number]: boolean }>({});
  const touchBrakeRef = useRef<boolean>(false);
  const keyboardBrakeRef = useRef<boolean>(false);

  const stateRef = useRef({
    speed: 0,
    progress: 0.05,
    throttle: 30,
    brake: false,
    chuffTimer: 0
  });

  const handleRestart = () => {
    stateRef.current.speed = 0;
    stateRef.current.progress = 0.05;
    stateRef.current.throttle = 30;
    stateRef.current.brake = false;
    stateRef.current.chuffTimer = 0;
    setSpeedKmh(0);
    setTrackProgress(0.05);
    setThrottle(30);
    setBrakeApplied(false);
    setCurrentStationIdx(0);
    setStationAlignmentFeedback(null);
    setLivePartAlert(null);
    setCurrentDialogBanner({
      name: 'Dona Helena',
      text: 'Viagem reiniciada! Partindo da Estação Central de Joinville com regulador suave.',
      avatarColor: '#ea580c'
    });
    playStationBell();
  };

  const handleRestartRef = useRef(handleRestart);
  handleRestartRef.current = handleRestart;

  // Keep stateRef in sync with React state
  useEffect(() => {
    stateRef.current.throttle = throttle;
    stateRef.current.brake = brakeApplied;
  }, [throttle, brakeApplied]);

  // Trigger resize when fullscreen changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // Gamepad Event Listeners
  useEffect(() => {
    const handleGamepadConnected = (e: GamepadEvent) => {
      setIsGamepadConnected(true);
      const name = getCleanGamepadName(e.gamepad.id);
      setGamepadName(name);
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.8 } });
    };

    const handleGamepadDisconnected = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const anyRemaining = Array.from(gamepads).some(g => g !== null && g.connected);
      if (!anyRemaining) {
        setIsGamepadConnected(false);
        setGamepadName('Nenhum controle detectado');
      }
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, []);

  function getCleanGamepadName(rawId: string): string {
    const lower = rawId.toLowerCase();
    if (lower.includes('dualsense') || lower.includes('054c:0ce6') || lower.includes('wireless controller')) {
      return 'PlayStation 5 (DualSense)';
    }
    if (lower.includes('dualshock') || lower.includes('054c:05c4') || lower.includes('sony')) {
      return 'PlayStation 4 (DualShock 4)';
    }
    if (lower.includes('xbox')) {
      return 'Controle Xbox / PC';
    }
    return 'Controle Gamepad Padrão (PS4/PS5 Mapeado)';
  }

  function triggerGamepadVibrate(gp: Gamepad, duration = 120, weak = 0.4, strong = 0.5) {
    try {
      if ('vibrationActuator' in gp && (gp as any).vibrationActuator) {
        (gp as any).vibrationActuator.playEffect('dual-rumble', {
          startDelay: 0,
          duration,
          weakMagnitude: weak,
          strongMagnitude: strong
        });
      }
    } catch {
      // Ignore vibration error
    }
  }

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbae6fd); // Sky blue
    scene.fog = new THREE.FogExp2(0xe0f2fe, 0.008);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 5, 15);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.replaceChildren(renderer.domElement);

    // 4. Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.7);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.2);
    sunLight.position.set(50, 80, 40);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // 5. Procedural Track Spline (Curving through Joinville)
    const curvePoints: THREE.Vector3[] = [];
    const totalSegments = 100;
    for (let i = 0; i <= totalSegments; i++) {
      const z = (i / totalSegments) * 1200 - 600;
      const x = Math.sin(i * 0.08) * 35 + Math.cos(i * 0.04) * 20;
      const y = Math.sin(i * 0.05) * 2.5;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const trackCurve = new THREE.CatmullRomCurve3(curvePoints);

    // Ground plane
    const groundGeom = new THREE.PlaneGeometry(1600, 1600);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    scene.add(ground);

    // Mountain silhouettes in background (Serra do Mar / Dona Francisca)
    for (let m = 0; m < 12; m++) {
      const mGeom = new THREE.ConeGeometry(60 + Math.random() * 40, 70 + Math.random() * 50, 5);
      const mMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.95 });
      const mountain = new THREE.Mesh(mGeom, mMat);
      const angle = (m / 12) * Math.PI * 2;
      mountain.position.set(Math.cos(angle) * 550, 20, Math.sin(angle) * 550);
      scene.add(mountain);
    }

    // 6. Rail Track Mesh along curve
    const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8, roughness: 0.3 });
    const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 });

    // Generate Sleepers along track
    const sleeperSpacing = 0.002;
    for (let t = 0; t <= 1; t += sleeperSpacing) {
      const pt = trackCurve.getPointAt(t);
      const tangent = trackCurve.getTangentAt(t);

      const sleeper = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.45), sleeperMat);
      sleeper.position.copy(pt);
      sleeper.position.y -= 0.1;
      sleeper.lookAt(pt.clone().add(tangent));
      sleeper.rotateY(Math.PI / 2);
      scene.add(sleeper);
    }

    // Two parallel rails
    const railGeometry = new THREE.TubeGeometry(trackCurve, 300, 0.08, 6, false);
    const railMeshLeft = new THREE.Mesh(railGeometry, railMat);
    railMeshLeft.position.x -= 0.75;
    const railMeshRight = new THREE.Mesh(railGeometry, railMat);
    railMeshRight.position.x += 0.75;
    scene.add(railMeshLeft);
    scene.add(railMeshRight);

    // 7. Joinville Scenery: Accessible Station Platforms along track
    const stationPositions = [0.08, 0.28, 0.52, 0.76, 0.94];
    const stationMeshes: THREE.Group[] = [];

    stationPositions.forEach((stT, idx) => {
      const stPt = trackCurve.getPointAt(stT);
      const stTangent = trackCurve.getTangentAt(stT);

      const stGroup = new THREE.Group();
      stGroup.position.copy(stPt);
      stGroup.lookAt(stPt.clone().add(stTangent));

      // Raised Platform (NBR 9050 Level Boarding)
      // Largura da plataforma: 4.6m, posicionada em X = 4.4, com borda segura em X = 2.1m
      // Garante distância ideal de embarque em nível sem qualquer colisão com os cilindros ou rodas da locomotiva
      const platGeom = new THREE.BoxGeometry(4.6, 0.9, 36);
      const platMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7 });
      const platform = new THREE.Mesh(platGeom, platMat);
      platform.position.set(4.4, 0.45, 0);
      stGroup.add(platform);

      // Tactile Paving Strip (Piso Podotátil de Alerta Amarelo NBR 9050)
      const tactileGeom = new THREE.BoxGeometry(0.35, 0.02, 36);
      const tactileMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.5 });
      const tactile = new THREE.Mesh(tactileGeom, tactileMat);
      tactile.position.set(2.45, 0.91, 0);
      stGroup.add(tactile);

      // Edifício Histórico da Estação de Joinville (Alvenaria e Estilo Arquitetônico Ferroviário)
      const buildingMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.8 }); // Terracota / Tijolos
      const stationBuilding = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.8, 28), buildingMat);
      stationBuilding.position.set(8.5, 2.4, 0);
      stGroup.add(stationBuilding);

      // Telhado Germânico Colonial do Edifício de Passageiros
      const bRoofMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 });
      const bRoof = new THREE.Mesh(new THREE.ConeGeometry(3.0, 1.8, 4), bRoofMat);
      bRoof.rotation.y = Math.PI / 4;
      bRoof.scale.set(1.4, 1.0, 7.2);
      bRoof.position.set(8.5, 5.6, 0);
      stGroup.add(bRoof);

      // Portas e Acessos Arqueados para Passageiros
      [-8, 0, 8].forEach(wz => {
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.4, 1.8), new THREE.MeshStandardMaterial({ color: 0x451a03 }));
        door.position.set(6.65, 1.2, wz);
        stGroup.add(door);
      });

      // TELHADO DA GARE / COBERTURA DA PLATAFORMA (Gabarito Ferroviário Elevado)
      // Altura livre total: o telhado é posicionado em Y = 6.0m até 6.8m!
      // A locomotiva possui altura máxima de 4.25m, deixando mais de 1.75m de vão livre
      // A locomotiva jamais corta ou passa através do telhado da estação!
      const canopyMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.25,
        roughness: 0.2,
        transparent: true,
        opacity: 0.8
      });
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.18, 34), canopyMat);
      canopy.position.set(4.6, 6.0, 0);
      canopy.rotation.z = -0.06; // Leve caimento para escoamento pluvial
      stGroup.add(canopy);

      // Cumeeira metálica de proteção da marquise
      const canopyRidge = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.25, 34),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 })
      );
      canopyRidge.position.set(2.3, 6.15, 0);
      stGroup.add(canopyRidge);

      // Pilares e Tesouras Metálicas Estruturais (Gabarito Ferroviário Livre)
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.3 });
      for (let pz = -14; pz <= 14; pz += 7) {
        // Pilar vertical recuado com segurança na plataforma
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 5.2, 12), pillarMat);
        pillar.position.set(5.5, 3.5, pz);
        stGroup.add(pillar);

        // Viga horizontal de suporte estrutural sob a marquise (Y = 5.9m)
        const trussBeam = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.12, 0.12), pillarMat);
        trussBeam.position.set(4.0, 5.9, pz);
        stGroup.add(trussBeam);

        // Mão-francesa de reforço estrutural
        const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8), pillarMat);
        brace.rotation.z = Math.PI / 4;
        brace.position.set(4.7, 5.3, pz);
        stGroup.add(brace);
      }

      // Placa de Identificação da Estação (Fixada em altura segura com vão livre completo)
      const signMesh = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, 5.2), new THREE.MeshStandardMaterial({ color: 0x0f172a }));
      signMesh.position.set(3.8, 4.4, 0);
      stGroup.add(signMesh);

      const signBorder = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 0.95, 5.3),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.4 })
      );
      signBorder.position.set(3.78, 4.4, 0);
      stGroup.add(signBorder);

      // 3D PASSENGERS ON PLATFORM:
      // 1. Lucas (PCD Wheelchair User) at the level boarding position
      const wcGroup = new THREE.Group();
      wcGroup.position.set(3.2, 0.91, 3.5);
      wcGroup.rotation.y = -Math.PI / 2; // Facing the train
      [-0.28, 0.28].forEach(wx => {
        const wheel = new THREE.Mesh(
          new THREE.TorusGeometry(0.3, 0.03, 6, 12),
          new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8 })
        );
        wheel.rotation.y = Math.PI / 2;
        wheel.position.set(wx, 0.32, 0);
        wcGroup.add(wheel);
      });
      const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.06, 0.45), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      seatMesh.position.set(0, 0.32, 0.05);
      const wcTorso = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.42, 0.2), new THREE.MeshStandardMaterial({ color: 0x2563eb }));
      wcTorso.position.set(0, 0.58, -0.05);
      const wcHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfbcfe8 }));
      wcHead.position.set(0, 0.88, -0.05);
      wcGroup.add(seatMesh, wcTorso, wcHead);
      stGroup.add(wcGroup);

      // 2. Dona Helena (Senior Passenger with walking cane)
      const seniorGroup = new THREE.Group();
      seniorGroup.position.set(4.0, 0.91, -3.5);
      const sTorso = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.5, 0.2), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
      sTorso.position.y = 0.95;
      const sHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfbcfe8 }));
      sHead.position.y = 1.3;
      const cane = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.85), new THREE.MeshStandardMaterial({ color: 0x78350f }));
      cane.position.set(0.24, 0.42, 0.1);
      seniorGroup.add(sTorso, sHead, cane);
      stGroup.add(seniorGroup);

      // 3. Mateus (Young Student with backpack)
      const studentGroup = new THREE.Group();
      studentGroup.position.set(3.8, 0.91, 7.5);
      const stTorso = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.52, 0.2), new THREE.MeshStandardMaterial({ color: 0x10b981 }));
      stTorso.position.y = 0.95;
      const stHead = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshStandardMaterial({ color: 0xfbcfe8 }));
      stHead.position.y = 1.32;
      const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.36, 0.16), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
      backpack.position.set(0, 0.96, -0.16);
      studentGroup.add(stTorso, stHead, backpack);
      stGroup.add(studentGroup);

      // 4. Station Wooden Bench with middle armrests
      const bench = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.4, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xb45309 })
      );
      bench.position.set(5.2, 0.91 + 0.2, -6.0);
      stGroup.add(bench);

      scene.add(stGroup);
      stationMeshes.push(stGroup);
    });

    // Trees and Streetlights along route
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    for (let t = 0.02; t < 0.98; t += 0.015) {
      const pt = trackCurve.getPointAt(t);
      const side = Math.random() > 0.5 ? 8 : -8;
      const treeGroup = new THREE.Group();
      treeGroup.position.set(pt.x + side + (Math.random() * 4 - 2), pt.y, pt.z + (Math.random() * 4 - 2));

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 3.0), trunkMat);
      trunk.position.y = 1.5;
      const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), treeMat);
      foliage.position.y = 3.6;

      treeGroup.add(trunk);
      treeGroup.add(foliage);
      scene.add(treeGroup);
    }

    // 8. 3D LOCOMOTIVE MESH (Train Actor with Detailed Anatomy)
    const trainGroup = new THREE.Group();

    // 1. Caldeira Cilíndrica Eco-Vapor
    const trainBody = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 5.8, 24),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.65, roughness: 0.35 })
    );
    trainBody.rotation.x = Math.PI / 2;
    trainBody.position.set(0, 1.6, 0);
    trainBody.userData = { partId: 'caldeira' };
    trainGroup.add(trainBody);

    // Decorative Brass Boiler Rings (Cintas estruturais de fixação da caldeira)
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9, roughness: 0.2 });
    [-1.8, -0.6, 0.6, 1.8].forEach(zPos => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.03, 8, 24), ringMat);
      ring.position.set(0, 1.6, zPos);
      ring.userData = { partId: 'caldeira' };
      trainGroup.add(ring);
    });

    // 2. Cúpula de Vapor e Válvula Reguladora (Steam Dome - brass)
    const steamDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 })
    );
    steamDome.position.set(0, 2.65, 0.4);
    steamDome.userData = { partId: 'regulador_cupula' };
    trainGroup.add(steamDome);

    // 3. Cúpula de Areia (Sand Dome - brass)
    const sandDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.8, roughness: 0.25 })
    );
    sandDome.position.set(0, 2.62, -0.9);
    sandDome.userData = { partId: 'caldeira' };
    trainGroup.add(sandDome);

    // 4. Cabine de Comando do Maquinista
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 2.2, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.5 })
    );
    cab.position.set(0, 1.9, -2.4);
    cab.userData = { partId: 'cabine_comando' };
    trainGroup.add(cab);

    // Cab Roof Curved Arc
    const cabRoof = new THREE.Mesh(
      new THREE.CylinderGeometry(1.25, 1.25, 2.3, 16, 1, false, 0, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0x044e39, roughness: 0.6 })
    );
    cabRoof.rotation.z = Math.PI / 2;
    cabRoof.position.set(0, 3.0, -2.4);
    cabRoof.userData = { partId: 'cabine_comando' };
    trainGroup.add(cabRoof);

    // 5. Apito a Vapor Bitonal (atop cab)
    const whistle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.95, roughness: 0.1 })
    );
    whistle.position.set(0.45, 3.25, -1.8);
    whistle.userData = { partId: 'apito_vapor' };
    trainGroup.add(whistle);

    // 6. Chaminé Eco-Vapor e Ejetor de Tiragem
    const chimney = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.24, 1.05, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
    );
    chimney.position.set(0, 2.85, 2.2);
    chimney.userData = { partId: 'chamine_exaustor' };
    trainGroup.add(chimney);

    // Chimney Brass Lip
    const chimneyLip = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.04, 8, 16), ringMat);
    chimneyLip.rotation.x = Math.PI / 2;
    chimneyLip.position.set(0, 3.38, 2.2);
    chimneyLip.userData = { partId: 'chamine_exaustor' };
    trainGroup.add(chimneyLip);

    // Headlight (Farol Central)
    const headlight = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    headlight.position.set(0, 1.7, 3.05);
    trainGroup.add(headlight);

    // 7. Cilindros de Dupla Ação e Pistões (ambos os lados dianteiros)
    const cylinderMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const pistonCoverMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });
    [-1.25, 1.25].forEach(cX => {
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 1.1, 16), cylinderMat);
      cyl.rotation.x = Math.PI / 2;
      cyl.position.set(cX, 0.72, 2.0);
      cyl.userData = { partId: 'cilindros' };
      trainGroup.add(cyl);

      const pistonCover = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.1, 16), pistonCoverMat);
      pistonCover.rotation.x = Math.PI / 2;
      pistonCover.position.set(cX, 0.72, 2.58);
      pistonCover.userData = { partId: 'cilindros' };
      trainGroup.add(pistonCover);
    });

    // 8. Rodas Motrizes e Bielas (Walschaerts Linkage)
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.85, roughness: 0.2 });
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.9, roughness: 0.2 });

    [-1.2, 0.2, 1.6].forEach((wZ) => {
      [-0.8, 0.8].forEach((wX) => {
        const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.12, 16), wheelMat);
        wh.rotation.z = Math.PI / 2;
        wh.position.set(wX, 0.65, wZ);
        wh.userData = { partId: 'rodeiros_eixos' };
        trainGroup.add(wh);
      });
    });

    // Connecting Side Rods (Bielas de acoplamento laterais)
    [-0.88, 0.88].forEach(rX => {
      const sideRod = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 3.0), rodMat);
      sideRod.position.set(rX, 0.45, 0.2);
      sideRod.userData = { partId: 'biela_walschaerts' };
      trainGroup.add(sideRod);
    });

    // Freios Pneumáticos Westinghouse (Sapatas e Cilindros)
    const brakeMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.4 });
    [-1.2, 0.2, 1.6].forEach(wZ => {
      [-0.86, 0.86].forEach(wX => {
        const brakeShoe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.24), brakeMat);
        brakeShoe.position.set(wX, 0.55, wZ + 0.45);
        brakeShoe.userData = { partId: 'freios_westinghouse' };
        trainGroup.add(brakeShoe);
      });
    });

    // 9. Tender Sustentável (H2 Verde & Condensador de Água)
    const tender = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 1.6, 4.0),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 })
    );
    tender.position.set(0, 1.4, -5.7);
    tender.userData = { partId: 'tender_suprimentos' };
    trainGroup.add(tender);

    // Green Hydrogen Storage Cylinders (H2 Verde a 350 bar atop tender)
    const h2Mat = new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.5, roughness: 0.3 });
    [-0.6, 0.6].forEach(hX => {
      const h2Tank = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 2.8, 16), h2Mat);
      h2Tank.rotation.x = Math.PI / 2;
      h2Tank.position.set(hX, 2.35, -5.7);
      h2Tank.userData = { partId: 'tender_suprimentos' };
      trainGroup.add(h2Tank);

      // Silver bands on H2 tank
      [-0.8, 0, 0.8].forEach(bZ => {
        const b = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.08, 16), rodMat);
        b.rotation.x = Math.PI / 2;
        b.position.set(hX, 2.35, -5.7 + bZ);
        b.userData = { partId: 'tender_suprimentos' };
        trainGroup.add(b);
      });
    });

    // Water Recovery Condenser Grill
    const grillMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7, roughness: 0.4 });
    const condenser = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 0.8), grillMat);
    condenser.position.set(0, 2.3, -4.0);
    condenser.userData = { partId: 'tender_suprimentos' };
    trainGroup.add(condenser);

    // 10. Marcadores 3D Interativos (Beacons) sobre as Peças Mecânicas
    const beaconPins: THREE.Group[] = [];
    const beaconData = [
      { partId: 'chamine_exaustor', pos: [0, 3.8, 2.2] },
      { partId: 'caldeira', pos: [0, 3.0, 1.1] },
      { partId: 'regulador_cupula', pos: [0, 3.4, 0.4] },
      { partId: 'apito_vapor', pos: [0.45, 3.8, -1.8] },
      { partId: 'cabine_comando', pos: [0, 3.6, -2.4] },
      { partId: 'cilindros', pos: [1.35, 1.45, 2.0] },
      { partId: 'biela_walschaerts', pos: [1.05, 0.95, 0.2] },
      { partId: 'rodeiros_eixos', pos: [-1.05, 0.75, 1.6] },
      { partId: 'freios_westinghouse', pos: [1.05, 0.65, 0.7] },
      { partId: 'tender_suprimentos', pos: [0, 3.1, -5.7] },
    ];

    const beaconSphereMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.85,
      metalness: 0.9,
      roughness: 0.15
    });
    const beaconRingMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.8 });

    beaconData.forEach(b => {
      const pin = new THREE.Group();
      pin.position.set(b.pos[0], b.pos[1], b.pos[2]);
      pin.userData = { partId: b.partId };

      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), beaconSphereMat);
      sphere.userData = { partId: b.partId };
      pin.add(sphere);

      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 8, 16), beaconRingMat);
      ring.rotation.x = Math.PI / 2;
      ring.userData = { partId: b.partId };
      pin.add(ring);

      trainGroup.add(pin);
      beaconPins.push(pin);
    });

    // Steam particles (Procedural puffs from chimney - 100% clean water vapor)
    const puffsGroup = new THREE.Group();
    scene.add(puffsGroup);
    const puffGeometry = new THREE.SphereGeometry(0.42, 8, 8);
    const puffMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.48 });
    const puffs: { mesh: THREE.Mesh; life: number; velocity: THREE.Vector3 }[] = [];

    scene.add(trainGroup);

    // Raycasting para clique e toque interativo nas peças mecânicas do trem
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(trainGroup.children, true);

      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== trainGroup) {
          if (curr.userData && curr.userData.partId) {
            const part = LOCOMOTIVE_PARTS.find(p => p.id === curr.userData.partId);
            if (part) {
              setActiveInspectedPart(part);
              setShowLocomotiveGuideModal(true);
              if (!discoveredPartsRef.current.includes(part.id)) {
                discoveredPartsRef.current.push(part.id);
                setDiscoveredParts([...discoveredPartsRef.current]);
                setScore(s => s + 100);
              }
              return;
            }
          }
          curr = curr.parent;
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(trainGroup.children, true);
      let isOverPart = false;
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== trainGroup) {
          if (curr.userData && curr.userData.partId) {
            isOverPart = true;
            break;
          }
          curr = curr.parent;
        }
        if (isOverPart) break;
      }
      renderer.domElement.style.cursor = isOverPart ? 'pointer' : 'default';
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // 9. Main Game Loop
    let lastTime = performance.now();

    const animateGame = (now: number) => {
      gameLoopRef.current = requestAnimationFrame(animateGame);

      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const current = stateRef.current;

      // ─── GAMEPAD POLLING (PS4 & PS5 CONTROLLER SUPPORT) ───
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      let activeGamepad: Gamepad | null = null;
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i] && gamepads[i]!.connected) {
          activeGamepad = gamepads[i];
          break;
        }
      }

      if (activeGamepad) {
        if (!isGamepadConnected) {
          setIsGamepadConnected(true);
          setGamepadName(getCleanGamepadName(activeGamepad.id));
        }

        const prevBtns = prevGamepadButtonsRef.current;
        const currentButtons: { [btn: string]: boolean } = {};

        // 1. L2 Trigger (button 6) -> Westinghouse Pneumatic Brake
        const l2Value = activeGamepad.buttons[6]?.value ?? 0;
        const l2Pressed = (activeGamepad.buttons[6]?.pressed ?? false) || l2Value > 0.15;
        if (l2Pressed || activeGamepad.buttons[4]?.pressed) {
          currentButtons['L2'] = true;
          if (!current.brake) {
            setBrakeApplied(true);
            playBrakeHiss(0.8);
            triggerGamepadVibrate(activeGamepad, 140, 0.4, 0.6);
          }
        } else if (!keyboardBrakeRef.current && !touchBrakeRef.current && current.brake) {
          setBrakeApplied(false);
        }

        // 2. R2 Trigger (button 7) -> Analog Throttle Regulator
        const r2Value = activeGamepad.buttons[7]?.value ?? 0;
        const r2Pressed = (activeGamepad.buttons[7]?.pressed ?? false) || r2Value > 0.15;
        if (r2Pressed) {
          currentButtons['R2'] = true;
          const targetThrot = Math.max(10, Math.round(r2Value * 100));
          setThrottle(targetThrot);
          if (current.brake) setBrakeApplied(false);
        }

        // 3. Cross Button ✕ (button 0) -> Acelerar (+15%)
        if (activeGamepad.buttons[0]?.pressed) {
          currentButtons['Cross'] = true;
          if (!prevBtns[0]) {
            setThrottle(t => Math.min(100, t + 15));
            setBrakeApplied(false);
            triggerGamepadVibrate(activeGamepad, 80, 0.25, 0.2);
          }
        }

        // 4. Circle Button ◯ (button 1) -> Apito a Vapor
        if (activeGamepad.buttons[1]?.pressed) {
          currentButtons['Circle'] = true;
          if (!prevBtns[1]) {
            playSteamWhistle();
            triggerGamepadVibrate(activeGamepad, 350, 0.7, 0.9);
          }
        }

        // 5. Square Button □ (button 2) -> Sino da Estação
        if (activeGamepad.buttons[2]?.pressed) {
          currentButtons['Square'] = true;
          if (!prevBtns[2]) {
            playStationBell();
            triggerGamepadVibrate(activeGamepad, 100, 0.3, 0.2);
          }
        }

        // 6. Triangle Button △ (button 3) -> Alternar Câmera
        if (activeGamepad.buttons[3]?.pressed) {
          currentButtons['Triangle'] = true;
          if (!prevBtns[3]) {
            setCameraMode(prev => {
              if (prev === 'chase') return 'cab';
              if (prev === 'cab') return 'side';
              if (prev === 'side') return 'station';
              return 'chase';
            });
            triggerGamepadVibrate(activeGamepad, 60, 0.2, 0.2);
          }
        }

        // 7. D-Pad Cima (button 12) / D-Pad Baixo (button 13)
        if (activeGamepad.buttons[12]?.pressed) {
          currentButtons['DpadUp'] = true;
          if (!prevBtns[12]) {
            setThrottle(t => Math.min(100, t + 10));
            setBrakeApplied(false);
          }
        }
        if (activeGamepad.buttons[13]?.pressed) {
          currentButtons['DpadDown'] = true;
          if (!prevBtns[13]) {
            setThrottle(t => Math.max(0, t - 10));
          }
        }

        // 8. Left Analog Stick Y (axes[1]) -> Regulador de Vapor Suave
        const leftStickY = activeGamepad.axes[1] ?? 0;
        if (leftStickY < -0.35) {
          // Pushed up -> increase throttle
          setThrottle(t => Math.min(100, Math.round(t + delta * 25)));
          if (current.brake) setBrakeApplied(false);
        } else if (leftStickY > 0.35) {
          // Pulled down -> decrease throttle
          setThrottle(t => Math.max(0, Math.round(t - delta * 30)));
        }

        // 9. Botão Share / Select (button 8) -> Reiniciar Viagem
        if (activeGamepad.buttons[8]?.pressed) {
          currentButtons['Select'] = true;
          if (!prevBtns[8]) {
            handleRestartRef.current();
            triggerGamepadVibrate(activeGamepad, 150, 0.4, 0.3);
          }
        }

        // Cache button states for edge triggers
        activeGamepad.buttons.forEach((b, idx) => {
          prevBtns[idx] = b.pressed || b.value > 0.15;
        });

        setActiveGamepadButtons(currentButtons);
      }

      // Acceleration / Brake calculation
      let targetSpeed = (current.throttle / 100) * 65; // Max 65 km/h in city
      if (current.brake) {
        targetSpeed = 0;
      }

      if (current.speed < targetSpeed) {
        current.speed += delta * 12; // Accelerate
      } else if (current.speed > targetSpeed) {
        current.speed -= delta * (current.brake ? 26 : 8); // Brake / Decelerate
      }
      current.speed = Math.max(0, current.speed);

      // Track advancement
      const speedUnitsPerSec = (current.speed / 3.6) * 0.0006;
      current.progress = (current.progress + speedUnitsPerSec * delta) % 1.0;

      // Update Train Position on Spline
      const trainPos = trackCurve.getPointAt(current.progress);
      const trainTangent = trackCurve.getTangentAt(current.progress);

      trainGroup.position.copy(trainPos);
      trainGroup.lookAt(trainPos.clone().add(trainTangent));

      // Emit Steam Puffs
      if (current.speed > 2 && Math.random() < 0.3) {
        const puff = new THREE.Mesh(puffGeometry, puffMaterial.clone());
        const chimneyWorldPos = new THREE.Vector3(0, 2.8, 2.2).applyMatrix4(trainGroup.matrixWorld);
        puff.position.copy(chimneyWorldPos);
        puffsGroup.add(puff);
        puffs.push({
          mesh: puff,
          life: 1.0,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.8,
            2.0 + Math.random() * 1.5,
            (Math.random() - 0.5) * 0.8
          )
        });
      }

      // Update existing puffs
      for (let p = puffs.length - 1; p >= 0; p--) {
        const pf = puffs[p];
        pf.life -= delta * 1.2;
        pf.mesh.position.addScaledVector(pf.velocity, delta);
        pf.mesh.scale.addScalar(delta * 1.8);
        (pf.mesh.material as THREE.MeshBasicMaterial).opacity = pf.life * 0.45;

        if (pf.life <= 0) {
          puffsGroup.remove(pf.mesh);
          puffs.splice(p, 1);
        }
      }

      // Chuff sounds based on wheel speed
      current.chuffTimer += current.speed * delta;
      if (current.chuffTimer > 15) {
        playSteamChuff(Math.min(0.25, (current.speed / 60) * 0.3 + 0.05));
        current.chuffTimer = 0;
      }

      // Station Alignment Checks
      stationPositions.forEach((stPos, stIdx) => {
        const dist = Math.abs(current.progress - stPos);
        if (dist < 0.006) {
          setCurrentStationIdx(stIdx);
          if (current.speed < 1.0) {
            // Train is stopped at station!
            const alignmentDeviation = dist * 1000; // in simulated cm
            if (alignmentDeviation < 3.0) {
              setStationAlignmentFeedback(`Parada Perfeita! Vão Zero (Gap Filler) ativado com sucesso! (+200 pts)`);
              confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
            } else {
              setStationAlignmentFeedback(`Parada realizada na estação. Desvio: ${(alignmentDeviation).toFixed(1)} cm.`);
            }
          }
        }
      });

      // Camera Positioning
      if (cameraMode === 'chase') {
        const offset = new THREE.Vector3(0, 4.5, -12).applyMatrix4(trainGroup.matrixWorld);
        camera.position.lerp(offset, 0.1);
        camera.lookAt(trainPos.clone().add(new THREE.Vector3(0, 1.5, 0)));
      } else if (cameraMode === 'cab') {
        const cabPos = new THREE.Vector3(0, 2.2, -1.8).applyMatrix4(trainGroup.matrixWorld);
        camera.position.copy(cabPos);
        const lookAhead = new THREE.Vector3(0, 2.0, 15).applyMatrix4(trainGroup.matrixWorld);
        camera.lookAt(lookAhead);
      } else if (cameraMode === 'side') {
        const sidePos = new THREE.Vector3(8, 3, 0).applyMatrix4(trainGroup.matrixWorld);
        camera.position.lerp(sidePos, 0.08);
        camera.lookAt(trainPos);
      } else if (cameraMode === 'station') {
        // Find nearest station
        const nearestSt = stationMeshes[currentStationIdx] || stationMeshes[0];
        camera.position.set(nearestSt.position.x + 10, nearestSt.position.y + 7, nearestSt.position.z + 10);
        camera.lookAt(trainPos);
      }

      // ─── DIDACTIC LOCOMOTIVE COMPONENT EXPLANATIONS IN REAL-TIME ───
      const discovered = discoveredPartsRef.current;

      // 1. Regulador de vapor
      if (current.throttle > 10 && !discovered.includes('regulador_cupula')) {
        discoveredPartsRef.current.push('regulador_cupula');
        setDiscoveredParts([...discoveredPartsRef.current]);
        const part = LOCOMOTIVE_PARTS.find(p => p.id === 'regulador_cupula');
        if (part) {
          setScore(s => s + 150);
          setLivePartAlert({
            part,
            message: 'A Cúpula de Vapor aloja a Válvula Reguladora de Vapor. Ao abrir o acelerador, você dosou vapor sob alta pressão aos cilindros dianteiros!',
            actionTrigger: 'Regulador Acionado (+150 pts de Engenharia)'
          });
          confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
        }
      }

      // 2. Cilindros de Dupla Ação
      if (current.speed > 6 && !discovered.includes('cilindros')) {
        discoveredPartsRef.current.push('cilindros');
        setDiscoveredParts([...discoveredPartsRef.current]);
        const part = LOCOMOTIVE_PARTS.find(p => p.id === 'cilindros');
        if (part) {
          setScore(s => s + 150);
          setLivePartAlert({
            part,
            message: 'Os Cilindros de Dupla Ação recebem vapor a 14 bar, empurrando os pistões com 128 kN de força mecânica linear!',
            actionTrigger: 'Pistões em Tração (+150 pts de Engenharia)'
          });
          confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
        }
      }

      // 3. Mecanismo Walschaerts & Bielas
      if (current.speed > 20 && !discovered.includes('biela_walschaerts')) {
        discoveredPartsRef.current.push('biela_walschaerts');
        setDiscoveredParts([...discoveredPartsRef.current]);
        const part = LOCOMOTIVE_PARTS.find(p => p.id === 'biela_walschaerts');
        if (part) {
          setScore(s => s + 150);
          setLivePartAlert({
            part,
            message: 'A Distribuição Walschaerts converte o vai-e-vem dos pistões na rotação vigorosa das 6 rodas motrizes!',
            actionTrigger: 'Cinemática Walschaerts Ativa (+150 pts)'
          });
          confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
        }
      }

      // 4. Caldeira Eco-Vapor a Hidrogênio Verde & Biometano
      if (current.speed > 35 && !discovered.includes('caldeira')) {
        discoveredPartsRef.current.push('caldeira');
        setDiscoveredParts([...discoveredPartsRef.current]);
        const part = LOCOMOTIVE_PARTS.find(p => p.id === 'caldeira');
        if (part) {
          setScore(s => s + 150);
          setLivePartAlert({
            part,
            message: 'A Caldeira gera 14 bar com a queima limpa de H₂ Verde e Biometano: 2 H₂ + O₂ → 2 H₂O. Zero fumaça fóssil, apenas vapor puro!',
            actionTrigger: 'Caldeira Eco-Vapor a 14 bar (+150 pts)'
          });
          confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
        }
      }

      // 5. Chaminé Eco-Vapor e Ejetor Kylchap
      if (current.speed > 14 && puffs.length > 2 && !discovered.includes('chamine_exaustor')) {
        discoveredPartsRef.current.push('chamine_exaustor');
        setDiscoveredParts([...discoveredPartsRef.current]);
        const part = LOCOMOTIVE_PARTS.find(p => p.id === 'chamine_exaustor');
        if (part) {
          setScore(s => s + 150);
          setLivePartAlert({
            part,
            message: 'O Ejetor Kylchap descarrega vapor de água puro (H₂O), criando vácuo (Efeito Venturi) que aspira ar fresco para os queimadores limpos!',
            actionTrigger: 'Vapor 100% Limpo na Chaminé (+150 pts)'
          });
          confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
        }
      }

      // 6. Freio Westinghouse
      if (current.brake && !discovered.includes('freios_westinghouse')) {
        discoveredPartsRef.current.push('freios_westinghouse');
        setDiscoveredParts([...discoveredPartsRef.current]);
        const part = LOCOMOTIVE_PARTS.find(p => p.id === 'freios_westinghouse');
        if (part) {
          setScore(s => s + 150);
          setLivePartAlert({
            part,
            message: 'O Freio Automático Westinghouse despressuriza a tubulação geral de 5 para 3,5 bar, aplicando as sapatas com máxima segurança!',
            actionTrigger: 'Freio Pneumático Aplicado (+150 pts)'
          });
          confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
        }
      }

      // 7. Tender Sustentável
      if (current.speed < 1.5 && stationPositions.some(p => Math.abs(current.progress - p) < 0.007) && !discovered.includes('tender_suprimentos')) {
        discoveredPartsRef.current.push('tender_suprimentos');
        setDiscoveredParts([...discoveredPartsRef.current]);
        const part = LOCOMOTIVE_PARTS.find(p => p.id === 'tender_suprimentos');
        if (part) {
          setScore(s => s + 150);
          setLivePartAlert({
            part,
            message: 'O Tender Sustentável guarda 240 kg de H₂ Verde a 350 bar e 20.000 L de água, com condensador que reaproveita 65% do vapor exalado!',
            actionTrigger: 'Tender Sustentável Acoplado (+150 pts)'
          });
          confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
        }
      }

      // Animar os marcadores 3D interativos sobre as peças da locomotiva
      const timeSec = now * 0.003;
      beaconPins.forEach((pin, i) => {
        pin.rotation.y = timeSec + i * 0.5;
        if (pin.children[1]) {
          pin.children[1].rotation.z = timeSec * 1.6 + i;
        }
      });

      setSpeedKmh(Math.round(current.speed));
      setTrackProgress(current.progress);

      renderer.render(scene, camera);
    };

    gameLoopRef.current = requestAnimationFrame(animateGame);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Keyboard controls for PC desktop
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        setThrottle(t => Math.min(100, t + 15));
        setBrakeApplied(false);
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        setThrottle(t => Math.max(0, t - 15));
      } else if (e.key === ' ') {
        setBrakeApplied(true);
        playBrakeHiss(0.8);
      } else if (e.key === 'h' || e.key === 'H') {
        handleWhistle();
      } else if (e.key === 'c' || e.key === 'C') {
        setCameraMode(prev => {
          if (prev === 'chase') return 'cab';
          if (prev === 'cab') return 'side';
          if (prev === 'side') return 'station';
          return 'chase';
        });
      } else if (e.key === 'b' || e.key === 'B') {
        playStationBell();
      } else if (e.key === 'r' || e.key === 'R') {
        handleRestartRef.current();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setBrakeApplied(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.dispose();
    };
  }, [cameraMode]);

  const toggleCamera = () => {
    setCameraMode(prev => {
      if (prev === 'chase') return 'cab';
      if (prev === 'cab') return 'side';
      if (prev === 'side') return 'station';
      return 'chase';
    });
  };

  const handleWhistle = () => {
    playSteamWhistle();
    if (!discoveredPartsRef.current.includes('apito_vapor')) {
      discoveredPartsRef.current.push('apito_vapor');
      setDiscoveredParts([...discoveredPartsRef.current]);
      const part = LOCOMOTIVE_PARTS.find(p => p.id === 'apito_vapor');
      if (part) {
        setScore(s => s + 150);
        setLivePartAlert({
          part,
          message: 'O Apito a Vapor canaliza vapor sob 12 bar em campânula de bronze naval afinada (330 Hz / 440 Hz), advertindo com 1,5 km de antecedência!',
          actionTrigger: 'Acionamento do Apito a Vapor (+150 pts)'
        });
        confetti({ particleCount: 20, spread: 45, origin: { y: 0.6 } });
      }
    }
  };

  const handleBell = () => {
    playStationBell();
  };

  return (
    <div className="w-full space-y-6">
      {/* Game Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-lg font-bold text-slate-900">
              Jogo 3D Joinville nos Trilhos (Web Edition)
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
              PC & Mobile
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Conduza a locomotiva pelas vias acessíveis de Joinville, atenda às missões dos passageiros e alinhe no vão zero
          </p>
        </div>

        {/* Live Game Score & Active Station & Controls Mode */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-500 block">Pontos de Conforto:</span>
            <span className="font-mono font-bold text-indigo-600 text-sm">
              {score} pts
            </span>
          </div>

          {/* Clean Sustainable Steam Pill Button */}
          <button
            onClick={() => setShowCleanSteamModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 shadow-xs transition"
            title="Conhecer a tecnologia de vapor sustentável limpo"
          >
            <Droplets className="w-4 h-4 text-emerald-600" />
            <span>Vapor Sustentável: 100% H₂O</span>
            <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">Limpo</span>
          </button>

          {/* Locomotive Anatomy Educational Guide Button */}
          <button
            onClick={() => {
              setShowLocomotiveGuideModal(true);
              if (!activeInspectedPart) {
                const first = LOCOMOTIVE_PARTS.find(p => discoveredParts.includes(p.id)) || LOCOMOTIVE_PARTS[0];
                setActiveInspectedPart(first);
              }
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 shadow-xs transition"
            title="Abrir Guia Didático das Partes da Locomotiva"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Anatomia da Locomotiva</span>
            <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
              {discoveredParts.length}/{LOCOMOTIVE_PARTS.length}
            </span>
          </button>

          {/* Gamepad Status Pill & Modal Trigger */}
          <button
            onClick={() => setShowGamepadGuide(prev => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
              isGamepadConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Gamepad2 className={`w-4 h-4 ${isGamepadConnected ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`} />
            <span>{isGamepadConnected ? gamepadName : 'Controle PS4 / PS5'}</span>
            {isGamepadConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            onClick={toggleCamera}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Camera className="w-4 h-4 text-amber-400" />
            Câmera: {cameraMode.toUpperCase()}
          </button>

          <button
            onClick={handleRestart}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
            title="Reiniciar Viagem (Posição inicial na Estação Central / Tecla R)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar Viagem</span>
          </button>

          <button
            onClick={handleWhistle}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Volume2 className="w-4 h-4" />
            Apitar
          </button>
        </div>
      </div>

      {/* Gamepad Mapping & Live Feedback Modal */}
      {showGamepadGuide && (
        <div className="bg-slate-900 text-white rounded-2xl border border-slate-700 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm text-white">
                Mapeamento de Controle PlayStation (PS4 DualShock 4 & PS5 DualSense)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                isGamepadConnected ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {isGamepadConnected ? `● ${gamepadName} Conectado` : 'Conecte seu controle via USB ou Bluetooth'}
              </span>
              <button
                onClick={() => setShowGamepadGuide(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 rounded-lg bg-slate-800"
              >
                ✕ Fechar
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            O jogo detecta automaticamente os controles de PS4 e PS5 conectados via cabo USB ou Bluetooth. Os gatilhos analógicos e botões de ação clássicos do PlayStation possuem suporte nativo com vibração tátil (Dual-Rumble).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3 rounded-xl border transition ${
              activeGamepadButtons['Cross'] ? 'bg-indigo-600/30 border-indigo-400 shadow-sm' : 'bg-slate-800/80 border-slate-700'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-indigo-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[11px]">✕</span>
                  Botão X (Cruz)
                </span>
                {activeGamepadButtons['Cross'] && <span className="text-[10px] text-emerald-400 font-mono">ATIVO</span>}
              </div>
              <p className="text-[11px] text-slate-300">Acelerar trem (+15% regulador de vapor)</p>
            </div>

            <div className={`p-3 rounded-xl border transition ${
              activeGamepadButtons['Circle'] ? 'bg-amber-600/30 border-amber-400 shadow-sm' : 'bg-slate-800/80 border-slate-700'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-amber-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[11px]">◯</span>
                  Botão Círculo
                </span>
                {activeGamepadButtons['Circle'] && <span className="text-[10px] text-emerald-400 font-mono">ATIVO</span>}
              </div>
              <p className="text-[11px] text-slate-300">Tocar Apito a Vapor (+ vibração háptica)</p>
            </div>

            <div className={`p-3 rounded-xl border transition ${
              activeGamepadButtons['Square'] ? 'bg-pink-600/30 border-pink-400 shadow-sm' : 'bg-slate-800/80 border-slate-700'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-pink-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-[11px]">□</span>
                  Botão Quadrado
                </span>
                {activeGamepadButtons['Square'] && <span className="text-[10px] text-emerald-400 font-mono">ATIVO</span>}
              </div>
              <p className="text-[11px] text-slate-300">Tocar Sino de Estação Joinville</p>
            </div>

            <div className={`p-3 rounded-xl border transition ${
              activeGamepadButtons['Triangle'] ? 'bg-emerald-600/30 border-emerald-400 shadow-sm' : 'bg-slate-800/80 border-slate-700'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-emerald-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px]">△</span>
                  Botão Triângulo
                </span>
                {activeGamepadButtons['Triangle'] && <span className="text-[10px] text-emerald-400 font-mono">ATIVO</span>}
              </div>
              <p className="text-[11px] text-slate-300">Alternar Câmeras (Cabine, Externa, Estação)</p>
            </div>

            <div className={`p-3 rounded-xl border transition ${
              activeGamepadButtons['L2'] ? 'bg-red-600/40 border-red-400 shadow-sm' : 'bg-slate-800/80 border-slate-700'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-red-300">Gatilho L2 (Analógico)</span>
                {activeGamepadButtons['L2'] && <span className="text-[10px] text-red-400 font-mono animate-pulse">PRESSIONADO</span>}
              </div>
              <p className="text-[11px] text-slate-300">Freio Pneumático Westinghouse progressivo</p>
            </div>

            <div className={`p-3 rounded-xl border transition ${
              activeGamepadButtons['R2'] ? 'bg-emerald-600/40 border-emerald-400 shadow-sm' : 'bg-slate-800/80 border-slate-700'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span className="text-emerald-300">Gatilho R2 (Analógico)</span>
                {activeGamepadButtons['R2'] && <span className="text-[10px] text-emerald-400 font-mono">TRACIONANDO</span>}
              </div>
              <p className="text-[11px] text-slate-300">Regulador de Vapor contínuo (0 a 100%)</p>
            </div>

            <div className="p-3 rounded-xl border bg-slate-800/80 border-slate-700">
              <div className="text-xs font-bold text-sky-300 mb-1">Analógico Esquerdo (L3)</div>
              <p className="text-[11px] text-slate-300">Empurrar para frente acelera; puxar desacelera</p>
            </div>

            <div className="p-3 rounded-xl border bg-slate-800/80 border-slate-700">
              <div className="text-xs font-bold text-slate-300 mb-1">D-Pad (Cima / Baixo)</div>
              <p className="text-[11px] text-slate-300">Ajuste fino de vapor (+10% / -10%)</p>
            </div>
          </div>
        </div>
      )}

      {/* Faixa Interativa de Peças Mecânicas no Trajeto (Posicionada com espaço dedicado, sem sobrepor o jogo) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 px-4 flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Cog className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                Peças Mecânicas no Trajeto:
                <span className="text-[10px] font-normal text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full border border-amber-300">
                  Clique na peça para ver Foto & Engenharia
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-bold border border-slate-200">
              {discoveredParts.length}/{LOCOMOTIVE_PARTS.length} descobertas
            </span>
            <button
              onClick={() => setShowRoutePartsDrawer(!showRoutePartsDrawer)}
              className="text-slate-600 hover:text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition"
              title={showRoutePartsDrawer ? 'Recolher faixa de peças' : 'Expandir faixa de peças'}
            >
              {showRoutePartsDrawer ? '▲ Ocultar' : '▼ Ver Peças'}
            </button>
          </div>
        </div>

        {showRoutePartsDrawer && (
          <div className="p-2.5 flex items-center gap-2.5 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 pb-3">
            {LOCOMOTIVE_PARTS.map((part) => {
              const isDiscovered = discoveredParts.includes(part.id);
              return (
                <button
                  key={part.id}
                  onClick={() => {
                    setActiveInspectedPart(part);
                    setShowLocomotiveGuideModal(true);
                    if (!discoveredParts.includes(part.id)) {
                      discoveredPartsRef.current.push(part.id);
                      setDiscoveredParts([...discoveredPartsRef.current]);
                      setScore(s => s + 100);
                    }
                  }}
                  className={`shrink-0 flex items-center gap-2.5 p-2 pr-3.5 rounded-xl border text-left transition active:scale-95 group ${
                    isDiscovered
                      ? 'bg-slate-50 border-slate-200 hover:border-amber-400 hover:bg-amber-50/40'
                      : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'
                  }`}
                  title={`Clique para inspecionar ${part.name}`}
                >
                  {part.imageUrl && (
                    <img
                      src={part.imageUrl}
                      alt={part.name}
                      className="w-11 h-11 rounded-lg object-cover border border-slate-200 group-hover:border-amber-400 shadow-xs transition"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="max-w-[130px] truncate">
                    <div className="text-xs font-bold text-slate-900 truncate group-hover:text-amber-700">
                      {part.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <Eye className="w-3 h-3 text-indigo-500" />
                      <span>Ver Foto & 3D</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3D Game Canvas Area (Estrutura sem sobreposição de elementos) */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'relative w-full h-[540px] sm:h-[580px] rounded-2xl border border-slate-300'} overflow-hidden shadow-lg bg-slate-950 flex flex-col`}>
        <div ref={containerRef} className="w-full h-full flex-1 touch-none" />

        {/* HUD Overlay - Barra Superior Unificada (Elementos alinhados sem colisão) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-3 pointer-events-none z-20">
          {/* Telemetria e Velocímetro */}
          <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700/80 text-white shadow-lg flex items-center gap-3 shrink-0 pointer-events-auto">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Velocidade
              </div>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                  {speedKmh}
                </span>
                <span className="text-[10px] text-slate-400 font-sans">km/h</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Regulador
              </div>
              <div className="text-xs sm:text-sm font-mono font-bold text-emerald-400">
                {throttle}%
              </div>
              <div className="text-[9px] text-slate-400 font-semibold">
                {brakeApplied ? 'FREIO ATIVO' : 'TRACIONANDO'}
              </div>
            </div>
          </div>

          {/* Próxima Estação & Notificação de Alinhamento (Centro / Desktop & Tablet) */}
          <div className="hidden sm:flex flex-col items-center pointer-events-auto max-w-[280px]">
            {stationAlignmentFeedback ? (
              <div className="bg-emerald-600/95 backdrop-blur-md text-white px-4 py-1.5 rounded-full shadow-lg text-xs font-bold flex items-center gap-2 border border-emerald-400 animate-bounce">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{stationAlignmentFeedback}</span>
              </div>
            ) : (
              <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-700/80 text-white shadow-md flex items-center gap-2 text-xs">
                <Navigation className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="text-slate-400">Estação:</span>
                <span className="font-bold text-white truncate">
                  {JOINVILLE_STATIONS[currentStationIdx]?.name || 'Estação Central'}
                </span>
              </div>
            )}
          </div>

          {/* Ações Rápidas: Reiniciar, Câmera e Tela Cheia */}
          <div className="flex items-center gap-2 pointer-events-auto shrink-0">
            {/* Botão Reiniciar no HUD */}
            <button
              onClick={handleRestart}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg font-bold text-xs flex items-center gap-1.5 transition active:scale-95 border border-amber-300"
              title="Reiniciar Viagem (Posição inicial na Estação Central / Tecla R)"
              aria-label="Reiniciar Viagem"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>

            {/* Alternar Câmera */}
            <button
              onClick={toggleCamera}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white shadow-md backdrop-blur-md transition flex items-center gap-1.5 text-xs font-semibold active:scale-95"
              title={`Câmera: ${cameraMode.toUpperCase()} (Tecla C)`}
              aria-label="Alternar Câmera"
            >
              <Camera className="w-4 h-4 text-sky-400" />
              <span className="hidden md:inline uppercase text-[10px] font-mono">{cameraMode}</span>
            </button>

            {/* Alternar Tela Cheia */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-white shadow-md backdrop-blur-md transition flex items-center gap-1.5 text-xs font-semibold active:scale-95"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
              aria-label="Tela Cheia"
            >
              {isFullscreen ? <Maximize2 className="w-4 h-4 rotate-180" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Notificação de Alinhamento de Estação no Celular (quando em telas pequenas < 640px) */}
        {stationAlignmentFeedback && (
          <div className="sm:hidden absolute top-16 left-1/2 -translate-x-1/2 bg-emerald-600/95 backdrop-blur-md text-white px-3.5 py-1 rounded-full shadow-lg text-[11px] font-bold flex items-center gap-1.5 border border-emerald-400 animate-bounce z-20 whitespace-nowrap pointer-events-none">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stationAlignmentFeedback}</span>
          </div>
        )}

        {/* Botão flutuante de peças quando em modo Tela Cheia */}
        {isFullscreen && (
          <div className="absolute top-16 left-3 pointer-events-auto z-20">
            <button
              onClick={() => {
                setShowLocomotiveGuideModal(true);
                if (!activeInspectedPart) {
                  setActiveInspectedPart(LOCOMOTIVE_PARTS[0]);
                }
              }}
              className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800 shadow-md transition"
            >
              <Cog className="w-3.5 h-3.5 text-amber-400" />
              <span>Peças da Locomotiva</span>
            </button>
          </div>
        )}

        {/* Alerta Didático de Componente Acionado (Posicionado no terço superior sem sobrepor a barra de topo) */}
        {livePartAlert && (
          <div className="absolute top-16 sm:top-20 left-3 right-3 max-w-lg mx-auto bg-slate-900/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border-2 border-amber-400 text-white shadow-2xl z-30 flex items-start gap-3 pointer-events-auto animate-bounce-short">
            {livePartAlert.part.imageUrl ? (
              <img
                src={livePartAlert.part.imageUrl}
                alt={livePartAlert.part.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-amber-400 shadow-md shrink-0 cursor-pointer hover:opacity-90 transition"
                referrerPolicy="no-referrer"
                onClick={() => {
                  setActiveInspectedPart(livePartAlert.part);
                  setShowLocomotiveGuideModal(true);
                  setLivePartAlert(null);
                }}
                title="Clique para ampliar a foto e ver engenharia"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <BookOpen className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {livePartAlert.actionTrigger}
                </span>
                <button 
                  onClick={() => setLivePartAlert(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 transition"
                  title="Fechar aviso"
                >
                  ✕
                </button>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5">{livePartAlert.part.name}</h4>
              <p className="text-[11px] sm:text-xs text-slate-200 mt-0.5 leading-relaxed line-clamp-2">
                {livePartAlert.message}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveInspectedPart(livePartAlert.part);
                    setShowLocomotiveGuideModal(true);
                    setLivePartAlert(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold flex items-center gap-1 shadow-xs transition"
                >
                  <Eye className="w-3 h-3" />
                  Ver Engenharia & FreeCAD
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Diálogo com Dona Helena / Passageiros (Posicionado com folga acima dos controles touch) */}
        {currentDialogBanner && (
          <div className="absolute bottom-20 sm:bottom-24 left-3 right-3 max-w-lg mx-auto bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 text-white shadow-lg flex items-center gap-3 pointer-events-auto z-20">
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-xs"
              style={{ backgroundColor: currentDialogBanner.avatarColor }}
            >
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-bold text-amber-400">
                {currentDialogBanner.name}
              </div>
              <p className="text-xs text-slate-200 line-clamp-2">
                "{currentDialogBanner.text}"
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {onOpenDialog && (
                <button
                  onClick={() => onOpenDialog('dona_helena')}
                  className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold whitespace-nowrap shadow-xs transition"
                >
                  Conversar
                </button>
              )}
              <button
                onClick={() => setCurrentDialogBanner(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition text-xs font-bold"
                title="Dispensar mensagem"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Controles Touch & Mobile no Rodapé (Perfeitamente espaçados sem sobrepor elementos) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-auto select-none z-20">
          {/* Regulador de Vapor (Polegar Esquerdo) */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-slate-700/90 shadow-lg">
            <button
              onClick={() => setThrottle(t => Math.max(0, t - 15))}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-base flex items-center justify-center active:scale-95 transition touch-manipulation"
              title="Diminuir Vapor"
              aria-label="Diminuir Vapor"
            >
              -
            </button>
            <div className="px-1.5 text-center min-w-[50px] sm:min-w-[60px]">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Vapor</span>
              <span className="font-mono text-sm sm:text-base font-extrabold text-amber-400">{throttle}%</span>
            </div>
            <button
              onClick={() => {
                setThrottle(t => Math.min(100, t + 15));
                setBrakeApplied(false);
              }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base flex items-center justify-center active:scale-95 transition touch-manipulation shadow-sm"
              title="Acelerar Vapor"
              aria-label="Acelerar Vapor"
            >
              +
            </button>
            {/* Slider de regulador */}
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={throttle}
              onChange={(e) => {
                setThrottle(Number(e.target.value));
                if (brakeApplied) setBrakeApplied(false);
              }}
              className="w-16 sm:w-24 md:w-28 accent-amber-500 cursor-pointer touch-manipulation"
              title="Regulador Proporcional de Vapor"
            />
          </div>

          {/* Botões de Ação: Reiniciar, Sino, Apito e Freio Westinghouse (Polegar Direito) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Botão Reiniciar no Touch */}
            <button
              onClick={handleRestart}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center active:scale-95 transition shadow-sm touch-manipulation"
              title="Reiniciar Viagem (Tecla R)"
              aria-label="Reiniciar Viagem"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleBell}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-amber-300 flex items-center justify-center active:scale-95 transition shadow-sm touch-manipulation"
              title="Tocar Sino"
              aria-label="Tocar Sino"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhistle}
              className="px-3 sm:px-4 h-10 sm:h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 active:scale-95 transition shadow-md touch-manipulation"
              title="Apitar"
              aria-label="Apitar"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Apito</span>
            </button>

            <button
              onMouseDown={() => {
                setBrakeApplied(true);
                playBrakeHiss(0.8);
              }}
              onMouseUp={() => setBrakeApplied(false)}
              onTouchStart={(e) => {
                e.preventDefault();
                touchBrakeRef.current = true;
                setBrakeApplied(true);
                playBrakeHiss(0.8);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                touchBrakeRef.current = false;
                setBrakeApplied(false);
              }}
              className={`px-3.5 sm:px-5 h-10 sm:h-11 rounded-xl font-bold text-xs flex items-center gap-1 active:scale-95 transition shadow-lg touch-manipulation ${
                brakeApplied
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-red-500/95 hover:bg-red-600 text-white'
              }`}
              title="Segure para frear com o Freio Pneumático Westinghouse"
            >
              <span>FREIO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cross-Platform Driving Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Desktop Keyboard Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Keyboard className="w-4 h-4 text-indigo-600" />
            Computador (Teclado):
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="bg-slate-50 p-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Acelerar / Mais Vapor:</span>
              <kbd className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">W / ↑</kbd>
            </div>
            <div className="bg-slate-50 p-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Desacelerar:</span>
              <kbd className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">S / ↓</kbd>
            </div>
            <div className="bg-slate-50 p-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Freio Westinghouse:</span>
              <kbd className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">Espaço</kbd>
            </div>
            <div className="bg-slate-50 p-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Apito & Câmeras:</span>
              <span className="space-x-1">
                <kbd className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">H</kbd>
                <kbd className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">C</kbd>
              </span>
            </div>
            <div className="bg-amber-50/60 p-1.5 px-2 rounded-lg border border-amber-200/80 flex items-center justify-between">
              <span className="font-semibold text-amber-900">Reiniciar Viagem:</span>
              <kbd className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900">R</kbd>
            </div>
          </div>
        </div>

        {/* Mobile Touch Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            Celular & Tablet (Touch com Dedos):
          </div>
          <div className="text-xs text-slate-600 space-y-2 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span><strong>Polegar Esquerdo:</strong> botões + / - e barra deslizante de vapor contínuo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span><strong>Polegar Direito:</strong> Freio Pneumático de toque contínuo com som de despressurização</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span><strong>Ações Rápidas:</strong> Botão Reiniciar, Apito, sino e alternância de câmeras em 1 toque</span>
            </div>
          </div>
        </div>

        {/* PlayStation 4 / PlayStation 5 Gamepad Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Gamepad2 className="w-4 h-4 text-blue-600" />
              Controles PS4 & PS5:
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
              isGamepadConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {isGamepadConnected ? 'Ativo' : 'USB/BT'}
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="bg-slate-50 p-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Acelerar / Vapor:</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">✕ (X) / R2</span>
            </div>
            <div className="bg-slate-50 p-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Freio Westinghouse:</span>
              <span className="font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">Gatilho L2</span>
            </div>
            <div className="bg-slate-50 p-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Apito & Vibração:</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">◯ (Círculo)</span>
            </div>
            <div className="bg-slate-50 p-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Sino & Câmera:</span>
              <span className="space-x-1 font-bold">
                <span className="text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-200">□</span>
                <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">△</span>
              </span>
            </div>
            <div className="bg-slate-50 p-1.5 px-2 rounded-lg border border-slate-100 flex items-center justify-between">
              <span>Reiniciar Viagem:</span>
              <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">Share / Select</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODAL 1: DIDACTIC LOCOMOTIVE ANATOMY & ENGINEERING GUIDE ─── */}
      {showLocomotiveGuideModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Guia Didático da Locomotiva Eco-Vapor
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold">
                      Engenharia & FreeCAD
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Conheça cada componente mecânico, termodinâmico e ecológico que movimenta a locomotiva por Joinville
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLocomotiveGuideModal(false)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Two-column layout (List of Parts + Detailed Inspection Panel) */}
            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-12 gap-5 bg-slate-50/50">
              {/* Left Column: Parts Selector */}
              <div className="md:col-span-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
                  <span>Componentes da Locomotiva:</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    {discoveredParts.length}/{LOCOMOTIVE_PARTS.length} Descobertos
                  </span>
                </div>

                <div className="space-y-2">
                  {LOCOMOTIVE_PARTS.map((part) => {
                    const isDiscovered = discoveredParts.includes(part.id);
                    const isSelected = activeInspectedPart?.id === part.id;
                    return (
                      <button
                        key={part.id}
                        onClick={() => setActiveInspectedPart(part)}
                        className={`w-full text-left p-2.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : isDiscovered
                            ? 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                            : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {part.imageUrl ? (
                            <img
                              src={part.imageUrl}
                              alt={part.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 shadow-xs"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : isDiscovered
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'bg-slate-200 text-slate-500'
                            }`}>
                              {isDiscovered ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                            </div>
                          )}
                          <div className="truncate">
                            <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {part.name}
                            </div>
                            <div className={`text-[11px] truncate ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                              {part.category}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Detailed Part Inspection */}
              <div className="md:col-span-7">
                {activeInspectedPart ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
                    {/* Part Header & Status */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                          {activeInspectedPart.category}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          {activeInspectedPart.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-semibold">Status em Jogo:</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                          Ativo no Trem 3D
                        </span>
                      </div>
                    </div>

                    {/* High-Resolution Technical 3D CAD Image */}
                    {activeInspectedPart.imageUrl && (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm bg-slate-950 group">
                        <img
                          src={activeInspectedPart.imageUrl}
                          alt={activeInspectedPart.imageAlt || activeInspectedPart.name}
                          className="w-full h-52 sm:h-64 object-cover transition duration-300 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <span className="bg-black/75 backdrop-blur-md text-amber-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-400/30">
                            ★ Importância: {activeInspectedPart.importanceRating}/5
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                          <span className="font-mono bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 font-bold text-[11px] truncate max-w-[65%]">
                            Render 3D CAD • {activeInspectedPart.materials.split(',')[0]}
                          </span>
                          <span className="bg-indigo-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold text-[11px]">
                            {activeInspectedPart.dimensions.split('|')[0]}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Technical Description */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-indigo-600" />
                        Descrição Técnica & Funcionamento:
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {activeInspectedPart.description}
                      </p>
                    </div>

                    {/* Engineering Principles & Thermodynamics */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        Princípios de Física & Termodinâmica:
                      </div>
                      <div className="text-xs text-slate-700 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 leading-relaxed font-mono">
                        {activeInspectedPart.engineeringPrinciples}
                      </div>
                    </div>

                    {/* Structural & Fluid Dynamics Analysis */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {activeInspectedPart.structuralAnalysis && (
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                          <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider mb-1 flex items-center gap-1"><Wrench className="w-3 h-3"/> Análise Estrutural (FEA)</span>
                          <span className="text-slate-700 leading-relaxed text-[11px]">
                            {activeInspectedPart.structuralAnalysis}
                          </span>
                        </div>
                      )}
                      {activeInspectedPart.fluidDynamics && (
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                          <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider mb-1 flex items-center gap-1"><Droplets className="w-3 h-3"/> Dinâmica de Fluidos (CFD)</span>
                          <span className="text-slate-700 leading-relaxed text-[11px]">
                            {activeInspectedPart.fluidDynamics}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Joinville Justification & Statistics */}
                    {activeInspectedPart.joinvilleDataJustification && (
                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                          Justificativa para Joinville (Dados Reais):
                        </div>
                        <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 leading-relaxed">
                          {activeInspectedPart.joinvilleDataJustification}
                        </div>
                      </div>
                    )}

                    {/* FreeCAD 3D Modeling Specifications */}
                    <div className="space-y-2 pt-1 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-blue-600" />
                        Modelagem no FreeCAD:
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Bancada FreeCAD:</span>
                          <span className="font-semibold text-slate-800 font-mono text-[11px]">
                            {activeInspectedPart.freecadWorkbench}
                          </span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] text-slate-400 block">Operação Principal:</span>
                          <span className="font-semibold text-slate-800 font-mono text-[11px]">
                            {activeInspectedPart.freecadOperation}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* References */}
                    {activeInspectedPart.references && (
                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          Referências de Engenharia:
                        </div>
                        <div className="text-[10px] text-slate-500 leading-relaxed italic">
                          {activeInspectedPart.references}
                        </div>
                      </div>
                    )}

                    {/* Navigation between locomotive parts */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          const currIdx = LOCOMOTIVE_PARTS.findIndex(p => p.id === activeInspectedPart.id);
                          const prevIdx = (currIdx - 1 + LOCOMOTIVE_PARTS.length) % LOCOMOTIVE_PARTS.length;
                          setActiveInspectedPart(LOCOMOTIVE_PARTS[prevIdx]);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Peça Anterior
                      </button>

                      <span className="text-[11px] font-mono text-slate-400">
                        {LOCOMOTIVE_PARTS.findIndex(p => p.id === activeInspectedPart.id) + 1} de {LOCOMOTIVE_PARTS.length}
                      </span>

                      <button
                        onClick={() => {
                          const currIdx = LOCOMOTIVE_PARTS.findIndex(p => p.id === activeInspectedPart.id);
                          const nextIdx = (currIdx + 1) % LOCOMOTIVE_PARTS.length;
                          setActiveInspectedPart(LOCOMOTIVE_PARTS[nextIdx]);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition"
                      >
                        Próxima Peça
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                    Selecione uma peça na coluna à esquerda para ver suas especificações completas de engenharia
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span>Locomotiva equipada com combustão catalítica de Hidrogênio Verde (H₂)</span>
              </div>
              <button
                onClick={() => setShowLocomotiveGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-xs"
              >
                Voltar ao Jogo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: SUSTAINABLE CLEAN STEAM RESEARCH & SOLUTION ─── */}
      {showCleanSteamModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white flex items-center justify-between border-b border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Solução de Vapor Sustentável e Limpo
                    <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold">
                      Zero Emissão Tóxica
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    Engenharia sustentável com Hidrogênio Verde e Biometano para a saúde dos idosos e da cidade de Joinville
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCleanSteamModal(false)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
              {/* Chemical Reaction Highlight Banner */}
              <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    Reação Química da Combustão Catalítica
                  </span>
                  <span className="text-[11px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                    100% Vapor de Água (H₂O)
                  </span>
                </div>
                <div className="text-center py-2 bg-emerald-950/60 rounded-xl border border-emerald-500/30">
                  <div className="font-mono text-xl md:text-2xl font-extrabold text-emerald-300 tracking-wider">
                    2 H₂ + O₂ → 2 H₂O + Calor (Zero CO₂, Zero SO₂, Zero Fuligem)
                  </div>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  A queima catalítica em maçaricos microporosos oxida o Hidrogênio Verde a 1.200 °C sem produzir óxidos de nitrogênio (NOx). A pluma visível na chaminé é unicamente <strong>vapor de água puro e cristalino</strong>, inofensivo ao sistema respiratório dos passageiros e da comunidade.
                </p>
              </div>

              {/* 4 Pillars of the Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                    <Droplets className="w-4 h-4" />
                    Recuperação de Água por Condensação
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    O tender da locomotiva possui radiadores condensadores de alumínio no teto que recuperam até <strong>65% do vapor exalado</strong>, reconvertendo-o em água destilada para retroalimentar a caldeira, gerando enorme economia hídrica.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                    <HeartPulse className="w-4 h-4" />
                    Proteção à Saúde da Terceira Idade
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Locomotivas antigas a carvão expeliam cinzas e fuligem com partículas PM2.5 prejudiciais aos idosos e PCDs. O vapor limpo age inclusive como <strong>umidificador suave</strong> nas estações climatizadas de Joinville.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                    <Flame className="w-4 h-4" />
                    Biometano como Suporte de Partida
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Produzido a partir de resíduos orgânicos e biomassa de Santa Catarina, o biometano purificado (98% CH₄) é utilizado para o acendimento inicial da caldeira até alcançar a temperatura ideal do catalisador cerâmico.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
                    <Layers className="w-4 h-4" />
                    Tanques Tipo IV em Fibra de Carbono
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    O hidrogênio é acondicionado no tender em 4 cilindros compósitos com liner de polímero de alta densidade e envoltória de fibra de carbono a <strong>350 bar</strong>, com válvulas térmicas automáticas de alívio de segurança (TPRD).
                  </p>
                </div>
              </div>

              {/* Comparison Table: Classic Coal vs Joinville Clean Steam */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-3.5 bg-slate-100 font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>Comparativo Tecnológico: Tradicional vs. Eco-Vapor Sustentável</span>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Parâmetro</th>
                        <th className="p-2.5">Locomotiva Tradicional (Carvão)</th>
                        <th className="p-2.5 text-emerald-700 font-bold">Locomotiva Joinville (H₂ Verde)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-800">Emissão de CO₂</td>
                        <td className="p-2.5 text-red-600">2,8 kg CO₂ / kg de carvão</td>
                        <td className="p-2.5 text-emerald-600 font-bold">0,00 kg (Zero Emissão)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-800">Dióxido de Enxofre (SO₂)</td>
                        <td className="p-2.5 text-red-600">Presente (Chuva ácida)</td>
                        <td className="p-2.5 text-emerald-600 font-bold">Inexistente (Zero Enxofre)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-800">Composição do Escape</td>
                        <td className="p-2.5 text-red-600">Cinzas, alcatrão e fuligem</td>
                        <td className="p-2.5 text-emerald-600 font-bold">Vapor de água puro (H₂O)</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold text-slate-800">Impacto para Idosos/PCDs</td>
                        <td className="p-2.5 text-red-600">Irritação pulmonar e ocular</td>
                        <td className="p-2.5 text-emerald-600 font-bold">Ar puro e umidificado na estação</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                Tecnologia certificada para o trajeto urbano Joinville Acessível
              </span>
              <button
                onClick={() => setShowCleanSteamModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition shadow-xs"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
