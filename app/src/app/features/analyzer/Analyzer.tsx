import { useState } from 'react';
import { ecoApiService, AnalysisResult } from '../../services/eco-api.service';

function Analyzer() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const result = await ecoApiService.analyzeItem(input);
      setData(result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBinClass = (color: string) => {
    if (color.includes('Blue')) return 'border-blue-500';
    if (color.includes('Green')) return 'border-green-500';
    return 'border-stone-800';
  };

  const getIconBg = (color: string) => {
    if (color.includes('Blue')) return 'bg-blue-100';
    if (color.includes('Green')) return 'bg-green-100';
    return 'bg-stone-200';
  };

  const getIcon = (color: string) => {
    if (color.includes('Blue')) return '♻️';
    if (color.includes('Green')) return '🍂';
    return '🗑️';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      {/* Input Section */}
      <div className="bg-white p-10 rounded-3xl shadow-xl mb-12 border border-stone-100">
        <h2 className="text-4xl font-bold text-stone-800 mb-2">AI Waste Analyzer</h2>
        <p className="text-stone-500 mb-8 text-lg">Not sure which bin to use? Our AI identifies items instantly.</p>
        
        <div className="flex gap-4">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && analyze()}
            placeholder="e.g. 'Greasy Pizza Box' or 'Plastic Bottle'" 
            className="flex-1 p-5 bg-stone-50 border border-stone-200 rounded-2xl text-xl outline-none focus:ring-4 focus:ring-emerald-100 transition-all placeholder:text-stone-400"
          />
          <button 
            onClick={analyze} 
            disabled={loading} 
            className="bg-emerald-600 text-white px-10 rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-200 flex items-center gap-2"
          >
            {loading && <span className="animate-spin">⌛</span>}
            {loading ? 'Analyzing...' : 'Check Item'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {data && (
        <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
          {/* Disposal Card */}
          <div className={`bg-white p-8 rounded-3xl shadow-lg border-l-8 flex flex-col ${getBinClass(data.bin_color)}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl ${getIconBg(data.bin_color)}`}>
                {getIcon(data.bin_color)}
              </div>
              <div>
                <span className="text-sm font-bold uppercase tracking-wider opacity-60">Verdict</span>
                <h3 className="text-3xl font-bold text-stone-800">{data.bin_color} Bin</h3>
              </div>
            </div>
            
            <div className="bg-stone-50 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-stone-700 mb-2 flex items-center gap-2">📝 Instructions</h4>
              <p className="text-lg text-stone-600 leading-relaxed">{data.handling_instructions}</p>
            </div>

            <div className="mt-auto pt-6 border-t border-stone-100">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-500 uppercase">Method: {data.disposal_method}</span>
            </div>
          </div>

          {/* Impact & SDG Card */}
          <div className="flex flex-col gap-6">
            {/* SDG Gradient Card */}
            <div className="bg-gradient-to-br from-[#BF8B2E] to-[#cf9d3e] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 text-9xl font-bold opacity-10 group-hover:opacity-20 transition-opacity">SDG</div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">United Nations Goal</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Sustainable Impact</h3>
                <p className="text-lg opacity-95 leading-relaxed">{data.sdg_connection || "Contributes to Goal 12: Responsible Consumption and Production."}</p>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-white p-8 rounded-3xl shadow-md border border-stone-100">
              <h4 className="font-bold text-emerald-700 mb-3 flex items-center gap-2">🌍 Environmental Effect</h4>
              <p className="text-stone-600">{data.environmental_impact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analyzer;
