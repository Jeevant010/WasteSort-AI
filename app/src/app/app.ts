import { Component, signal, effect, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators, FormsModule } from '@angular/forms';

// --- API CONFIGURATION ---
const apiKey = "";

// --- TYPES & INTERFACES ---
type PageRoute = 'home' | 'analyzer' | 'sdg' | 'news' | 'events' | 'marketplace' | 'challenge' | 'carbon' | 'quiz' | 'volunteer' | 'about' | 'contact';

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

interface HistoryItem { name: string; type: string; date: number; }
interface DiyGuide { idea: string; materials_needed: string[]; steps: string[]; difficulty: string; }
interface QuizData { question: string; options: string[]; correctIndex: number; explanation: string; }

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
              <a (click)="navigate('home')" 
                 class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none"
                 [ngClass]="currentPage() === 'home' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-800/50 hover:text-white'">Home</a>
              
              <a (click)="navigate('analyzer')" 
                 class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none"
                 [ngClass]="currentPage() === 'analyzer' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-800/50 hover:text-white'">AI Sorter</a>
              
              <a (click)="navigate('sdg')" 
                 class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none"
                 [ngClass]="currentPage() === 'sdg' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-800/50 hover:text-white'">SDGs</a>
              
              <a (click)="navigate('news')" 
                 class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none"
                 [ngClass]="currentPage() === 'news' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-800/50 hover:text-white'">News</a>
              
              <a (click)="navigate('events')" 
                 class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none"
                 [ngClass]="currentPage() === 'events' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-800/50 hover:text-white'">Events</a>
              
              <a (click)="navigate('marketplace')" 
                 class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none"
                 [ngClass]="currentPage() === 'marketplace' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-800/50 hover:text-white'">Market</a>
              
              <a (click)="navigate('challenge')" 
                 class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none"
                 [ngClass]="currentPage() === 'challenge' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-800/50 hover:text-white'">Challenge</a>
              
              <a (click)="navigate('carbon')" 
                 class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none"
                 [ngClass]="currentPage() === 'carbon' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-800/50 hover:text-white'">Carbon</a>
              
              <a (click)="navigate('quiz')" 
                 class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none"
                 [ngClass]="currentPage() === 'quiz' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-800/50 hover:text-white'">Quiz</a>
              
              <a (click)="navigate('volunteer')" 
                 class="px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer select-none"
                 [ngClass]="currentPage() === 'volunteer' ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-emerald-800/50 hover:text-white'">Volunteer</a>
            </div>

            <!-- Mobile Menu Button (Simple implementation) -->
            <button class="xl:hidden p-2 text-stone-400 hover:text-white" (click)="toggleMobileMenu()">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
        <!-- Mobile Menu Dropdown -->
        @if (isMobileMenuOpen()) {
          <div class="xl:hidden bg-stone-900 border-t border-stone-800 p-2 grid grid-cols-2 gap-2">
            @for (page of pages; track page.id) {
              <button (click)="navigate(page.id); toggleMobileMenu()" class="text-left px-3 py-2 rounded hover:bg-stone-800 text-sm text-stone-300" [class.text-emerald-400]="currentPage() === page.id">
                {{ page.label }}
              </button>
            }
          </div>
        }
      </nav>

      <!-- MAIN CONTENT ROUTER -->
      <main class="flex-grow pt-16">
        @switch (currentPage()) {
          
          <!-- 1. HOME PAGE -->
          @case ('home') {
            <div class="fade-in">
              <!-- Hero -->
              <div class="bg-stone-900 text-white py-24 px-6 relative overflow-hidden">
                <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-24d4c16419d0?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/80 to-transparent"></div>
                <div class="max-w-7xl mx-auto relative z-10 text-center">
                  <span class="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-500/30">Sustainable Future</span>
                  <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Waste Less. <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Live More.</span></h1>
                  <p class="text-xl text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Join the global movement towards Responsible Consumption (SDG 12) and Climate Action (SDG 13). Use our AI tools to rethink your waste.
                  </p>
                  <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button (click)="navigate('analyzer')" class="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2">
                      Try AI Sorter
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </button>
                    <button (click)="navigate('about')" class="px-8 py-4 bg-stone-800 hover:bg-stone-700 text-white rounded-xl font-bold text-lg transition-all border border-stone-700">
                      Our Mission
                    </button>
                  </div>
                </div>
              </div>

              <!-- Impact Stats -->
              <div class="bg-emerald-900 py-12 border-y border-emerald-800">
                <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div><div class="text-4xl font-bold text-white mb-1">50k+</div><div class="text-emerald-300 text-sm uppercase tracking-wide">Items Sorted</div></div>
                  <div><div class="text-4xl font-bold text-white mb-1">120</div><div class="text-emerald-300 text-sm uppercase tracking-wide">Countries</div></div>
                  <div><div class="text-4xl font-bold text-white mb-1">5k+</div><div class="text-emerald-300 text-sm uppercase tracking-wide">Trees Saved</div></div>
                  <div><div class="text-4xl font-bold text-white mb-1">SDG</div><div class="text-emerald-300 text-sm uppercase tracking-wide">Certified</div></div>
                </div>
              </div>

              <!-- Features Grid -->
              <div class="max-w-7xl mx-auto px-6 py-20">
                <h2 class="text-3xl font-bold text-stone-800 mb-12 text-center">Explore Our Ecosystem</h2>
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

          <!-- 2. ANALYZER PAGE (The Core Tool) -->
          @case ('analyzer') {
            <div class="fade-in max-w-4xl mx-auto px-6 py-12">
              <div class="text-center mb-12">
                <h2 class="text-4xl font-bold text-stone-800 mb-4">AI Waste Sorter</h2>
                <p class="text-stone-500 text-lg">Unsure about an item? Ask our AI expert instantly.</p>
              </div>

              <!-- Original Tool Logic Incorporated Here -->
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
                    <div class="flex items-center gap-4 text-sm font-medium border-t border-stone-700 pt-4">
                      <span>⏳ Decomposes in: <span class="text-white">{{ result.decomposition_time }}</span></span>
                      <span class="w-1 h-1 bg-stone-600 rounded-full"></span>
                      <span>🎯 SDG Target: <span class="text-white">{{ result.sdg_connection }}</span></span>
                    </div>
                  </div>
                </div>
              }
            </div>
          }

          <!-- 3. SDG HUB PAGE -->
          @case ('sdg') {
            <div class="fade-in max-w-6xl mx-auto px-6 py-12">
              <h2 class="text-4xl font-bold text-stone-800 mb-8 text-center">Sustainable Development Goals</h2>
              <div class="grid md:grid-cols-2 gap-8">
                <!-- Goal 12 -->
                <div class="bg-[#BF8B2E] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                  <div class="absolute -right-10 -bottom-10 text-9xl font-bold opacity-20 group-hover:scale-110 transition-transform">12</div>
                  <h3 class="text-2xl font-bold mb-4">Responsible Consumption and Production</h3>
                  <p class="mb-6 opacity-90 leading-relaxed">Ensure sustainable consumption and production patterns. This involves reducing waste generation through prevention, reduction, recycling and reuse.</p>
                  <ul class="space-y-2 text-sm font-medium">
                    <li class="flex items-center gap-2">✅ Halve global food waste</li>
                    <li class="flex items-center gap-2">✅ Efficient use of natural resources</li>
                    <li class="flex items-center gap-2">✅ Manage chemical waste</li>
                  </ul>
                </div>
                <!-- Goal 13 -->
                <div class="bg-[#3F7E44] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
                  <div class="absolute -right-10 -bottom-10 text-9xl font-bold opacity-20 group-hover:scale-110 transition-transform">13</div>
                  <h3 class="text-2xl font-bold mb-4">Climate Action</h3>
                  <p class="mb-6 opacity-90 leading-relaxed">Take urgent action to combat climate change and its impacts. Every small sorting decision reduces landfill methane emissions.</p>
                  <ul class="space-y-2 text-sm font-medium">
                    <li class="flex items-center gap-2">🌍 Strengthen resilience</li>
                    <li class="flex items-center gap-2">🌍 Improve education on climate</li>
                    <li class="flex items-center gap-2">🌍 Integrate measures into policies</li>
                  </ul>
                </div>
              </div>
            </div>
          }

          <!-- 4. GREEN NEWS -->
          @case ('news') {
            <div class="fade-in max-w-5xl mx-auto px-6 py-12">
              <h2 class="text-3xl font-bold mb-8">Latest in Green Tech</h2>
              <div class="grid gap-6">
                @for (news of mockNews; track news.id) {
                  <div class="bg-white p-6 rounded-xl border border-stone-200 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all cursor-pointer">
                    <div class="w-full md:w-48 h-32 bg-stone-200 rounded-lg flex-shrink-0 bg-cover bg-center" [style.background-image]="'url(' + news.image + ')'"></div>
                    <div>
                      <span class="text-emerald-600 text-xs font-bold uppercase">{{news.category}}</span>
                      <h3 class="text-xl font-bold text-stone-800 mt-1 mb-2">{{news.title}}</h3>
                      <p class="text-stone-500 text-sm mb-4">{{news.summary}}</p>
                      <span class="text-stone-400 text-xs">{{news.date}} • {{news.readTime}} read</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- 5. EVENTS -->
          @case ('events') {
            <div class="fade-in max-w-5xl mx-auto px-6 py-12">
              <div class="flex justify-between items-end mb-8">
                <div>
                  <h2 class="text-3xl font-bold text-stone-800">Community Events</h2>
                  <p class="text-stone-500">Join a local drive and make a tangible difference.</p>
                </div>
                <button class="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Host an Event</button>
              </div>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (event of mockEvents; track event.id) {
                  <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-all">
                    <div class="h-40 bg-emerald-100 flex items-center justify-center text-emerald-800 text-4xl font-bold">{{event.day}}</div>
                    <div class="p-6">
                      <div class="text-sm font-bold text-emerald-600 mb-1">{{event.month}}</div>
                      <h3 class="text-xl font-bold text-stone-900 mb-2">{{event.title}}</h3>
                      <p class="text-stone-500 text-sm mb-4 flex items-center gap-1">📍 {{event.location}}</p>
                      <div class="flex items-center -space-x-2 mb-4">
                        <div class="w-8 h-8 rounded-full bg-stone-300 border-2 border-white"></div>
                        <div class="w-8 h-8 rounded-full bg-stone-400 border-2 border-white"></div>
                        <div class="w-8 h-8 rounded-full bg-stone-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">+12</div>
                      </div>
                      <button class="w-full py-2 border border-stone-200 rounded-lg text-sm font-bold hover:bg-stone-50">Join Event</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- 6. MARKETPLACE -->
          @case ('marketplace') {
            <div class="fade-in max-w-6xl mx-auto px-6 py-12">
              <h2 class="text-3xl font-bold mb-2">Upcycle Marketplace</h2>
              <p class="text-stone-500 mb-8">Don't throw it. Trade it.</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                @for (item of mockMarket; track item.id) {
                  <div class="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
                    <div class="aspect-square bg-stone-100 rounded-lg mb-4 flex items-center justify-center text-4xl">{{item.emoji}}</div>
                    <h3 class="font-bold text-stone-800">{{item.name}}</h3>
                    <p class="text-xs text-stone-500 mb-3">{{item.condition}}</p>
                    <div class="flex justify-between items-center">
                      <span class="font-bold text-emerald-600">{{item.price}}</span>
                      <button class="px-3 py-1 bg-stone-900 text-white text-xs rounded">Contact</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- 7. CHALLENGE (30 Day) -->
          @case ('challenge') {
            <div class="fade-in max-w-4xl mx-auto px-6 py-12">
              <div class="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-8 text-white mb-8 text-center">
                <h2 class="text-3xl font-bold mb-2">30-Day Eco Challenge</h2>
                <p class="opacity-90">Small daily habits, massive global impact.</p>
              </div>
              <div class="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
                @for (day of [].constructor(30); track $index) {
                  <div class="aspect-square rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all" 
                       [class.border-emerald-500]="$index < 5"
                       [class.bg-emerald-50]="$index < 5"
                       [class.border-stone-100]="$index >= 5"
                       [class.hover:border-emerald-300]="$index >= 5">
                    <span class="text-xs font-bold text-stone-400">Day</span>
                    <span class="text-xl font-bold" [class.text-emerald-600]="$index < 5" [class.text-stone-800]="$index >= 5">{{ $index + 1 }}</span>
                    @if ($index < 5) { <span class="text-xs">✅</span> }
                  </div>
                }
              </div>
            </div>
          }

          <!-- 8. CARBON CALC -->
          @case ('carbon') {
            <div class="fade-in max-w-2xl mx-auto px-6 py-12">
              <h2 class="text-3xl font-bold mb-6 text-center">Quick Footprint Estimate</h2>
              <div class="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
                <label class="block mb-4">
                  <span class="text-sm font-bold text-stone-600">How do you commute?</span>
                  <select class="w-full mt-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <option>Car (Gas)</option>
                    <option>Car (EV)</option>
                    <option>Public Transport</option>
                    <option>Bike/Walk</option>
                  </select>
                </label>
                <label class="block mb-4">
                  <span class="text-sm font-bold text-stone-600">Meat consumption?</span>
                  <select class="w-full mt-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <option>Daily</option>
                    <option>Few times a week</option>
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                  </select>
                </label>
                <button class="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl mt-4">Calculate Footprint</button>
              </div>
            </div>
          }

          <!-- 9. QUIZ ZONE -->
          @case ('quiz') {
            <div class="fade-in max-w-3xl mx-auto px-6 py-12 text-center">
              <h2 class="text-3xl font-bold mb-8">Test Your Eco-Knowledge</h2>
              <div class="bg-white p-8 rounded-3xl shadow-xl border border-indigo-100">
                <div class="text-6xl mb-6">🧠</div>
                <h3 class="text-xl font-bold text-stone-800 mb-6">Which plastic is easiest to recycle?</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button class="p-4 rounded-xl border-2 border-stone-100 hover:border-indigo-500 hover:bg-indigo-50 font-bold text-stone-600 transition-all">PET (1)</button>
                  <button class="p-4 rounded-xl border-2 border-stone-100 hover:border-indigo-500 hover:bg-indigo-50 font-bold text-stone-600 transition-all">PVC (3)</button>
                  <button class="p-4 rounded-xl border-2 border-stone-100 hover:border-indigo-500 hover:bg-indigo-50 font-bold text-stone-600 transition-all">LDPE (4)</button>
                  <button class="p-4 rounded-xl border-2 border-stone-100 hover:border-indigo-500 hover:bg-indigo-50 font-bold text-stone-600 transition-all">PS (6)</button>
                </div>
              </div>
            </div>
          }

          <!-- 10. VOLUNTEER -->
          @case ('volunteer') {
            <div class="fade-in max-w-4xl mx-auto px-6 py-12">
              <h2 class="text-3xl font-bold mb-6">Join the Green Army</h2>
              <div class="bg-white p-8 rounded-2xl border border-stone-200">
                <form class="grid md:grid-cols-2 gap-6">
                  <label class="block"><span class="text-sm font-bold">Name</span><input type="text" class="w-full mt-1 p-3 bg-stone-50 rounded-lg border border-stone-200"></label>
                  <label class="block"><span class="text-sm font-bold">Email</span><input type="email" class="w-full mt-1 p-3 bg-stone-50 rounded-lg border border-stone-200"></label>
                  <label class="block md:col-span-2"><span class="text-sm font-bold">Interests</span>
                    <div class="flex gap-4 mt-2">
                      <label class="flex items-center gap-2"><input type="checkbox"> Cleanups</label>
                      <label class="flex items-center gap-2"><input type="checkbox"> Tree Planting</label>
                      <label class="flex items-center gap-2"><input type="checkbox"> Education</label>
                    </div>
                  </label>
                  <button class="md:col-span-2 py-4 bg-stone-900 text-white font-bold rounded-xl">Sign Up</button>
                </form>
              </div>
            </div>
          }

          <!-- 11. ABOUT -->
          @case ('about') {
            <div class="fade-in max-w-4xl mx-auto px-6 py-12">
              <h2 class="text-4xl font-bold mb-8">About EcoSort AI</h2>
              <div class="prose prose-stone max-w-none">
                <p class="text-lg leading-relaxed mb-6">
                  We are a team of environmentalists and technologists dedicated to solving the global waste crisis using Artificial Intelligence.
                  By simplifying the complex rules of recycling, we empower individuals to make better choices every day.
                </p>
                <div class="grid md:grid-cols-3 gap-6 mt-12">
                  <div class="text-center">
                    <div class="w-32 h-32 bg-stone-200 rounded-full mx-auto mb-4"></div>
                    <h3 class="font-bold">Sarah Chen</h3>
                    <p class="text-sm text-stone-500">Founder & CEO</p>
                  </div>
                  <div class="text-center">
                    <div class="w-32 h-32 bg-stone-200 rounded-full mx-auto mb-4"></div>
                    <h3 class="font-bold">David Okonjo</h3>
                    <p class="text-sm text-stone-500">Head of AI</p>
                  </div>
                  <div class="text-center">
                    <div class="w-32 h-32 bg-stone-200 rounded-full mx-auto mb-4"></div>
                    <h3 class="font-bold">Maria Garcia</h3>
                    <p class="text-sm text-stone-500">Sustainability Lead</p>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- 12. CONTACT -->
          @case ('contact') {
            <div class="fade-in max-w-3xl mx-auto px-6 py-12">
              <h2 class="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
              <div class="bg-white p-8 rounded-2xl shadow-lg">
                <textarea class="w-full h-40 p-4 bg-stone-50 rounded-xl border border-stone-200 mb-4" placeholder="How can we help you?"></textarea>
                <button class="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl">Send Message</button>
              </div>
              <div class="mt-8 text-center text-stone-500">
                <p>support&#64;ecosort.ai</p>
                <p>123 Green Street, Eco City, Earth</p>
              </div>
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
            <h4 class="text-white font-bold mb-4">Platform</h4>
            <ul class="space-y-2 text-sm">
              <li><a (click)="navigate('analyzer')" class="hover:text-white cursor-pointer">AI Sorter</a></li>
              <li><a (click)="navigate('marketplace')" class="hover:text-white cursor-pointer">Marketplace</a></li>
              <li><a (click)="navigate('carbon')" class="hover:text-white cursor-pointer">Calculator</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4">Company</h4>
            <ul class="space-y-2 text-sm">
              <li><a (click)="navigate('about')" class="hover:text-white cursor-pointer">About Us</a></li>
              <li><a (click)="navigate('news')" class="hover:text-white cursor-pointer">Press</a></li>
              <li><a (click)="navigate('contact')" class="hover:text-white cursor-pointer">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold mb-4">Legal</h4>
            <ul class="space-y-2 text-sm">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div class="text-center text-xs border-t border-stone-800 pt-8">
          &copy; {{ currentYear }} EcoSort AI. Built for the Planet.
        </div>
      </footer>
    </div>
  `
})
export class App {
  // --- NAVIGATION STATE ---
  currentPage = signal<PageRoute>('home');
  isMobileMenuOpen = signal<boolean>(false);
  currentYear = new Date().getFullYear();

  pages: {id: PageRoute, label: string}[] = [
    {id: 'home', label: 'Home'},
    {id: 'analyzer', label: 'AI Sorter'},
    {id: 'sdg', label: 'SDGs'},
    {id: 'news', label: 'Green News'},
    {id: 'events', label: 'Events'},
    {id: 'marketplace', label: 'Marketplace'},
    {id: 'challenge', label: 'Challenge'},
    {id: 'carbon', label: 'Carbon Calc'},
    {id: 'quiz', label: 'Quiz'},
    {id: 'volunteer', label: 'Volunteer'},
    {id: 'about', label: 'About'},
    {id: 'contact', label: 'Contact'},
  ];

  // --- MOCK DATA FOR PAGES ---
  homeFeatures: HomeFeature[] = [
    {icon: '🔍', title: 'Smart Analysis', desc: 'Identify any item instantly with our advanced Gemini AI vision.', link: 'analyzer'},
    {icon: '🌱', title: 'SDG Impact', desc: 'See exactly how your actions contribute to UN Global Goals 12 & 13.', link: 'sdg'},
    {icon: '🤝', title: 'Community', desc: 'Connect with local recycling drives and upcycling events near you.', link: 'events'},
    {icon: '📊', title: 'Track Progress', desc: 'Monitor your carbon footprint reduction over time.', link: 'carbon'},
    {icon: '💡', title: 'DIY Ideas', desc: 'Turn trash into treasure with AI-generated creative projects.', link: 'analyzer'},
    {icon: '🎁', title: 'Green Rewards', desc: 'Earn eco-points for every correct sort and verified action.', link: 'challenge'},
  ];

  mockNews = [
    {id: 1, category: 'Innovation', title: 'New Enzyme Eats Plastic in Hours', summary: 'Scientists discover a super-enzyme that degrades PET plastic bottles 6x faster.', date: '2h ago', readTime: '4 min', image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&q=80'},
    {id: 2, category: 'Policy', title: 'Global Plastic Treaty Talks Begin', summary: 'UN member states gather to forge a legally binding international instrument.', date: '5h ago', readTime: '6 min', image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80'},
    {id: 3, category: 'Tech', title: 'Solar Panels Made from recycled e-waste', summary: 'Breakthrough allows solar cells to be constructed from old laptops.', date: '1d ago', readTime: '3 min', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80'},
  ];

  mockEvents = [
    {id: 1, title: 'Beach Cleanup Drive', location: 'Santa Monica Pier', day: '12', month: 'OCT'},
    {id: 2, title: 'E-Waste Collection', location: 'City Hall Parking', day: '15', month: 'OCT'},
    {id: 3, title: 'Upcycling Workshop', location: 'Community Center', day: '22', month: 'OCT'},
  ];

  mockMarket = [
    {id: 1, name: 'Glass Jars', condition: 'Clean/Like New', price: 'Free', emoji: '🫙'},
    {id: 2, name: 'Pallet Wood', condition: 'Rough', price: '$10', emoji: '🪵'},
    {id: 3, name: 'Bike Parts', condition: 'Used', price: '$25', emoji: '🚲'},
    {id: 4, name: 'Fabric Scraps', condition: 'Various', price: '$5', emoji: '🧵'},
  ];

  // --- ANALYZER STATE (From previous version) ---
  inputControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  loading = signal<boolean>(false);
  data = signal<AnalysisResult | null>(null);
  error = signal<string | null>(null);

  constructor() {}

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

  // --- HELPERS ---
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