import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EcoApiService, AnalysisResult } from '../../services/eco-api.service';

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
        <h2 class="text-3xl font-bold text-stone-800 mb-4">AI Waste Sorter</h2>
        <div class="flex gap-4">
          <input [(ngModel)]="itemInput" placeholder="What are you throwing away?" 
                 class="flex-1 p-4 bg-stone-50 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500">
          <button (click)="analyze()" [disabled]="isLoading()" 
                  class="bg-emerald-600 text-white px-8 rounded-xl font-bold disabled:opacity-50">
            {{ isLoading() ? 'Thinking...' : 'Analyze' }}
          </button>
        </div>
      </div>

      @if (result(); as data) {
        <div class="grid md:grid-cols-2 gap-6 animate-fade-in">
          <div class="bg-white p-8 rounded-2xl border-l-8" 
               [ngClass]="{'border-blue-500': data.bin_color.includes('Blue'), 'border-green-500': data.bin_color.includes('Green')}">
            <h3 class="text-2xl font-bold mb-2">Use {{ data.bin_color }} Bin</h3>
            <p class="text-stone-600">{{ data.handling_instructions }}</p>
          </div>
          <div class="bg-stone-900 text-stone-300 p-8 rounded-2xl">
            <h4 class="text-emerald-400 font-bold uppercase text-xs tracking-wider mb-2">SDG Impact</h4>
            <p>{{ data.sdg_connection }}</p>
          </div>
        </div>
      }
    </div>
  `
})
export class AnalyzerComponent {
  private api = inject(EcoApiService);
  
  itemInput = '';
  isLoading = signal(false);
  result = signal<AnalysisResult | null>(null);

  analyze() {
    if (!this.itemInput.trim()) return;
    this.isLoading.set(true);
    this.api.analyzeItem(this.itemInput).subscribe({
      next: (data) => {
        this.result.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }
}