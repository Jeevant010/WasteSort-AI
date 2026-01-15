import { Routes } from '@angular/router';
import { AnalyzerComponent } from './components/analyzer/analyzer.component';
import { MarketplaceComponent } from './components/marketplace/marketplace.component';

export const routes: Routes = [
  { path: '', redirectTo: 'analyzer', pathMatch: 'full' },
  { path: 'analyzer', component: AnalyzerComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  // Add other routes here (SDG, Login, Premium, etc.)
];