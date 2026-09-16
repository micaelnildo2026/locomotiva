import React from 'react';
import { BookMarked, ExternalLink, ShieldCheck } from 'lucide-react';

export default function ReferencesPage() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookMarked className="w-32 h-32 text-emerald-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <BookMarked className="w-8 h-8 text-emerald-400" />
          Referências Bibliográficas
        </h2>
        <p className="mt-2 text-slate-300 font-medium max-w-2xl text-sm leading-relaxed">
          Base teórica, técnica e normativa utilizada no desenvolvimento do projeto Joinville nos Trilhos, formatada segundo as normas da ABNT.
        </p>
      </div>

      <div className="p-6 sm:p-10 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Normas Técnicas */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Normas Técnicas & Acessibilidade
            </h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="pl-4 border-l-2 border-emerald-500">
                ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. <strong>ABNT NBR 9050:2020:</strong> Acessibilidade a edificações, mobiliário, espaços e equipamentos urbanos. Rio de Janeiro: ABNT, 2020.
              </li>
              <li className="pl-4 border-l-2 border-emerald-500">
                BRASIL. <strong>Lei nº 13.146, de 6 de julho de 2015.</strong> Institui a Lei Brasileira de Inclusão da Pessoa com Deficiência (Estatuto da Pessoa com Deficiência). Brasília, DF: Presidência da República, 2015. Disponível em: &lt;http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm&gt;. Acesso em: 16 set. 2026.
              </li>
            </ul>
          </section>

          {/* Engenharia e Modelagem */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Engenharia, Mecânica & Modelagem 3D
            </h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="pl-4 border-l-2 border-indigo-500">
                BELL, A. M. <strong>Locomotives: Their Construction, Maintenance and Operation.</strong> 7. ed. Londres: Virtue & Company, 1952.
              </li>
              <li className="pl-4 border-l-2 border-indigo-500">
                FREECAD PROJECT. <strong>FreeCAD Documentation v1.0.</strong> 2024. Disponível em: &lt;https://wiki.freecadweb.org/Main_Page&gt;. Acesso em: 16 set. 2026.
              </li>
              <li className="pl-4 border-l-2 border-indigo-500">
                SINCLAIR, A. <strong>Development of the Locomotive Engine.</strong> Nova York: Angus Sinclair Publishing Company, 1907.
              </li>
            </ul>
          </section>

          {/* Computação Gráfica e Motores de Jogo */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Computação Gráfica & Game Engines
            </h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="pl-4 border-l-2 border-amber-400">
                EPIC GAMES. <strong>Unreal Engine 5 Documentation.</strong> Cary: Epic Games, 2024. Disponível em: &lt;https://docs.unrealengine.com/5.4/en-US/&gt;. Acesso em: 16 set. 2026.
              </li>
              <li className="pl-4 border-l-2 border-amber-400">
                CABELLO, R. et al. <strong>Three.js Documentation.</strong> 2024. Disponível em: &lt;https://threejs.org/docs/&gt;. Acesso em: 16 set. 2026.
              </li>
            </ul>
          </section>

          {/* História de Joinville */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-rose-500" />
              História e Ferrovia de Joinville
            </h3>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="pl-4 border-l-2 border-rose-400">
                FICKER, C. <strong>História de Joinville: subsídios para a crônica da colônia Dona Francisca.</strong> 2. ed. Joinville: Fundação Cultural de Joinville, 1965.
              </li>
              <li className="pl-4 border-l-2 border-rose-400">
                IBGE - INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA. <strong>Censo Demográfico 2022: Joinville.</strong> Rio de Janeiro: IBGE, 2023. Disponível em: &lt;https://cidades.ibge.gov.br/brasil/sc/joinville/panorama&gt;. Acesso em: 16 set. 2026.
              </li>
              <li className="pl-4 border-l-2 border-rose-400">
                PREFEITURA DE JOINVILLE. <strong>Estação da Memória.</strong> Joinville: Secretaria de Cultura e Turismo, [20--]. Disponível em: &lt;https://www.joinville.sc.gov.br/institucional/estacao-da-memoria/&gt;. Acesso em: 16 set. 2026.
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
