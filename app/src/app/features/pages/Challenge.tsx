import { useState, useEffect } from 'react';
import { ecoApiService } from '../../services/eco-api.service';

function Challenge() {
  const days = Array.from({length: 30}, (_, i) => i + 1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const data = await ecoApiService.getChallengeProgress();
        setCompletedDays(data);
      } catch (error) {
        console.error('Failed to load challenge progress:', error);
      }
    };
    loadProgress();
  }, []);

  const toggleDay = async (day: number) => {
    const isComplete = !completedDays.includes(day);
    if (isComplete) {
      setCompletedDays(prev => [...prev, day]);
    } else {
      setCompletedDays(prev => prev.filter(x => x !== day));
    }

    try {
      await ecoApiService.updateChallenge(day, isComplete);
    } catch (error) {
      console.error('Failed to update challenge:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-10 text-white mb-10 text-center shadow-lg">
        <h2 className="text-4xl font-bold mb-4">30-Day Eco Challenge</h2>
        <p className="text-emerald-100 text-lg">Click a day to mark complete. Your progress is saved.</p>
      </div>
      
      <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
        {days.map((i) => (
          <div 
            key={i}
            onClick={() => toggleDay(i)}
            className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105 ${
              completedDays.includes(i) 
                ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' 
                : 'bg-white border-stone-100 text-stone-400 hover:border-emerald-200'
            }`}
          >
            <span className="text-xs font-bold uppercase tracking-wider">Day</span>
            <span className="text-2xl font-bold">{i}</span>
            {completedDays.includes(i) && <span className="text-lg mt-1">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Challenge;
