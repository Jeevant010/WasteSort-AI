import { useState } from 'react';
import { ecoApiService } from '../../services/eco-api.service';

function Volunteer() {
  const [data, setData] = useState({ name: '', email: '', interests: '' });
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ecoApiService.submitVolunteer(data);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit volunteer:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-slide-up">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2 text-stone-800">Join the Green Army</h2>
        <p className="text-stone-500">Volunteers are the backbone of our mission.</p>
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-xl border border-stone-100">
        {!submitted ? (
          <form onSubmit={submit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold text-sm text-stone-600">Full Name</label>
                <input 
                  value={data.name}
                  onChange={(e) => setData({...data, name: e.target.value})}
                  type="text" 
                  className="w-full p-4 bg-stone-50 rounded-xl outline-none border border-stone-200 focus:ring-2 focus:ring-emerald-500" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="font-bold text-sm text-stone-600">Email Address</label>
                <input 
                  value={data.email}
                  onChange={(e) => setData({...data, email: e.target.value})}
                  type="email" 
                  className="w-full p-4 bg-stone-50 rounded-xl outline-none border border-stone-200 focus:ring-2 focus:ring-emerald-500" 
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="font-bold text-sm text-stone-600">Interests</label>
              <input 
                value={data.interests}
                onChange={(e) => setData({...data, interests: e.target.value})}
                type="text" 
                placeholder="e.g. Beach Cleanup, Tree Planting" 
                className="w-full p-4 bg-stone-50 rounded-xl outline-none border border-stone-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl text-lg hover:bg-emerald-700 transition-all shadow-lg"
            >
              Sign Up Now
            </button>
          </form>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-emerald-700">Thank You!</h3>
            <p className="text-stone-500">We've received your details and will be in touch soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Volunteer;
