import { Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { LobbyComponent } from './lobby/lobby.component';

export const routes: Routes = [
  {
    path: '',
    component: LobbyComponent,
  },
  {
    path: 'details/:userId',
    component: DetailsComponent,
  },
];
