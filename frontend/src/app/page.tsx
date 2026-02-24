import PixForm from "../components/PixForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 selection:bg-[#7939e8]/30">
      {/* Background ambient light */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#7939e8]/20 to-transparent rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#502699]/40 to-transparent rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
      </div>

      <main className="w-full max-w-5xl z-10 space-y-8 flex flex-col pt-12 pb-24">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-2 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#7939e8] animate-pulse"></span>
            <span className="text-xs font-medium tracking-wide text-[#9b66f2]">SISTEMA ONLINE</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Gerador <span className="text-[#7939e8]">Paynux</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Um sistema perfeito para gerar pagamentos via Pix. Rápido, seguro e eficiente.
          </p>
        </div>

        {/* The Pix Form Component */}
        <PixForm />

        {/* Footer */}
        <footer className="text-center text-sm text-gray-600 pt-16 mt-8 border-t border-white/5">
          <p>&copy; {new Date().getFullYear()} Paynux Pagamentos LTDA.</p>
        </footer>
      </main>
    </div>
  );
}
