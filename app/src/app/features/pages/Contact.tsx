import { useState } from 'react';
import { ecoApiService } from '../../services/eco-api.service';

function Contact() {
  const [data, setData] = useState({ email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ecoApiService.sendMessage(data);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 text-stone-800">Get in Touch</h2>
        <p className="text-stone-500">Have questions? We'd love to hear from you.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
        {!submitted ? (
          <form onSubmit={send} className="space-y-6">
            <div className="space-y-2">
              <label className="font-bold text-sm text-stone-600">Your Email</label>
              <input 
                value={data.email}
                onChange={(e) => setData({...data, email: e.target.value})}
                type="email" 
                className="w-full p-4 bg-stone-50 rounded-xl outline-none border border-stone-200 focus:ring-2 focus:ring-emerald-500" 
                required
              />
            </div>
            <div className="space-y-2">
              <label className="font-bold text-sm text-stone-600">Message</label>
              <textarea 
                value={data.message}
                onChange={(e) => setData({...data, message: e.target.value})}
                className="w-full p-4 bg-stone-50 rounded-xl outline-none border border-stone-200 focus:ring-2 focus:ring-emerald-500 h-40" 
                required
              ></textarea>
            </div>
            <button 
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl text-lg hover:bg-emerald-700 transition-all shadow-md"
            >
              Send Message
            </button>
          </form>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📨</div>
            <h3 className="text-2xl font-bold text-stone-800">Message Sent!</h3>
            <p className="text-stone-500">We will get back to you shortly.</p>
          </div>
        )}
      </div>
      
      <div className="mt-12 text-center text-stone-400 text-sm">
        <p>support&#64;ecosort.ai</p>
        <p>123 Green Street, Eco City, Earth</p>
      </div>
    </div>
  );
}

export default Contact;
