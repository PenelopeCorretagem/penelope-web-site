# Instruções de Especialista: Projeto PENELOPE-WEB-SITE

Você é o Especialista de IA para o projeto **PENELOPE-WEB-SITE**, uma plataforma de gestão imobiliária. Seu objetivo é gerar código que siga rigorosamente a arquitetura MVVM, os padrões de nomenclatura e a stack tecnológica definida.

## 🛠 Stack Tecnológica
- **Framework:** React 18 (Componentes Funcionais + Hooks)
- **Build Tool:** Vite 7
- **Estilização:** Tailwind CSS 4 (Utility-first, Mobile-first)
- **Roteamento:** React Router DOM 7
- **Comunicação:** Axios (via `@penelopec/axiosInstance`)

## 🏗 Arquitetura Obrigatória (MVVM)
Todo componente complexo ou página deve ser dividido em 3 arquivos:

1.  **Model (`*Model.js`):** Lógica de negócio pura. Use classes com campos privados (`#`) e getters/setters. Sem dependências de React.
2.  **ViewModel (`use*ViewModel.js`):** Hook React. Gerencia estado via `useState(() => new Model())`, lida com `useEffect` e chamadas de API.
3.  **View (`*View.jsx`):** Apresentação pura. Usa Tailwind e consome o hook ViewModel.

## 📏 Regras de Implementação (Invioláveis)

### 1. Nomenclatura e Escrita
- **Idioma:** Código técnico em Inglês, mas **textos de UI e regras de negócio em Português Brasileiro (pt-BR)**.
- **Componentes:** Sempre sufixo `View` (ex: `PropertyCardView.jsx`).
- **Campos Privados:** Sempre use `#` para encapsulamento em classes.

### 2. Estilização (Tailwind 4)
- **Tokens de Cores:** `distac-primary` (#b33c8e), `distac-secondary` (#36221d), `default-light` (#ebe9e9).
- **Fontes:** `font-body` (Poppins), `font-title` (Darker Grotesque).
- **Classes:** Use `clsx` para condicionais. **Nunca** use CSS Modules ou Styled Components.

### 3. Imports (Aliases Vite)
Sempre use caminhos absolutos:
- `@shared`, `@institutional`, `@auth`, `@management`, `@routes`, `@utils`, `@services`, `@api`, `@mapper`, `@entity`, `@constant`.

### 4. Fluxo de Dados
- **Mappers:** Sempre converta a resposta da API para uma Entidade de Domínio usando classes Mapper em `src/app/services/mapper/`.
- **API:** Nunca importe `axios` diretamente. Use `@penelopec/axiosInstance`.
- **Estado:** Evite Redux/Zustand. Use Estado Local + Context API (se necessário) + `sessionStorage`.

## 📂 Estrutura de Pastas Alvo
- `src/app/model/entities/`: Classes de domínio.
- `src/app/services/api/`: Chamadas Axios.
- `src/shared/components/`: Componentes UI reaproveitáveis (Button, Input, etc).

## 🧩 Exemplo de Código Esperado (Model)
```javascript
export class PropertyModel {
  #id; #price;
  constructor({ id, price }) {
    this.#id = id ?? null;
    this.#price = price ?? 0;
  }
  get price() { return this.#price; }
  set price(v) { this.#price = v; }
}
