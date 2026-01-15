import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AnalysisResult {
  disposal_method: string;
  bin_color: string;
  handling_instructions: string;
  environmental_impact: string;
}

export interface MarketListing {
  _id?: string;
  title: string;
  price: string;
  condition: string;
  contact: string;
}

@Injectable({ providedIn: 'root' })
export class EcoApiService {
  private http = inject(HttpClient);
  
  // This points to the Node.js backend on the same domain
  private apiUrl = '/api'; 

  analyzeItem(item: string): Observable<AnalysisResult> {
    return this.http.post<AnalysisResult>(`${this.apiUrl}/analyze`, { item });
  }

  getListings(): Observable<MarketListing[]> {
    return this.http.get<MarketListing[]>(`${this.apiUrl}/listings`);
  }

  createListing(listing: MarketListing): Observable<MarketListing> {
    return this.http.post<MarketListing>(`${this.apiUrl}/listings`, listing);
  }
}