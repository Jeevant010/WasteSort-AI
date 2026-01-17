function Sdg() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      <h2 className="text-4xl font-bold text-stone-800 mb-12 text-center">Global Goals</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-10 rounded-3xl shadow-xl hover:scale-[1.02] transition-transform">
          <h3 className="text-3xl font-bold mb-4">12. Responsible Consumption</h3>
          <p className="text-lg opacity-90">Doing more and better with less. Decoupling economic growth from environmental degradation.</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-10 rounded-3xl shadow-xl hover:scale-[1.02] transition-transform">
          <h3 className="text-3xl font-bold mb-4">13. Climate Action</h3>
          <p className="text-lg opacity-90">Take urgent action to combat climate change and its impacts.</p>
        </div>
      </div>
    </div>
  );
}

export default Sdg;
