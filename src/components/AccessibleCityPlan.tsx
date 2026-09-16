import { useState } from 'react';
import { JOINVILLE_STATIONS, ACCESSIBILITY_GUIDELINES_JOINVILLE } from '../data/joinvilleProject';
import { CityStation } from '../types';
import JoinvilleAccessible3DPlan from './JoinvilleAccessible3DPlan';
import { 
  Building2, 
  Heart, 
  Accessibility, 
  GraduationCap, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Trees, 
  Bike, 
  Maximize2, 
  Zap, 
  Volume2,
  Box
} from 'lucide-react';

export default function AccessibleCityPlan() {
  const [selectedStation, setSelectedStation] = useState<CityStation>(JOINVILLE_STATIONS[1]); // Estação Central
  const [activeFilter, setActiveFilter] = useState<'todos' | 'idosos' | 'pcd' | 'estudantes'>('todos');
  const [activeViewMode, setActiveViewMode] = useState<'3d_plan' | 'schematic'>('3d_plan');

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Projeto Arquitetônico de Joinville Acessível e Inclusiva
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Plano diretor de mobilidade urbana universal para a Terceira Idade, Pessoas com Deficiência (NBR 9050) e Estudantes
          </p>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700">
            <button
              onClick={() => setActiveViewMode('3d_plan')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeViewMode === '3d_plan'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              Planta 3D Detalhada
            </button>
            <button
              onClick={() => setActiveViewMode('schematic')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeViewMode === 'schematic'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              Mapa & Diretrizes
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700">
            <button
              onClick={() => setActiveFilter('todos')}
              className={`px-2.5 py-1.5 rounded-lg transition ${activeFilter === 'todos' ? 'bg-white text-slate-900 shadow-xs' : 'hover:bg-slate-200'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveFilter('idosos')}
              className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${activeFilter === 'idosos' ? 'bg-amber-500 text-white shadow-xs' : 'hover:bg-slate-200'}`}
            >
              <Heart className="w-3 h-3" />
              Idosos
            </button>
            <button
              onClick={() => setActiveFilter('pcd')}
              className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${activeFilter === 'pcd' ? 'bg-blue-600 text-white shadow-xs' : 'hover:bg-slate-200'}`}
            >
              <Accessibility className="w-3 h-3" />
              PCD
            </button>
            <button
              onClick={() => setActiveFilter('estudantes')}
              className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 ${activeFilter === 'estudantes' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:bg-slate-200'}`}
            >
              <GraduationCap className="w-3 h-3" />
              Estudantes
            </button>
          </div>
        </div>
      </div>

      {/* Featured Detailed 3D Architectural Plan */}
      <JoinvilleAccessible3DPlan />

      {/* 3 Pillars Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pillar 1: Terceira Idade */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-2xl border border-amber-200 p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            1. Terceira Idade & Envelhecimento Ativo
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Joinville possui uma crescente população sênior. O projeto assegura calçadas sem degraus, bancos ergonômicos sombreados a cada 60 metros e semáforos com tempo de travessia estendido em 40%.
          </p>
          <div className="pt-2 border-t border-amber-200/60 space-y-1 text-xs text-amber-950 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Bancos com apoios laterais para levantar fácil
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Iluminação anti-ofuscante 3000K nos calçadões
            </div>
          </div>
        </div>

        {/* Pillar 2: PCD & NBR 9050 */}
        <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-2xl border border-blue-200 p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Accessibility className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            2. Pessoas com Deficiência & Desenho Universal
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminação integral de barreiras conforme a NBR 9050:2020. Piso tátil contínuo, rampas suaves com inclinação máxima de 6%, elevadores panorâmicos e o sistema de vão zero nas paradas do trem.
          </p>
          <div className="pt-2 border-t border-blue-200/60 space-y-1 text-xs text-blue-950 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              Vão horizontal plataforma-trem menor que 20 mm
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              Mapas táteis e sintetizador sonoro nas estações
            </div>
          </div>
        </div>

        {/* Pillar 3: Jovens Estudantes */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-2xl border border-emerald-200 p-5 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">
            3. Jovens Universitários & Inovação
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Corredor expresso ligando o Centro aos campi da Univille, UDESC e ao Ágora Tech Park. Ciclovias protegidas com bicicletários integrados, Wi-Fi 6 público e bancadas de estudo com recarga solar.
          </p>
          <div className="pt-2 border-t border-emerald-200/60 space-y-1 text-xs text-emerald-950 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Deslocamento Centro-Campus em apenas 18 min
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Estações de empréstimo de bicicletas públicas
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Stations Map & Station Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schematic Architectural Corridor Map (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Traçado Urbano & Estações Acessíveis de Joinville
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Extensão: 15.2 km de Eixo Universal
            </span>
          </div>

          {/* SVG Map of Joinville Linear Corridor */}
          <div className="relative w-full bg-slate-950 rounded-xl p-4 overflow-hidden border border-slate-800">
            <div className="text-[11px] text-slate-400 mb-2 font-mono flex items-center justify-between">
              <span>SUL (ITAUM / GUANABARA)</span>
              <span>NORTE (CAMPUS UNIVILLE / AEROPORTO)</span>
            </div>

            <svg viewBox="0 0 920 180" className="w-full h-auto">
              {/* Rail Line Glow */}
              <path
                d="M 50 140 Q 250 110, 460 90 T 870 40"
                fill="none"
                stroke="#6366f1"
                strokeWidth="6"
                strokeLinecap="round"
                className="opacity-75"
              />
              <path
                d="M 50 140 Q 250 110, 460 90 T 870 40"
                fill="none"
                stroke="#a5b4fc"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {/* Station Markers */}
              {JOINVILLE_STATIONS.map((station, idx) => {
                const isSelected = selectedStation.id === station.id;
                // Compute coordinates along the curve
                const t = idx / (JOINVILLE_STATIONS.length - 1);
                const cx = 50 + t * 820;
                const cy = 140 - Math.pow(t, 0.85) * 100;

                return (
                  <g 
                    key={station.id} 
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setSelectedStation(station)}
                  >
                    {/* Ring highlight if selected */}
                    {isSelected && (
                      <circle cx={cx} cy={cy} r="16" fill="none" stroke="#38bdf8" strokeWidth="2.5" className="animate-ping opacity-60" />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? "11" : "8"}
                      fill={isSelected ? "#38bdf8" : "#ffffff"}
                      stroke="#1e293b"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={cy + (idx % 2 === 0 ? 25 : -16)}
                      textAnchor="middle"
                      fill={isSelected ? "#38bdf8" : "#94a3b8"}
                      fontSize="10"
                      fontWeight={isSelected ? "bold" : "normal"}
                      fontFamily="system-ui"
                    >
                      {station.name.split(' ')[0]} {station.name.split(' ')[1] || ''}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                Estação Selecionada: <strong className="text-white">{selectedStation.name}</strong>
              </span>
              <span className="font-mono text-slate-500">
                {selectedStation.distanceKm} km da Estação Sul
              </span>
            </div>
          </div>

          {/* Architectural Cross-Section Diagram */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Corte Arquitetônico Típico: Calçadão Acessível NBR 9050
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-amber-100/70 p-2 rounded-lg border border-amber-200">
                <div className="font-bold text-amber-900">Faixa de Acesso</div>
                <div className="text-[11px] text-amber-700">0.80m • Bancos & Árvores</div>
              </div>
              <div className="bg-blue-100/70 p-2 rounded-lg border border-blue-200 col-span-2">
                <div className="font-bold text-blue-900">Faixa Livre Pedonal (NBR 9050)</div>
                <div className="text-[11px] text-blue-700">2.20m • Piso Tátil & Nivelamento Laser</div>
              </div>
              <div className="bg-emerald-100/70 p-2 rounded-lg border border-emerald-200">
                <div className="font-bold text-emerald-900">Ciclovia Segregada</div>
                <div className="text-[11px] text-emerald-700">1.50m • Asfalto Poroso</div>
              </div>
            </div>
          </div>
        </div>

        {/* Station Details Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                {selectedStation.zone}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedStation.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedStation.urbanIntegration}
              </p>
            </div>

            {/* Accessibility features */}
            {(activeFilter === 'todos' || activeFilter === 'pcd') && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                  <Accessibility className="w-3.5 h-3.5 text-blue-600" />
                  Acessibilidade Universal & PCD:
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  {selectedStation.accessibilityFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Elderly features */}
            {(activeFilter === 'todos' || activeFilter === 'idosos') && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-amber-600" />
                  Conforto para a Terceira Idade:
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  {selectedStation.elderlyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Student features */}
            {(activeFilter === 'todos' || activeFilter === 'estudantes') && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                  Conexão Estudantil & Inovação:
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  {selectedStation.studentFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Conformidade ABNT NBR 9050</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Homologado
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
