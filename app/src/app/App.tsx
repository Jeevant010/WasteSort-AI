import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './features/home/Home';
import Analyzer from './features/analyzer/Analyzer';
import Marketplace from './features/marketplace/Marketplace';
import Sdg from './features/pages/Sdg';
import News from './features/pages/News';
import Events from './features/pages/Events';
import Challenge from './features/pages/Challenge';
import Carbon from './features/pages/Carbon';
import Quiz from './features/pages/Quiz';
import Volunteer from './features/pages/Volunteer';
import About from './features/pages/About';
import Contact from './features/pages/Contact';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || (path === '/home' && location.pathname === '/');
  };

  return (
    <nav className="bg-stone-900 text-stone-300 p-4 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
          <span className="font-bold text-white text-lg tracking-tight">EcoSort<span className="text-emerald-500">.ai</span></span>
        </Link>
        
        <div className="flex flex-wrap justify-center gap-1">
          <Link to="/home" className={`px-3 py-2 rounded hover:text-white transition-colors ${isActive('/home') || isActive('/') ? 'bg-emerald-900 text-white' : ''}`}>Home</Link>
          <Link to="/analyzer" className={`px-3 py-2 rounded hover:text-white transition-colors ${isActive('/analyzer') ? 'bg-emerald-900 text-white' : ''}`}>Sorter</Link>
          <Link to="/marketplace" className={`px-3 py-2 rounded hover:text-white transition-colors ${isActive('/marketplace') ? 'bg-emerald-900 text-white' : ''}`}>Market</Link>
          <Link to="/sdg" className={`px-3 py-2 rounded hover:text-white transition-colors ${isActive('/sdg') ? 'bg-emerald-900 text-white' : ''}`}>SDGs</Link>
          <Link to="/news" className={`px-3 py-2 rounded hover:text-white transition-colors ${isActive('/news') ? 'bg-emerald-900 text-white' : ''}`}>News</Link>
          <Link to="/events" className={`px-3 py-2 rounded hover:text-white transition-colors ${isActive('/events') ? 'bg-emerald-900 text-white' : ''}`}>Events</Link>
          <Link to="/challenge" className={`px-3 py-2 rounded hover:text-white transition-colors ${isActive('/challenge') ? 'bg-emerald-900 text-white' : ''}`}>Challenge</Link>
          <Link to="/carbon" className={`px-3 py-2 rounded hover:text-white transition-colors ${isActive('/carbon') ? 'bg-emerald-900 text-white' : ''}`}>Carbon</Link>
          <Link to="/about" className={`px-3 py-2 rounded hover:text-white transition-colors ${isActive('/about') ? 'bg-emerald-900 text-white' : ''}`}>About</Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50 font-sans flex flex-col">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/sdg" element={<Sdg />} />
            <Route path="/news" element={<News />} />
            <Route path="/events" element={<Events />} />
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/carbon" element={<Carbon />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="bg-stone-900 text-stone-500 py-12 border-t border-stone-800 mt-auto">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p>© 2026 EcoSort AI. Built for the United Nations SDGs.</p>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <Link to="/contact" className="hover:text-white">Contact</Link>
              <Link to="/volunteer" className="hover:text-white">Volunteer</Link>
              <span>Privacy Policy</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
