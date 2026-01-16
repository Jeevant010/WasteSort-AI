import { Injectable, inject, PLATFORM_ID } from '@angular/core';
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
  sellerId?: string;
  sellerName?: string;
}

@Injectable({ providedIn: 'root' })
export class EcoApiService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  // TODO: after backend deploy on Render, set your real URL here
  private readonly PROD_API = 'https://YOUR-RENDER-SERVICE.onrender.com/api';

  private apiUrl =
    isPlatformBrowser(this.platformId)
      ? (location.hostname === 'localhost' ? 'http://localhost:3000/api' : this.PROD_API)
      : this.PROD_API;

  analyzeItem(item: string): Observable<AnalysisResult> {
    if (isPlatformBrowser(this.platformId)) {
      return this.http.post<AnalysisResult>(`${this.apiUrl}/analyze`, { item });
    }
    return of({} as AnalysisResult);
  }
  getListings(): Observable<MarketListing[]> {
    if (isPlatformBrowser(this.platformId)) return this.http.get<MarketListing[]>(`${this.apiUrl}/listings`);
    return of([]);
  }
  createListing(listing: MarketListing): Observable<any> {
    if (isPlatformBrowser(this.platformId)) return this.http.post(`${this.apiUrl}/listings`, listing);
    return of(null);
  }
  getChallengeProgress(): Observable<number[]> {
    if (isPlatformBrowser(this.platformId)) return this.http.get<number[]>(`${this.apiUrl}/challenge`);
    return of([]);
  }
  updateChallenge(day: number, completed: boolean): Observable<any> {
    if (isPlatformBrowser(this.platformId)) return this.http.post(`${this.apiUrl}/challenge`, { day, completed });
    return of(null);
  }
  calculateCarbon(data: any): Observable<{score: number}> {
    if (isPlatformBrowser(this.platformId)) return this.http.post<{score: number}>(`${this.apiUrl}/carbon`, data);
    return of({score: 0});
  }
  getNews(): Observable<any[]> {
    if (isPlatformBrowser(this.platformId)) return this.http.get<any[]>(`${this.apiUrl}/news`);
    return of([]);
  }
  getEvents(): Observable<any[]> {
    if (isPlatformBrowser(this.platformId)) return this.http.get<any[]>(`${this.apiUrl}/events`);
    return of([]);
  }
  submitVolunteer(data: any): Observable<any> {
    if (isPlatformBrowser(this.platformId)) return this.http.post(`${this.apiUrl}/volunteer`, data);
    return of(null);
  }
  sendMessage(data: any): Observable<any> {
    if (isPlatformBrowser(this.platformId)) return this.http.post(`${this.apiUrl}/contact`, data);
    return of(null);
  }
}