import { useState } from 'react';
import { JOINVILLE_STATIONS, FREIGHT_RAILWAY_DATA } from '../data/joinvilleProject';
import { 
  Train, 
  Container, 
  Clock, 
  ShieldCheck, 
  ArrowRightLeft, 
  Map, 
  CheckCircle2, 
  Anchor, 
  Factory, 
  BarChart3,
  Layers,
  Calculator,
  Leaf,
  DollarSign
} from 'lucide-react';

export default function RailwayNetworkView() {
  const [activeTab, setActiveTab] = useState<'both' | 'passenger' | 'freight'>('both');

  // Calculator State
  const [calcDistance, setCalcDistance] = useState<number>(45); // km (Joinville to SFS)
  const [calcCargo, setCalcCargo] = useState<number>(500); // tons

  // Logistics Calculations
  const roadCost = calcDistance * calcCargo * 0.45; // R$ 0.45 por ton-km
  const railCost = calcDistance * calcCargo * 0.15; // R$ 0.15 por ton-km
  const costSavings = roadCost - railCost;
  
  const roadTime = calcDistance / 40; // 40 km/h avg speed trucks with traffic
  const railTime = calcDistance / 60; // 60 km/h avg speed train direct
  
  const roadCO2 = calcDistance * calcCargo * 0.12; // 0.12 kg CO2 per ton-km
  const railCO2 = calcDistance * calcCargo * 0.03; // 0.03 kg CO2 per ton-km
  const co2Savings = roadCO2 - railCO2;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Malha Ferroviária & Metroviária Integrada de Joinville
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sistema intermodal: Linha VLT de passageiros de alta acessibilidade e Corredor de Cargas para o Porto de São Francisco do Sul
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700">
          <button
            onClick={() => setActiveTab('both')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'both' ? 'bg-white text-slate-900 shadow-xs' : 'hover:bg-slate-200'}`}
          >
            Rede Completa
          </button>
          <button
            onClick={() => setActiveTab('passenger')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'passenger' ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-200'}`}
          >
            <Train className="w-3.5 h-3.5" />
            VLT Passageiros
          </button>
          <button
            onClick={() => setActiveTab('freight')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${activeTab === 'freight' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-slate-200'}`}
          >
            <Container className="w-3.5 h-3.5" />
            Ferrovia Cargas
          </button>
        </div>
      </div>

      {/* Network Cards Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Linha 1 VLT Passageiros */}
        {(activeTab === 'both' || activeTab === 'passenger') && (
          <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  Linha 1 - Flores & Dança
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  VLT Metroviário de Passageiros
                </h3>
                <p className="text-xs text-slate-500">
                  Zona Sul (Itaum) ⇄ Centro ⇄ América ⇄ Univille/UDESC ⇄ Aeroporto
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Train className="w-5 h-5" />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Extensão</span>
                <span className="text-base font-bold text-slate-900">15.2 km</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Estações</span>
                <span className="text-base font-bold text-slate-900">12 ativas</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Passageiros/Dia</span>
                <span className="text-base font-bold text-indigo-600">65.000</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-semibold text-slate-900">Destaques Operacionais:</div>
              <ul className="space-y-1 bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/60">
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  Intervalo nos horários de pico universitário: 4 minutos
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  Piso baixo 100% contínuo e nivelado às plataformas
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  Integração tarifária com ônibus municipais e bicicletas
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Card 2: Linha de Cargas Portuária */}
        {(activeTab === 'both' || activeTab === 'freight') && (
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  Corredor Industrial / Exportação
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Ferrovia de Cargas Porto de São Francisco
                </h3>
                <p className="text-xs text-slate-500">
                  Polos Metalmecânicos de Joinville ⇄ Pátio Intermodal ⇄ Terminal Portuário
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Container className="w-5 h-5" />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Comprimento</span>
                <span className="text-base font-bold text-slate-900">{FREIGHT_RAILWAY_DATA.lengthKm} km</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Carga Anual</span>
                <span className="text-base font-bold text-emerald-600">18.5 Mi Ton</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                <span className="text-[11px] text-slate-500 block">Bitola</span>
                <span className="text-base font-bold text-slate-900">Métrica (1.000mm)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <div className="font-semibold text-slate-900">Principais Cargas Transportadas:</div>
              <ul className="space-y-1 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100/60">
                {FREIGHT_RAILWAY_DATA.cargoTypes.slice(0, 3).map((cargo, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Factory className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{cargo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Segregation & Urban Safety Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          Segregação Urbana & Mitigação de Impacto em Joinville
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-1">
            <span className="font-bold text-slate-900 block">Barreiras Acústicas Vivas</span>
            <p className="text-slate-600">
              Muros verdes com vegetação nativa da Mata Atlântica reduzem em 18 dB o ruído das composições junto a hospitais e residências.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-1">
            <span className="font-bold text-slate-900 block">Trincheiras Ferroviárias</span>
            <p className="text-slate-600">
              Eliminação de passagens de nível no centro de Joinville; carros e pedestres circulam por cima em viadutos ajardinados.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-1">
            <span className="font-bold text-slate-900 block">Sinalização CBTC / ERTMS</span>
            <p className="text-slate-600">
              Controle automático de velocidade por rádio digital impede colisão e reduz a velocidade para 30 km/h em zonas escolares.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-1">
            <span className="font-bold text-slate-900 block">Janelas Noturnas de Carga</span>
            <p className="text-slate-600">
              Composições de minério e peças industriais circulam prioritariamente entre 23h00 e 05h00, priorizando pessoas de dia.
            </p>
          </div>
        </div>
      </div>

      {/* Logistics Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              Calculadora de Eficiência Logística Intermodal
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Compare os custos e emissões entre transporte Rodoviário (Caminhão) e Ferroviário (Trem) para a região de Joinville.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-slate-700">Distância da Rota (km)</label>
                <span className="text-sm font-bold text-indigo-600">{calcDistance} km</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="250" 
                value={calcDistance} 
                onChange={(e) => setCalcDistance(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[10px] text-slate-400">Ex: Joinville ao Porto de São Francisco do Sul (~45 km)</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-slate-700">Volume de Carga (Toneladas)</label>
                <span className="text-sm font-bold text-indigo-600">{calcCargo.toLocaleString('pt-BR')} t</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="5000" 
                step="50"
                value={calcCargo} 
                onChange={(e) => setCalcCargo(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <p className="text-[10px] text-slate-400">Capacidade de 1 composição de carga típica: ~2.500t a 3.000t</p>
            </div>
          </div>

          {/* Results Comparison */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Road Transport Box */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-700 border-b border-slate-200 pb-2">
                <Container className="w-4 h-4" />
                <span className="font-bold text-sm">Rodoviário (Caminhões)</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Custo Estimado</span>
                  <div className="text-lg font-bold text-slate-800">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(roadCost)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Tempo (com trânsito)</span>
                  <div className="text-sm font-bold text-slate-700">{roadTime.toFixed(1)} horas</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Pegada de Carbono</span>
                  <div className="text-sm font-bold text-slate-700">{roadCO2.toLocaleString('pt-BR')} kg CO₂</div>
                </div>
              </div>
            </div>

            {/* Rail Transport Box */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-8 -mt-8 pointer-events-none" />
              <div className="flex items-center gap-2 text-emerald-800 border-b border-emerald-200 pb-2">
                <Train className="w-4 h-4" />
                <span className="font-bold text-sm">Ferroviário (Trem)</span>
              </div>
              
              <div className="space-y-3 relative z-10">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600/80 font-bold">Custo Estimado</span>
                  <div className="text-lg font-bold text-emerald-700">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(railCost)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600/80 font-bold">Tempo (Via Direta)</span>
                  <div className="text-sm font-bold text-emerald-700">{railTime.toFixed(1)} horas</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600/80 font-bold">Pegada de Carbono</span>
                  <div className="text-sm font-bold text-emerald-700">{railCO2.toLocaleString('pt-BR')} kg CO₂</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Highlight */}
        <div className="bg-indigo-900 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-800 flex items-center justify-center text-emerald-400 shadow-inner">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-100">Benefício Ambiental</h4>
              <p className="text-lg font-extrabold text-emerald-400">
                - {co2Savings.toLocaleString('pt-BR')} kg CO₂ <span className="text-xs font-normal text-indigo-200">evitados na atmosfera</span>
              </p>
            </div>
          </div>
          
          <div className="h-10 w-px bg-indigo-800 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-800 flex items-center justify-center text-amber-400 shadow-inner">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-indigo-100">Economia Financeira</h4>
              <p className="text-lg font-extrabold text-amber-400">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(costSavings)} <span className="text-xs font-normal text-indigo-200">por viagem</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
