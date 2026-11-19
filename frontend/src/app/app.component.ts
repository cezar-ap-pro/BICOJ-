import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly api = inject(ProductService);
  readonly mensagemApi = signal('');
  readonly verificando = signal(false);

  testarConexao(): void {
    this.verificando.set(true);
    this.mensagemApi.set('Verificando conexão...');
    this.api.verificarServidor().subscribe({
      next: () => {
        this.mensagemApi.set('API respondeu! Backend acessível.');
        this.verificando.set(false);
      },
      error: () => {
        this.mensagemApi.set('Não foi possível acessar a API. Verifique se o backend está em execução.');
        this.verificando.set(false);
      }
    });
  }
}
