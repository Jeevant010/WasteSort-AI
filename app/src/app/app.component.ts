import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-stone-50 font-sans flex flex-col">
      <!-- Navbar -->
      <nav class="bg-emerald-900 text-white p-4 sticky top-0 z-50 shadow-lg">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <div class="text-2xl font-bold tracking-tight">EcoSort<span class="text-emerald-400">.ai</span></div>
          <div class="flex gap-6">
            <a routerLink="/analyzer" routerLinkActive="text-emerald-300 font-bold" class="hover:text-emerald-200 transition-colors cursor-pointer">Analyzer</a>
            <a routerLink="/marketplace" routerLinkActive="text-emerald-300 font-bold" class="hover:text-emerald-200 transition-colors cursor-pointer">Marketplace</a>
          </div>
        </div>
      </nav>
      
      <!-- Content Area -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-stone-900 text-stone-500 py-6 text-center text-sm border-t border-stone-800">
        <p>© 2026 EcoSort AI • Powered by Gemini & MongoDB</p>
      </footer>
    </div>
  `
})
export class AppComponent {}