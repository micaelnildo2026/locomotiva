import { useState, useEffect, useRef } from 'react';
import { LocomotivePhysicsState } from '../types';
import { 
  Gauge, 
  Flame, 
  Droplet, 
  Wind, 
  Sliders, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck,
  Volume2
} from 'lucide-react';
import { playSteamWhistle, playBrakeHiss, playSteamChuff } from '../utils/soundEffects';

interface Props {
  onSpeedUpdate?: (speed: number) => void;
}

export default function LocomotiveSimulator({ onSpeedUpdate }: Props) {
  const [physics, setPhysics] = useState<LocomotivePhysicsState>({
    regulatorPercent: 25,
    reverserPercent: 65,
    boilerPressureBar: 14.2,
    waterLevelPercent: 78,
    trainBrakeBar: 5.0, // Westinghouse released (5.0 bar in brake pipe)
    locoBrakeBar: 0.0,
    currentSpeedKmh: 0,
    tractiveEffortKn: 0,
    powerOutputHp: 0,
    wheelAdhesionStatus: 'normal',
    coalKg: 4200,
    waterLiters: 18500,
    trackGradientPercent: 0.5, // 0.5% incline
    sandApplied: false
  });

  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [telemetryHistory, setTelemetryHistory] = useState<{ speed: number; power: number; effort: number }[]>([]);
  const chuffTimerRef = useRef<number>(0);

  // Simulation physics tick (60Hz / 16ms delta)
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPhysics((prev) => {
        // Physical Constants for standard 2-6-2 steam locomotive
        const adhesiveWeightTon = 54.0; // 54 tons on driving wheels
        const totalTrainWeightTon = 280.0; // Locomotive + tender + passenger coaches
        const wheelDiameterMeters = 1.45;
        const cylinderDiamMeters = 0.52;
        const pistonStrokeMeters = 0.66;

        // Cutoff & Effective Cylinder Pressure
        const cutoffFactor = Math.abs(prev.reverserPercent) / 100;
        const regulatorFactor = prev.regulatorPercent / 100;
        const direction = prev.reverserPercent >= 0 ? 1 : -1;

        // Effective pressure in cylinders (bar -> Pa)
        const meanEffectivePressureBar = prev.boilerPressureBar * regulatorFactor * (0.35 + 0.55 * cutoffFactor);
        const mepPa = meanEffectivePressureBar * 1e5;

        // Theoretical Tractive Effort: F = (P * d^2 * s) / D (for 2 cylinders)
        let tractiveEffortN = (mepPa * Math.pow(cylinderDiamMeters, 2) * pistonStrokeMeters) / wheelDiameterMeters;
        tractiveEffortN = Math.max(0, tractiveEffortN) * direction;
        const tractiveEffortKn = tractiveEffortN / 1000;

        // Adhesion Limit
        let adhesionCoeff = prev.sandApplied ? 0.35 : 0.26;
        const maxAdhesiveForceKn = adhesiveWeightTon * 9.81 * adhesionCoeff;

        let adhesionStatus: 'normal' | 'slipping' | 'sanded' = 'normal';
        let actualTractiveEffortKn = tractiveEffortKn;

        if (Math.abs(tractiveEffortKn) > maxAdhesiveForceKn) {
          if (prev.sandApplied) {
            adhesionStatus = 'sanded';
          } else {
            adhesionStatus = 'slipping';
            // When slipping, tractive force drops dramatically
            actualTractiveEffortKn = Math.sign(tractiveEffortKn) * (maxAdhesiveForceKn * 0.4);
          }
        }

        // Brake Force (Westinghouse: 5.0 bar = released, 3.5 bar = full service, 0 bar = emergency)
        const brakePipeReduction = Math.max(0, 5.0 - prev.trainBrakeBar);
        const brakeCylinderBar = Math.min(3.8, brakePipeReduction * 2.5) + prev.locoBrakeBar * 0.8;
        const brakeRetardationForceKn = brakeCylinderBar * 22.0 * Math.sign(prev.currentSpeedKmh || 1);

        // Train Resistance (Davis Formula: R = A + B*v + C*v^2 + Gradient)
        const vMps = Math.abs(prev.currentSpeedKmh) / 3.6;
        const davisRollingResistanceN = (1.5 + 0.03 * Math.abs(prev.currentSpeedKmh) + 0.002 * Math.pow(Math.abs(prev.currentSpeedKmh), 2)) * totalTrainWeightTon * 9.81;
        const gradientResistanceN = totalTrainWeightTon * 9.81 * (prev.trackGradientPercent / 100);
        const totalResistanceKn = (davisRollingResistanceN + gradientResistanceN) / 1000;

        // Net Force on Composition (kN)
        let netForceKn = 0;
        if (Math.abs(prev.currentSpeedKmh) > 0.1 || Math.abs(actualTractiveEffortKn) > totalResistanceKn) {
          netForceKn = actualTractiveEffortKn - totalResistanceKn - (Math.sign(prev.currentSpeedKmh || actualTractiveEffortKn) * brakeRetardationForceKn);
        }

        // Acceleration a = F / m (m/s^2)
        const totalMassKg = totalTrainWeightTon * 1000;
        const accelerationMps2 = (netForceKn * 1000) / totalMassKg;

        // New Speed (km/h)
        let newSpeedKmh = prev.currentSpeedKmh + (accelerationMps2 * 0.05 * 3.6);
        if (Math.abs(newSpeedKmh) < 0.2 && regulatorFactor === 0 && brakeCylinderBar > 0.5) {
          newSpeedKmh = 0;
        }
        newSpeedKmh = Math.max(-25, Math.min(105, newSpeedKmh));

        // Power Output (HP): P = (F * v) / 745.7
        const powerHp = Math.max(0, (Math.abs(actualTractiveEffortKn * 1000) * (Math.abs(newSpeedKmh) / 3.6)) / 745.7);

        // Thermodynamics: Steam generation & Boiler pressure dynamics
        const steamConsumptionRate = (regulatorFactor * cutoffFactor * (Math.abs(newSpeedKmh) + 8)) * 0.012;
        const heatInputRate = 0.08; // Continuous coal fire
        let newPressure = prev.boilerPressureBar + (heatInputRate - steamConsumptionRate) * 0.05;
        // Safety relief valve pop at 16.2 bar
        newPressure = Math.max(8.0, Math.min(16.2, newPressure));

        // Coal & Water consumption
        const newCoal = Math.max(0, prev.coalKg - (heatInputRate * 0.02));
        const newWater = Math.max(0, prev.waterLiters - (steamConsumptionRate * 0.8));

        // Trigger chuff sounds based on wheel rotation
        chuffTimerRef.current += Math.abs(newSpeedKmh) * 0.05;
        if (chuffTimerRef.current > 4.5 && Math.abs(newSpeedKmh) > 1.5) {
          playSteamChuff(Math.min(0.3, regulatorFactor * 0.4 + 0.05));
          chuffTimerRef.current = 0;
        }

        if (onSpeedUpdate) onSpeedUpdate(newSpeedKmh);

        return {
          ...prev,
          currentSpeedKmh: newSpeedKmh,
          tractiveEffortKn: actualTractiveEffortKn,
          powerOutputHp: powerHp,
          boilerPressureBar: newPressure,
          wheelAdhesionStatus: adhesionStatus,
          coalKg: newCoal,
          waterLiters: newWater
        };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, onSpeedUpdate]);

  // History logger for telemetry graphs
  useEffect(() => {
    const histInterval = setInterval(() => {
      setTelemetryHistory((prev) => {
        const next = [
          ...prev,
          {
            speed: Math.round(physics.currentSpeedKmh),
            power: Math.round(physics.powerOutputHp),
            effort: Math.round(physics.tractiveEffortKn)
          }
        ];
        return next.slice(-24); // Keep last 24 records
      });
    }, 1000);
    return () => clearInterval(histInterval);
  }, [physics.currentSpeedKmh, physics.powerOutputHp, physics.tractiveEffortKn]);

  const handleBrakeRelease = () => {
    playBrakeHiss(0.7);
    setPhysics(p => ({ ...p, trainBrakeBar: 5.0, locoBrakeBar: 0.0 }));
  };

  const handleBrakeService = () => {
    playBrakeHiss(0.9);
    setPhysics(p => ({ ...p, trainBrakeBar: 3.8 }));
  };

  const handleBrakeEmergency = () => {
    playBrakeHiss(1.4);
    setPhysics(p => ({ ...p, trainBrakeBar: 0.0, regulatorPercent: 0, locoBrakeBar: 4.0 }));
  };

  const handleResetSimulator = () => {
    setPhysics({
      regulatorPercent: 0,
      reverserPercent: 65,
      boilerPressureBar: 14.0,
      waterLevelPercent: 82,
      trainBrakeBar: 5.0,
      locoBrakeBar: 0.0,
      currentSpeedKmh: 0,
      tractiveEffortKn: 0,
      powerOutputHp: 0,
      wheelAdhesionStatus: 'normal',
      coalKg: 4200,
      waterLiters: 18500,
      trackGradientPercent: 0.0,
      sandApplied: false
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-900">
              Simulador & Análise de Engenharia da Locomotiva
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cálculo em tempo real de termodinâmica do vapor, atrito de adesão roda-trilho e frenagem pneumática Westinghouse
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => playSteamWhistle()}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Volume2 className="w-4 h-4" />
            Apitar (Vapor)
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              isRunning ? 'bg-slate-100 hover:bg-slate-200 text-slate-800' : 'bg-emerald-600 text-white shadow-xs'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            {isRunning ? 'Pausar Simulação' : 'Retomar Simulação'}
          </button>
          <button
            onClick={handleResetSimulator}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs"
            title="Reiniciar valores"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Gauges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Speedometer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>VELOCÍMETRO</span>
            <Gauge className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {Math.abs(physics.currentSpeedKmh).toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">km/h</span>
          </div>
          {/* Visual bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-150"
              style={{ width: `${Math.min(100, (Math.abs(physics.currentSpeedKmh) / 90) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex justify-between font-mono">
            <span>0</span>
            <span>Limite: 80 km/h</span>
          </div>
        </div>

        {/* Boiler Pressure */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>PRESSÃO CALDEIRA</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600">
              {physics.boilerPressureBar.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">bar</span>
            <span className="text-[11px] text-slate-400">({(physics.boilerPressureBar * 14.5038).toFixed(0)} psi)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                physics.boilerPressureBar > 15.5 ? 'bg-red-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (physics.boilerPressureBar / 18) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex justify-between font-mono">
            <span>Min: 10</span>
            <span className="text-emerald-600 font-semibold">Ideal: 14 bar</span>
            <span>Alívio: 16.2</span>
          </div>
        </div>

        {/* Tractive Effort & Adhesion */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>FORÇA DE TRAÇÃO</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {Math.abs(physics.tractiveEffortKn).toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">kN</span>
            <span className="text-[11px] text-slate-400">({Math.round(physics.powerOutputHp)} HP)</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                physics.wheelAdhesionStatus === 'slipping' ? 'bg-red-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, (Math.abs(physics.tractiveEffortKn) / 125) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] mt-2 flex items-center justify-between">
            <span className="text-slate-400">Aderência:</span>
            {physics.wheelAdhesionStatus === 'slipping' ? (
              <span className="font-bold text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> PATINANDO!
              </span>
            ) : physics.wheelAdhesionStatus === 'sanded' ? (
              <span className="font-semibold text-amber-600">Areia Ativada (µ 0.35)</span>
            ) : (
              <span className="font-semibold text-emerald-600">Aço-Trilho Seguro</span>
            )}
          </div>
        </div>

        {/* Westinghouse Air Brake */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>LINHA WESTINGHOUSE</span>
            <Wind className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-sky-700">
              {physics.trainBrakeBar.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500">bar</span>
            <span className="text-[11px] text-slate-400">
              {physics.trainBrakeBar >= 4.9 ? '(Aliviado)' : physics.trainBrakeBar === 0 ? '(EMERGÊNCIA)' : '(Aplicado)'}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-sky-600 transition-all duration-150"
              style={{ width: `${Math.min(100, (physics.trainBrakeBar / 5) * 100)}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex justify-between font-mono">
            <span>0 bar (Emerg.)</span>
            <span>Serviço: 3.8</span>
            <span>Livre: 5.0</span>
          </div>
        </div>
      </div>

      {/* Control Console & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driving Controls Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Console de Comando Operacional do Maquinista
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
              Padrão EFSC Joinville
            </span>
          </div>

          {/* Regulator Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-800">Alavanca do Regulador (Acelerador de Vapor):</span>
              <span className="font-mono text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                {physics.regulatorPercent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={physics.regulatorPercent}
              onChange={(e) => setPhysics(p => ({ ...p, regulatorPercent: Number(e.target.value) }))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Fechado (0%)</span>
              <span>Corte Moderado (35%)</span>
              <span>Vapor Direto (100%)</span>
            </div>
          </div>

          {/* Reverser / Cutoff Walschaerts Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-800">Reversor & Grau de Corte Walschaerts:</span>
              <span className="font-mono text-slate-900 font-bold bg-slate-100 px-2.5 py-0.5 rounded-lg">
                {physics.reverserPercent > 0 ? `+${physics.reverserPercent}% (Frente)` : `${physics.reverserPercent}% (Ré)`}
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={physics.reverserPercent}
              onChange={(e) => setPhysics(p => ({ ...p, reverserPercent: Number(e.target.value) }))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Ré Total (-100%)</span>
              <span>Ponto Morto (0%)</span>
              <span>Expansão Reta (25%)</span>
              <span>Partida Forte (+75%)</span>
            </div>
          </div>

          {/* Westinghouse Air Brake Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-800 block">
              Válvula de Freio Automático Westinghouse:
            </span>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleBrakeRelease}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  physics.trainBrakeBar >= 4.8 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Aliviar (5.0 bar)
              </button>

              <button
                onClick={handleBrakeService}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  physics.trainBrakeBar > 0 && physics.trainBrakeBar < 4.8
                    ? 'bg-amber-600 text-white shadow-xs' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Wind className="w-4 h-4" />
                Serviço (3.8 bar)
              </button>

              <button
                onClick={handleBrakeEmergency}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  physics.trainBrakeBar === 0
                    ? 'bg-red-600 text-white shadow-xs animate-pulse' 
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Emergência (0 bar)
              </button>
            </div>
          </div>

          {/* Sand Dispenser & Incline */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-800 block mb-1.5">
                Caixa de Areia (Aumenta Aderência):
              </span>
              <button
                onClick={() => setPhysics(p => ({ ...p, sandApplied: !p.sandApplied }))}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                  physics.sandApplied
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {physics.sandApplied ? 'Areia Aplicando nos Trilhos' : 'Ligar Dispersor de Areia'}
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-slate-800">Rampa da Via (Serra de Joinville):</span>
                <span className="font-mono text-indigo-600 font-bold">
                  {physics.trackGradientPercent > 0 ? `+${physics.trackGradientPercent}%` : `${physics.trackGradientPercent}%`}
                </span>
              </div>
              <input
                type="range"
                min="-2.5"
                max="2.5"
                step="0.1"
                value={physics.trackGradientPercent}
                onChange={(e) => setPhysics(p => ({ ...p, trackGradientPercent: Number(e.target.value) }))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Real-time Telemetry & Supplies */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Telemetria e Balanço de Suprimentos
            </h3>

            {/* Tender Water Tank */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-sky-500" />
                  Água no Tender:
                </span>
                <span className="font-mono text-sky-700">{Math.round(physics.waterLiters)} L</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500"
                  style={{ width: `${(physics.waterLiters / 22000) * 100}%` }}
                />
              </div>
            </div>

            {/* Coal Tank */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Carvão Mineral / Biomassa:
                </span>
                <span className="font-mono text-amber-700">{Math.round(physics.coalKg)} kg</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${(physics.coalKg / 6000) * 100}%` }}
                />
              </div>
            </div>

            {/* Live Chart Mini Strip */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-2">
                Histórico de Velocidade (Últimos 24 segundos):
              </span>
              <div className="h-16 bg-slate-900 rounded-xl p-2 flex items-end gap-1">
                {telemetryHistory.map((item, idx) => {
                  const barHeight = Math.max(4, Math.min(50, (item.speed / 80) * 50));
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-indigo-400 rounded-t-xs hover:bg-amber-400 transition"
                      style={{ height: `${barHeight}px` }}
                      title={`${item.speed} km/h - ${item.power} HP`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Practical Engineering Tip */}
          <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-xs text-indigo-950">
            <span className="font-bold block mb-0.5">Dica de Engenharia Ferroviária:</span>
            Para economizar até 40% de vapor em velocidade constante, reduza o reversor Walschaerts para 25% (corte curto). Isso permite que o vapor se expanda adiabaticamente dentro dos cilindros sem esvaziar a caldeira!
          </div>
        </div>
      </div>
    </div>
  );
}
