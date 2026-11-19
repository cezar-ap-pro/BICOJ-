import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Profissional, Bico } from '../../models/product';

@Component({
  selector: 'app-product-list', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private api = inject(ProductService);
  profissionais = signal<Profissional[]>([]);
  bicos = signal<Bico[]>([]);
  carregando = signal(false);
  erro = signal('');
  busca = '';
  categoria = '';
  categorias = signal<{id:number;nome:string}[]>([]);
  perguntas = [
    {pergunta:'Como funciona a segurança dos pagamentos?', resposta:'Os pagamentos reais ainda não estão disponíveis neste protótipo acadêmico.'},
    {pergunta:'Os profissionais são verificados?', resposta:'Os profissionais iniciais são exemplos de demonstração. A verificação de identidade será uma funcionalidade futura.'},
    {pergunta:'O cadastro para anunciar bicos é pago?', resposta:'Neste protótipo, a publicação de bicos é gratuita.'},
    {pergunta:'E se houver algum imprevisto no serviço?', resposta:'O atendimento e a resolução de conflitos serão implementados em uma versão futura.'}
  ];
  perguntaAberta = 0;
  ngOnInit() { this.api.listarCategorias().subscribe({next: v => this.categorias.set(v), error: () => this.erro.set('Não foi possível carregar as categorias.')}); this.carregar(); }
  carregar() {
    this.carregando.set(true); this.erro.set('');
    this.api.listarProfissionais(this.busca, this.categoria).subscribe({
      next: dados => {this.profissionais.set(dados); this.carregando.set(false);},
      error: () => {this.erro.set('Não foi possível acessar a API. Confira se backend e banco estão ligados.');this.carregando.set(false);}
    });
    this.api.listarBicos().subscribe({next: dados => this.bicos.set(dados),error: () => {}});
  }
  selecionarCategoria(nome: string) { this.categoria = this.categoria === nome ? '' : nome; this.carregar(); document.getElementById('profissionais')?.scrollIntoView({behavior:'smooth'}); }
}
