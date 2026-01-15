import { Routes } from '@angular/router';
import { AnalyzerComponent } from './features/analyzer/analyzer.component';
import { MarketplaceComponent } from './features/marketplace/marketplace.component';

export const routes: Routes = [
  { path: '', redirectTo: 'analyzer', pathMatch: 'full' },
  { path: 'analyzer', component: AnalyzerComponent },
  { path: 'marketplace', component: MarketplaceComponent }
];