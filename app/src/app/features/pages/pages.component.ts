import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EcoApiService } from '../../services/eco-api.service';

// --- SDG ---
@Component({
  selector: 'app-sdg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      <h2 class="text-4xl font-bold text-stone-800 mb-12 text-center">Global Goals</h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-10 rounded-3xl shadow-xl hover:scale-[1.02] transition-transform">
          <h3 class="text-3xl font-bold mb-4">12. Responsible Consumption</h3>
          <p class="text-lg opacity-90">Doing more and better with less. Decoupling economic growth from environmental degradation.</p>
        </div>
        <div class="bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-10 rounded-3xl shadow-xl hover:scale-[1.02] transition-transform">
          <h3 class="text-3xl font-bold mb-4">13. Climate Action</h3>
          <p class="text-lg opacity-90">Take urgent action to combat climate change and its impacts.</p>
        </div>
      </div>
    </div>
  `
})
export class SdgComponent {}

// --- News ---
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <h2 class="text-3xl font-bold mb-8 text-stone-800">Green Tech News</h2>
      <div class="grid gap-6">
        <div *ngFor="let item of news()" class="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all">
          <span class="text-emerald-600 font-bold uppercase text-xs tracking-wider mb-2 block">{{item.category}}</span>
          <h3 class="text-2xl font-bold text-stone-800 mb-2">{{item.title}}</h3>
          <p class="text-stone-600">{{item.summary}}</p>
        </div>
      </div>
    </div>
  `
})
export class NewsComponent implements OnInit {
  api = inject(EcoApiService);
  news = signal<any[]>([]);
  ngOnInit() { this.api.getNews().subscribe(data => this.news.set(data)); }
}

// --- Events ---
@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <h2 class="text-3xl font-bold text-stone-800 mb-8">Community Events</h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let event of events()" class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
          <div class="h-32 bg-emerald-900 flex items-center justify-center text-emerald-400 text-3xl font-bold">{{event.day}}</div>
          <div class="p-6">
            <h3 class="text-xl font-bold text-stone-900">{{event.title}}</h3>
            <p class="text-stone-500 mb-4">📍 {{event.location}}</p>
            <button class="w-full py-2 border border-stone-200 rounded-lg font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Register</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EventsComponent implements OnInit {
  api = inject(EcoApiService);
  events = signal<any[]>([]);
  ngOnInit() { this.api.getEvents().subscribe(data => this.events.set(data)); }
}

// --- Challenge (FUNCTIONAL) ---
@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <div class="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-10 text-white mb-10 text-center shadow-lg">
        <h2 class="text-4xl font-bold mb-4">30-Day Eco Challenge</h2>
        <p class="text-emerald-100 text-lg">Click a day to mark complete. Your progress is saved.</p>
      </div>
      
      <div class="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
        <div *ngFor="let i of days" 
             (click)="toggleDay(i)"
             class="aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105"
             [ngClass]="completedDays().includes(i) ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' : 'bg-white border-stone-100 text-stone-400 hover:border-emerald-200'">
          <span class="text-xs font-bold uppercase tracking-wider">Day</span>
          <span class="text-2xl font-bold">{{i}}</span>
          <span *ngIf="completedDays().includes(i)" class="text-lg mt-1">✓</span>
        </div>
      </div>
    </div>
  `
})
export class ChallengeComponent implements OnInit {
  api = inject(EcoApiService);
  days = Array.from({length: 30}, (_, i) => i + 1);
  completedDays = signal<number[]>([]);

  ngOnInit() {
    this.api.getChallengeProgress().subscribe(days => this.completedDays.set(days));
  }

  toggleDay(day: number) {
    const isComplete = !this.completedDays().includes(day);
    if (isComplete) this.completedDays.update(d => [...d, day]);
    else this.completedDays.update(d => d.filter(x => x !== day));

    // Save to MongoDB
    this.api.updateChallenge(day, isComplete).subscribe();
  }
}

// --- Carbon (FUNCTIONAL) ---
@Component({
  selector: 'app-carbon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-12 animate-slide-up">
      <h2 class="text-3xl font-bold mb-2 text-center text-stone-800">Carbon Footprint</h2>
      <p class="text-center text-stone-500 mb-8">Calculate your daily impact score.</p>
      
      <div class="bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
        <div class="space-y-6">
          <label class="block">
            <span class="text-sm font-bold text-stone-600 uppercase">Commute</span>
            <select [(ngModel)]="data.commute" class="w-full mt-2 p-4 bg-stone-50 rounded-xl outline-none border border-stone-200">
              <option>Car (Gasoline)</option><option>Electric Vehicle</option><option>Public Transport</option><option>Cycling</option>
            </select>
          </label>
          <label class="block">
            <span class="text-sm font-bold text-stone-600 uppercase">Diet</span>
            <select [(ngModel)]="data.diet" class="w-full mt-2 p-4 bg-stone-50 rounded-xl outline-none border border-stone-200">
              <option>Meat Eater</option><option>Vegetarian</option><option>Vegan</option>
            </select>
          </label>
          <button (click)="calculate()" class="w-full py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">
            Calculate Impact
          </button>
        </div>

        <div *ngIf="result !== null" class="mt-8 text-center p-6 bg-emerald-50 rounded-2xl animate-fade-in">
          <p class="text-stone-500 mb-2">Your Daily Impact Score</p>
          <div class="text-5xl font-bold text-emerald-600 mb-2">{{result}}</div>
          <p class="text-sm text-emerald-800">Saved to your history!</p>
        </div>
      </div>
    </div>
  `
})
export class CarbonComponent {
  api = inject(EcoApiService);
  data = { commute: 'Car (Gasoline)', diet: 'Meat Eater' };
  result: number | null = null;

  calculate() {
    this.api.calculateCarbon(this.data).subscribe(res => this.result = res.score);
  }
}

// --- Static Components ---
@Component({ selector: 'app-quiz', standalone: true, imports: [CommonModule], template: `<div class="p-12 text-center text-stone-600">Quiz Component Loaded</div>` }) export class QuizComponent {}
@Component({ selector: 'app-volunteer', standalone: true, imports: [CommonModule], template: `<div class="p-12 text-center text-stone-600">Volunteer Component Loaded</div>` }) export class VolunteerComponent {}
@Component({ selector: 'app-about', standalone: true, imports: [CommonModule], template: `<div class="p-12 text-center text-stone-600">About Component Loaded</div>` }) export class AboutComponent {}
@Component({ selector: 'app-contact', standalone: true, imports: [CommonModule], template: `<div class="p-12 text-center text-stone-600">Contact Component Loaded</div>` }) export class ContactComponent {}