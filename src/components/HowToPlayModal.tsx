import React, { useState } from 'react';
import { BookOpen, Trophy, ArrowLeft, CheckCircle2, Shuffle, Layers, ShieldCheck, Grid, Sparkles, Touchpad } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HowToPlayModalProps {
  onBack: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const roundsInfo = [
    {
      id: 1,
      title: 'Babak 1: Mystery Fraction Family',
      icon: <Layers className="w-5 h-5 text-sky-400" />,
      desc: 'Misteri 2 Keluarga Pecahan Senilai',
      content: (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            Tersedia <strong>8 kartu pecahan</strong> yang diacak di meja arena. Tugas tim Anda adalah mengelompokkannya ke dalam <strong>2 keluarga pecahan senilai</strong> (Kelompok A dan Kelompok B) masing-masing 4 kartu!
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-sky-500/30">
            <div className="text-xs font-bold text-sky-400 mb-2 uppercase">Contoh 2 Keluarga Senilai:</div>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-300 font-mono">
              <li>Kelompok A: 1/2 = 2/4 = 3/6 = 4/8</li>
              <li>Kelompok B: 3/4 = 6/8 = 9/12 = 12/16</li>
            </ul>
          </div>
          <div className="text-xs bg-amber-950/40 border border-amber-500/40 rounded-lg p-3 text-amber-200">
            <strong>Catatan Champion:</strong> Pada tingkat Champion, ada <em>1 kartu penyusup</em> yang bukan bagian dari kelompok manapun. Pindahkan kartu penyusup ke <strong>Zona Karantina Penyusup</strong>.
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Babak 2: Duel Perbandingan Pecahan',
      icon: <CheckCircle2 className="w-5 h-5 text-orange-400" />,
      desc: 'Hanya Sama Pembilang atau Sama Penyebut',
      content: (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            Dua pecahan dimunculkan di podium hologram. Tim memilih simbol perbandingan: <strong>&gt;</strong> (Lebih Besar), <strong>&lt;</strong> (Lebih Kecil), atau <strong>=</strong> (Senilai).
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-orange-500/30 space-y-2 text-xs">
            <div>
              <strong className="text-cyan-400">Penyebut Sama:</strong> Bandingkan pembilangnya langsung! Semakin besar pembilang, nilainya semakin besar (misal 2/7 &lt; 5/7).
            </div>
            <div>
              <strong className="text-orange-400">Pembilang Sama:</strong> Semakin kecil penyebut, potongannya semakin besar sehingga nilainya lebih besar (misal 3/4 &gt; 3/8).
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Babak 3: Mengurutkan Pecahan & Bukti Visual',
      icon: <Shuffle className="w-5 h-5 text-purple-400" />,
      desc: 'Urutan Nilai Terkecil ke Terbesar',
      content: (
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            Tersedia 2 tantangan mengurutkan 4 kartu pecahan dari nilai terkecil ke terbesar:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
            <li><strong>Tantangan 1 (Penyebut Sama):</strong> Urutkan berdasarkan pembilang terkecil ke terbesar (misal: 1/8 &lt; 3/8 &lt; 5/8 &lt; 7/8).</li>
            <li><strong>Tantangan 2 (Pembilang Sama):</strong> Urutkan dari penyebut terbesar ke penyebut terkecil (misal: 2/9 &lt; 2/7 &lt; 2/5 &lt; 2/3).</li>
          </ul>
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30">
            <div className="text-xs font-bold text-purple-400 mb-2 uppercase">3 Pilihan Pembuktian Nyata:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-cyan-300 block mb-1">Batang Pecahan</span>
                Membandingkan panjang strip balok terarsir.
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-orange-300 block mb-1">Lingkaran Pecahan</span>
                Membandingkan luas juring lingkaran.
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-emerald-300 block mb-1">Garis Bilangan</span>
                Melihat letak titik antara 0 dan 1.
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span>PANDUAN & ATURAN TURNAMEN</span>
          </h2>
          <p className="text-xs text-slate-400">
            Pedoman lengkap 3 babak kompetisi matematika pecahan
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 border-b border-slate-800 scrollbar-none">
        {roundsInfo.map(r => (
          <button
            key={r.id}
            onClick={() => {
              sounds.playClick();
              setActiveTab(r.id);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              activeTab === r.id
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {r.icon}
            <span>Babak {r.id}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          {roundsInfo[activeTab - 1].icon}
          <div>
            <h3 className="text-xl font-black font-display text-white">
              {roundsInfo[activeTab - 1].title}
            </h3>
            <span className="text-xs text-cyan-400 font-medium">
              {roundsInfo[activeTab - 1].desc}
            </span>
          </div>
        </div>

        {roundsInfo[activeTab - 1].content}

        {/* Tip Layar IFP / Layar Sentuh */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-start gap-3 bg-slate-950/60 p-4 rounded-xl">
          <Touchpad className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <span className="font-bold text-amber-300">Dukungan Penuh Layar Sentuh & IFP:</span>
            <p className="mt-0.5">
              Seluruh kartu pecahan dapat dipindahkan dengan cara <strong>seret-dan-lepas (drag & drop)</strong> ataupun dengan metode <strong>klik-pilih lalu klik-tujuan</strong>. Sangat praktis saat dimainkan di Interactive Flat Panel (IFP) depan kelas atau tablet bersama!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
