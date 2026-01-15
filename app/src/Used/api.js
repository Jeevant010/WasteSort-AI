import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define Interfaces matching Backend/DB
export interface AnalysisResult {
  disposal_method: string;
  bin_color: string;
  handling_instructions: string;
  upcycling_ideas: string[];
  environmental_impact: string;
  recyclability_score: number;
  sdg_connection: string;
}

export interface MarketListing {
  _id?: string;
  title: string;
  price: string;
  condition: string;
  emoji: string;
  contactEmail: string;
  sellerId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EcoApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; // Point to Node Backend

  // AI Feature
  analyzeItem(itemName: string): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(`${this.apiUrl}/analyze`, { item: itemName });
  }

  // Marketplace Features (MongoDB)
  getListings(): Observable<MarketListing[]> {
    return this.http.get<MarketListing[]>(`${this.apiUrl}/listings`);
  }

  createListing(listing: MarketListing): Observable<MarketListing> {
    return this.http.post<MarketListing>(`${this.apiUrl}/listings`, listing);
  }

  // Stripe Feature
  createPaymentIntent(): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/create-payment-intent`, {});
  }
}