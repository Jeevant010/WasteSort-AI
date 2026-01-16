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
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 animate-fade-in">
      <h2 class="text-3xl md:text-4xl font-bold text-stone-800 mb-8 md:mb-12 text-center">Global Goals</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div class="bg-gradient-to-br from-amber-600 to-amber-700 text-white p-8 md:p-10 rounded-3xl shadow-xl hover:scale-[1.02] transition-transform">
          <h3 class="text-2xl md:text-3xl font-bold mb-4">12. Responsible Consumption</h3>
          <p class="text-base md:text-lg opacity-90">Doing more and better with less. Decoupling economic growth from environmental degradation.</p>
        </div>
        <div class="bg-gradient-to-br from-emerald-700 to-teal-800 text-white p-8 md:p-10 rounded-3xl shadow-xl hover:scale-[1.02] transition-transform">
          <h3 class="text-2xl md:text-3xl font-bold mb-4">13. Climate Action</h3>
          <p class="text-base md:text-lg opacity-90">Take urgent action to combat climate change and its impacts through education and innovation.</p>
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
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 animate-fade-in">
      <h2 class="text-3xl md:text-4xl font-bold mb-8 text-stone-800 text-center md:text-left">Green Tech News</h2>
      <div class="grid grid-cols-1 gap-6">
        <div *ngFor="let item of news()" class="bg-white p-6 md:p-8 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all">
          <div class="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
            <span class="text-emerald-600 font-bold uppercase text-xs tracking-wider">{{item.category}}</span>
            <span class="text-stone-400 text-xs">{{item.source}}</span>
          </div>
          <h3 class="text-xl md:text-2xl font-bold text-stone-800 mb-2">{{item.title}}</h3>
          <p class="text-stone-600 text-sm md:text-base">{{item.summary}}</p>
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
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 animate-fade-in">
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 class="text-3xl font-bold text-stone-800 text-center md:text-left">Community Events</h2>
        <button (click)="showForm = !showForm" class="bg-stone-900 text-white px-6 py-2 rounded-xl font-bold w-full md:w-auto">
          {{ showForm ? 'Cancel' : '+ Add Event' }}
        </button>
      </div>

      <div *ngIf="showForm" class="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-stone-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input [(ngModel)]="newEvent.title" placeholder="Event Title" class="p-3 border rounded-lg w-full">
          <input [(ngModel)]="newEvent.location" placeholder="Location" class="p-3 border rounded-lg w-full">
          <input [(ngModel)]="newEvent.date" placeholder="Date (e.g. 25 OCT)" class="p-3 border rounded-lg w-full">
        </div>
        <button (click)="addEvent()" class="w-full mt-4 bg-emerald-600 text-white py-2 rounded-lg font-bold">Publish Event</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let event of events()" class="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-row sm:flex-col">
          <div class="h-auto w-24 sm:w-full sm:h-32 bg-emerald-900 flex items-center justify-center text-emerald-400 text-xl sm:text-3xl font-bold p-2 text-center break-words">
            {{event.day || event.date}}
          </div>
          <div class="p-4 sm:p-6 flex-1">
            <h3 class="text-lg sm:text-xl font-bold text-stone-900">{{event.title}}</h3>
            <p class="text-stone-500 mb-4 text-sm">📍 {{event.location}}</p>
            <button class="w-full py-2 border border-stone-200 rounded-lg font-bold text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Register</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EventsComponent implements OnInit {
  api = inject(EcoApiService);
  events = signal<any[]>([]);
  showForm = false;
  newEvent = { title: '', location: '', date: '' };

  ngOnInit() { this.loadEvents(); }
  
  loadEvents() { this.api.getEvents().subscribe(data => this.events.set(data)); }

  addEvent() {
    this.api.createEvent(this.newEvent).subscribe(() => {
      this.loadEvents();
      this.showForm = false;
      this.newEvent = { title: '', location: '', date: '' };
    });
  }
}

// --- Challenge ---
@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 animate-fade-in">
      <div class="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-3xl p-6 md:p-10 text-white mb-8 text-center shadow-lg">
        <h2 class="text-2xl md:text-4xl font-bold mb-2 md:mb-4">30-Day Eco Challenge</h2>
        <p class="text-emerald-100 text-sm md:text-lg">Click a day to mark complete. Your progress is saved.</p>
      </div>
      
      <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2 md:gap-4">
        <div *ngFor="let i of days" 
             (click)="toggleDay(i)"
             class="aspect-square rounded-xl md:rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer hover:scale-105"
             [ngClass]="completedDays().includes(i) ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' : 'bg-white border-stone-100 text-stone-400 hover:border-emerald-200'">
          <span class="text-[10px] md:text-xs font-bold uppercase tracking-wider">Day</span>
          <span class="text-lg md:text-2xl font-bold">{{i}}</span>
          <span *ngIf="completedDays().includes(i)" class="text-sm md:text-lg mt-1">✓</span>
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

    this.api.updateChallenge(day, isComplete).subscribe();
  }
}

// --- Carbon ---
@Component({
  selector: 'app-carbon',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-6 py-12 animate-slide-up">
      <h2 class="text-3xl font-bold mb-2 text-center text-stone-800">Carbon Footprint</h2>
      <p class="text-center text-stone-500 mb-8">Calculate your daily impact score.</p>
      
      <div class="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-stone-100">
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