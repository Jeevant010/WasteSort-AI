import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EcoApiService, AnalysisResult } from '../../services/eco-api.service';

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 mt-10">
      
      <!-- Input Section -->
      <div class="bg-white p-10 rounded-3xl shadow-xl mb-12 border border-stone-100">
        <h2 class="text-4xl font-bold text-stone-800 mb-2">AI Waste Analyzer</h2>
        <p class="text-stone-500 mb-8 text-lg">Not sure which bin to use? Our AI identifies items instantly.</p>
        
        <div class="flex gap-4">
          <input [(ngModel)]="input" placeholder="e.g. 'Greasy Pizza Box' or 'Plastic Bottle'" 
                 class="flex-1 p-5 bg-stone-50 border border-stone-200 rounded-2xl text-xl outline-none focus:ring-4 focus:ring-emerald-100 transition-all placeholder:text-stone-400">
          <button (click)="analyze()" [disabled]="loading()" 
                  class="bg-emerald-600 text-white px-10 rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-200 flex items-center gap-2">
            <span *ngIf="loading()" class="animate-spin">⌛</span>
            {{ loading() ? 'Analyzing...' : 'Check Item' }}
          </button>
        </div>
      </div>

      <!-- Results Section -->
      @if (data(); as res) {
        <div class="grid md:grid-cols-2 gap-8 animate-fade-in">
          
          <!-- Disposal Card -->
          <div class="bg-white p-8 rounded-3xl shadow-lg border-l-8 flex flex-col" 
               [ngClass]="getBinClass(res.bin_color)">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 rounded-full flex items-center justify-center text-4xl" [ngClass]="getIconBg(res.bin_color)">
                {{ getIcon(res.bin_color) }}
              </div>
              <div>
                <span class="text-sm font-bold uppercase tracking-wider opacity-60">Verdict</span>
                <h3 class="text-3xl font-bold text-stone-800">{{ res.bin_color }} Bin</h3>
              </div>
            </div>
            
            <div class="bg-stone-50 rounded-2xl p-6 mb-6">
              <h4 class="font-bold text-stone-700 mb-2 flex items-center gap-2">📝 Instructions</h4>
              <p class="text-lg text-stone-600 leading-relaxed">{{ res.handling_instructions }}</p>
            </div>

            <div class="mt-auto pt-6 border-t border-stone-100">
               <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-500 uppercase">Method: {{ res.disposal_method }}</span>
            </div>
          </div>

          <!-- Impact & SDG Card -->
          <div class="flex flex-col gap-6">
            <!-- SDG Gradient Card -->
            <div class="bg-gradient-to-br from-[#BF8B2E] to-[#cf9d3e] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden group">
              <div class="absolute -right-6 -bottom-6 text-9xl font-bold opacity-10 group-hover:opacity-20 transition-opacity">SDG</div>
              <div class="relative z-10">
                <div class="flex items-center gap-2 mb-4">
                   <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-sm">United Nations Goal</span>
                </div>
                <h3 class="text-2xl font-bold mb-2">Sustainable Impact</h3>
                <p class="text-lg opacity-95 leading-relaxed">{{ res.sdg_connection || "Contributes to Goal 12: Responsible Consumption and Production." }}</p>
              </div>
            </div>

            <!-- Environmental Impact -->
            <div class="bg-white p-8 rounded-3xl shadow-md border border-stone-100">
               <h4 class="font-bold text-emerald-700 mb-3 flex items-center gap-2">🌍 Environmental Effect</h4>
               <p class="text-stone-600">{{ res.environmental_impact }}</p>
            </div>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AnalyzerComponent {
  private api = inject(EcoApiService);
  input = '';
  loading = signal(false);
  data = signal<AnalysisResult | null>(null);

  analyze() {
    if (!this.input.trim()) return;
    this.loading.set(true);
    this.api.analyzeItem(this.input).subscribe({
      next: (d) => { this.data.set(d); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  getBinClass(color: string) {
    if (color.includes('Blue')) return 'border-blue-500';
    if (color.includes('Green')) return 'border-green-500';
    return 'border-stone-800';
  }

  getIconBg(color: string) {
    if (color.includes('Blue')) return 'bg-blue-100';
    if (color.includes('Green')) return 'bg-green-100';
    return 'bg-stone-200';
  }

  getIcon(color: string) {
    if (color.includes('Blue')) return '♻️';
    if (color.includes('Green')) return '🍂';
    return '🗑️';
  }
}