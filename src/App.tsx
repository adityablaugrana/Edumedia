/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Sparkles, LayoutTemplate, Copy, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [jenjang, setJenjang] = useState('SD');
  const [mataPelajaran, setMataPelajaran] = useState('');
  const [materi, setMateri] = useState('');
  const [jenisMedia, setJenisMedia] = useState('Slide Pembelajaran');
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mataPelajaran || !materi) {
      setError('Mata pelajaran dan materi harus diisi.');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult('');
    setCopied(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jenjang, mataPelajaran, materi, jenisMedia, catatan }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Terjadi kesalahan');
      
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || 'Gagal menghasilkan konten. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F3] text-[#2D2D2D] font-sans selection:bg-[#E6F8F9] selection:text-[#008185]">
      <header className="bg-white border-b border-[#E2E1D9] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00C4CC] rounded-lg flex items-center justify-center text-white">
              <LayoutTemplate className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A]">Edu-Media</h1>
          </div>
          <div className="text-xs font-bold px-2 py-0.5 bg-[#E6F8F9] text-[#008185] rounded uppercase tracking-widest">
            Generator Prompt
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#E2E1D9]">
              <h2 className="text-2xl font-serif italic text-[#1A1A1A] mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00C4CC]" />
                Rancang Media Pembelajaran
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#4B4B4B] mb-1 uppercase tracking-widest">Jenjang</label>
                  <select 
                    value={jenjang}
                    onChange={(e) => setJenjang(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E2E1D9] rounded px-3 py-2 text-sm font-medium text-[#4B4B4B] focus:border-[#00C4CC] focus:outline-none focus:ring-1 focus:ring-[#00C4CC] transition-colors"
                  >
                    <option value="SD Kelas 1-3">SD Kelas 1-3 (Fase A-B)</option>
                    <option value="SD Kelas 4-6">SD Kelas 4-6 (Fase B-C)</option>
                    <option value="SMP">SMP (Fase D)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4B4B4B] mb-1 uppercase tracking-widest">Mata Pelajaran <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={mataPelajaran}
                    onChange={(e) => setMataPelajaran(e.target.value)}
                    placeholder="Contoh: IPA, Matematika, Bahasa Indonesia"
                    className="w-full bg-[#F5F5F5] border border-[#E2E1D9] rounded px-3 py-2 text-sm font-medium text-[#4B4B4B] focus:border-[#00C4CC] focus:outline-none focus:ring-1 focus:ring-[#00C4CC] transition-colors placeholder:text-[#A1A1A1]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4B4B4B] mb-1 uppercase tracking-widest">Topik / Materi <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={materi}
                    onChange={(e) => setMateri(e.target.value)}
                    placeholder="Contoh: Siklus Air, Pecahan, Puisi Lama"
                    className="w-full bg-[#F5F5F5] border border-[#E2E1D9] rounded px-3 py-2 text-sm font-medium text-[#4B4B4B] focus:border-[#00C4CC] focus:outline-none focus:ring-1 focus:ring-[#00C4CC] transition-colors placeholder:text-[#A1A1A1]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4B4B4B] mb-1 uppercase tracking-widest">Jenis Media</label>
                  <select 
                    value={jenisMedia}
                    onChange={(e) => setJenisMedia(e.target.value)}
                    className="w-full bg-[#F5F5F5] border border-[#E2E1D9] rounded px-3 py-2 text-sm font-medium text-[#4B4B4B] focus:border-[#00C4CC] focus:outline-none focus:ring-1 focus:ring-[#00C4CC] transition-colors"
                  >
                    <option value="Slide Pembelajaran">Slide Pembelajaran</option>
                    <option value="E-Modul">E-Modul</option>
                    <option value="LKPD / Worksheet">LKPD / Worksheet</option>
                    <option value="Game Edukasi">Game Edukasi</option>
                    <option value="Media Interaktif (Drag & Drop, Quiz)">Media Interaktif (Drag & Drop, Quiz)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4B4B4B] mb-1 uppercase tracking-widest">Catatan Tambahan (Opsional)</label>
                  <textarea 
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Contoh: Fokus pada desain ramah anak, warna pastel, maksimal 10 halaman."
                    rows={3}
                    className="w-full bg-[#F5F5F5] border border-[#E2E1D9] rounded px-3 py-2 text-sm font-medium text-[#4B4B4B] focus:border-[#00C4CC] focus:outline-none focus:ring-1 focus:ring-[#00C4CC] transition-colors placeholder:text-[#A1A1A1] resize-none"
                  />
                </div>

                {error && (
                  <div className="text-[11px] font-bold text-red-600 bg-red-50 px-3 py-2 rounded border border-red-100 uppercase tracking-widest">
                    {error}
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#00C4CC] hover:bg-[#00A8AD] text-white text-xs font-bold px-4 py-3 rounded uppercase tracking-widest transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Generate Prompt'
                  )}
                </button>
              </form>
            </div>
            
            <div className="bg-[#00C4CC10] border border-[#00C4CC40] p-4 rounded-xl">
              <h3 className="text-[10px] text-[#008185] font-bold mb-1 uppercase tracking-wider">Tips Penggunaan:</h3>
              <ul className="text-xs text-[#2D2D2D] leading-relaxed list-disc list-inside space-y-1">
                <li>Spesifikkan materi agar hasil lebih akurat.</li>
                <li>Gunakan catatan tambahan untuk request tema warna tertentu.</li>
                <li>Copy hasil prompt dan paste ke AI pembuat desain atau simpan sebagai panduan desain.</li>
              </ul>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-xl border border-[#E2E1D9] h-full min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E1D9]">
                <h2 className="text-[10px] font-bold text-[#A1A1A1] uppercase tracking-widest">Hasil Generation</h2>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-[#E2E1D9] bg-white text-xs font-bold rounded hover:bg-[#F9F8F3] text-[#4B4B4B] transition-colors"
                  >
                    {copied ? (
                      <><CheckCircle2 className="w-4 h-4 text-[#00C4CC]" /> Tersalin</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Salin Teks</>
                    )}
                  </button>
                )}
              </div>
              
              <div className="flex-grow overflow-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#A1A1A1] gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00C4CC]" />
                    <p className="text-[11px] font-bold uppercase tracking-widest">Menyusun struktur dan meracik prompt...</p>
                  </div>
                ) : result ? (
                  <div className="markdown-body">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[#A1A1A1] gap-2">
                    <LayoutTemplate className="w-12 h-12 opacity-20" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-center">Belum ada hasil.<br/>Isi form dan klik Generate.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
