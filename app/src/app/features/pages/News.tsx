import { useState, useEffect } from 'react';
import { ecoApiService } from '../../services/eco-api.service';

function News() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await ecoApiService.getNews();
        setNews(data);
      } catch (error) {
        console.error('Failed to load news:', error);
      }
    };
    loadNews();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <h2 className="text-3xl font-bold mb-8 text-stone-800">Green Tech News</h2>
      <div className="grid gap-6">
        {news.map((item, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all">
            <span className="text-emerald-600 font-bold uppercase text-xs tracking-wider mb-2 block">{item.category}</span>
            <h3 className="text-2xl font-bold text-stone-800 mb-2">{item.title}</h3>
            <p className="text-stone-600">{item.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
