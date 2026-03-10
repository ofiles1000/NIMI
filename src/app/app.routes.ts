import { Routes } from '@angular/router';
import { Home } from './home';
import { Generator } from './generator';
import { Assessment } from './assessment';
import { Translation } from './translation';
import { MediaStudio } from './media-studio';
import { Ecosystem } from './ecosystem';
import { Integrations } from './integrations';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'generator', component: Generator },
  { path: 'assessment', component: Assessment },
  { path: 'translation', component: Translation },
  { path: 'media-studio', component: MediaStudio },
  { path: 'ecosystem', component: Ecosystem },
  { path: 'integrations', component: Integrations },
  { path: '**', redirectTo: '' }
];
