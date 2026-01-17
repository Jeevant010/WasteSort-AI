import { useState } from 'react';
import { ecoApiService } from '../../services/eco-api.service';

function Carbon() {
  const [data, setData] = useState({ commute: 'Car (Gasoline)', diet: 'Meat Eater' });
  const [result, setResult] = useState<number | null>(null);

  const calculate = async () => {
    try {
      const res = await ecoApiService.calculateCarbon(data);
      setResult(res.score);
    } catch (error) {
      console.error('Failed to calculate carbon:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-slide-up">
      <h2 className="text-3xl font-bold mb-2 text-center text-stone-800">Carbon Footprint</h2>
      <p className="text-center text-stone-500 mb-8">Calculate your daily impact score.</p>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
        <div className="space-y-6">
          <label className="block">
            <span className="text-sm font-bold text-stone-600 uppercase">Commute</span>
            <select 
              value={data.commute}
              onChange={(e) => setData({...data, commute: e.target.value})}
              className="w-full mt-2 p-4 bg-stone-50 rounded-xl outline-none border border-stone-200"
            >
              <option>Car (Gasoline)</option>
              <option>Electric Vehicle</option>
              <option>Public Transport</option>
              <option>Cycling</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold text-stone-600 uppercase">Diet</span>
            <select 
              value={data.diet}
              onChange={(e) => setData({...data, diet: e.target.value})}
              className="w-full mt-2 p-4 bg-stone-50 rounded-xl outline-none border border-stone-200"
            >
              <option>Meat Eater</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
            </select>
          </label>
          <button 
            onClick={calculate} 
            className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Calculate Impact
          </button>
        </div>

        {result !== null && (
          <div className="mt-8 text-center p-6 bg-emerald-50 rounded-2xl animate-fade-in">
            <p className="text-stone-500 mb-2">Your Daily Impact Score</p>
            <div className="text-5xl font-bold text-emerald-600 mb-2">{result}</div>
            <p className="text-sm text-emerald-800">Saved to your history!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carbon;
