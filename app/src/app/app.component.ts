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
      <nav class="bg-stone-900 text-stone-300 p-4 sticky top-0 z-50 shadow-lg">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
            <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
            <span class="font-bold text-white text-lg tracking-tight">EcoSort<span class="text-emerald-500">.ai</span></span>
          </div>
          
          <div class="flex flex-wrap justify-center gap-1">
            <a routerLink="/home" routerLinkActive="bg-emerald-900 text-white" class="px-3 py-2 rounded hover:text-white transition-colors">Home</a>
            <a routerLink="/analyzer" routerLinkActive="bg-emerald-900 text-white" class="px-3 py-2 rounded hover:text-white transition-colors">Sorter</a>
            <a routerLink="/marketplace" routerLinkActive="bg-emerald-900 text-white" class="px-3 py-2 rounded hover:text-white transition-colors">Market</a>
            <a routerLink="/sdg" routerLinkActive="bg-emerald-900 text-white" class="px-3 py-2 rounded hover:text-white transition-colors">SDGs</a>
            <a routerLink="/news" routerLinkActive="bg-emerald-900 text-white" class="px-3 py-2 rounded hover:text-white transition-colors">News</a>
            <a routerLink="/events" routerLinkActive="bg-emerald-900 text-white" class="px-3 py-2 rounded hover:text-white transition-colors">Events</a>
            <a routerLink="/challenge" routerLinkActive="bg-emerald-900 text-white" class="px-3 py-2 rounded hover:text-white transition-colors">Challenge</a>
            <a routerLink="/carbon" routerLinkActive="bg-emerald-900 text-white" class="px-3 py-2 rounded hover:text-white transition-colors">Carbon</a>
            <a routerLink="/about" routerLinkActive="bg-emerald-900 text-white" class="px-3 py-2 rounded hover:text-white transition-colors">About</a>
          </div>
        </div>
      </nav>
      
      <!-- Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-stone-900 text-stone-500 py-12 border-t border-stone-800 mt-auto">
        <div class="max-w-7xl mx-auto px-6 text-center">
          <p>© 2026 EcoSort AI. Built for the United Nations SDGs.</p>
          <div class="flex justify-center gap-4 mt-4 text-xs">
            <a routerLink="/contact" class="hover:text-white">Contact</a>
            <a routerLink="/volunteer" class="hover:text-white">Volunteer</a>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {}