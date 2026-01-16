import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="fade-in">
      <!-- Hero Section -->
      <div class="bg-stone-900 text-white py-24 px-6 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-stone-900 via-stone-900/80 z-0"></div>
        <div class="max-w-7xl mx-auto relative z-10 text-center">
          <span class="inline-block py-1 px-3 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-4 border border-emerald-500/30">Sustainable Future</span>
          <h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Waste Less. <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Live More.</span></h1>
          <p class="text-xl text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the global movement towards Responsible Consumption (SDG 12) and Climate Action (SDG 13). Use our AI tools to rethink your waste.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/analyzer" class="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 cursor-pointer">
              Try AI Sorter
            </a>
            <a routerLink="/about" class="px-8 py-4 bg-stone-800 hover:bg-stone-700 text-white rounded-xl font-bold text-lg transition-all border border-stone-700 cursor-pointer">
              Our Mission
            </a>
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
          <div *ngFor="let feature of features" [routerLink]="feature.link" class="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <span class="text-2xl">{{feature.icon}}</span>
            </div>
            <h3 class="text-xl font-bold text-stone-800 mb-3">{{feature.title}}</h3>
            <p class="text-stone-500 leading-relaxed">{{feature.desc}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fade-in { animation: fadeIn 0.5s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class HomeComponent {
  features = [
    {icon: '🔍', title: 'Smart Analysis', desc: 'Identify any item instantly with our advanced Gemini AI vision.', link: '/analyzer'},
    {icon: '🌱', title: 'SDG Impact', desc: 'See exactly how your actions contribute to UN Global Goals 12 & 13.', link: '/sdg'},
    {icon: '🤝', title: 'Community', desc: 'Connect with local recycling drives and upcycling events near you.', link: '/events'},
    {icon: '📊', title: 'Track Progress', desc: 'Monitor your carbon footprint reduction over time.', link: '/carbon'},
    {icon: '🎁', title: 'Green Rewards', desc: 'Earn eco-points for every correct sort and verified action.', link: '/challenge'},
    {icon: '🛍️', title: 'Marketplace', desc: 'Don\'t throw it away. Sell or donate your reusable items.', link: '/marketplace'},
  ];
}