# JF Veículos

Site da JF Veículos: catálogo de carros e motos seminovos, com painel de edição visual (sem precisar mexer em código) para cadastrar veículos, depoimentos e dados da loja.

## Stack

- **[Astro](https://astro.build)** — gera um site estático (HTML/CSS/JS), rápido e simples de hospedar.
- **[Decap CMS](https://decapcms.org)** — painel de edição em `/admin`, com formulários e upload de fotos. Cada publicação vira um commit no repositório.
- Conteúdo (veículos, depoimentos, dados da loja) fica em `src/content/`, como arquivos JSON.

## Rodando localmente

```sh
npm install
npm run dev
```

Abre em `http://localhost:4321`.

Para testar o painel de edição (`/admin`) localmente, sem precisar de Netlify, rode em outro terminal:

```sh
npx decap-server
```

E acesse `http://localhost:4321/admin/index.html`.

## Estrutura do projeto

```text
public/
  admin/            → painel de edição (Decap CMS): config.yml define os campos
src/
  components/        → componentes reutilizáveis (Header, Footer, VehicleCard, Button, Icon)
  content/
    veiculos/         → um arquivo .json por veículo
    depoimentos/       → um arquivo .json por depoimento
    loja/loja.json     → dados da loja (WhatsApp, endereço, horários...)
  content.config.ts   → define os campos (schema) de cada tipo de conteúdo
  layouts/            → layout base (head, header, footer)
  lib/                → funções auxiliares (formatação de preço, km, link do WhatsApp)
  pages/
    index.astro           → home
    veiculos/index.astro  → listagem com filtros
    veiculos/[slug].astro → página de detalhe de um veículo
    loja.astro             → página institucional da loja
  scripts/            → JS que roda no navegador (filtros da listagem, galeria de fotos)
  styles/tokens/       → cores, tipografia e espaçamentos (identidade visual)
```

## Editando conteúdo

**Pelo painel (recomendado para quem não mexe em código):** acesse `/admin` no site publicado, faça login e edite veículos, depoimentos ou dados da loja por formulário.

**Direto no código:** edite os arquivos `.json` em `src/content/`. Os campos aceitos de cada tipo estão descritos em `src/content.config.ts`.

## Comandos

| Comando           | Ação                                      |
| :----------------- | :----------------------------------------- |
| `npm install`       | Instala as dependências                     |
| `npm run dev`        | Sobe o servidor local em `localhost:4321`    |
| `npm run build`      | Gera o site de produção em `./dist/`         |
| `npm run preview`    | Pré-visualiza o build de produção localmente |
| `npx astro check`   | Checa erros de tipo/template                |

## Deploy

O site é feito para hospedar no [Netlify](https://netlify.com) (build command `npm run build`, pasta `dist`, já configurado em `netlify.toml`). Depois do primeiro deploy, ative **Identity** e **Git Gateway** em Site configuration para o painel `/admin` funcionar em produção, e convide por e-mail quem for editar o conteúdo.
