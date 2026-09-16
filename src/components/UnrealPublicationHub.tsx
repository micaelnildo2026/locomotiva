import { useState } from 'react';
import { UNREAL_ENGINE_GUIDE } from '../data/unrealEngineDocs';
import { 
  Gamepad2, 
  Monitor, 
  Smartphone, 
  Globe, 
  Code, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function UnrealPublicationHub() {
  const [activeTab, setActiveTab] = useState<'unreal' | 'pc' | 'mobile' | 'web'>('unreal');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCpp = () => {
    navigator.clipboard.writeText(UNREAL_ENGINE_GUIDE.cppSampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadBuildManifest = () => {
    const manifest = {
      projectName: "JoinvilleNosTrilhos",
      engine: "Unreal Engine 5.4.4",
      platforms: {
        pc: {
          target: "Windows 64-bit DX12",
          binary: "Binaries/Win64/JoinvilleNosTrilhos-Shipping.exe",
          features: ["Nanite", "Lumen", "DLSS 3.5", "Accessibility Controller"]
        },
        mobile: {
          target: "Android 14+ Vulkan",
          package: "com.joinville.nostrilhos",
          aabOutput: "Build/Android/JoinvilleNosTrilhos.aab",
          features: ["Forward Shading", "ASTC Textures", "UMG Touch Joystick"]
        },
        web: {
          target: "Web Edition PWA",
          deployment: "Cloud Run / Global CDN",
          features: ["WebGL 2.0", "Web Audio API Harmonic Synthesis", "NBR 9050 Hub"]
        }
      }
    };
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Joinville_Unreal_Build_Manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Hub de Desenvolvimento Unreal Engine 5 & Publicação
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Arquitetura C++ / Blueprints, pacotes de distribuição para PC, Celular (Android/iOS) e Divulgação da Versão Web
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadBuildManifest}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Manifest de Publicação (.json)
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('unreal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'unreal'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4 text-indigo-400" />
          Arquitetura Unreal Engine 5
        </button>

        <button
          onClick={() => setActiveTab('pc')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'pc'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Monitor className="w-4 h-4 text-sky-400" />
          Publicar para Computador (PC)
        </button>

        <button
          onClick={() => setActiveTab('mobile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'mobile'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          Publicar para Celular (Mobile)
        </button>

        <button
          onClick={() => setActiveTab('web')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'web'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4 text-amber-400" />
          Divulgação da Versão Web
        </button>
      </div>

      {/* Tab 1: Unreal Engine 5 Architecture */}
      {activeTab === 'unreal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Core Modules Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Módulos Principais C++ & Blueprints (UE5)
              </h3>

              <div className="space-y-3">
                {UNREAL_ENGINE_GUIDE.architecture.coreSystems.map((sys, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-mono text-xs font-bold text-indigo-700 block">
                      {sys.module}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sys.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Graphics Pipeline Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Pipeline Gráfico Nanite & Lumen
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-900 block">Renderização de Alta Fidelidade (PC):</span>
                  <p className="text-slate-600 leading-relaxed">
                    {UNREAL_ENGINE_GUIDE.architecture.renderPipeline.desktop}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                  <span className="font-bold text-slate-900 block">Renderização Otimizada (Mobile):</span>
                  <p className="text-slate-600 leading-relaxed">
                    {UNREAL_ENGINE_GUIDE.architecture.renderPipeline.mobile}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample C++ Header Code */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Code className="w-4 h-4 text-indigo-600" />
                Exemplo de Código C++ da Locomotiva (TrainLocomotive.h):
              </div>
              <button
                onClick={handleCopyCpp}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copiado!' : 'Copiar C++'}
              </button>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto max-h-72">
              <pre>
                <code>{UNREAL_ENGINE_GUIDE.cppSampleCode}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: PC Publication */}
      {activeTab === 'pc' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-md">
                Desktop Edition
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Publicação para Computador (Windows & Linux)
              </h3>
              <p className="text-xs text-slate-500">
                Experiência de alta fidelidade visual com Ray Tracing e suporte a volantes e manetes de tração ferroviária
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
              <Monitor className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">Requisitos Mínimos:</span>
              <p className="text-slate-600 font-mono">{UNREAL_ENGINE_GUIDE.multiplatformDeploy.pc.minSpecs}</p>
              <div className="pt-2 border-t border-slate-200/60">
                <span className="font-bold text-slate-900 block">Requisitos Recomendados (Lumen 60 FPS):</span>
                <p className="text-slate-600 font-mono">{UNREAL_ENGINE_GUIDE.multiplatformDeploy.pc.recommendedSpecs}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">Passos de Build e Empacotamento:</span>
              <ol className="space-y-1 list-decimal list-inside text-slate-600">
                <li>No Unreal Engine 5, selecione <strong>Platforms &gt; Windows &gt; Package Project</strong>.</li>
                <li>Configure o Build Configuration para <strong>Shipping</strong> com inclusão de crash logs.</li>
                <li>Gere o instalador com o <strong>Inno Setup</strong> ou faça o upload direto via <strong>SteamPipe</strong>.</li>
                <li>Habilite o mapeamento para controle de acessibilidade Xbox Adaptive Controller e teclado.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Mobile Publication */}
      {activeTab === 'mobile' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                Mobile Edition
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Publicação para Celular (Android & iOS)
              </h3>
              <p className="text-xs text-slate-500">
                Otimizado para rodar em 60 FPS com controles táteis responsivos e baixo consumo de bateria
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">Google Play Store (Android):</span>
              <ul className="space-y-1 text-slate-600">
                <li>• Formato de pacote: <strong>Android App Bundle (.aab)</strong></li>
                <li>• Suporte a Vulkan RHI e OpenGL ES 3.2</li>
                <li>• Download dinâmico de texturas via Play Asset Delivery (PAD)</li>
                <li>• Tamanho inicial de download inferior a 150 MB</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-900 block">Apple App Store (iOS):</span>
              <ul className="space-y-1 text-slate-600">
                <li>• Formato de pacote: <strong>.ipa</strong> assinado com certificado Apple Developer</li>
                <li>• Suporte a Metal 3 e Upscaling MetalFX</li>
                <li>• Compatível com iPhone 11 em diante e iPads com chip Apple Silicon</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Web Release & Promotion */}
      {activeTab === 'web' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md">
                Web Edition
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Divulgação do Jogo na Versão Web
              </h3>
              <p className="text-xs text-slate-500">
                Disponível diretamente no navegador para que qualquer cidadão, estudante ou pessoa idosa possa jogar sem instalar nada
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs font-bold">
              <Globe className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-4 rounded-xl text-xs space-y-2">
              <span className="font-bold text-amber-950 block text-sm">
                Ficha Técnica de Divulgação para Imprensa e Redes Sociais:
              </span>
              <p className="text-amber-900 leading-relaxed">
                <strong>Título:</strong> Joinville nos Trilhos: Locomotiva 3D & Cidade Inclusiva<br/>
                <strong>Gênero:</strong> Simulação Ferroviária Pedagógica e Urbanismo Acessível<br/>
                <strong>Plataformas:</strong> Web (Navegador), PC (Windows/Linux) e Mobile (Android/iOS)<br/>
                <strong>Proposta:</strong> Unir a história centenária da ferrovia catarinense à vanguarda da acessibilidade urbana (NBR 9050), conectando a terceira idade, pessoas com deficiência e estudantes universitários de Joinville.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">Acesso Instantâneo</span>
                <p className="text-slate-600">
                  Executável em WebGL sem necessidade de plugins proprietários em qualquer celular ou notebook.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">Sintetizador Web Audio</span>
                <p className="text-slate-600">
                  Áudio harmônico espacial puro de apito a vapor e chug-chug calculado em tempo real.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                <span className="font-bold text-slate-900 block">Instalação PWA</span>
                <p className="text-slate-600">
                  Permite adicionar o jogo como aplicativo nativo à tela inicial do celular com 1 clique.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
