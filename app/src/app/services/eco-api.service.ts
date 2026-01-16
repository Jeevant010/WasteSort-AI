import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface AnalysisResult {
  disposal_method: string;
  bin_color: string;
  handling_instructions: string;
  environmental_impact: string;
  sdg_connection?: string;
}

export interface MarketListing {
  _id?: string;
  title: string;
  price: string;
  condition: string;
  contact: string;
  emoji?: string;
}

@Injectable({ providedIn: 'root' })
export class EcoApiService {

  // This points to the Node.js backend on the same domain
  private apiUrl = '/api';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  analyzeItem(item: string): Observable<AnalysisResult> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post<AnalysisResult>(`${this.apiUrl}/analyze`, { item });
    }
    return of({} as AnalysisResult);
  }

  getListings(): Observable<MarketListing[]> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.get<MarketListing[]>(`${this.apiUrl}/listings`);
    }
    return of([]);
  }

  createListing(listing: MarketListing): Observable<MarketListing> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post<MarketListing>(`${this.apiUrl}/listings`, listing);
    }
    return of({} as MarketListing);
  }
}
