import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-stone-50 font-sans flex flex-col">
      <!-- Navbar -->
      <nav class="bg-stone-900 text-stone-300 sticky top-0 z-50 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-2 cursor-pointer" routerLink="/">
              <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">E</div>
              <span class="font-bold text-white text-lg tracking-tight">EcoSort<span class="text-emerald-500">.ai</span></span>
            </div>
            
            <!-- Desktop Menu -->
            <div class="hidden md:flex gap-4">
              <a routerLink="/analyzer" routerLinkActive="text-white bg-stone-800" class="px-3 py-2 rounded-md hover:text-white transition-colors">Sorter</a>
              <a routerLink="/marketplace" routerLinkActive="text-white bg-stone-800" class="px-3 py-2 rounded-md hover:text-white transition-colors">Market</a>
              <a routerLink="/news" routerLinkActive="text-white bg-stone-800" class="px-3 py-2 rounded-md hover:text-white transition-colors">News</a>
              <a routerLink="/events" routerLinkActive="text-white bg-stone-800" class="px-3 py-2 rounded-md hover:text-white transition-colors">Events</a>
            </div>

            <!-- Mobile Button -->
            <div class="md:hidden">
              <button (click)="mobileMenuOpen.set(!mobileMenuOpen())" class="text-stone-300 hover:text-white focus:outline-none">
                <span class="text-2xl">☰</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        <div *ngIf="mobileMenuOpen()" class="md:hidden bg-stone-800">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <a routerLink="/analyzer" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md hover:bg-stone-700 hover:text-white">Sorter</a>
            <a routerLink="/marketplace" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md hover:bg-stone-700 hover:text-white">Market</a>
            <a routerLink="/news" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md hover:bg-stone-700 hover:text-white">News</a>
            <a routerLink="/events" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md hover:bg-stone-700 hover:text-white">Events</a>
            <a routerLink="/challenge" (click)="mobileMenuOpen.set(false)" class="block px-3 py-2 rounded-md hover:bg-stone-700 hover:text-white">Challenge</a>
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
          <div class="flex justify-center gap-4 mt-4 text-xs flex-wrap">
            <a routerLink="/contact" class="hover:text-white">Contact</a>
            <a routerLink="/volunteer" class="hover:text-white">Volunteer</a>
            <a routerLink="/about" class="hover:text-white">About Us</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  mobileMenuOpen = signal(false);
}