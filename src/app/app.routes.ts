import { Routes } from '@angular/router';
import { Home } from './home';
import { Generator } from './generator';
import { Assessment } from './assessment';
import { Translation } from './translation';
import { MediaStudio } from './media-studio';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'generator', component: Generator },
  { path: 'assessment', component: Assessment },
  { path: 'translation', component: Translation },
  { path: 'media-studio', component: MediaStudio },
  { path: '**', redirectTo: '' }
];
