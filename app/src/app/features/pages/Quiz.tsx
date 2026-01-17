function Quiz() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-center animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-stone-800">Eco-Trivia Master</h2>
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-indigo-100">
        <div className="text-6xl mb-6">🧠</div>
        <h3 className="text-2xl font-bold text-stone-800 mb-8">Which plastic type is generally easiest to recycle?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-5 rounded-2xl border-2 border-stone-100 hover:border-indigo-500 hover:bg-indigo-50 font-bold text-stone-600 transition-all">
            PET (Type 1)
          </button>
          <button className="p-5 rounded-2xl border-2 border-stone-100 hover:border-indigo-500 hover:bg-indigo-50 font-bold text-stone-600 transition-all">
            PVC (Type 3)
          </button>
          <button className="p-5 rounded-2xl border-2 border-stone-100 hover:border-indigo-500 hover:bg-indigo-50 font-bold text-stone-600 transition-all">
            LDPE (Type 4)
          </button>
          <button className="p-5 rounded-2xl border-2 border-stone-100 hover:border-indigo-500 hover:bg-indigo-50 font-bold text-stone-600 transition-all">
            PS (Type 6)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
