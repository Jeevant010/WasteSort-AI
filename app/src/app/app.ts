import { Component, signal, effect, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators, FormsModule, FormGroup, FormBuilder } from '@angular/forms';

// --- CONFIGURATION ---
const apiKey = "";

// --- REAL BACKEND SETUP INSTRUCTIONS ---
/*
  TO USE REAL FIREBASE:
  1. Run: npm install firebase
  2. Uncomment the imports below:
     import { initializeApp } from 'firebase/app';
     import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
     import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
  3. Replace the 'SimulatedBackend' calls with actual Firebase refs.
*/

// --- TYPES & INTERFACES ---
type PageRoute = 'home' | 'analyzer' | 'sdg' | 'news' | 'events' | 'marketplace' | 'challenge' | 'carbon' | 'quiz' | 'volunteer' | 'about' | 'contact' | 'premium';

// Mock User Interface (Matches Firebase User)
interface User {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
}

interface AnalysisResult {
  disposal_method: string;
  bin_color: string;
  handling_instructions: string;
  upcycling_ideas: string[];
  environmental_impact: string;
  decomposition_time: string;
  recyclability_score: number;
  sdg_connection: string;
}

interface HomeFeature {
  icon: string;
  title: string;
  desc: string;
  link: PageRoute;
}

interface MarketItem {
  id?: string;
  name: string;
  price: string;
  condition: string;
  emoji: string;
  contact: string;
  sellerId?: string;
  sellerName?: string;
  timestamp?: number; // using number for simulation
}

// --- MOCK BACKEND SERVICE ---
// This simulates Firebase using LocalStorage so the app runs without NPM install
class SimulatedBackend {
  private usersKey = 'ecosort_users';
  private marketKey = 'ecosort_market';
  private currentUser: User | null = null;
  private authListeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Restore session
    const savedUser = localStorage.getItem('ecosort_current_user');
    if (savedUser) this.currentUser = JSON.parse(savedUser);
  }

  // Auth Simulation
  async signInWithGoogle() {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    const mockUser: User = {
      uid: 'user_' + Math.random().toString(36).substr(2, 9),
      displayName: 'Demo User',
      photoURL: 'https://ui-avatars.com/api/?name=Demo+User&background=10b981&color=fff',
      email: 'demo@ecosort.ai'
    };
    this.currentUser = mockUser;
    localStorage.setItem('ecosort_current_user', JSON.stringify(mockUser));
    this.notifyAuthListeners();
    return mockUser;
  }

  async signOut() {
    await new Promise(r => setTimeout(r, 400));
    this.currentUser = null;
    localStorage.removeItem('ecosort_current_user');
    this.notifyAuthListeners();
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    this.authListeners.push(callback);
    callback(this.currentUser); // Initial state
    return () => this.authListeners = this.authListeners.filter(l => l !== callback);
  }

  private notifyAuthListeners() {
    this.authListeners.forEach(l => l(this.currentUser));
  }

  // Firestore Simulation
  subscribeToMarketplace(callback: (items: MarketItem[]) => void) {
    const load = () => {
      const data = localStorage.getItem(this.marketKey);
      const items: MarketItem[] = data ? JSON.parse(data) : [];
      // Sort by timestamp desc
      items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      callback(items);
    };
    load();
    // Poll for changes (simulating realtime updates)
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }

  async addMarketItem(item: MarketItem) {
    await new Promise(r => setTimeout(r, 600));
    const data = localStorage.getItem(this.marketKey);
    const items: MarketItem[] = data ? JSON.parse(data) : [];
    items.push({ ...item, id: Math.random().toString(36).substr(2, 9) });
    localStorage.setItem(this.marketKey, JSON.stringify(items));
  }
}

// --- COMPONENT ---
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  styles: [`
    :host { display: block; min-height: 100vh; background-color: #fafaf9; font-family: ui-sans-serif, system-ui, sans-serif; }
    .animate-spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .fade-in { animation: fadeIn 0.4s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .market-grid::-webkit-scrollbar { width: 6px; }
    .market-grid::-webkit-scrollbar-track { background: transparent; }
    .market-grid::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
  `],
  template: `
    <div class="min-h-screen text-stone-900 selection:bg-emerald-200 selection:text-emerald-900 flex flex-col">
      
      <!-- NAVIGATION BAR -->
      <nav class="bg-stone-900 text-stone-300 fixed w-full z-50 border-b border-stone-800 shadow-xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-2 cursor-pointer" (click)="navigate('home')">
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-900/50">E</div>
              <span class="font-bold text-white text-lg tracking-tight">EcoSort<span class="text-emerald-500">.ai</span></span>
            </div>
            
            <!-- Desktop Nav -->
            <div class="hidden xl:flex items-center space-x-1">
              <a (click)="navigate('home')" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none hover:bg-emerald-800/50 hover:text-white" [class.bg-emerald-500-20]="currentPage() === 'home'" [class.text-emerald-300]="currentPage() === 'home'">Home</a>
              <a (click)="navigate('analyzer')" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none hover:bg-emerald-800/50 hover:text-white" [class.bg-emerald-500-20]="currentPage() === 'analyzer'" [class.text-emerald-300]="currentPage() === 'analyzer'">AI Sorter</a>
              <a (click)="navigate('marketplace')" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none hover:bg-emerald-800/50 hover:text-white" [class.bg-emerald-500-20]="currentPage() === 'marketplace'" [class.text-emerald-300]="currentPage() === 'marketplace'">Market</a>
              <a (click)="navigate('premium')" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none hover:bg-emerald-800/50 hover:text-white text-amber-400 hover:text-amber-300" [class.bg-emerald-500-20]="currentPage() === 'premium'">👑 Premium</a>
            </div>

            <!-- User Auth Section -->
            <div class="flex items-center gap-4">
              @if (user()) {
                <div class="hidden md:flex items-center gap-2">
                  <img [src]="user()?.photoURL" class="w-8 h-8 rounded-full border border-stone-600">
                  <div class="text-xs">
                    <p class="text-white font-bold">{{ user()?.displayName }}</p>
                    <button (click)="logout()" class="text-stone-400 hover:text-red-400 transition-colors">Sign Out</button>
                  </div>
                </div>
              } @else {
                <button (click)="loginWithGoogle()" class="hidden md:flex items-center gap-2 bg-white text-stone-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-stone-100 transition-all">
                  Sign In
                </button>
              }
              
              <!-- Mobile Menu Button -->
              <button class="xl:hidden p-2 text-stone-400 hover:text-white" (click)="toggleMobileMenu()">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile Menu -->
        @if (isMobileMenuOpen()) {
          <div class="xl:hidden bg-stone-900 border-t border-stone-800 p-2 grid grid-cols-2 gap-2">
            @for (page of pages; track page.id) {
              <button (click)="navigate(page.id); toggleMobileMenu()" class="text-left px-3 py-2 rounded hover:bg-stone-800 text-sm text-stone-300" [class.text-emerald-400]="currentPage() === page.id">
                {{ page.label }}
              </button>
            }
            @if (!user()) {
               <button (click)="loginWithGoogle(); toggleMobileMenu()" class="col-span-2 mt-2 bg-emerald-600 text-white py-2 rounded-lg font-bold">Sign In</button>
            } @else {
               <button (click)="logout(); toggleMobileMenu()" class="col-span-2 mt-2 bg-red-900/50 text-red-200 py-2 rounded-lg font-bold">Sign Out</button>
            }
          </div>
        }
      </nav>

      <!-- MAIN CONTENT ROUTER -->
      <main class="flex-grow pt-16">
        @switch (currentPage()) {
          
          <!-- 1. HOME -->
          @case ('home') {
            <div class="fade-in">
              <div class="bg-stone-900 text-white py-24 px-6 relative overflow-hidden">
                <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-24d4c16419d0?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent"></div>
                <div class="max-w-7xl mx-auto relative z-10 text-center">
                  <span class="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-500/30">Sustainable Future</span>
                  <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Waste Less. <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Live More.</span></h1>
                  <p class="text-xl text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Join the global movement towards Responsible Consumption (SDG 12). Use our AI tools to rethink your waste.
                  </p>
                  <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button (click)="navigate('analyzer')" class="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2">
                      Try AI Sorter
                    </button>
                    <button (click)="navigate('premium')" class="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl font-bold text-lg transition-all border border-amber-400">
                      Go Premium 👑
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Features Grid -->
              <div class="max-w-7xl mx-auto px-6 py-20">
                <div class="grid md:grid-cols-3 gap-8">
                  @for (feature of homeFeatures; track feature.title) {
                    <div class="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group" (click)="navigate(feature.link)">
                      <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <span class="text-2xl">{{feature.icon}}</span>
                      </div>
                      <h3 class="text-xl font-bold text-stone-800 mb-3">{{feature.title}}</h3>
                      <p class="text-stone-500 leading-relaxed">{{feature.desc}}</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          }

          <!-- 2. ANALYZER -->
          @case ('analyzer') {
            <div class="fade-in max-w-4xl mx-auto px-6 py-12">
              <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-stone-800 mb-4">AI Waste Sorter</h2>
                <p class="text-stone-500 text-lg">Unsure about an item? Ask our AI expert instantly.</p>
              </div>
              <div class="bg-white rounded-2xl shadow-xl border border-stone-200 p-2 mb-10">
                <form (submit)="handleSubmit($event)" class="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-xl">
                  <input [formControl]="inputControl" type="text" placeholder="e.g. 'Pizza Box', 'Old Batteries'" class="flex-1 h-14 pl-6 rounded-lg bg-stone-50 text-lg outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all border border-transparent focus:border-emerald-500">
                  <button type="submit" [disabled]="loading() || inputControl.invalid" class="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                    @if (loading()) { <span class="animate-spin">⌛</span> } @else { Analyze }
                  </button>
                </form>
              </div>
              @if (error()) {
                <div class="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-100">{{ error() }}</div>
              }
              @if (data(); as result) {
                <div class="space-y-6 fade-in">
                  <div class="grid md:grid-cols-3 gap-6">
                    <div class="col-span-2 bg-white p-8 rounded-2xl shadow-sm border-l-8" [ngClass]="getBinBorder(result.bin_color)">
                      <div class="flex justify-between items-start mb-4">
                        <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-100 text-stone-600">{{ result.disposal_method }}</span>
                        <div class="text-4xl">🗑️</div>
                      </div>
                      <h2 class="text-3xl font-bold text-stone-800 mb-2">Use the {{ result.bin_color }} Bin</h2>
                      <p class="text-stone-600 text-lg">{{ result.handling_instructions }}</p>
                    </div>
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 text-center flex flex-col justify-center">
                      <div class="text-5xl font-bold mb-2" [ngClass]="getScoreColor(result.recyclability_score)">{{ result.recyclability_score }}/10</div>
                      <div class="text-sm font-bold text-stone-400 uppercase">Recyclability Score</div>
                    </div>
                  </div>
                  <div class="bg-stone-900 text-stone-300 p-8 rounded-2xl">
                    <h3 class="text-emerald-400 font-bold uppercase tracking-widest text-sm mb-4">AI Insight</h3>
                    <p class="text-lg leading-relaxed mb-6">"{{ result.environmental_impact }}"</p>
                  </div>
                </div>
              }
            </div>
          }

          <!-- 3. PREMIUM / STRIPE INTEGRATION MOCK -->
          @case ('premium') {
            <div class="fade-in max-w-4xl mx-auto px-6 py-12">
               <div class="text-center mb-12">
                  <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Upgrade Plan</span>
                  <h2 class="text-4xl font-bold text-stone-800 mt-4 mb-4">EcoSort Premium</h2>
                  <p class="text-stone-500 text-lg max-w-xl mx-auto">Unlimited AI analysis, Carbon Tracking, and Zero-Waste DIY Guides.</p>
               </div>

               <div class="grid md:grid-cols-2 gap-8 items-start">
                  <!-- Plan Details -->
                  <div class="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
                     <div class="flex items-baseline mb-6">
                        <span class="text-5xl font-bold text-stone-900">$5</span>
                        <span class="text-stone-500 ml-2">/ month</span>
                     </div>
                     <ul class="space-y-4 mb-8">
                        <li class="flex items-center gap-3"><div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</div> <span>Unlimited Item Analysis</span></li>
                        <li class="flex items-center gap-3"><div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</div> <span>Advanced Carbon Calculator</span></li>
                        <li class="flex items-center gap-3"><div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</div> <span>Exclusive Marketplace Deals</span></li>
                        <li class="flex items-center gap-3"><div class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs">✓</div> <span>Support our Reforestation Fund</span></li>
                     </ul>
                     <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 text-sm text-stone-500">
                        This donation supports the maintenance of our AI models and databases.
                     </div>
                  </div>

                  <!-- Stripe Payment Element Mock -->
                  <div class="bg-white p-8 rounded-2xl shadow-xl border border-stone-200 relative overflow-hidden">
                     <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                     <h3 class="font-bold text-lg mb-6 flex items-center gap-2">
                        <svg class="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h20v2H2v-2zm1.15-4.96c-.36-.58-.55-1.25-.55-1.94 0-1.25.64-2.39 1.72-3.04l8.36-5.02c.76-.46 1.69-.46 2.45 0l8.36 5.02c1.08.65 1.72 1.79 1.72 3.04 0 .69-.19 1.36-.55 1.94L12 17.5 3.15 12.04z"/></svg>
                        Secure Payment
                     </h3>
                     
                     <form [formGroup]="paymentForm" (ngSubmit)="handlePayment()" class="space-y-4">
                        <div>
                           <label class="block text-xs font-bold text-stone-500 uppercase mb-1">Cardholder Name</label>
                           <input formControlName="cardName" type="text" placeholder="John Doe" class="w-full p-3 bg-white border border-stone-300 rounded-lg transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                        </div>
                        <div>
                           <label class="block text-xs font-bold text-stone-500 uppercase mb-1">Card Details</label>
                           <div class="relative">
                              <input formControlName="cardNumber" type="text" placeholder="0000 0000 0000 0000" class="w-full p-3 bg-white border border-stone-300 rounded-lg transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 pl-10 font-mono">
                              <svg class="w-5 h-5 text-stone-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                           </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                           <div>
                              <label class="block text-xs font-bold text-stone-500 uppercase mb-1">Expiry</label>
                              <input formControlName="expiry" type="text" placeholder="MM/YY" class="w-full p-3 bg-white border border-stone-300 rounded-lg transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono">
                           </div>
                           <div>
                              <label class="block text-xs font-bold text-stone-500 uppercase mb-1">CVC</label>
                              <input formControlName="cvc" type="text" placeholder="123" class="w-full p-3 bg-white border border-stone-300 rounded-lg transition-all outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono">
                           </div>
                        </div>
                        
                        <button type="submit" [disabled]="isProcessingPayment()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all mt-4 flex items-center justify-center gap-2">
                           @if(isProcessingPayment()) {
                              <span class="animate-spin">⌛</span> Processing...
                           } @else {
                              Pay $5.00
                           }
                        </button>
                        
                        <div class="text-center mt-4">
                           <span class="text-xs text-stone-400 flex items-center justify-center gap-1">
                              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                              Encrypted by Stripe
                           </span>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
          }

          <!-- 4. MARKETPLACE -->
          @case ('marketplace') {
            <div class="fade-in max-w-6xl mx-auto px-6 py-12">
              <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <h2 class="text-3xl font-bold mb-2">Upcycle Marketplace</h2>
                  <p class="text-stone-500">Live listings from the community.</p>
                </div>
                <button (click)="toggleMarketForm()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all">
                  <span>+</span> Post Item
                </button>
              </div>

              <!-- Post Item Form -->
              @if (showMarketForm()) {
                <div class="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 mb-8 animate-fade-in-up">
                  @if (!user()) {
                     <div class="text-center py-6">
                        <p class="text-stone-500 mb-4">You must be logged in to post.</p>
                        <button (click)="loginWithGoogle()" class="bg-stone-900 text-white px-6 py-2 rounded-lg font-bold">Sign In</button>
                     </div>
                  } @else {
                     <h3 class="font-bold text-lg mb-4">Post a New Listing as {{ user()?.displayName }}</h3>
                     <form [formGroup]="marketForm" (ngSubmit)="submitMarketItem()" class="grid md:grid-cols-2 gap-4">
                        <input formControlName="name" placeholder="Item Name (e.g. Glass Jars)" class="p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <input formControlName="price" placeholder="Price (e.g. Free, $10)" class="p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <select formControlName="condition" class="p-3 bg-stone-50 rounded-lg border border-stone-200">
                           <option value="" disabled>Condition</option>
                           <option value="New">New</option>
                           <option value="Like New">Like New</option>
                           <option value="Good">Good</option>
                        </select>
                        <input formControlName="emoji" placeholder="Emoji Icon (e.g. 🪑)" class="p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <input formControlName="contact" placeholder="Contact Email" class="md:col-span-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div class="md:col-span-2 flex gap-3">
                           <button type="submit" [disabled]="marketForm.invalid || isPosting()" class="flex-1 bg-stone-900 text-white py-3 rounded-lg font-bold disabled:opacity-50">
                           {{ isPosting() ? 'Posting...' : 'Publish Listing' }}
                           </button>
                           <button type="button" (click)="toggleMarketForm()" class="px-6 py-3 border border-stone-200 rounded-lg hover:bg-stone-50">Cancel</button>
                        </div>
                     </form>
                  }
                </div>
              }

              <!-- Live Listings -->
              @if (marketItems().length === 0) {
                 <div class="text-center py-12 text-stone-400 bg-stone-50 rounded-2xl border border-stone-100 border-dashed">
                    <p>No active listings. Be the first to post!</p>
                 </div>
              } @else {
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 market-grid">
                  @for (item of marketItems(); track item.id) {
                    <div class="bg-white rounded-xl shadow-sm border border-stone-200 p-4 hover:shadow-md transition-all">
                      <div class="aspect-square bg-stone-50 rounded-lg mb-4 flex items-center justify-center text-5xl relative group cursor-default">
                        {{item.emoji}}
                        <div class="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity flex items-center justify-center">
                           <span class="text-xs font-bold bg-white px-2 py-1 rounded shadow">{{item.condition}}</span>
                        </div>
                      </div>
                      <h3 class="font-bold text-stone-800 truncate">{{item.name}}</h3>
                      <div class="flex justify-between items-center mt-2">
                        <span class="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-sm">{{item.price}}</span>
                        <button class="px-3 py-1 bg-stone-900 text-white text-xs rounded hover:bg-stone-700">Contact</button>
                      </div>
                      @if (item.sellerName) {
                         <div class="mt-2 text-[10px] text-stone-400 text-center">by {{ item.sellerName }}</div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          }
          
          @default {
             <!-- SDG, NEWS, EVENTS, VOLUNTEER etc would go here in full implementation, keeping concise for this update -->
             <div class="fade-in max-w-4xl mx-auto px-6 py-12 text-center">
                <h2 class="text-2xl font-bold mb-4">Coming Soon</h2>
                <p>This page is under construction in this version.</p>
                <button (click)="navigate('home')" class="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg">Go Home</button>
             </div>
          }
        }
      </main>

      <!-- FOOTER -->
      <footer class="bg-stone-900 text-stone-400 py-12 border-t border-stone-800 mt-auto">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-white font-bold mb-4">EcoSort.ai</h3>
            <p class="text-sm">Empowering the world to waste less and live more through AI-driven insights.</p>
          </div>
          <div>
             <h4 class="text-white font-bold mb-4">Payment Methods</h4>
             <div class="flex gap-2 text-2xl grayscale opacity-50">
                <span>💳</span> <span>🅿️</span> <span>🏦</span>
             </div>
          </div>
        </div>
        <div class="text-center text-xs border-t border-stone-800 pt-8">
          &copy; {{ currentYear }} EcoSort AI. Built for the Planet.
        </div>
      </footer>
    </div>
  `
})
export class App implements OnInit, OnDestroy {
  // --- NAVIGATION STATE ---
  currentPage = signal<PageRoute>('home');
  isMobileMenuOpen = signal<boolean>(false);
  currentYear = new Date().getFullYear();

  // --- FIREBASE STATE (SIMULATED) ---
  user = signal<User | null>(null);
  marketItems = signal<MarketItem[]>([]);
  isPosting = signal<boolean>(false);
  showMarketForm = signal<boolean>(false);

  // --- ANALYZER STATE ---
  inputControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  loading = signal<boolean>(false);
  data = signal<AnalysisResult | null>(null);
  error = signal<string | null>(null);

  // --- PAYMENT STATE ---
  isProcessingPayment = signal<boolean>(false);

  // --- FORMS ---
  fb = inject(FormBuilder);
  marketForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    condition: ['', Validators.required],
    emoji: ['📦', Validators.required],
    contact: ['', [Validators.required, Validators.email]]
  });
  
  paymentForm: FormGroup = this.fb.group({
     cardName: ['', Validators.required],
     cardNumber: ['', [Validators.required, Validators.minLength(16)]],
     expiry: ['', Validators.required],
     cvc: ['', Validators.required]
  });

  // --- BACKEND SERVICE ---
  private backend = new SimulatedBackend();
  private unsubscribeMarket: any;
  private unsubscribeAuth: any;

  pages: {id: PageRoute, label: string}[] = [
    {id: 'home', label: 'Home'},
    {id: 'analyzer', label: 'AI Sorter'},
    {id: 'marketplace', label: 'Marketplace'},
    {id: 'premium', label: 'Premium'},
    {id: 'contact', label: 'Contact'}
  ];

  // --- MOCK DATA ---
  homeFeatures: HomeFeature[] = [
    {icon: '🔍', title: 'Smart Analysis', desc: 'Identify any item instantly with our advanced Gemini AI vision.', link: 'analyzer'},
    {icon: '🤝', title: 'Community', desc: 'Connect with local recycling drives and upcycling events near you.', link: 'marketplace'},
    {icon: '🎁', title: 'Green Rewards', desc: 'Earn eco-points for every correct sort and verified action.', link: 'premium'},
  ];

  constructor() {}

  ngOnInit() {
    // Auth Listener
    this.unsubscribeAuth = this.backend.onAuthStateChanged((user: User | null) => {
      this.user.set(user);
      if (user) {
        this.loadMarketplace();
      }
    });
  }

  ngOnDestroy() {
    if (this.unsubscribeMarket) this.unsubscribeMarket();
    if (this.unsubscribeAuth) this.unsubscribeAuth();
  }

  // --- AUTH ACTIONS ---
  async loginWithGoogle() {
     try {
        await this.backend.signInWithGoogle();
     } catch (e) {
        console.error("Login failed", e);
     }
  }

  async logout() {
     try {
        await this.backend.signOut();
     } catch(e) { console.error(e); }
  }

  // --- MARKETPLACE LOGIC ---
  loadMarketplace() {
    this.unsubscribeMarket = this.backend.subscribeToMarketplace((items: MarketItem[]) => {
      this.marketItems.set(items);
    });
  }

  async submitMarketItem() {
    if (!this.user() || this.marketForm.invalid) return;
    
    this.isPosting.set(true);
    try {
      const newItem: MarketItem = {
        ...this.marketForm.value,
        sellerId: this.user()!.uid,
        sellerName: this.user()!.displayName || 'Anonymous',
        timestamp: Date.now()
      };
      
      await this.backend.addMarketItem(newItem);
      
      this.marketForm.reset({emoji: '📦'});
      this.showMarketForm.set(false);
    } catch (e) {
      console.error("Error posting item:", e);
    } finally {
      this.isPosting.set(false);
    }
  }

  toggleMarketForm() {
    this.showMarketForm.update(v => !v);
  }

  // --- STRIPE MOCK HANDLER ---
  handlePayment() {
     if (this.paymentForm.invalid) return;
     this.isProcessingPayment.set(true);
     
     setTimeout(() => {
        this.isProcessingPayment.set(false);
        alert(`Payment Successful! Thank you ${this.paymentForm.value.cardName} for going Premium.`);
        this.paymentForm.reset();
        this.navigate('home');
     }, 2000);
  }

  // --- NAVIGATION ACTIONS ---
  navigate(page: PageRoute) {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  // --- ANALYZER LOGIC ---
  async handleSubmit(e: Event) {
    e.preventDefault();
    if (this.inputControl.invalid || !this.inputControl.value.trim()) return;

    const itemName = this.inputControl.value;
    this.loading.set(true);
    this.error.set(null);
    this.data.set(null);

    const systemPrompt = `
      You are an expert in sustainable development and waste management.
      Analyze the item "${itemName}".
      Return ONLY a JSON object. No markdown.
      Structure:
      {
        "disposal_method": "String (e.g. 'Recycle', 'Compost')",
        "bin_color": "String (Blue/Green/Black)",
        "handling_instructions": "String",
        "upcycling_ideas": ["String", "String"],
        "environmental_impact": "String",
        "decomposition_time": "String",
        "recyclability_score": Number (1-10),
        "sdg_connection": "String"
      }
    `;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }], generationConfig: { responseMimeType: "application/json" } }),
        }
      );

      if (!response.ok) throw new Error("API unavailable");
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No data");
      this.data.set(JSON.parse(text));
    } catch (err) {
      this.error.set("Analysis failed. Please try again.");
    } finally {
      this.loading.set(false);
    }
  }

  getBinBorder(color: string) {
    const c = color?.toLowerCase() || '';
    if (c.includes('blue')) return 'border-blue-500';
    if (c.includes('green')) return 'border-green-500';
    if (c.includes('black')) return 'border-gray-800';
    return 'border-emerald-500';
  }

  getScoreColor(score: number) {
    return score > 7 ? 'text-emerald-500' : score > 4 ? 'text-amber-500' : 'text-red-500';
  }
}