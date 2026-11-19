/** Contratos compatíveis com a API Node.js/Express do BicoJá. */
export interface Categoria { id:number; nome:string; }
export interface Profissional { id:number; nome:string; especialidade:string; categoria:string; cidade:string; valor_hora:number; }
export interface Bico { id:number; titulo:string; descricao:string; categoria:string; cidade:string; orcamento:number; status:string; criado_em:string; }
export interface NovoProfissional { nome:string; especialidade:string; cidade:string; categoria_id:number; valor_hora:number; }
export interface NovoBico { titulo:string; descricao:string; cidade:string; categoria_id:number; orcamento:number; }
