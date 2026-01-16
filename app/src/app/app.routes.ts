import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AnalyzerComponent } from './features/analyzer/analyzer.component';
import { MarketplaceComponent } from './features/marketplace/marketplace.component';
import { 
  SdgComponent, NewsComponent, EventsComponent, ChallengeComponent, 
  CarbonComponent, QuizComponent, VolunteerComponent, AboutComponent, ContactComponent 
} from './features/pages/pages.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'analyzer', component: AnalyzerComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'sdg', component: SdgComponent },
  { path: 'news', component: NewsComponent },
  { path: 'events', component: EventsComponent },
  { path: 'challenge', component: ChallengeComponent },
  { path: 'carbon', component: CarbonComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'volunteer', component: VolunteerComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent }
];