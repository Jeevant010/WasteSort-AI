function About() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <h2 className="text-4xl font-bold mb-8 text-stone-800">About EcoSort AI</h2>
      <div className="prose prose-lg text-stone-600 leading-relaxed">
        <p className="mb-6">
          We are a team of environmentalists and technologists dedicated to solving the global waste crisis using Artificial Intelligence.
          By simplifying the complex rules of recycling, we empower individuals to make better choices every day.
        </p>
        <p>
          Our mission is aligned with the UN Sustainable Development Goals 12 and 13, focusing on responsible consumption and urgent climate action.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-stone-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">👩‍🔬</div>
          <h3 className="font-bold text-stone-800">Data Science</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-stone-100">
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">🤖</div>
          <h3 className="font-bold text-stone-800">AI Vision</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center border border-stone-100">
          <div className="w-20 h-20 bg-amber-100 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">🌱</div>
          <h3 className="font-bold text-stone-800">Sustainability</h3>
        </div>
      </div>
    </div>
  );
}

export default About;
