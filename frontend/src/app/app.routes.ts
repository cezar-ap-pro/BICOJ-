import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';

export const routes: Routes = [
  {path:'', component:ProductListComponent, title:'BicoJá — Encontre profissionais'},
  {path:'publicar', component:ProductFormComponent, data:{modo:'bico'}, title:'Publicar bico — BicoJá'},
  {path:'cadastrar-profissional', component:ProductFormComponent, data:{modo:'profissional'}, title:'Cadastro profissional — BicoJá'},
  {path:'**', redirectTo:''}
];
