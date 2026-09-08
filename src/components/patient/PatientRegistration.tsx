import React, { useState } from 'react';
import { PatientInfo, Eye } from '../../types/screening';
import { ArrowRight, UserCheck, Calendar, Sparkles, AlertCircle, Shield, Play } from 'lucide-react';
import { CLINICAL_CASE_PRESETS } from '../../data/clinicalCases';

interface PatientRegistrationProps {
  initialPatient: PatientInfo;
  onSubmit: (patient: PatientInfo, presetId?: string) => void;
  onSelectPreset?: (presetId: string) => void;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  initialPatient,
  onSubmit,
}) => {
  const [patientId, setPatientId] = useState(initialPatient.patientId);
  const [age, setAge] = useState(initialPatient.age ? String(initialPatient.age) : '52');
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other'>(initialPatient.sex || 'Female');
  const [eye, setEye] = useState<Eye>(initialPatient.eye || 'OD');
  const [phcLocation, setPhcLocation] = useState(
    initialPatient.phcLocation || 'Shirur Primary Health Centre, Rural District'
  );
  const [errors, setErrors] = useState<{ patientId?: string; age?: string }>({});

  const handleGenerateId = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setPatientId(`PHC-LIVE-${randomDigits}`);
    setErrors({});
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = CLINICAL_CASE_PRESETS.find((c) => c.id === presetId);
    if (preset) {
      onSubmit(preset.patient, preset.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { patientId?: string; age?: string } = {};

    if (!patientId.trim()) {
      newErrors.patientId = 'Patient ID is required.';
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      newErrors.age = 'Enter a valid age between 1 and 120.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const currentTimestamp =
      new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
      }) + ' IST';

    const updatedPatient: PatientInfo = {
      patientId: patientId.trim().toUpperCase(),
      age: ageNum,
      sex,
      eye,
      timestamp: currentTimestamp,
      phcLocation: phcLocation.trim(),
    };

    // Live intake submission (no presetId)
    onSubmit(updatedPatient);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Editorial Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs mb-3">
          <span>STEP 01</span>
          <span>·</span>
          <span>PATIENT IDENTIFICATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e60f0f] mb-2">
          Frontline Patient Intake
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Record essential identification for screening traceability. Minimal data entry is prioritized for high-throughput rural primary health centres (PHCs).
        </p>
      </div>

      {/* Main Intake Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Registration Form (8 cols) - Live Screening */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-8 bg-[#11171F] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6"
        >
          {/* Form Header with Live Mode Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                Live Patient Intake (Real Screening Mode)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Contract: Min. required PHC metadata
            </span>
          </div>

          {/* Patient ID */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="patient-id-input" className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
                Patient Identifier / PHC Registration ID
              </label>
              <button
                type="button"
                onClick={handleGenerateId}
                className="text-[11px] font-mono text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                <span>Generate ID</span>
              </button>
            </div>
            <input
              id="patient-id-input"
              type="text"
              value={patientId}
              onChange={(e) => {
                setPatientId(e.target.value);
                if (errors.patientId) setErrors({ ...errors, patientId: undefined });
              }}
              placeholder="e.g. PHC-LIVE-4091"
              className={`w-full bg-[#0B0F14] border ${
                errors.patientId ? 'border-rose-500' : 'border-slate-700 focus:border-rose-500'
              } rounded-lg px-4 py-3 text-base font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors`}
              autoFocus
            />
            {errors.patientId && (
              <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.patientId}
              </p>
            )}
          </div>

          {/* Age & Sex Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Age */}
            <div>
              <label htmlFor="patient-age-input" className="block text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-2">
                Age (Years)
              </label>
              <input
                id="patient-age-input"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  if (errors.age) setErrors({ ...errors, age: undefined });
                }}
                className={`w-full bg-[#0B0F14] border ${
                  errors.age ? 'border-rose-500' : 'border-slate-700 focus:border-rose-500'
                } rounded-lg px-4 py-3 text-base font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-colors`}
              />
              {errors.age && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.age}
                </p>
              )}
            </div>

            {/* Sex */}
            <div>
              <label className="block text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-2">
                Biological Sex
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Female', 'Male', 'Other'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={`py-3 px-2 rounded-lg text-xs font-medium border transition-all text-center min-h-[44px] cursor-pointer ${
                      sex === s
                        ? 'bg-slate-800 border-rose-500/80 text-white shadow-sm font-semibold'
                        : 'bg-[#0B0F14] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Eye Being Screened (OD vs OS) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
                Eye Being Screened
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                OD: Right Eye · OS: Left Eye
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="select-eye-od"
                onClick={() => setEye('OD')}
                className={`p-3.5 rounded-lg border text-left transition-all min-h-[44px] cursor-pointer ${
                  eye === 'OD'
                    ? 'bg-slate-800/90 border-rose-500 text-white shadow-sm ring-1 ring-rose-500/30'
                    : 'bg-[#0B0F14] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-white">OD</span>
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${eye === 'OD' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400'}`}>
                    Right Eye
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Oculus Dexter (Initial field)</p>
              </button>

              <button
                type="button"
                id="select-eye-os"
                onClick={() => setEye('OS')}
                className={`p-3.5 rounded-lg border text-left transition-all min-h-[44px] cursor-pointer ${
                  eye === 'OS'
                    ? 'bg-slate-800/90 border-rose-500 text-white shadow-sm ring-1 ring-rose-500/30'
                    : 'bg-[#0B0F14] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-white">OS</span>
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${eye === 'OS' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400'}`}>
                    Left Eye
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Oculus Sinister (Contralateral)</p>
              </button>
            </div>
          </div>

          {/* Screening PHC Center */}
          <div>
            <label htmlFor="phc-location-input" className="block text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-2">
              Frontline Facility / PHC Node
            </label>
            <input
              id="phc-location-input"
              type="text"
              value={phcLocation}
              onChange={(e) => setPhcLocation(e.target.value)}
              className="w-full bg-[#0B0F14] border border-slate-800 rounded-lg px-4 py-2.5 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600"
            />
          </div>

          {/* Primary Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              id="proceed-to-imaging-btn"
              className="w-full py-4 px-6 bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 hover:shadow-rose-900/50 transition-all cursor-pointer min-h-[44px]"
            >
              <span>Proceed to Fundus Acquisition (Stage 02)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Rapid Benchmark Presets (4 cols) - Clearly Separated Demonstration */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#11171F]/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demonstration Scenarios</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                Synthetic Benchmarks
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Test standardized clinical scenarios without a live fundus camera. These presets use illustrative benchmark imagery and pre-calibrated telemetry:
            </p>

            <div className="space-y-2.5">
              {CLINICAL_CASE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  id={`load-preset-${preset.id}`}
                  onClick={() => handleApplyPreset(preset.id)}
                  className="w-full text-left p-3 rounded-lg border border-slate-800 bg-[#0B0F14]/80 hover:bg-slate-800/80 hover:border-slate-700 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-200 group-hover:text-white mb-1">
                    <span className="truncate font-semibold">{preset.shortLabel}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ml-1 ${
                        preset.expectedResult.includes('Referable')
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : preset.expectedResult.includes('Quality')
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {preset.expectedResult.includes('Referable')
                        ? 'Referable'
                        : preset.expectedResult.includes('Quality')
                        ? 'Recapture'
                        : 'Routine'}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Synthetic Case: {preset.patient.patientId}</span>
                    <span className="text-amber-400/80 group-hover:text-amber-300 flex items-center gap-1">
                      <Play className="w-2.5 h-2.5" />
                      Run Demo
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 text-[11px] font-mono text-amber-300/80 bg-amber-950/20 p-2.5 rounded border border-amber-500/20 leading-relaxed">
              <strong>Notice:</strong> Demonstration cases do not perform live inference or create real medical records.
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs text-slate-400 font-mono">
            <span className="text-slate-300 font-bold block mb-1">CLINICAL SAFETY DIRECTIVE</span>
            NetraRakshakAI assists frontline healthcare workers in rural triage. It is not an autonomous diagnostic device.
          </div>
        </div>
      </div>
    </div>
  );
};
