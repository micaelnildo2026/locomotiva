import { useState } from 'react';
import { FREECAD_PYTHON_SCRIPT } from '../data/freecadScript';
import { 
  Code, 
  Copy, 
  Check, 
  Download, 
  X, 
  Layers, 
  Sparkles, 
  FileText, 
  Terminal,
  ChevronRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function FreeCadModal({ isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(FREECAD_PYTHON_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([FREECAD_PYTHON_SCRIPT], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Locomotiva_Joinville_Acessivel_FreeCAD.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Gerador de Modelo 3D Paramétrico no FreeCAD
                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                  Macro Python
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Compatível com FreeCAD v0.20, v0.21 e FreeCAD 1.0 (Part Design, Sketcher, TechDraw)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Script'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              Baixar .py
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Instructions Timeline */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-600" />
              Como executar e gerar o 3D no FreeCAD (Passo a Passo):
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold inline-flex items-center justify-center text-[10px] mb-1">
                  1
                </span>
                <div className="font-bold text-slate-900">Abra o FreeCAD</div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Inicie o software livre FreeCAD (Windows, Mac ou Linux).
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold inline-flex items-center justify-center text-[10px] mb-1">
                  2
                </span>
                <div className="font-bold text-slate-900">Menu de Macros</div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Vá em <strong>Macro &gt; Macros...</strong> e clique em <strong>Criar Novo</strong>.
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold inline-flex items-center justify-center text-[10px] mb-1">
                  3
                </span>
                <div className="font-bold text-slate-900">Cole o Código</div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Nomeie como <code>locomotiva.py</code> e cole o código abaixo.
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold inline-flex items-center justify-center text-[10px] mb-1">
                  4
                </span>
                <div className="font-bold text-slate-900">Executar / Play</div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Pressione <strong>Ctrl+F6</strong> ou o botão verde de Play. O 3D sólido surge instantaneamente!
                </div>
              </div>
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <span>Script Python Completo (FreeCAD API & Part Design):</span>
              <span className="font-mono text-[11px] text-slate-400">
                {FREECAD_PYTHON_SCRIPT.split('\n').length} linhas de código CAD
              </span>
            </div>

            <div className="relative rounded-2xl bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto max-h-96">
              <pre>
                <code>{FREECAD_PYTHON_SCRIPT}</code>
              </pre>
            </div>
          </div>

          {/* Workbench Integration Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-xl text-indigo-950">
              <span className="font-bold block mb-1">Part Design Workbench:</span>
              Permite aplicar chanfros, arredondamentos (fillets) e criar furações de alívio estrutural nas longarinas do chassi.
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-emerald-950">
              <span className="font-bold block mb-1">Sketcher & Spreadsheet:</span>
              Todas as variáveis (bitola de 1.000 mm, diâmetro da caldeira) estão organizadas no topo para fácil alteração paramétrica.
            </div>

            <div className="bg-amber-50 border border-amber-100 p-3.5 rounded-xl text-amber-950">
              <span className="font-bold block mb-1">TechDraw Workbench:</span>
              Gere pranchas de desenho técnico 2D em escala (vistas ortogonais frontal, lateral e superior) com cotas de engenharia normalizadas.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Licença Aberta para Ensino de Engenharia e Preservação Ferroviária de Joinville
          </span>
          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Baixar Macro Python (.py)
          </button>
        </div>
      </div>
    </div>
  );
}
