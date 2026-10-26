import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Music, Clock, Flame, RotateCcw, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { GameSettings, DifficultyLevel } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface TeacherSettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetMatch: () => void;
  onBack: () => void;
  isMatchActive: boolean;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetMatch,
  onBack,
  isMatchActive,
}) => {
  const [localSettings, setLocalSettings] = useState<GameSettings>({ ...settings });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    sounds.playSuccess();
    onUpdateSettings(localSettings);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleConfirmReset = () => {
    sounds.playError();
    onResetMatch();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu</span>
        </button>
        <div className="text-right">
          <h2 className="text-2xl font-black font-display text-white tracking-wide flex items-center justify-end gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <span>PENGATURAN GURU</span>
          </h2>
          <p className="text-xs text-slate-400">
            Kendali parameter kompetisi kelas & lingkungan bermain
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Durasi Giliran */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400 mb-2">
            <Clock className="w-4 h-4" />
            <span>DURASI TIMER PER GILIRAN</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Atur batas waktu berpikir bagi tim per babak. Saat waktu habis, susunan kartu akan terkunci otomatis.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { val: 30, label: '30 Detik', desc: 'Sangat Cepat' },
              { val: 60, label: '60 Detik', desc: 'Tantangan Cepat' },
              { val: 90, label: '90 Detik', desc: 'Standar Turnamen' },
              { val: 120, label: '120 Detik', desc: 'Santai / Pemula' },
              { val: 0, label: 'Tanpa Timer', desc: 'Fokus Eksplorasi' },
            ].map(item => (
              <button
                key={item.val}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setLocalSettings(s => ({ ...s, turnDuration: item.val }));
                }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  localSettings.turnDuration === item.val
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-black">{item.label}</div>
                <div className="text-[10px] opacity-75">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tingkat Kesulitan */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400 mb-2">
            <Flame className="w-4 h-4" />
            <span>TINGKAT KESULITAN KURIKULUM</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Menyesuaikan kompleksitas angka pecahan dan mekanisme kartu jebakan.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'pemula',
                label: 'Pemula (Level 1)',
                desc: 'Pecahan dasar 1/2, 1/3, 1/4. Tanpa kartu penyusup. Pengali teratur.',
              },
              {
                id: 'menengah',
                label: 'Menengah (Level 2)',
                desc: 'Standar Kelas IV: penyebut hingga 16, pengali acak, langkah switch teratur.',
              },
              {
                id: 'champion',
                label: 'Champion (Level 3)',
                desc: 'Turnamen Penuh: kartu penyusup aktif di Babak 1, langkah switch lebih menantang.',
              },
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setLocalSettings(s => ({ ...s, difficulty: item.id as DifficultyLevel }));
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  localSettings.difficulty === item.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-black mb-1">{item.label}</div>
                <div className="text-xs leading-relaxed opacity-85">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Efek Suara */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
          <div className="text-sm font-bold text-sky-400 mb-4">SUARA & ATMOSFER ARENA</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                const next = !localSettings.soundEnabled;
                sounds.isSoundEnabled = next;
                if (next) sounds.playClick();
                setLocalSettings(s => ({ ...s, soundEnabled: next }));
              }}
              className={`p-4 rounded-xl border flex items-center justify-between ${
                localSettings.soundEnabled
                  ? 'bg-sky-500/20 border-sky-400 text-sky-200'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                {localSettings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                <div className="text-left">
                  <div className="text-sm font-bold">Efek Suara (SFX)</div>
                  <div className="text-[11px] opacity-75">Bunyi klik, kartu, dan hasil jawaban</div>
                </div>
              </div>
              <div className="font-mono text-xs font-bold">
                {localSettings.soundEnabled ? 'AKTIF' : 'SENYAP'}
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                const next = !localSettings.bgmEnabled;
                sounds.toggleBgm(next);
                setLocalSettings(s => ({ ...s, bgmEnabled: next }));
              }}
              className={`p-4 rounded-xl border flex items-center justify-between ${
                localSettings.bgmEnabled
                  ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-sm font-bold">Musik BGM Synthesizer</div>
                  <div className="text-[11px] opacity-75">Melodi ambient turnamen futuristik</div>
                </div>
              </div>
              <div className="font-mono text-xs font-bold">
                {localSettings.bgmEnabled ? 'AKTIF' : 'NONAKTIF'}
              </div>
            </button>
          </div>
        </div>

        {/* Reset Pertandingan */}
        <div className="bg-rose-950/20 border border-rose-900/50 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-rose-400 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>RESET PERTANDINGAN AKTIF</span>
              </div>
              <p className="text-xs text-slate-400 max-w-lg">
                Menghapus seluruh skor tim, putaran babak yang sedang berjalan, dan mengembalikan status kompetisi ke awal.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/80 border border-rose-600/50 hover:bg-rose-900/60 transition-colors flex items-center gap-2 shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Pertandingan
            </button>
          </div>

          {/* Reset Confirmation Modal */}
          {showResetConfirm && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-rose-500/60 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <span className="text-xs text-rose-200">
                Apakah Anda yakin ingin mereset seluruh data turnamen ini?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReset}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
                >
                  Ya, Reset Sekarang
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Pengaturan berhasil disimpan!
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-500/20"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
