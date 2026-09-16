import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Building2, 
  Accessibility, 
  Heart, 
  GraduationCap, 
  Layers, 
  Camera, 
  Info, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  Maximize2, 
  Sun, 
  Moon, 
  RotateCcw,
  Train,
  MapPin,
  Move
} from 'lucide-react';

interface HotspotInfo {
  id: string;
  title: string;
  category: 'nbr9050' | 'elderly' | 'students' | 'railway';
  position: [number, number, number];
  normative: string;
  dimensions: string;
  description: string;
  benefit: string;
}

const ARCHITECTURAL_HOTSPOTS: HotspotInfo[] = [
  {
    id: 'vao_zero',
    title: 'Sistema "Vão Zero" & Nivelamento Dinâmico (Gap Filler)',
    category: 'nbr9050',
    position: [2.5, 1.3, 2],
    normative: 'NBR 9050:2020 • Item 10.3 & UIC 560',
    dimensions: 'Vão horizontal < 20 mm • Desnível vertical < 10 mm',
    description: 'Borda mecânica retrátil pneumática que se projeta automaticamente ao parar na estação, eliminando totalmente o perigoso vão entre a plataforma e o piso do trem.',
    benefit: 'Permite que cadeirantes, idosos com andadores e carrinhos de bebê embarquem e desembarquem com 100% de autonomia e sem risco de acidentes.'
  },
  {
    id: 'rampa_acessivel',
    title: 'Rampa de Acesso Universal NBR 9050',
    category: 'nbr9050',
    position: [9.5, 0.7, -12],
    normative: 'NBR 9050:2020 • Item 6.6 (Tabela de Inclinações)',
    dimensions: 'Inclinação suave de 6% (1:16.6) • Largura livre: 1.80 m',
    description: 'Rampa contínua com patamares de descanso a cada 50 metros de desnível, piso antiderrapante e guia de balizamento nas laterais.',
    benefit: 'Garante acesso confortável e seguro para pessoas com mobilidade reduzida e idosos sem causar fadiga muscular.'
  },
  {
    id: 'corrimão_duplo',
    title: 'Corrimãos Duplos e Guia de Balizamento',
    category: 'nbr9050',
    position: [8.8, 1.2, -12],
    normative: 'NBR 9050:2020 • Item 6.9',
    dimensions: 'Alturas de 0.70 m e 0.92 m • Seção circular Ø 40 mm',
    description: 'Corrimãos em aço inoxidável escovado contínuos em ambos os lados, com prolongamento de 30 cm no início e fim e identificação tátil em braille.',
    benefit: 'Atende perfeitamente tanto adultos e idosos quanto crianças e pessoas em cadeira de rodas.'
  },
  {
    id: 'piso_tátil',
    title: 'Piso Podotátil Direcional e de Alerta',
    category: 'nbr9050',
    position: [2.8, 1.05, 0],
    normative: 'NBR 9050:2020 • Item 5.4 e NBR 16537',
    dimensions: 'Faixa de alerta de 40 cm na borda • Piso direcional de 30 cm de largura',
    description: 'Piso em relevo tátil de alto contraste cromático (amarelo segurança). O piso de alerta sinaliza a proximidade dos trilhos e o direcional guia até as portas e elevadores.',
    benefit: 'Garante orientação espacial autônoma e segura para pessoas cegas ou com baixa visão ao longo de toda a estação.'
  },
  {
    id: 'elevador_panorâmico',
    title: 'Elevador Panorâmico Acessível de Transposição',
    category: 'nbr9050',
    position: [6.5, 3.2, -4],
    normative: 'NBR NM 313 & NBR 9050',
    dimensions: 'Cabine: 1.40 m × 1.70 m • Porta livre: 0.90 m',
    description: 'Elevador de vidro laminado transparente com sinalização por voz, botoeiras táteis com braille em altura acessível (0.90 m a 1.20 m) e espelho de fundo.',
    benefit: 'Permite transposição entre plataformas e mezanino sem barreiras arquitetônicas, com segurança visual e conforto.'
  },
  {
    id: 'locomotiva_vapor',
    title: 'Locomotiva Histórica a Vapor nº 11 de Joinville',
    category: 'railway',
    position: [-2.5, 1.8, -10],
    normative: 'Patrimônio Ferroviário IPHAN / Fundação Cultural de Joinville',
    dimensions: 'Bitola Métrica (1.000 mm) • Rodagem 4-6-0 • Caldeira 12 bar',
    description: 'Locomotiva histórica a vapor restaurada como museu vivo sobre trilhos. Conecta o passado industrial de Joinville à mobilidade limpa e acessível do futuro.',
    benefit: 'Turismo cultural acessível, preservação da memória ferroviária catarinense e educação técnica para jovens estudantes.'
  },
  {
    id: 'vlt_moderno',
    title: 'VLT Articulado Elétrico 100% Piso Baixo',
    category: 'railway',
    position: [1.3, 1.4, 4],
    normative: 'Norma Ferroviária ABNT NBR 14006 / EN 12663',
    dimensions: 'Capacidade: 280 passageiros • Piso baixo contínuo a 350 mm do boleto',
    description: 'Composição moderna com portas automáticas extra-largas (1.40 m), espaço dedicado para cadeirantes com cinto e intercomunicador, e motorização elétrica síncrona de emissão zero.',
    benefit: 'Transporte rápido, limpo e suave ligando os bairros ao Centro e às universidades de Joinville sem degraus.'
  },
  {
    id: 'praca_idosos',
    title: 'Espaço de Convivência da Terceira Idade & Rua das Palmeiras',
    category: 'elderly',
    position: [-10.5, 0.6, 5],
    normative: 'Diretrizes OMS de Cidades Amigas da Pessoa Idosa',
    dimensions: 'Bancos ergonômicos com altura de assento a 46 cm • Apoios de braço intermediários',
    description: 'Área sombreada por Ipês e Palmeiras Imperiais com calçadas niveladas sem desníveis, piso com coeficiente de atrito seguro e iluminação suave de 3000K.',
    benefit: 'Estimula o convívio social, caminhadas seguras e descanso confortável com apoio biomecânico para se levantar sem esforço.'
  },
  {
    id: 'ciclovia_estudantes',
    title: 'Ciclovia Segregada & Conexão Estudantil Univille/UDESC',
    category: 'students',
    position: [-8.0, 0.4, -6],
    normative: 'Manual de Desenho Urbano Cicloviário & NBR 9050',
    dimensions: 'Largura: 2.50 m bidirecional • Pavimento asfáltico poroso drenante',
    description: 'Pista ciclopedonal protegida por canteiro verde, interligando o ramal ferroviário diretamente aos campi universitários e ao Ágora Tech Park.',
    benefit: 'Mobilidade ativa e econômica para jovens estudantes, com bicicletário seguro integrado ao terminal do trem.'
  }
];

export default function JoinvilleAccessible3DPlan() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotInfo>(ARCHITECTURAL_HOTSPOTS[0]);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [showPeople, setShowPeople] = useState<boolean>(true);
  const [showTrains, setShowTrains] = useState<boolean>(true);
  const [showNBR9050, setShowNBR9050] = useState<boolean>(true);
  const [isAnimated, setIsAnimated] = useState<boolean>(true);

  // Scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const peopleGroupRef = useRef<THREE.Group | null>(null);
  const trainsGroupRef = useRef<THREE.Group | null>(null);
  const nbrGroupRef = useRef<THREE.Group | null>(null);
  const vltMeshRef = useRef<THREE.Group | null>(null);
  const steamPuffGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 520;

    // 1. SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isNightMode ? 0x090d16 : 0xdbeafe);
    scene.fog = new THREE.FogExp2(isNightMode ? 0x090d16 : 0xe0f2fe, 0.015);

    // 2. CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    camera.position.set(18, 14, 22);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.replaceChildren(renderer.domElement);

    // 4. ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Do not go below ground
    controls.minDistance = 5;
    controls.maxDistance = 65;
    controls.target.set(0, 1.5, 0);
    controlsRef.current = controls;

    // 5. LIGHTING
    const ambientLight = new THREE.AmbientLight(
      isNightMode ? 0x334155 : 0xffffff, 
      isNightMode ? 0.7 : 0.85
    );
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(
      isNightMode ? 0x38bdf8 : 0xfffbeb, 
      isNightMode ? 0.8 : 1.3
    );
    mainSun.position.set(25, 40, 20);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 2048;
    mainSun.shadow.mapSize.height = 2048;
    mainSun.shadow.camera.near = 0.5;
    mainSun.shadow.camera.far = 100;
    mainSun.shadow.camera.left = -25;
    mainSun.shadow.camera.right = 25;
    mainSun.shadow.camera.top = 25;
    mainSun.shadow.camera.bottom = -25;
    scene.add(mainSun);

    // Warm station lights for NBR 9050 lighting
    const stationLight = new THREE.PointLight(0xffedd5, 1.2, 25);
    stationLight.position.set(4, 4, 0);
    scene.add(stationLight);

    // GROUPS FOR FILTERABLE LAYERS
    const groundGroup = new THREE.Group();
    const railwayGroup = new THREE.Group();
    const stationGroup = new THREE.Group();
    const peopleGroup = new THREE.Group();
    const nbrElementsGroup = new THREE.Group();
    const trainsGroup = new THREE.Group();
    const urbanSceneryGroup = new THREE.Group();
    const steamPuffsGroup = new THREE.Group();

    peopleGroupRef.current = peopleGroup;
    trainsGroupRef.current = trainsGroup;
    nbrGroupRef.current = nbrElementsGroup;
    steamPuffGroupRef.current = steamPuffsGroup;

    scene.add(groundGroup);
    scene.add(railwayGroup);
    scene.add(stationGroup);
    scene.add(peopleGroup);
    scene.add(nbrElementsGroup);
    scene.add(trainsGroup);
    scene.add(urbanSceneryGroup);
    scene.add(steamPuffsGroup);

    // -------------------------------------------------------------
    // A. GROUND & URBAN TOPOGRAPHY (JOINVILLE MASTERPLAN)
    // -------------------------------------------------------------
    // Main terrain plane
    const groundGeom = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({ 
      color: isNightMode ? 0x0f172a : 0xf1f5f9, 
      roughness: 0.9 
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    groundGroup.add(ground);

    // Rio Cachoeira Canal (Joinville waterway)
    const riverGeom = new THREE.BoxGeometry(7, 0.4, 80);
    const riverMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x0369a1 : 0x0284c7,
      roughness: 0.2,
      metalness: 0.4,
      transparent: true,
      opacity: 0.85
    });
    const river = new THREE.Mesh(riverGeom, riverMat);
    river.position.set(-17, -0.15, 0);
    groundGroup.add(river);

    // Canal Stone Borders
    [-20.6, -13.4].forEach(x => {
      const border = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.5, 80),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
      );
      border.position.set(x, 0.1, 0);
      groundGroup.add(border);
    });

    // Accessible Pedestrian Bridge over Rio Cachoeira
    const bridgeGroup = new THREE.Group();
    bridgeGroup.position.set(-17, 0.35, 4);
    const bridgeDeck = new THREE.Mesh(
      new THREE.BoxGeometry(7.6, 0.25, 4.0),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0 })
    );
    bridgeGroup.add(bridgeDeck);

    // Bridge Guardrails (NBR 9050 1.10m height)
    [-1.9, 1.9].forEach(z => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(7.6, 0.9, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.8 })
      );
      rail.position.set(0, 0.55, z);
      bridgeGroup.add(rail);
    });
    groundGroup.add(bridgeGroup);

    // Pedestrian Promenade with Paving
    const plazaGeom = new THREE.BoxGeometry(16, 0.05, 38);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 });
    const plaza = new THREE.Mesh(plazaGeom, plazaMat);
    plaza.position.set(-8, 0.02, 2);
    groundGroup.add(plaza);

    // Segregated Bicycle Lane (Joinville Ciclovia)
    const bikeGeom = new THREE.BoxGeometry(2.5, 0.06, 50);
    const bikeMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.7 }); // Emerald green asphalt
    const bikeLane = new THREE.Mesh(bikeGeom, bikeMat);
    bikeLane.position.set(-8.5, 0.03, 0);
    groundGroup.add(bikeLane);

    // -------------------------------------------------------------
    // B. DETAILED RAILWAY CORRIDOR (TRILHOS, DORMENTES & CATENÁRIA)
    // -------------------------------------------------------------
    // Crushed Stone Ballast (Balastro de Brita)
    const ballastGeom = new THREE.BoxGeometry(8.2, 0.35, 70);
    const ballastMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 });
    const ballast = new THREE.Mesh(ballastGeom, ballastMat);
    ballast.position.set(0, 0.15, 0);
    ballast.receiveShadow = true;
    railwayGroup.add(ballast);

    // Concrete Sleepers (Dormentes de Concreto Protendido)
    const sleeperGeom = new THREE.BoxGeometry(2.6, 0.16, 0.28);
    const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 });
    
    // Double track: Track 1 (VLT at x=1.4) and Track 2 (Locomotive / Freight at x=-1.8)
    for (let z = -34; z <= 34; z += 0.8) {
      // Track 1
      const slp1 = new THREE.Mesh(sleeperGeom, sleeperMat);
      slp1.position.set(1.4, 0.38, z);
      railwayGroup.add(slp1);

      // Track 2
      const slp2 = new THREE.Mesh(sleeperGeom, sleeperMat);
      slp2.position.set(-2.2, 0.38, z);
      railwayGroup.add(slp2);
    }

    // Steel Rails (Trilhos de Aço Reluzente UIC 60)
    const railGeom = new THREE.BoxGeometry(0.08, 0.14, 70);
    const railMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.85, roughness: 0.25 });

    // Track 1 rails (1.00m meter gauge)
    const r1L = new THREE.Mesh(railGeom, railMat);
    r1L.position.set(0.9, 0.5, 0);
    const r1R = new THREE.Mesh(railGeom, railMat);
    r1R.position.set(1.9, 0.5, 0);
    railwayGroup.add(r1L, r1R);

    // Track 2 rails
    const r2L = new THREE.Mesh(railGeom, railMat);
    r2L.position.set(-2.7, 0.5, 0);
    const r2R = new THREE.Mesh(railGeom, railMat);
    r2R.position.set(-1.7, 0.5, 0);
    railwayGroup.add(r2L, r2R);

    // Catenary Electrification Poles & Contact Wires (Linha Aérea do VLT)
    const poleGeom = new THREE.CylinderGeometry(0.1, 0.12, 6.5);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x64748b });

    for (let z = -30; z <= 30; z += 15) {
      const pole = new THREE.Mesh(poleGeom, poleMat);
      pole.position.set(-0.4, 3.25, z);
      railwayGroup.add(pole);

      // Cantilever arm (Braço de suporte)
      const arm = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.08, 0.08), poleMat);
      arm.position.set(0.9, 6.2, z);
      railwayGroup.add(arm);

      // Insulator
      const ins = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35), new THREE.MeshStandardMaterial({ color: 0xa855f7 }));
      ins.position.set(1.4, 6.0, z);
      railwayGroup.add(ins);
    }

    // Overhead wire spanning the scene
    const overheadWire = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 70), wireMat);
    overheadWire.position.set(1.4, 5.8, 0);
    railwayGroup.add(overheadWire);

    // -------------------------------------------------------------
    // C. ACCESSIBLE STATION ARCHITECTURE (NBR 9050 ESTAÇÃO CENTRAL)
    // -------------------------------------------------------------
    // Platform Slab (Plataforma Elevada NBR 9050 - Nível Exato com Trem)
    const platformGeom = new THREE.BoxGeometry(5.0, 0.95, 34);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
    const platform = new THREE.Mesh(platformGeom, platformMat);
    platform.position.set(4.9, 0.48, 1);
    platform.receiveShadow = true;
    stationGroup.add(platform);

    // Modern Curved Canopy Roof (Cobertura Sustentável com Placas Solares)
    const canopyCurve = new THREE.Mesh(
      new THREE.BoxGeometry(6.5, 0.15, 36),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.8, roughness: 0.2 })
    );
    canopyCurve.position.set(5.5, 4.4, 1);
    canopyCurve.rotation.z = -0.05;
    stationGroup.add(canopyCurve);

    // Solar PV Panels on Station Roof
    for (let pz = -14; pz <= 16; pz += 3.5) {
      const solarPanel = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 0.06, 2.8),
        new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.7, roughness: 0.3 })
      );
      solarPanel.position.set(5.5, 4.52, pz);
      solarPanel.rotation.z = -0.05;
      stationGroup.add(solarPanel);
    }

    // Station Structural Steel Columns
    for (let pz = -14; pz <= 16; pz += 7) {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 4.4),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      col.position.set(6.8, 2.2, pz);
      stationGroup.add(col);
    }

    // -------------------------------------------------------------
    // D. NBR 9050 SPECIFIC ELEMENTS (PISO TÁTIL, VÃO ZERO, RAMPA, ELEVADOR)
    // -------------------------------------------------------------
    // 1. Podotátil de Alerta Amarelo na borda da plataforma
    const podoAlertaGeom = new THREE.BoxGeometry(0.4, 0.03, 34);
    const podoAlertaMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 }); // Bright Safety Yellow
    const podoAlerta = new THREE.Mesh(podoAlertaGeom, podoAlertaMat);
    podoAlerta.position.set(2.6, 0.97, 1);
    nbrElementsGroup.add(podoAlerta);

    // 2. Podotátil Direcional Azul/Amarelo cruzando a plataforma
    const podoDirecional = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.02, 30),
      new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.5 })
    );
    podoDirecional.position.set(4.2, 0.96, 1);
    nbrElementsGroup.add(podoDirecional);

    // Transverse directional lines leading to doors and elevator
    [-8, 0, 8].forEach(pz => {
      const transLine = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.02, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x2563eb })
      );
      transLine.position.set(3.4, 0.96, pz);
      nbrElementsGroup.add(transLine);
    });

    // 3. Dynamic Gap Filler "Vão Zero" (Borda Mecânica Pneumática Estendida)
    const gapFillerGeom = new THREE.BoxGeometry(0.28, 0.08, 14);
    const gapFillerMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 });
    const gapFiller = new THREE.Mesh(gapFillerGeom, gapFillerMat);
    gapFiller.position.set(2.32, 0.93, 2);
    nbrElementsGroup.add(gapFiller);

    // 4. Accessibility Ramp NBR 9050 (6% slope) at station south end
    const rampGroup = new THREE.Group();
    rampGroup.position.set(4.9, 0, -16);

    const rampLength = 16;
    const rampGeom = new THREE.BoxGeometry(3.0, 0.15, rampLength);
    const rampMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    const ramp = new THREE.Mesh(rampGeom, rampMat);
    // Slope calculation: 0.95m rise over 16m run = ~5.9%
    ramp.rotation.x = -Math.atan2(0.95, rampLength);
    ramp.position.set(0, 0.48, -rampLength / 2);
    rampGroup.add(ramp);

    // Yellow tactile strip on ramp start and finish
    const rampTactileStart = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.04, 0.6), podoAlertaMat);
    rampTactileStart.position.set(0, 0.02, -rampLength);
    rampGroup.add(rampTactileStart);

    // Double Handrails on Ramp (70cm and 92cm)
    [-1.45, 1.45].forEach(rx => {
      // Lower handrail (70cm)
      const hrLow = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, rampLength),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
      );
      hrLow.rotation.x = Math.PI / 2 - Math.atan2(0.95, rampLength);
      hrLow.position.set(rx, 0.7 + 0.48, -rampLength / 2);
      rampGroup.add(hrLow);

      // Upper handrail (92cm)
      const hrHigh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, rampLength),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 })
      );
      hrHigh.rotation.x = Math.PI / 2 - Math.atan2(0.95, rampLength);
      hrHigh.position.set(rx, 0.92 + 0.48, -rampLength / 2);
      rampGroup.add(hrHigh);

      // Vertical Support posts
      for (let pz = 0; pz >= -rampLength; pz -= 3) {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.03, 1.1),
          new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 })
        );
        const yNorm = (1 + pz / rampLength) * 0.95;
        post.position.set(rx, yNorm + 0.55, pz);
        rampGroup.add(post);
      }
    });
    nbrElementsGroup.add(rampGroup);

    // 5. Panoramic Glass Elevator Tower
    const elevatorTower = new THREE.Group();
    elevatorTower.position.set(6.8, 0, -4);

    // Steel Frame
    const elevFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 7.2, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, wireframe: false, roughness: 0.3 })
    );
    elevFrame.position.y = 3.6;

    // Glass walls
    const elevGlass = new THREE.Mesh(
      new THREE.BoxGeometry(2.35, 7.1, 2.35),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.1 })
    );
    elevGlass.position.y = 3.6;
    elevatorTower.add(elevGlass);

    // Elevator Cabin inside
    const cabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 2.4, 1.9),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.4 })
    );
    cabin.position.y = 2.2;
    elevatorTower.add(cabin);

    // Braille call button totem outside
    const buttonTotem = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 1.1, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6 })
    );
    buttonTotem.position.set(-1.4, 0.95 + 0.55, 0);
    elevatorTower.add(buttonTotem);

    nbrElementsGroup.add(elevatorTower);

    // 6. Senior Ergonomic Benches with Armrests on Platform and Plaza
    const benchPositions = [
      { x: 5.8, y: 0.95, z: 8, rot: 0 },
      { x: 5.8, y: 0.95, z: -8, rot: 0 },
      { x: -10.5, y: 0.05, z: 5, rot: Math.PI / 2 },
      { x: -10.5, y: 0.05, z: 9, rot: Math.PI / 2 }
    ];

    benchPositions.forEach(bp => {
      const benchGroup = new THREE.Group();
      benchGroup.position.set(bp.x, bp.y, bp.z);
      benchGroup.rotation.y = bp.rot;

      // Wooden slats
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.08, 0.55),
        new THREE.MeshStandardMaterial({ color: 0xb45309 })
      );
      seat.position.set(0, 0.46, 0);
      benchGroup.add(seat);

      const back = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.45, 0.06),
        new THREE.MeshStandardMaterial({ color: 0xb45309 })
      );
      back.position.set(0, 0.72, 0.24);
      benchGroup.add(back);

      // Ergonomic Center and Side Armrests (NBR 9050 for seniors)
      [-1.0, 0, 1.0].forEach(ax => {
        const armrest = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.26, 0.5),
          new THREE.MeshStandardMaterial({ color: 0x1e293b })
        );
        armrest.position.set(ax, 0.58, 0);
        benchGroup.add(armrest);
      });

      nbrElementsGroup.add(benchGroup);
    });

    // -------------------------------------------------------------
    // E. LOCOMOTIVES & TRAINS (HISTÓRICA A VAPOR & VLT MODERNO)
    // -------------------------------------------------------------
    // 1. MODERN ACCESSIBLE VLT (Articulated Low-Floor Electric Train)
    const vltGroup = new THREE.Group();
    vltGroup.position.set(1.4, 0, 2);
    vltMeshRef.current = vltGroup;

    // Front Aerodynamic Car
    const vltBodyGeom = new THREE.BoxGeometry(2.4, 2.7, 12);
    const vltBodyMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.2 });
    const vltBody = new THREE.Mesh(vltBodyGeom, vltBodyMat);
    vltBody.position.y = 1.9;
    vltGroup.add(vltBody);

    // White accent wrap
    const vltStripe = new THREE.Mesh(
      new THREE.BoxGeometry(2.42, 0.4, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    vltStripe.position.y = 1.7;
    vltGroup.add(vltStripe);

    // Panoramic Windows
    const vltWindow = new THREE.Mesh(
      new THREE.BoxGeometry(2.44, 0.9, 10.5),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1 })
    );
    vltWindow.position.y = 2.35;
    vltGroup.add(vltWindow);

    // Double Sliding Doors (1.40m wide NBR 14006 low-floor access)
    [-2.8, 2.8].forEach(dz => {
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 2.1, 1.6),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
      );
      door.position.set(1.22, 1.6, dz);
      vltGroup.add(door);
    });

    // Roof Pantograph
    const pantograph = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.4),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 })
    );
    pantograph.rotation.x = Math.PI / 4;
    pantograph.position.set(0, 3.8, -2);
    vltGroup.add(pantograph);

    trainsGroup.add(vltGroup);

    // 2. HISTORIC STEAM LOCOMOTIVE Nº 11 DE JOINVILLE
    const steamGroup = new THREE.Group();
    steamGroup.position.set(-2.2, 0, -10);

    // Boiler (Cilindro preto)
    const boiler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 5.2, 20),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.6, roughness: 0.4 })
    );
    boiler.rotation.x = Math.PI / 2;
    boiler.position.set(0, 1.8, 0);
    steamGroup.add(boiler);

    // Brass boiler rings (Anéis de Latão Dourado)
    [-1.6, -0.6, 0.4, 1.4].forEach(bz => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.96, 0.03, 8, 24),
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 })
      );
      ring.position.set(0, 1.8, bz);
      steamGroup.add(ring);
    });

    // Cab (Cabine do Maquinista)
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 2.1, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x065f46 }) // Deep green heritage color
    );
    cab.position.set(0, 2.0, -2.5);
    steamGroup.add(cab);

    // Smokestack (Chaminé de Vapor)
    const smokestack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.2, 1.1, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f172a })
    );
    smokestack.position.set(0, 3.0, 1.9);
    steamGroup.add(smokestack);

    // Front Headlight (Farol Central Histórico)
    const headlight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.24, 0.4, 16),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8 })
    );
    headlight.rotation.x = Math.PI / 2;
    headlight.position.set(0, 2.0, 2.7);
    steamGroup.add(headlight);

    const lightBulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    lightBulb.position.set(0, 2.0, 2.9);
    steamGroup.add(lightBulb);

    // Driving Wheels (Rodas Motrizes de Raios Metálicos)
    const driveWheelMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.7 });
    [-1.2, 0.1, 1.4].forEach(wz => {
      [-0.85, 0.85].forEach(wx => {
        const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.14, 16), driveWheelMat);
        wh.rotation.z = Math.PI / 2;
        wh.position.set(wx, 0.65, wz);
        steamGroup.add(wh);
      });
    });

    // Connecting Side Rod (Biela Mecânica)
    [-0.94, 0.94].forEach(wx => {
      const rod = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.1, 2.7),
        new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 })
      );
      rod.position.set(wx, 0.45, 0.1);
      steamGroup.add(rod);
    });

    // Coal & Water Tender Wagon
    const tender = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.6, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 })
    );
    tender.position.set(0, 1.5, -5.2);
    steamGroup.add(tender);

    // Real-time steam particles rising from locomotive
    for (let i = 0; i < 18; i++) {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(0.25 + Math.random() * 0.35, 7, 7),
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 })
      );
      puff.position.set(
        -2.2 + (Math.random() * 0.4 - 0.2),
        3.5 + Math.random() * 2.5,
        -10 + 1.9 - Math.random() * 1.5
      );
      steamPuffsGroup.add(puff);
    }

    trainsGroup.add(steamGroup);

    // -------------------------------------------------------------
    // F. DETAILED 3D PEOPLE (PCD, IDOSOS, ESTUDANTES & CONDUTORES)
    // -------------------------------------------------------------
    function createPersonFigure({
      type,
      colorShirt,
      colorPants,
      hasCane = false,
      hasBackpack = false
    }: {
      type: 'standing' | 'wheelchair' | 'seated';
      colorShirt: number;
      colorPants: number;
      hasCane?: boolean;
      hasBackpack?: boolean;
    }) {
      const person = new THREE.Group();

      const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.7 });
      const shirtMat = new THREE.MeshStandardMaterial({ color: colorShirt });
      const pantsMat = new THREE.MeshStandardMaterial({ color: colorPants });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

      if (type === 'wheelchair') {
        // High-tech modern wheelchair
        const chairGroup = new THREE.Group();

        // Big Wheels
        const wheelGeom = new THREE.TorusGeometry(0.35, 0.03, 8, 16);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8 });
        [-0.32, 0.32].forEach(wx => {
          const w = new THREE.Mesh(wheelGeom, wheelMat);
          w.rotation.y = Math.PI / 2;
          w.position.set(wx, 0.38, 0);
          chairGroup.add(w);
        });

        // Small front castors
        [-0.26, 0.26].forEach(wx => {
          const c = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 8), darkMat);
          c.rotation.z = Math.PI / 2;
          c.position.set(wx, 0.09, 0.32);
          chairGroup.add(c);
        });

        // Frame & Cushion
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.5), darkMat);
        seat.position.set(0, 0.38, 0.08);
        const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.06), darkMat);
        backrest.position.set(0, 0.65, -0.16);
        chairGroup.add(seat, backrest);

        // Seated Person Body
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.5, 0.22), shirtMat);
        torso.position.set(0, 0.68, -0.05);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), skinMat);
        head.position.set(0, 1.02, -0.05);

        // Seated Legs
        const upperLegs = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.44), pantsMat);
        upperLegs.position.set(0, 0.46, 0.16);

        const lowerLegs = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.36, 0.14), pantsMat);
        lowerLegs.position.set(0, 0.25, 0.36);

        person.add(chairGroup, torso, head, upperLegs, lowerLegs);
      } else {
        // Standing Person (Adult, Senior or Student)
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.55, 0.22), shirtMat);
        torso.position.y = 1.05;

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), skinMat);
        head.position.y = 1.45;

        // Legs
        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.16), pantsMat);
        legL.position.set(-0.11, 0.4, 0);
        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.16), pantsMat);
        legR.position.set(0.11, 0.4, 0);

        person.add(torso, head, legL, legR);

        if (hasBackpack) {
          const backpack = new THREE.Mesh(
            new THREE.BoxGeometry(0.32, 0.42, 0.18),
            new THREE.MeshStandardMaterial({ color: 0x0284c7 }) // Blue student backpack
          );
          backpack.position.set(0, 1.08, -0.18);
          person.add(backpack);
        }

        if (hasCane) {
          const cane = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.015, 0.9),
            new THREE.MeshStandardMaterial({ color: 0x78350f })
          );
          cane.position.set(0.28, 0.45, 0.15);
          cane.rotation.z = -0.1;
          person.add(cane);
        }
      }

      return person;
    }

    // Spawn Persons in Key Accessibility Spots:
    // 1. Lucas (PCD Cadeirante) waiting on platform to board VLT
    const lucasPCD = createPersonFigure({
      type: 'wheelchair',
      colorShirt: 0x2563eb,
      colorPants: 0x1e293b
    });
    lucasPCD.position.set(3.8, 0.97, 2.0); // Movido para fora do vagão
    lucasPCD.rotation.y = -Math.PI / 2; // Facing the train door
    peopleGroup.add(lucasPCD);

    // 2. Dona Helena (Idosa com Bengala) on platform waiting area
    const donaHelena = createPersonFigure({
      type: 'standing',
      colorShirt: 0xd97706, // Warm amber sweater
      colorPants: 0x475569,
      hasCane: true
    });
    donaHelena.position.set(4.5, 0.96, 6.0);
    peopleGroup.add(donaHelena);

    // 3. Mateus (Jovem Estudante Univille) with backpack
    const mateusStudent = createPersonFigure({
      type: 'standing',
      colorShirt: 0x10b981, // Emerald green
      colorPants: 0x1e3a8a, // Jeans
      hasBackpack: true
    });
    mateusStudent.position.set(3.8, 0.96, -2.5);
    peopleGroup.add(mateusStudent);

    // 4. Seated Seniors resting on Plaza Benches
    const seniorResting = createPersonFigure({
      type: 'standing',
      colorShirt: 0x9333ea,
      colorPants: 0x334155,
      hasCane: true
    });
    seniorResting.position.set(-10.5, 0.05, 5.0);
    peopleGroup.add(seniorResting);

    // 5. Visually Impaired Passenger using Tactile Strip
    const blindPassenger = createPersonFigure({
      type: 'standing',
      colorShirt: 0xe11d48,
      colorPants: 0x1e293b,
      hasCane: true
    });
    blindPassenger.position.set(4.2, 0.96, -7.0);
    peopleGroup.add(blindPassenger);

    // 6. Station Master / Conductor
    const conductor = createPersonFigure({
      type: 'standing',
      colorShirt: 0x0f172a, // Official navy uniform
      colorPants: 0x0f172a
    });
    conductor.position.set(3.2, 0.96, 0);
    peopleGroup.add(conductor);

    // -------------------------------------------------------------
    // G. URBAN VEGETATION & ARCHITECTURE (JOINVILLE'S PALMEIRAS & ENXAIMEL)
    // -------------------------------------------------------------
    // Iconic Imperial Palm Trees (Rua das Palmeiras de Joinville)
    for (let pz = -25; pz <= 25; pz += 7) {
      const palmGroup = new THREE.Group();
      palmGroup.position.set(-13, 0, pz);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.28, 7.5, 10),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
      );
      trunk.position.y = 3.75;
      palmGroup.add(trunk);

      // Fronds / Palm Leaves
      for (let fr = 0; fr < 8; fr++) {
        const frond = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.06, 0.35),
          new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 })
        );
        frond.rotation.y = (fr * Math.PI) / 4;
        frond.rotation.z = -0.3;
        frond.position.set(0, 7.5, 0);
        palmGroup.add(frond);
      }
      urbanSceneryGroup.add(palmGroup);
    }

    // Joinville Half-Timbered (Enxaimel) Historic Station Building
    const enxaimelHouse = new THREE.Group();
    enxaimelHouse.position.set(11, 0, 0);

    const houseBase = new THREE.Mesh(
      new THREE.BoxGeometry(6, 4.5, 14),
      new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.7 })
    );
    houseBase.position.y = 2.25;
    enxaimelHouse.add(houseBase);

    // Dark timber beams
    for (let bz = -6; bz <= 6; bz += 2.5) {
      const vBeam = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 4.5, 0.25),
        new THREE.MeshStandardMaterial({ color: 0x451a03 })
      );
      vBeam.position.set(-3.02, 2.25, bz);
      enxaimelHouse.add(vBeam);
    }

    // Ceramic Pitched Roof
    const roofGeom = new THREE.ConeGeometry(5.2, 2.4, 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 });
    const roof = new THREE.Mesh(roofGeom, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1, 1, 2.8);
    roof.position.set(0, 5.7, 0);
    enxaimelHouse.add(roof);

    urbanSceneryGroup.add(enxaimelHouse);

    // -------------------------------------------------------------
    // H. ANIMATION LOOP
    // -------------------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gentle movement for VLT and puffs if animated
      if (isAnimated) {
        if (vltMeshRef.current) {
          // Slight oscillation at stop
          vltMeshRef.current.position.y = Math.sin(time * 2) * 0.005;
        }

        if (steamPuffGroupRef.current) {
          steamPuffGroupRef.current.children.forEach((puff, idx) => {
            puff.position.y += delta * 0.6;
            puff.position.x += Math.sin(time * 1.5 + idx) * 0.005;
            puff.scale.addScalar(delta * 0.2);
            if (puff.position.y > 7.5) {
              puff.position.y = 3.2;
              puff.scale.set(1, 1, 1);
            }
          });
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isNightMode, isAnimated]);

  // Handle Layer Visibilities
  useEffect(() => {
    if (peopleGroupRef.current) peopleGroupRef.current.visible = showPeople;
  }, [showPeople]);

  // Trigger resize when fullscreen changes
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  useEffect(() => {
    if (trainsGroupRef.current) trainsGroupRef.current.visible = showTrains;
  }, [showTrains]);

  useEffect(() => {
    if (nbrGroupRef.current) nbrGroupRef.current.visible = showNBR9050;
  }, [showNBR9050]);

  // Smooth camera transitions to hotspots
  const flyToHotspot = (hotspot: HotspotInfo) => {
    setSelectedHotspot(hotspot);
    if (!controlsRef.current || !cameraRef.current) return;

    const [tx, ty, tz] = hotspot.position;
    controlsRef.current.target.set(tx, ty, tz);

    // Offset camera slightly for great viewing angle
    cameraRef.current.position.set(tx + 8, ty + 6, tz + 9);
  };

  const setPresetView = (preset: 'overview' | 'station' | 'trains' | 'ramp' | 'palmeiras') => {
    if (!controlsRef.current || !cameraRef.current) return;

    if (preset === 'overview') {
      controlsRef.current.target.set(0, 1.5, 0);
      cameraRef.current.position.set(22, 18, 26);
    } else if (preset === 'station') {
      controlsRef.current.target.set(3.5, 1.5, 2);
      cameraRef.current.position.set(10, 4.5, 9);
      setSelectedHotspot(ARCHITECTURAL_HOTSPOTS[0]); // Vão Zero
    } else if (preset === 'trains') {
      controlsRef.current.target.set(-1.0, 1.8, -6);
      cameraRef.current.position.set(5, 5, 2);
      setSelectedHotspot(ARCHITECTURAL_HOTSPOTS[5]); // Locomotiva
    } else if (preset === 'ramp') {
      controlsRef.current.target.set(6, 1.2, -14);
      cameraRef.current.position.set(14, 5, -8);
      setSelectedHotspot(ARCHITECTURAL_HOTSPOTS[1]); // Rampa NBR 9050
    } else if (preset === 'palmeiras') {
      controlsRef.current.target.set(-11, 1.5, 4);
      cameraRef.current.position.set(-6, 4, 14);
      setSelectedHotspot(ARCHITECTURAL_HOTSPOTS[7]); // Praça Idosos
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col space-y-4 p-4 md:p-6">
      {/* Header with Title & Live Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Building2 className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              Planta 3D Detalhada de Joinville Acessível
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> NBR 9050:2020
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Visualização 3D arquitetônica do corredor ferroviário intermodal com pessoas, locomotiva histórica, VLT elétrico e estação sem barreiras
          </p>
        </div>

        {/* Quick Camera Preset Pills */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <button
            onClick={() => setPresetView('overview')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
          >
            🏛️ Panorâmica
          </button>
          <button
            onClick={() => setPresetView('station')}
            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-semibold transition"
          >
            🚉 Estação & Vão Zero
          </button>
          <button
            onClick={() => setPresetView('trains')}
            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold transition"
          >
            🚂 Locomotiva & VLT
          </button>
          <button
            onClick={() => setPresetView('ramp')}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold transition"
          >
            ♿ Rampa 6% & Elevador
          </button>
          <button
            onClick={() => setPresetView('palmeiras')}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold transition"
          >
            🌳 Idosos & Palmeiras
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area */}
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'relative w-full h-[460px] md:h-[540px] rounded-2xl border border-slate-800'} overflow-hidden bg-slate-950 shadow-inner flex flex-col`}>
        <div ref={mountRef} className="w-full h-full flex-1 cursor-grab active:cursor-grabbing touch-none" />

        {/* Top Right Controls: Fullscreen */}
        <div className="absolute top-3 right-3 flex items-center gap-2 z-10 pointer-events-auto">
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="bg-slate-900/85 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 text-white shadow-md hover:bg-slate-800 transition flex items-center gap-2"
            title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
          >
            {isFullscreen ? <span className="text-xs font-bold hidden sm:block">Sair</span> : <span className="text-xs font-bold hidden sm:block">Expandir</span>}
            {isFullscreen ? <Maximize2 className="w-4 h-4 rotate-180" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Layer Controls Bar (Top Left) */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 text-white shadow-md flex items-center gap-1.5 z-10">
          <button
            onClick={() => setShowPeople(!showPeople)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              showPeople ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Alternar visibilidade das pessoas"
          >
            👥 Pessoas ({showPeople ? 'ON' : 'OFF'})
          </button>
          <button
            onClick={() => setShowTrains(!showTrains)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              showTrains ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Alternar visibilidade de trens e ferrovias"
          >
            🚂 Trens
          </button>
          <button
            onClick={() => setShowNBR9050(!showNBR9050)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              showNBR9050 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Alternar piso tátil, rampas e vão zero"
          >
            ♿ NBR 9050
          </button>
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
            title="Alternar iluminação diurna / noturna 3000K"
          >
            {isNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* 3D Interaction Tip (Top Right) */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-[11px] text-slate-300 font-medium flex items-center gap-2 pointer-events-none z-10">
          <Move className="w-3.5 h-3.5 text-sky-400" />
          <span>Gire com o mouse ou dedos • Zoom com roda ou pinça</span>
        </div>

        {/* Hotspot Floating Chips Overlay (Bottom Left) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 z-10 pointer-events-auto">
          {ARCHITECTURAL_HOTSPOTS.map((h) => {
            const isSelected = selectedHotspot.id === h.id;
            return (
              <button
                key={h.id}
                onClick={() => flyToHotspot(h)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 shadow-md ${
                  isSelected
                    ? 'bg-indigo-600 text-white border border-indigo-400 ring-2 ring-indigo-400/40'
                    : 'bg-slate-900/90 text-slate-200 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                {h.category === 'nbr9050' && <Accessibility className="w-3.5 h-3.5 text-sky-400" />}
                {h.category === 'elderly' && <Heart className="w-3.5 h-3.5 text-amber-400" />}
                {h.category === 'students' && <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />}
                {h.category === 'railway' && <Train className="w-3.5 h-3.5 text-rose-400" />}
                <span>{h.title.split(' ')[0]} {h.title.split(' ')[1] || ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Architectural Inspection Card (Hotspot Info) */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800">
              {selectedHotspot.category.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-slate-500">
              {selectedHotspot.normative}
            </span>
          </div>

          <h4 className="text-base font-bold text-slate-900">
            {selectedHotspot.title}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed">
            {selectedHotspot.description}
          </p>

          <div className="pt-2 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Dimensões & Parâmetros NBR:
              </span>
              <strong className="text-slate-800 font-mono">
                {selectedHotspot.dimensions}
              </strong>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950 shadow-2xs">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                Impacto Social & Inclusão:
              </span>
              <span>{selectedHotspot.benefit}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => flyToHotspot(selectedHotspot)}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
        >
          <Camera className="w-4 h-4 text-sky-400" />
          Focar Câmera 3D
        </button>
      </div>
    </div>
  );
}
