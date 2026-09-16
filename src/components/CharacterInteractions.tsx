import { useState } from 'react';
import { CHARACTERS, MISSIONS_LIST } from '../data/characters';
import { Character, Mission } from '../types';
import { 
  Users, 
  MessageSquare, 
  Award, 
  Heart, 
  Accessibility, 
  GraduationCap, 
  Wrench, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  Volume2
} from 'lucide-react';
import { playSteamWhistle, playStationBell } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface Props {
  initialCharacterId?: string;
  onSelectMission?: (mission: Mission) => void;
}

export default function CharacterInteractions({ initialCharacterId, onSelectMission }: Props) {
  const [selectedCharId, setSelectedCharId] = useState<string>(initialCharacterId || CHARACTERS[0].id);
  const [currentDialogId, setCurrentDialogId] = useState<string>(CHARACTERS[0].initialDialogId);
  const [activeMissions, setActiveMissions] = useState<Mission[]>(MISSIONS_LIST);
  const [acceptedMissions, setAcceptedMissions] = useState<string[]>([]);

  const currentChar = CHARACTERS.find(c => c.id === selectedCharId) || CHARACTERS[0];
  const currentDialog = currentChar.dialogs[currentDialogId] || currentChar.dialogs[currentChar.initialDialogId];

  const handleSelectCharacter = (char: Character) => {
    setSelectedCharId(char.id);
    setCurrentDialogId(char.initialDialogId);
  };

  const handleChooseOption = (choice: { text: string; nextDialogId?: string; acceptedMissionId?: string }) => {
    if (choice.acceptedMissionId) {
      if (!acceptedMissions.includes(choice.acceptedMissionId)) {
        setAcceptedMissions(prev => [...prev, choice.acceptedMissionId!]);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
        playStationBell();
      }
    }
    if (choice.nextDialogId && currentChar.dialogs[choice.nextDialogId]) {
      setCurrentDialogId(choice.nextDialogId);
    }
  };

  const handleCompleteMission = (missionId: string) => {
    setActiveMissions(prev => prev.map(m => m.id === missionId ? { ...m, completed: true } : m));
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    playStationBell();
  };

  const getRoleIcon = (archetype: string) => {
    switch (archetype) {
      case 'Terceira Idade':
        return <Heart className="w-4 h-4 text-amber-500" />;
      case 'Pessoa com Deficiência (PCD)':
        return <Accessibility className="w-4 h-4 text-blue-500" />;
      case 'Jovem Universitário':
        return <GraduationCap className="w-4 h-4 text-emerald-500" />;
      default:
        return <Wrench className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Interações de Personagens & Missões em Joinville
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Converse com os cidadãos, conheça suas histórias e realize missões de condução com foco em conforto, acessibilidade e pontualidade
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Missões Aceitas:
          </span>
          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
            {acceptedMissions.length} / {activeMissions.length}
          </span>
        </div>
      </div>

      {/* Main Grid: Character Selector & Dialogue Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Character Roster (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-[11px] font-bold uppercase text-slate-400 px-1">
            Personagens da Comunidade
          </div>

          <div className="space-y-2">
            {CHARACTERS.map((char) => {
              const isSelected = char.id === currentChar.id;
              return (
                <button
                  key={char.id}
                  onClick={() => handleSelectCharacter(char)}
                  className={`w-full text-left p-3.5 rounded-2xl transition border flex items-center gap-3 ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0"
                    style={{ backgroundColor: char.avatarColor }}
                  >
                    {getRoleIcon(char.archetype)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {char.name}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {char.age} anos
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {char.role}
                    </div>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {char.archetype}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dialogue Box & Mission Board (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Active Dialogue Bubble Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            {/* Speaker Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs"
                  style={{ backgroundColor: currentChar.avatarColor }}
                >
                  {getRoleIcon(currentChar.archetype)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {currentChar.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentChar.role} • {currentChar.archetype}
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                Tom: {currentDialog.characterMood}
              </span>
            </div>

            {/* Character Speech Bubble */}
            <div className="relative bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-800 leading-relaxed font-medium">
              <div className="text-slate-400 text-xl font-serif leading-none mb-1">“</div>
              {currentDialog.text}
            </div>

            {/* Interactive Response Choices */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                Escolha sua resposta ou ação:
              </div>

              {currentDialog.choices.length > 0 ? (
                currentDialog.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => handleChooseOption(choice)}
                    className="w-full text-left p-3 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs text-slate-800 transition flex items-center justify-between gap-3 group"
                  >
                    <span className="group-hover:text-indigo-950 font-medium">
                      {choice.text}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                  </button>
                ))
              ) : (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-950">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Conversa finalizada! Missão adicionada ao seu painel.
                  </span>
                  <button
                    onClick={() => setCurrentDialogId(currentChar.initialDialogId)}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Conversar novamente
                  </button>
                </div>
              )}
            </div>

            {/* Character Insight Quote */}
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 italic">
              {currentChar.feedbackForCity}
            </div>
          </div>

          {/* Missions List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Missões Operacionais Disponíveis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMissions.map((mission) => {
                const isAccepted = acceptedMissions.includes(mission.id);
                return (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-xl border transition space-y-3 ${
                      mission.completed
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : isAccepted
                        ? 'bg-indigo-50/50 border-indigo-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {mission.giver}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                          {mission.title}
                        </h4>
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                        +{mission.scoreBonus} pts
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600">
                      {mission.description}
                    </p>

                    <div className="text-[11px] font-medium text-slate-700 bg-white p-2 rounded-lg border border-slate-200/80">
                      <strong>Objetivo:</strong> {mission.objective}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {mission.completed ? (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Concluída com Sucesso!
                        </span>
                      ) : isAccepted ? (
                        <button
                          onClick={() => handleCompleteMission(mission.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                        >
                          Concluir Missão
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setAcceptedMissions(prev => [...prev, mission.id]);
                            confetti({ particleCount: 30, spread: 50 });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
                        >
                          Aceitar Desafio
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
