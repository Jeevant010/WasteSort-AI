import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EcoApiService, MarketListing } from '../../services/eco-api.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-stone-800">Community Market</h2>
        <button (click)="showForm.set(!showForm())" class="bg-stone-900 text-white px-6 py-2 rounded-lg">
          {{ showForm() ? 'Cancel' : 'Post Item' }}
        </button>
      </div>

      @if (showForm()) {
        <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-stone-200">
          <form (ngSubmit)="submitListing()" class="grid md:grid-cols-2 gap-4">
            <input [(ngModel)]="newItem.title" name="title" placeholder="Title" class="p-3 border rounded">
            <input [(ngModel)]="newItem.price" name="price" placeholder="Price" class="p-3 border rounded">
            <input [(ngModel)]="newItem.contactEmail" name="contact" placeholder="Email" class="p-3 border rounded">
            <button type="submit" class="bg-emerald-600 text-white p-3 rounded font-bold">Post Listing</button>
          </form>
        </div>
      }

      <div class="grid md:grid-cols-4 gap-6">
        @for (item of listings(); track item._id) {
          <div class="bg-white p-4 rounded-xl border border-stone-200 hover:shadow-md transition-shadow">
            <div class="text-4xl mb-4 bg-stone-50 h-32 flex items-center justify-center rounded-lg">{{ item.emoji || '📦' }}</div>
            <h3 class="font-bold text-lg truncate">{{ item.title }}</h3>
            <div class="flex justify-between mt-2">
              <span class="text-emerald-600 font-bold">{{ item.price }}</span>
              <span class="text-xs text-stone-400">{{ item.condition }}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class MarketplaceComponent implements OnInit {
  private api = inject(EcoApiService);
  
  listings = signal<MarketListing[]>([]);
  showForm = signal(false);
  newItem: any = { title: '', price: '', contactEmail: '', condition: 'Good', emoji: '📦' };

  ngOnInit() {
    this.loadListings();
  }

  loadListings() {
    this.api.getListings().subscribe(data => this.listings.set(data));
  }

  submitListing() {
    this.api.createListing(this.newItem).subscribe(created => {
      this.listings.update(prev => [created, ...prev]);
      this.showForm.set(false);
    });
  }
}