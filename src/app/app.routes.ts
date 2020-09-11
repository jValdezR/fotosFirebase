import { Routes,RouterModule } from '@angular/router';
import { FotosComponent } from './components/fotos/fotos.component';
import { cargaComponent } from './components/carga/carga.component';


const RUTAS: Routes = [
    {path: 'fotos', component: FotosComponent},
    {path: 'carga', component: cargaComponent},
    {path: '**', pathMatch: 'full' , redirectTo: 'fotos'}
];

export const APP_ROUTES = RouterModule.forRoot(RUTAS)