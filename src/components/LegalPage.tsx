import React from 'react';
import { Scale, ShieldCheck, FileText, User, Bot, Code } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Scale className="w-32 h-32 text-indigo-400" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-3">
          <Scale className="w-8 h-8 text-indigo-400" />
          Políticas, Licença e Transparência
        </h2>
        <p className="mt-2 text-slate-300 font-medium max-w-2xl text-sm leading-relaxed">
          Informações legais, de autoria, termos de uso e políticas de privacidade referentes a este simulador e plataforma educativa.
        </p>
      </div>

      <div className="p-6 sm:p-10 bg-slate-50">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Autoria e Sobre */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-indigo-600" />
              Sobre a Autoria e Desenvolvimento
            </h3>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-sm text-slate-600 space-y-4 shadow-sm">
              <p>
                <strong>Desenvolvedor / Autor:</strong> Micael Nildo Oliveira Souza
              </p>
              <p className="flex items-start gap-2">
                <Bot className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Auxílio de Inteligência Artificial:</strong> Este projeto contou com o suporte de Inteligência Artificial generativa para prototipação de código (React, Three.js), estruturação de dados de acessibilidade e modelagem matemática para a simulação física.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Code className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Link Oficial de Acesso:</strong> <a href="https://locomotiva.equipecom.workers.dev/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://locomotiva.equipecom.workers.dev/</a>
                </span>
              </p>
            </div>
          </section>

          {/* Licença MIT */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-amber-500" />
              Licença MIT
            </h3>
            <div className="bg-slate-800 p-6 rounded-2xl text-slate-300 text-xs font-mono whitespace-pre-wrap shadow-inner overflow-x-auto">
{`Copyright (c) 2026 Micael Nildo Oliveira Souza

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`}
            </div>
          </section>

          {/* Termos de Uso */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-rose-500" />
              Termos de Uso
            </h3>
            <div className="space-y-4 text-sm text-slate-600">
              <p>Ao acessar e utilizar este sistema ("Joinville nos Trilhos"), você concorda com os presentes Termos de Uso.</p>
              
              <h4 className="font-bold text-slate-700 mt-4">1. Natureza do Serviço</h4>
              <p>A aplicação é um projeto de simulação gráfica 3D, de cunho educativo, servindo como portfólio de engenharia de software, modelagem 3D e demonstração de acessibilidade urbana baseada na NBR 9050.</p>

              <h4 className="font-bold text-slate-700 mt-4">2. Uso de Dados Simulados</h4>
              <p>As dimensões, físicas de máquinas a vapor e disposições urbanas são criações computacionais simuladas elaboradas a partir de dados históricos e normativas. Elas servem para demonstração interativa em ambiente virtual. Não garantimos a exatidão científica plena para aplicação direta em engenharia do mundo físico.</p>

              <h4 className="font-bold text-slate-700 mt-4">3. Limitação de Responsabilidade</h4>
              <p>O serviço é fornecido "como está" ("as is"), sem garantias expressas ou implícitas. O autor não se responsabiliza por eventuais incompatibilidades ou uso indevido dos dados/modelos exportados.</p>
            </div>
          </section>

          {/* Política de Privacidade */}
          <section>
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              Política de Privacidade
            </h3>
            <div className="space-y-4 text-sm text-slate-600">
              <p>Neste projeto educativo e interativo, a sua privacidade é uma prioridade. Nós garantimos que a coleta abusiva de dados pessoais é estritamente evitada.</p>
              
              <h4 className="font-bold text-slate-700 mt-4">1. Coleta e Processamento Local</h4>
              <p>A nossa aplicação web opera quase inteiramente de forma local no seu navegador ("Client-Side"). <strong>NÃO</strong> coletamos, armazenamos ou processamos informações pessoais identificáveis (como nome, documentos ou IP de navegação) em bancos de dados proprietários para fins de marketing, publicidade ou venda a terceiros.</p>

              <h4 className="font-bold text-slate-700 mt-4">2. Armazenamento no Navegador</h4>
              <p>A aplicação pode utilizar recursos como <code>localStorage</code> do seu próprio navegador estritamente para salvar configurações de câmera, som e estado do jogo, permitindo que a simulação seja retomada futuramente sem prejuízo na experiência de uso.</p>

              <h4 className="font-bold text-slate-700 mt-4">3. Provedor de Nuvem</h4>
              <p>Como a aplicação está hospedada na web, os serviços de infraestrutura (Edge Computing, CDNs) que entregam a página podem registrar os acessos de rede padronizados por questões de segurança e integridade sob os próprios termos da hospedagem.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
