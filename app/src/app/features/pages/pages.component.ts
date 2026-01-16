import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- 1. SDG Component ---
@Component({
  selector: 'app-sdg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto px-6 py-12">
      <h2 class="text-4xl font-bold text-stone-800 mb-8 text-center">Sustainable Development Goals</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-[#BF8B2E] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
          <div class="absolute -right-10 -bottom-10 text-9xl font-bold opacity-20">12</div>
          <h3 class="text-2xl font-bold mb-4">Responsible Consumption</h3>
          <p class="mb-6 opacity-90">Ensure sustainable consumption and production patterns. Reduce waste generation through prevention, reduction, recycling and reuse.</p>
        </div>
        <div class="bg-[#3F7E44] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden group">
          <div class="absolute -right-10 -bottom-10 text-9xl font-bold opacity-20">13</div>
          <h3 class="text-2xl font-bold mb-4">Climate Action</h3>
          <p class="mb-6 opacity-90">Take urgent action to combat climate change. Every small sorting decision reduces landfill methane emissions.</p>
        </div>
      </div>
    </div>
  `
})
export class SdgComponent {}

// --- 2. News Component ---
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto px-6 py-12">
      <h2 class="text-3xl font-bold mb-8 text-stone-800">Latest in Green Tech</h2>
      <div class="grid gap-6">
        <div class="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <span class="text-emerald-600 text-xs font-bold uppercase">Innovation</span>
          <h3 class="text-xl font-bold text-stone-800 mt-1">New Enzyme Eats Plastic in Hours</h3>
          <p class="text-stone-500 mt-2">Scientists discover a super-enzyme that degrades PET plastic bottles 6x faster.</p>
        </div>
        <div class="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <span class="text-emerald-600 text-xs font-bold uppercase">Policy</span>
          <h3 class="text-xl font-bold text-stone-800 mt-1">Global Plastic Treaty Talks Begin</h3>
          <p class="text-stone-500 mt-2">UN member states gather to forge a legally binding international instrument.</p>
        </div>
      </div>
    </div>
  `
})
export class NewsComponent {}

// --- 3. Events Component ---
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto px-6 py-12">
      <h2 class="text-3xl font-bold text-stone-800 mb-8">Community Events</h2>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div class="h-32 bg-emerald-100 flex items-center justify-center text-emerald-800 text-3xl font-bold">12 OCT</div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-stone-900">Beach Cleanup Drive</h3>
            <p class="text-stone-500">Santa Monica Pier</p>
            <button class="mt-4 w-full py-2 border border-stone-300 rounded-lg font-bold hover:bg-stone-50">Join</button>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div class="h-32 bg-emerald-100 flex items-center justify-center text-emerald-800 text-3xl font-bold">15 OCT</div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-stone-900">E-Waste Collection</h3>
            <p class="text-stone-500">City Hall Parking</p>
            <button class="mt-4 w-full py-2 border border-stone-300 rounded-lg font-bold hover:bg-stone-50">Join</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EventsComponent {}

// --- 4. Challenge Component ---
@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-12">
      <div class="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-3xl p-8 text-white mb-8 text-center">
        <h2 class="text-3xl font-bold mb-2">30-Day Eco Challenge</h2>
        <p class="opacity-90">Small daily habits, massive global impact.</p>
      </div>
      <div class="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
        <div *ngFor="let i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]" 
             class="aspect-square rounded-xl border-2 flex flex-col items-center justify-center"
             [ngClass]="i <= 5 ? 'bg-emerald-50 border-emerald-500' : 'border-stone-100'">
          <span class="text-xs font-bold text-stone-400">Day</span>
          <span class="text-xl font-bold" [ngClass]="i <= 5 ? 'text-emerald-600' : 'text-stone-800'">{{i}}</span>
          <span *ngIf="i <= 5" class="text-xs">✅</span>
        </div>
      </div>
    </div>
  `
})
export class ChallengeComponent {}

// --- 5. Carbon Component ---
@Component({
  selector: 'app-carbon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-12">
      <h2 class="text-3xl font-bold mb-6 text-center text-stone-800">Quick Footprint Estimate</h2>
      <div class="bg-white p-8 rounded-2xl shadow-lg border border-stone-100">
        <div class="space-y-4">
          <label class="block">
            <span class="text-sm font-bold text-stone-600">Commute</span>
            <select class="w-full mt-1 p-3 bg-stone-50 rounded-lg border border-stone-200">
              <option>Car (Gas)</option><option>EV</option><option>Public Transport</option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm font-bold text-stone-600">Diet</span>
            <select class="w-full mt-1 p-3 bg-stone-50 rounded-lg border border-stone-200">
              <option>Omnivore</option><option>Vegetarian</option><option>Vegan</option>
            </select>
          </label>
          <button class="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl">Calculate</button>
        </div>
      </div>
    </div>
  `
})
export class CarbonComponent {}

// --- 6. Quiz Component ---
@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto px-6 py-12 text-center">
      <h2 class="text-3xl font-bold mb-8 text-stone-800">Eco-Trivia</h2>
      <div class="bg-white p-8 rounded-3xl shadow-xl border border-indigo-100">
        <div class="text-6xl mb-6">🧠</div>
        <h3 class="text-xl font-bold text-stone-800 mb-6">Which plastic is easiest to recycle?</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button class="p-4 rounded-xl border-2 border-stone-100 hover:border-indigo-500 font-bold text-stone-600">PET (1)</button>
          <button class="p-4 rounded-xl border-2 border-stone-100 hover:border-indigo-500 font-bold text-stone-600">PVC (3)</button>
          <button class="p-4 rounded-xl border-2 border-stone-100 hover:border-indigo-500 font-bold text-stone-600">LDPE (4)</button>
          <button class="p-4 rounded-xl border-2 border-stone-100 hover:border-indigo-500 font-bold text-stone-600">PS (6)</button>
        </div>
      </div>
    </div>
  `
})
export class QuizComponent {}

// --- 7. Volunteer Component ---
@Component({
  selector: 'app-volunteer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-12">
      <h2 class="text-3xl font-bold mb-6 text-stone-800">Join the Green Army</h2>
      <div class="bg-white p-8 rounded-2xl border border-stone-200">
        <form class="grid md:grid-cols-2 gap-6">
          <input type="text" placeholder="Name" class="p-3 border rounded-lg">
          <input type="email" placeholder="Email" class="p-3 border rounded-lg">
          <button class="md:col-span-2 py-3 bg-stone-900 text-white font-bold rounded-lg">Sign Up</button>
        </form>
      </div>
    </div>
  `
})
export class VolunteerComponent {}

// --- 8. About Component ---
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-12">
      <h2 class="text-4xl font-bold mb-8 text-stone-800">About EcoSort AI</h2>
      <p class="text-lg leading-relaxed mb-6 text-stone-600">
        We are a team of environmentalists and technologists dedicated to solving the global waste crisis using Artificial Intelligence.
        By simplifying the complex rules of recycling, we empower individuals to make better choices every day.
      </p>
    </div>
  `
})
export class AboutComponent {}

// --- 9. Contact Component ---
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto px-6 py-12 text-center">
      <h2 class="text-3xl font-bold mb-8 text-stone-800">Get in Touch</h2>
      <div class="bg-white p-8 rounded-2xl shadow-lg">
        <p class="text-stone-500">support&#64;ecosort.ai</p>
        <p class="text-stone-500">123 Green Street, Eco City</p>
      </div>
    </div>
  `
})
export class ContactComponent {}