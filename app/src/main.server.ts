import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationRef } from '@angular/core';
import { AppComponent } from './app/app.component';
import { appConfigServer } from './app/app.config.server';

export default function bootstrap(): Promise<ApplicationRef> {
  return bootstrapApplication(AppComponent, appConfigServer);
}
