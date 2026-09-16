/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ActiveTab, LocomotivePart } from './types';
import LocomotiveViewer3D from './components/LocomotiveViewer3D';
import LocomotiveSimulator from './components/LocomotiveSimulator';
import TechnicalEncyclopedia from './components/TechnicalEncyclopedia';
import AccessibleCityPlan from './components/AccessibleCityPlan';
import RailwayNetworkView from './components/RailwayNetworkView';
import PlayableWebGame3D from './components/PlayableWebGame3D';
import CharacterInteractions from './components/CharacterInteractions';
import FreeCadModal from './components/FreeCadModal';
import UnrealPublicationHub from './components/UnrealPublicationHub';
import { 
  Gamepad2, 
  Box, 
  Activity, 
  BookOpen, 
  Building2, 
  Train, 
  Users, 
  Code, 
  Volume2, 
  Download,
  Layers,
  MapPin,
  Sparkles
} from 'lucide-react';
import { playSteamWhistle } from './utils/soundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('game');
  const [isFreeCadModalOpen, setIsFreeCadModalOpen] = useState<boolean>(false);
  const [selectedCharacterFromGame, setSelectedCharacterFromGame] = useState<string>('dona_helena');

  const handleOpenCharacterDialog = (charId: string) => {
    setSelectedCharacterFromGame(charId);
    setActiveTab('characters');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo & Project Title */}
            <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('game')}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-amber-400 flex items-center justify-center font-extrabold shadow-sm">
                <Train className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                    Joinville nos Trilhos
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <MapPin className="w-3 h-3 text-emerald-600" /> Santa Catarina
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Locomotiva 3D • Engenharia • Urbanismo NBR 9050 • Jogo Unreal & Web
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => playSteamWhistle()}
                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
                title="Tocar apito de vapor acústico"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Apito a Vapor</span>
              </button>

              <button
                onClick={() => setIsFreeCadModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                <Code className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">Script FreeCAD (.py)</span>
                <span className="md:hidden">FreeCAD</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar">
            <button
              onClick={() => setActiveTab('game')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'game'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Jogo 3D Web
            </button>

            <button
              onClick={() => setActiveTab('model3d')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'model3d'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Box className="w-4 h-4" />
              Modelo 3D & FreeCAD
            </button>

            <button
              onClick={() => setActiveTab('physics')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'physics'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              Engenharia & Simulação
            </button>

            <button
              onClick={() => setActiveTab('encyclopedia')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'encyclopedia'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Anatomia da Locomotiva
            </button>

            <button
              onClick={() => setActiveTab('urbanism')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'urbanism'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Joinville Acessível (PCD/Idosos)
            </button>

            <button
              onClick={() => setActiveTab('network')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'network'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Train className="w-4 h-4" />
              Malha VLT & Cargas
            </button>

            <button
              onClick={() => setActiveTab('characters')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'characters'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Personagens & Missões
            </button>

            <button
              onClick={() => setActiveTab('unreal')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === 'unreal'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              Unreal Engine 5 & Publicação
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'game' && (
          <PlayableWebGame3D onOpenDialog={handleOpenCharacterDialog} />
        )}

        {activeTab === 'model3d' && (
          <LocomotiveViewer3D
            onOpenFreeCad={() => setIsFreeCadModalOpen(true)}
            onSelectPart={() => {}}
          />
        )}

        {activeTab === 'physics' && (
          <LocomotiveSimulator />
        )}

        {activeTab === 'encyclopedia' && (
          <TechnicalEncyclopedia
            onOpenFreeCad={() => setIsFreeCadModalOpen(true)}
          />
        )}

        {activeTab === 'urbanism' && (
          <AccessibleCityPlan />
        )}

        {activeTab === 'network' && (
          <RailwayNetworkView />
        )}

        {activeTab === 'characters' && (
          <CharacterInteractions
            initialCharacterId={selectedCharacterFromGame}
          />
        )}

        {activeTab === 'unreal' && (
          <UnrealPublicationHub />
        )}
      </main>

      {/* FreeCAD Python Macro Modal */}
      <FreeCadModal
        isOpen={isFreeCadModalOpen}
        onClose={() => setIsFreeCadModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">
              Joinville nos Trilhos
            </span>
            <span>•</span>
            <span>Patrimônio Ferroviário, Engenharia & Acessibilidade Universal</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Conformidade ABNT NBR 9050:2020</span>
            <span>•</span>
            <span>FreeCAD v0.21 / v1.0</span>
            <span>•</span>
            <span>Unreal Engine 5.4</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
