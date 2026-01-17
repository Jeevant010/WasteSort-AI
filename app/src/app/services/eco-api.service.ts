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

class EcoApiService {
  // Production API points to your Render backend
  private readonly PROD_API = 'https://wastesort-ai-8pj9.onrender.com/api';

  private getApiUrl(): string {
    if (typeof window === 'undefined') return this.PROD_API;
    return window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : this.PROD_API;
  }

  async analyzeItem(item: string): Promise<AnalysisResult> {
    const response = await fetch(`${this.getApiUrl()}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item }),
    });
    return response.json();
  }

  async getListings(): Promise<MarketListing[]> {
    const response = await fetch(`${this.getApiUrl()}/listings`);
    return response.json();
  }

  async createListing(listing: MarketListing): Promise<any> {
    const response = await fetch(`${this.getApiUrl()}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing),
    });
    return response.json();
  }

  async getChallengeProgress(): Promise<number[]> {
    const response = await fetch(`${this.getApiUrl()}/challenge`);
    return response.json();
  }

  async updateChallenge(day: number, completed: boolean): Promise<any> {
    const response = await fetch(`${this.getApiUrl()}/challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, completed }),
    });
    return response.json();
  }

  async calculateCarbon(data: any): Promise<{ score: number }> {
    const response = await fetch(`${this.getApiUrl()}/carbon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async getNews(): Promise<any[]> {
    const response = await fetch(`${this.getApiUrl()}/news`);
    return response.json();
  }

  async getEvents(): Promise<any[]> {
    const response = await fetch(`${this.getApiUrl()}/events`);
    return response.json();
  }

  async submitVolunteer(data: any): Promise<any> {
    const response = await fetch(`${this.getApiUrl()}/volunteer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async sendMessage(data: any): Promise<any> {
    const response = await fetch(`${this.getApiUrl()}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

export const ecoApiService = new EcoApiService();
