import { useState, useEffect } from 'react';
import { ecoApiService, MarketListing } from '../../services/eco-api.service';

function Marketplace() {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', price: '', contact: '', condition: 'Good', emoji: '📦' });

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await ecoApiService.getListings();
      setListings(data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    }
  };

  const submitListing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await ecoApiService.createListing(newItem);
      setListings(prev => [created, ...prev]);
      setShowForm(false);
      setNewItem({ title: '', price: '', contact: '', condition: 'Good', emoji: '📦' });
    } catch (error) {
      console.error('Failed to create listing:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800">Community Market</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="bg-stone-900 text-white px-6 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : 'Post Item'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-stone-200">
          <form onSubmit={submitListing} className="grid md:grid-cols-2 gap-4">
            <input 
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              placeholder="Title" 
              className="p-3 border rounded"
              required
            />
            <input 
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              placeholder="Price" 
              className="p-3 border rounded"
              required
            />
            <input 
              value={newItem.contact}
              onChange={(e) => setNewItem({...newItem, contact: e.target.value})}
              placeholder="Email" 
              className="p-3 border rounded"
              type="email"
              required
            />
            <button type="submit" className="bg-emerald-600 text-white p-3 rounded font-bold">Post Listing</button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-6">
        {listings.map((item) => (
          <div key={item._id} className="bg-white p-4 rounded-xl border border-stone-200 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4 bg-stone-50 h-32 flex items-center justify-center rounded-lg">{item.emoji || '📦'}</div>
            <h3 className="font-bold text-lg truncate">{item.title}</h3>
            <div className="flex justify-between mt-2">
              <span className="text-emerald-600 font-bold">{item.price}</span>
              <span className="text-xs text-stone-400">{item.condition}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
