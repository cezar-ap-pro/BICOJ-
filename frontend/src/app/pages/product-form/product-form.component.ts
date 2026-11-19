
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  private api = inject(ProductService);
  private router = inject(Router);

  modo = inject(ActivatedRoute).snapshot.data['modo'] as
    'bico' | 'profissional';

  categorias = signal<{ id: number; nome: string }[]>([]);
  enviando = signal(false);
  erro = signal('');

  dados = {
    nome: '',
    especialidade: '',
    titulo: '',
    descricao: '',
    cidade: '',
    categoria_id: 0,
    valor: 0
  };

  constructor() {
    this.api.listarCategorias().subscribe({
      next: categorias => this.categorias.set(categorias),
      error: () => {
        this.erro.set(
          'Não foi possível carregar as categorias. Verifique a API.'
        );
      }
    });
  }

  salvar(): void {
    this.erro.set('');

    if (
      !this.dados.categoria_id ||
      !this.dados.cidade.trim() ||
      this.dados.valor < 0
    ) {
      this.erro.set(
        'Preencha cidade, categoria e valor corretamente.'
      );
      return;
    }

    this.enviando.set(true);

    const pedido: Observable<unknown> =
      this.modo === 'profissional'
        ? this.api.cadastrarProfissional({
            nome: this.dados.nome,
            especialidade: this.dados.especialidade,
            cidade: this.dados.cidade,
            categoria_id: Number(this.dados.categoria_id),
            valor_hora: Number(this.dados.valor)
          })
        : this.api.publicarBico({
            titulo: this.dados.titulo,
            descricao: this.dados.descricao,
            cidade: this.dados.cidade,
            categoria_id: Number(this.dados.categoria_id),
            orcamento: Number(this.dados.valor)
          });

    pedido.subscribe({
      next: () => {
        this.enviando.set(false);

        this.router.navigate(['/'], {
          fragment: 'profissionais'
        });
      },
      error: (e: HttpErrorResponse) => {
        this.erro.set(
          e.error?.erro ||
          'Erro ao salvar. Verifique o backend e os dados.'
        );

        this.enviando.set(false);
      }
    });
  }
}
