import { useState } from 'react';
import { LOCOMOTIVE_PARTS } from '../data/locomotiveParts';
import { LocomotivePart } from '../types';
import { 
  BookOpen, 
  Search, 
  Tag, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Wrench, 
  Compass, 
  Code, 
  ShieldCheck, 
  ChevronRight,
  Download
} from 'lucide-react';

interface Props {
  onOpenFreeCad: () => void;
  onSelectIn3D?: (partId: string) => void;
}

export default function TechnicalEncyclopedia({ onOpenFreeCad, onSelectIn3D }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activePartId, setActivePartId] = useState<string>(LOCOMOTIVE_PARTS[0].id);

  const categories = [
    { id: 'todos', label: 'Todos os Sistemas' },
    { id: 'propulsao', label: 'Propulsão & Vapor' },
    { id: 'chassis', label: 'Chassi & Rodeiros' },
    { id: 'frenagem', label: 'Frenagem Westinghouse' },
    { id: 'seguranca', label: 'Segurança & Exaustão' },
    { id: 'cabine', label: 'Cabine de Comando' },
    { id: 'abastecimento', label: 'Tender & Abastecimento' },
  ];

  const filteredParts = LOCOMOTIVE_PARTS.filter((part) => {
    const matchesCat = selectedCategory === 'todos' || part.category === selectedCategory;
    const matchesSearch = 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.technicalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.materials.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const currentPart = LOCOMOTIVE_PARTS.find(p => p.id === activePartId) || filteredParts[0] || LOCOMOTIVE_PARTS[0];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Enciclopédia & Anatomia Técnica da Locomotiva
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tratado completo de engenharia mecânica, termodinâmica, materiais e guia de modelagem paramétrica no FreeCAD
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar componente, aço, fórmula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parts List Navigation (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm p-3 space-y-1 max-h-[640px] overflow-y-auto">
          <div className="text-[11px] font-bold uppercase text-slate-400 px-3 py-2">
            Componentes ({filteredParts.length})
          </div>

          {filteredParts.map((part) => {
            const isSelected = part.id === currentPart.id;
            return (
              <button
                key={part.id}
                onClick={() => {
                  setActivePartId(part.id);
                  if (onSelectIn3D) onSelectIn3D(part.id);
                }}
                className={`w-full text-left p-2.5 rounded-xl transition flex items-center justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 font-semibold shadow-xs'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {part.imageUrl && (
                    <img
                      src={part.imageUrl}
                      alt={part.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {part.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                      {part.technicalName}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 ${isSelected ? 'text-indigo-600' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Detailed Component View (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                  {currentPart.category}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-mono">
                  Tag ID: {currentPart.id}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                {currentPart.name}
              </h3>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                {currentPart.technicalName}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenFreeCad}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <Code className="w-4 h-4 text-amber-400" />
                Script CAD FreeCAD
              </button>
            </div>
          </div>

          {/* Technical Image */}
          {currentPart.imageUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900 group">
              <img
                src={currentPart.imageUrl}
                alt={currentPart.imageAlt || currentPart.name}
                className="w-full h-56 md:h-64 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="font-mono bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 font-bold">
                  Renderização Técnica CAD • {currentPart.materials.split(',')[0]}
                </span>
                <span className="bg-indigo-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold">
                  {currentPart.dimensions.split('|')[0]}
                </span>
              </div>
            </div>
          )}

          {/* Section 1: Descrição Funcional */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-600" />
              Descrição Funcional e Operação Mecânica
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {currentPart.description}
            </p>
          </div>

          {/* Section 2: Princípio Físico e Termodinâmico */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Princípios Físicos, Dinâmica & Termodinâmica
            </h4>
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-950 leading-relaxed">
              {currentPart.engineeringPrinciples}
            </div>
          </div>

          {/* Specifications Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dimensions */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Dimensões Nominais e Tolerâncias:
              </span>
              <p className="font-mono text-xs font-semibold text-slate-800">
                {currentPart.dimensions}
              </p>
            </div>

            {/* Materials & Metallurgy */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Composição de Materiais e Metalurgia:
              </span>
              <p className="text-xs text-slate-800">
                {currentPart.materials}
              </p>
            </div>
          </div>

          {/* FreeCAD Workbench Guide */}
          <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-indigo-600" />
                Como Modelar este Componente no FreeCAD:
              </h4>
              <span className="text-[11px] font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                Bancada: {currentPart.freecadWorkbench}
              </span>
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
              <strong>Operação CAD:</strong> {currentPart.freecadOperation}
            </p>
            <p className="text-[11px] text-indigo-700">
              No FreeCAD, utilize restrições geométricas no Sketcher (coincidência, tangência, raio) e gere o sólido no Part Design com parâmetros globais vinculados a uma planilha (Spreadsheet Workbench).
            </p>
          </div>

          {/* Maintenance & Reliability */}
          <div className="flex items-start gap-3 bg-emerald-50/60 border border-emerald-200/60 p-4 rounded-xl text-xs text-emerald-950">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Protocolo de Manutenção e Confiabilidade:</span>
              <span>{currentPart.maintenanceInterval}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
