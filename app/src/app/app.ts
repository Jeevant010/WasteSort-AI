import { Component, signal, effect, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

// --- API CONFIGURATION ---
const apiKey = "";

// --- INTERFACES ---
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

interface HistoryItem {
  name: string;
  type: string;
  date: number;
}

interface DiyGuide {
  idea: string;
  materials_needed: string[];
  steps: string[];
  difficulty: string;
}

interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #fafaf9; /* stone-50 */
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.6s ease-out forwards;
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
  template: `
    <div class="min-h-screen text-stone-900 selection:bg-emerald-200 selection:text-emerald-900">
      
      <!-- HEADER -->
      <header class="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white pt-16 pb-32 px-6 relative overflow-hidden">
        <!-- Abstract Background Shapes -->
        <div class="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400 opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
        
        <div class="max-w-4xl mx-auto relative z-10 text-center">
          <div class="inline-flex items-center justify-center py-1.5 px-4 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20 shadow-lg">
            <!-- Globe Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-emerald-300"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            <span class="text-xs font-bold uppercase tracking-widest text-emerald-50">Global Goals 12 & 13</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
            EcoSort <span class="text-emerald-300">AI</span>
          </h1>
          <p class="text-emerald-100/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Advanced waste analytics driven by Angular & Generative AI. 
            Instantly determine the lifecycle and environmental impact of any material.
          </p>
        </div>
      </header>

      <main class="max-w-4xl mx-auto px-6 -mt-24 relative z-20 pb-20">
        
        <!-- SEARCH INTERFACE -->
        <div class="bg-white rounded-2xl shadow-xl border-0 ring-1 ring-black/5 p-2 mb-10">
          <form (submit)="handleSubmit($event)" class="flex flex-col md:flex-row gap-2 bg-white p-2 rounded-xl">
            <div class="flex-1 relative">
              <input
                [formControl]="inputControl"
                type="text"
                placeholder="Describe an item (e.g., 'Bubble Wrap', 'Old Paint')"
                class="w-full h-16 pl-6 pr-12 rounded-lg text-lg bg-transparent outline-none placeholder:text-stone-400 text-stone-700"
              />
              @if (inputControl.value) {
                <button 
                  type="button"
                  (click)="clearInput()"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <!-- X Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
                </button>
              }
            </div>
            <button
              type="submit"
              [disabled]="loading() || inputControl.invalid"
              class="h-16 px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg shadow-emerald-200"
            >
              @if (loading()) {
                <!-- Loader Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                Analyzing...
              } @else {
                Analyze 
                <!-- ArrowRight Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              }
            </button>
          </form>
        </div>

        <!-- CONTENT AREA -->
        <div class="min-h-[400px]">
          
          <!-- ERROR STATE -->
          @if (error()) {
            <div class="bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl flex items-center gap-4 animate-fade-in-up mb-6">
              <!-- AlertTriangle Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              <div>
                <p class="font-bold">Analysis Failed</p>
                <p class="text-sm opacity-90">{{ error() }}</p>
              </div>
              <button (click)="handleSubmit($event)" class="ml-auto p-2 hover:bg-red-100 rounded-full">
                <!-- RotateCcw Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/><path d="M3 3v9h9"/></svg>
              </button>
            </div>
          }

          <!-- EMPTY STATE -->
          @if (!data() && !loading() && !error()) {
            <div class="text-center py-12 opacity-60">
              <!-- Recycle Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-6 text-stone-300"><path d="M7 19a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8H7v11Z"/><path d="M5 8h14"/><path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M12 12v6"/><path d="M12 3v5"/></svg>
              <p class="text-xl font-medium text-stone-400">Ready to optimize your waste footprint.</p>
              <p class="text-stone-400 mt-2">Enter an item above to generate a sustainability report.</p>
            </div>
          }

          <!-- ANALYSIS RESULT -->
          @if (data(); as result) {
            <div class="space-y-6 animate-fade-in-up">
              
              <!-- VERDICT SECTION -->
              <div class="grid md:grid-cols-3 gap-6">
                <!-- BIN CARD -->
                <div 
                  class="col-span-2 rounded-2xl shadow-sm border-2 overflow-hidden"
                  [ngClass]="getBinStyles(result.bin_color).container"
                >
                  <div class="p-8">
                    <div class="flex items-start justify-between">
                      <div>
                        <div class="flex items-center space-x-2 mb-2">
                          <span 
                            class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/60 backdrop-blur-sm"
                            [ngClass]="getBinStyles(result.bin_color).text"
                          >
                            {{ result.disposal_method }}
                          </span>
                        </div>
                        <h2 
                          class="text-3xl font-bold mb-4"
                          [ngClass]="getBinStyles(result.bin_color).text"
                        >
                          Use the {{ result.bin_color }} Bin
                        </h2>
                      </div>
                      <div 
                        class="p-4 rounded-full"
                        [ngClass]="getBinStyles(result.bin_color).icon + ' ' + getBinStyles(result.bin_color).text"
                      >
                        <!-- Trash2 Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                      </div>
                    </div>
                    
                    <div class="bg-white/60 backdrop-blur-sm rounded-xl p-5 mt-4">
                      <h3 class="text-sm font-bold text-stone-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                        <!-- CheckCircle2 Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                        Protocol
                      </h3>
                      <p class="text-stone-800 text-lg leading-relaxed font-medium">
                        {{ result.handling_instructions }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- SCORE GAUGE -->
                <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 flex flex-col items-center justify-center h-full">
                  <h3 class="text-sm font-bold text-stone-400 uppercase tracking-wide mb-4">Recyclability Score</h3>
                  <div class="flex flex-col items-center justify-center p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <div class="relative w-24 h-24 flex items-center justify-center">
                      <svg class="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" stroke-width="8" fill="transparent" class="text-stone-200" />
                        <circle 
                          cx="48" cy="48" r="40" 
                          stroke="currentColor" stroke-width="8" 
                          fill="transparent" 
                          [attr.stroke-dasharray]="(result.recyclability_score * 10 * 2.51) + ' 251'" 
                          stroke-linecap="round"
                          [ngClass]="getScoreColor(result.recyclability_score).text"
                        />
                      </svg>
                      <span 
                        class="absolute text-2xl font-bold"
                        [ngClass]="getScoreColor(result.recyclability_score).text"
                      >
                        {{ result.recyclability_score }}
                      </span>
                    </div>
                    <span class="mt-2 text-xs font-bold uppercase tracking-wide text-stone-500">{{ getScoreColor(result.recyclability_score).label }}</span>
                  </div>
                </div>
              </div>

              <!-- QUIZ FEATURE SECTION -->
              <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden">
                 <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-lg text-indigo-900 flex items-center gap-2">
                       <!-- Brain Icon -->
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-1.4 4.5 4.5 0 0 1-3 1.4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M9 21v-1a2 2 0 0 1 2-2"/></svg>
                       Eco-Trivia Challenge
                    </h3>
                    @if (!quizData()) {
                       <button (click)="generateQuiz()" [disabled]="isQuizLoading()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
                          @if(isQuizLoading()) { <span class="animate-spin">⌛</span> }
                          ✨ Generate Quiz
                       </button>
                    }
                 </div>
                 
                 @if (quizData(); as quiz) {
                    <div class="animate-fade-in-up">
                       <p class="text-lg font-medium text-indigo-900 mb-4">{{ quiz.question }}</p>
                       <div class="grid gap-3 mb-4">
                          @for (opt of quiz.options; track $index) {
                             <button 
                                (click)="checkQuizAnswer($index)"
                                [class.bg-green-100]="quizFeedback() !== null && $index === quiz.correctIndex"
                                [class.border-green-300]="quizFeedback() !== null && $index === quiz.correctIndex"
                                [class.bg-red-100]="quizFeedback() === 'incorrect' && $index !== quiz.correctIndex && $index === selectedQuizOption()"
                                class="p-3 text-left bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-indigo-800"
                                [disabled]="quizFeedback() !== null"
                             >
                                {{ opt }}
                                @if (quizFeedback() !== null && $index === quiz.correctIndex) { ✅ }
                                @if (quizFeedback() === 'incorrect' && $index === selectedQuizOption()) { ❌ }
                             </button>
                          }
                       </div>
                       @if (quizFeedback()) {
                          <div class="bg-white/50 p-3 rounded-lg text-sm text-indigo-900 italic">
                             💡 {{ quiz.explanation }}
                          </div>
                       }
                    </div>
                 }
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                
                <!-- ENV IMPACT -->
                <div class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                  <div class="p-6 border-b border-stone-100 bg-stone-50">
                    <h3 class="font-bold text-lg text-stone-800 flex items-center gap-2">
                      <!-- BarChart3 Icon -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-600"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                      Environmental Profile
                    </h3>
                  </div>
                  <div class="p-6 space-y-6">
                    <div class="flex items-start gap-4">
                      <div class="p-3 bg-red-50 text-red-600 rounded-lg shrink-0">
                        <!-- Clock Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      </div>
                      <div>
                        <span class="text-xs font-bold text-stone-400 uppercase tracking-wide">Decomposition Time</span>
                        <p class="text-xl font-bold text-stone-800">{{ result.decomposition_time || "Unknown" }}</p>
                        <p class="text-sm text-stone-500 mt-1">Time to breakdown in a landfill environment.</p>
                      </div>
                    </div>
                    <div class="flex items-start gap-4">
                      <div class="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                        <!-- Leaf Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1.45 6"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.5 12 13 13 12"/></svg>
                      </div>
                      <div>
                        <span class="text-xs font-bold text-stone-400 uppercase tracking-wide">Impact Analysis</span>
                        <p class="text-stone-700 leading-relaxed mt-1">{{ result.environmental_impact }}</p>
                      </div>
                    </div>
                    
                    <div class="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100">
                      <span class="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1 block">Aligned with UN SDG 12</span>
                      <p class="text-sm text-emerald-900 italic">"{{ result.sdg_connection }}"</p>
                    </div>
                  </div>
                </div>

                <!-- UPCYCLING -->
                <div class="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                  <div class="p-6 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
                    <h3 class="font-bold text-lg text-stone-800 flex items-center gap-2">
                      <!-- Lightbulb Icon -->
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                      Circular Economy Ideas
                    </h3>
                  </div>
                  <div class="p-6">
                    <ul class="space-y-6">
                      @for (idea of result.upcycling_ideas; track $index) {
                        <li class="group">
                          <div class="flex gap-4 items-start">
                             <span class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                                {{ $index + 1 }}
                             </span>
                             <div class="flex-1">
                                <p class="text-stone-700 font-medium group-hover:text-stone-900 transition-colors pt-1 mb-2">
                                   {{ idea }}
                                </p>
                                
                                <!-- DIY Guide Toggle -->
                                @if (activeDiyGuide()?.idea === idea) {
                                   <div class="mt-3 bg-amber-50 rounded-xl p-4 border border-amber-100 animate-fade-in-up">
                                      <div class="flex justify-between items-start mb-2">
                                         <h4 class="font-bold text-amber-900">📝 Steps</h4>
                                         <span class="text-xs bg-white text-amber-700 px-2 py-1 rounded border border-amber-200">{{ activeDiyGuide()?.difficulty }}</span>
                                      </div>
                                      
                                      <p class="text-xs font-bold text-amber-700 uppercase mb-1">Materials:</p>
                                      <p class="text-sm text-amber-900 mb-3">{{ activeDiyGuide()?.materials_needed?.join(', ') }}</p>
                                      
                                      <ol class="list-decimal pl-4 space-y-1 text-sm text-stone-700">
                                         @for (step of activeDiyGuide()?.steps; track step) {
                                            <li>{{ step }}</li>
                                         }
                                      </ol>
                                   </div>
                                } @else {
                                   <button (click)="generateDiyGuide(idea)" [disabled]="isGuideLoading()" class="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
                                      @if(isGuideLoading() && loadingGuideId() === idea) { 
                                         <span class="animate-spin">⌛</span> Generating Guide...
                                      } @else {
                                         ✨ Generate DIY Guide
                                      }
                                   </button>
                                }
                             </div>
                          </div>
                        </li>
                      }
                    </ul>
                    <div class="mt-8 pt-6 border-t border-stone-100 text-center">
                      <p class="text-xs text-stone-400 uppercase tracking-widest">Prevent Waste • Reimagine Value</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- HISTORY -->
          @if (history().length > 0) {
            <div class="mt-12 max-w-2xl mx-auto">
              <div class="flex items-center justify-between mb-4 px-2">
                <h3 class="text-sm font-bold text-stone-400 uppercase tracking-wide flex items-center gap-2">
                  <!-- History Icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/><path d="M3 3v9h9"/><path d="M12 7v5l4 2"/></svg>
                  Recent Analyses
                </h3>
                <button (click)="clearHistory()" class="text-xs text-red-400 hover:text-red-600 font-medium hover:underline">
                  Clear All
                </button>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                @for (h of history(); track h.date) {
                  <button
                    (click)="selectHistory(h.name)"
                    class="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all group text-left"
                  >
                    <span class="font-medium text-stone-700 group-hover:text-emerald-700 truncate">{{ h.name }}</span>
                    <span class="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded border border-stone-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100">
                      {{ h.type }}
                    </span>
                  </button>
                }
              </div>
            </div>
          }

        </div>

      </main>

      <!-- FOOTER -->
      <footer class="bg-white border-t border-stone-200 py-12 mt-auto">
        <div class="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center">
              <!-- Leaf Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-300"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1.45 6"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.5 12 13 13 12"/></svg>
            </div>
            <span class="font-bold text-stone-800">EcoSort AI</span>
          </div>
          <div class="text-stone-500 text-sm text-center md:text-right">
            <p>Built for the United Nations SDGs.</p>
            <p class="mt-1">© {{ currentYear }} Sustainable Futures Lab.</p>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class App {
  // --- STATE WITH SIGNALS ---
  inputControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  loading = signal<boolean>(false);
  data = signal<AnalysisResult | null>(null);
  error = signal<string | null>(null);
  history = signal<HistoryItem[]>([]);
  currentYear = new Date().getFullYear();

  // New Features State
  activeDiyGuide = signal<DiyGuide | null>(null);
  isGuideLoading = signal<boolean>(false);
  loadingGuideId = signal<string | null>(null);

  quizData = signal<QuizData | null>(null);
  isQuizLoading = signal<boolean>(false);
  quizFeedback = signal<'correct' | 'incorrect' | null>(null);
  selectedQuizOption = signal<number | null>(null);

  constructor() {
    // Check if localStorage is available (prevents SSR errors)
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('ecosort_history_ng');
      if (saved) {
        try {
          this.history.set(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load history", e);
        }
      }
    }

    effect(() => {
      const currentHistory = this.history();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ecosort_history_ng', JSON.stringify(currentHistory));
      }
    });
  }

  // --- ACTIONS ---

  clearInput() {
    this.inputControl.setValue('');
  }

  selectHistory(name: string) {
    this.inputControl.setValue(name);
    this.handleSubmit(new Event('submit'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearHistory() {
    this.history.set([]);
  }

  // --- FEATURE 1: CORE ANALYSIS ---
  async handleSubmit(e: Event) {
    e.preventDefault();
    if (this.inputControl.invalid || !this.inputControl.value.trim()) return;

    const itemName = this.inputControl.value;
    this.loading.set(true);
    this.error.set(null);
    this.data.set(null);
    this.resetNewFeatures();

    const systemPrompt = `
      You are an expert in sustainable development, waste management, and materials science.
      Analyze the item "${itemName}".
      Return ONLY a JSON object. Do not include markdown formatting like \`\`\`json.
      Structure:
      {
        "disposal_method": "Short string (e.g. 'Recycle', 'Compost', 'Landfill', 'E-Waste')",
        "bin_color": "String (Standard bin color: Blue, Green, Black, Red (Hazard))",
        "handling_instructions": "String (1-2 clear sentences on preparation)",
        "upcycling_ideas": ["String", "String", "String"],
        "environmental_impact": "String (Scientific explanation of impact)",
        "decomposition_time": "String (Estimate, e.g., '450 years', '2-4 weeks')",
        "recyclability_score": Number (Integer 1-10, where 10 is perfectly recyclable),
        "sdg_connection": "String (Connection to SDG 12 or 13)"
      }
    `;

    try {
      const response = await this.callGemini(systemPrompt);
      const parsed: AnalysisResult = JSON.parse(response);
      
      this.data.set(parsed);
      
      this.history.update(prev => {
        const filtered = prev.filter(p => p.name.toLowerCase() !== itemName.toLowerCase());
        return [{ name: itemName, type: parsed.disposal_method, date: Date.now() }, ...filtered].slice(0, 6);
      });

    } catch (err) {
      this.error.set("We couldn't analyze that item. Please try a different description or check your connection.");
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  // --- FEATURE 2: DIY GUIDES ---
  async generateDiyGuide(idea: string) {
     if (this.isGuideLoading()) return;
     
     this.isGuideLoading.set(true);
     this.loadingGuideId.set(idea);
     
     const prompt = `
       Create a DIY Upcycling Guide for "${idea}" using the base item "${this.inputControl.value}".
       Return ONLY JSON. No markdown.
       Structure:
       {
         "idea": "${idea}",
         "materials_needed": ["String", "String"],
         "steps": ["Step 1...", "Step 2..."],
         "difficulty": "Easy/Medium/Hard"
       }
     `;

     try {
        const response = await this.callGemini(prompt);
        const guide: DiyGuide = JSON.parse(response);
        this.activeDiyGuide.set(guide);
     } catch (e) {
        console.error(e);
        // Fallback or error toast could go here
     } finally {
        this.isGuideLoading.set(false);
        this.loadingGuideId.set(null);
     }
  }

  // --- FEATURE 3: ECO QUIZ ---
  async generateQuiz() {
     if (this.isQuizLoading()) return;
     this.isQuizLoading.set(true);
     
     const prompt = `
        Create a multiple choice trivia question about the environmental impact or recycling of "${this.inputControl.value}".
        Return ONLY JSON. No markdown.
        Structure:
        {
           "question": "String",
           "options": ["Option A", "Option B", "Option C", "Option D"],
           "correctIndex": Number (0-3),
           "explanation": "Short string explaining why the answer is correct"
        }
     `;
     
     try {
        const response = await this.callGemini(prompt);
        const quiz: QuizData = JSON.parse(response);
        this.quizData.set(quiz);
     } catch (e) {
        console.error(e);
     } finally {
        this.isQuizLoading.set(false);
     }
  }

  checkQuizAnswer(index: number) {
     if (this.quizFeedback() !== null) return;
     this.selectedQuizOption.set(index);
     const isCorrect = index === this.quizData()?.correctIndex;
     this.quizFeedback.set(isCorrect ? 'correct' : 'incorrect');
  }

  // --- UTILS ---
  async callGemini(prompt: string): Promise<string> {
     const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          }),
        }
      );

      if (!response.ok) throw new Error("API Error");
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No data returned");
      return text;
  }

  resetNewFeatures() {
     this.activeDiyGuide.set(null);
     this.quizData.set(null);
     this.quizFeedback.set(null);
     this.selectedQuizOption.set(null);
  }

  getBinStyles(color: string) {
    const c = color?.toLowerCase() || '';
    if (c.includes('blue')) return { container: 'bg-blue-50 border-blue-200', text: 'text-blue-800', icon: 'bg-blue-100' };
    if (c.includes('green')) return { container: 'bg-green-50 border-green-200', text: 'text-green-800', icon: 'bg-green-100' };
    if (c.includes('black') || c.includes('grey')) return { container: 'bg-stone-100 border-stone-300', text: 'text-stone-800', icon: 'bg-stone-200' };
    if (c.includes('yellow')) return { container: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', icon: 'bg-yellow-100' };
    if (c.includes('red')) return { container: 'bg-red-50 border-red-200', text: 'text-red-800', icon: 'bg-red-100' };
    return { container: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: 'bg-emerald-100' };
  }

  getScoreColor(score: number) {
    if (score > 7) return { text: 'text-emerald-500', label: 'High Recyclability' };
    if (score > 4) return { text: 'text-amber-500', label: 'Moderate' };
    return { text: 'text-red-500', label: 'Low Recyclability' };
  }
}