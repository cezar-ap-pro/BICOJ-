# BicoJá — Protótipo SPA

**Precisou? Achou. Contratou.**

Projeto acadêmico inspirado no Figma e no PDF: Angular 19 + Node.js/Express + PostgreSQL + Docker Compose.

## Estrutura

- `front-end/`: SPA Angular, componentes, rotas, formulários e estilos.
- `backend/`: API REST Express, conexão PostgreSQL e rotas.
- `db/init.sql`: esquema e dados ilustrativos.
- `docker-compose.yml`: serviços.
- `.gitignore` e `.env.example`: configuração.

## Execução no GitHub Codespaces

1. Envie o conteúdo da pasta `BicoJa` à raiz do seu repositório.
2. Abra o terminal e execute `docker compose version`.
3. Se estiver disponível, execute `docker compose up --build`.
4. Na aba **Ports**, abra a porta **5173** no navegador.
5. Acesse a interface e teste a busca, o cadastro e a publicação de bicos.

A API fica acessível por `/api` no mesmo endereço do frontend. Teste `/api/health` e `/api/profissionais`.

## Funcionalidades

- Navegação SPA com Angular Router.
- Busca e filtro de profissionais cadastrados.
- Formulários para cadastro de profissional e publicação de bico.
- Dados persistidos no PostgreSQL.
- Seções de apresentação, categorias, FAQ e layout responsivo.

## Limitações e segurança

Protótipo acadêmico, **não** plataforma pronta para produção. Não há login real, pagamentos, verificação de identidade, chat nem controle de autorização. Não utilize dados pessoais reais. Profissionais iniciais são fictícios. Não exponha banco de dados ou backend diretamente na internet. Configure credenciais fortes antes de qualquer implantação. O script SQL é executado apenas na primeira criação do volume do banco.

Os arquivos foram organizados e verificados estaticamente, mas a aplicação completa ainda precisa ser executada e testada no seu Codespaces.

## Autoria

BicoJá — Cézar Antônio e Jeniffer Gabriele
