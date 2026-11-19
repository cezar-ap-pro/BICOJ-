import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bico, Categoria, NovoBico, NovoProfissional, Profissional } from '../models/product';
@Injectable({providedIn:'root'})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = '/api';
  verificarServidor(): Observable<unknown> { return this.http.get(`${this.baseUrl}/health`); }
  listarCategorias(): Observable<Categoria[]> { return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`); }
  listarProfissionais(busca='', categoria=''): Observable<Profissional[]> {
    let params = new HttpParams();
    if (busca.trim()) params = params.set('busca', busca.trim());
    if (categoria) params = params.set('categoria', categoria);
    return this.http.get<Profissional[]>(`${this.baseUrl}/profissionais`,{params});
  }
  cadastrarProfissional(dados:NovoProfissional): Observable<Profissional> { return this.http.post<Profissional>(`${this.baseUrl}/profissionais`,dados); }
  listarBicos(): Observable<Bico[]> { return this.http.get<Bico[]>(`${this.baseUrl}/bicos`); }
  publicarBico(dados:NovoBico): Observable<Bico> { return this.http.post<Bico>(`${this.baseUrl}/bicos`,dados); }
}
