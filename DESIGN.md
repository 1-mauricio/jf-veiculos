---
name: JF Veículos
description: O pátio da loja na tela do celular, com o preço escrito no vidro de cada moto.
colors:
  asphalt-950: "#101214"
  asphalt-900: "#16191B"
  asphalt-800: "#1E2225"
  glass-700: "#262D31"
  glass-500: "#4A565C"
  concrete-300: "#C9C7C1"
  concrete-200: "#DDDAD3"
  concrete-100: "#E9E7E2"
  concrete-50: "#F4F3EF"
  posca-white: "#F7F7F2"
  posca-yellow: "#F6E23A"
  posca-yellow-ink: "#5C5000"
  text-secondary: "#4E5559"
typography:
  display:
    fontFamily: "'Archivo', ui-sans-serif, sans-serif"
    fontSize: "clamp(36px, 5vw, 56px)"
    fontWeight: 800
    lineHeight: 1.02
  headline:
    fontFamily: "'Archivo', ui-sans-serif, sans-serif"
    fontSize: "clamp(26px, 3.4vw, 36px)"
    fontWeight: 800
    lineHeight: 1.08
  title:
    fontFamily: "'Archivo', ui-sans-serif, sans-serif"
    fontSize: "18px"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "'Archivo', ui-sans-serif, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  body-lg:
    fontFamily: "'Archivo', ui-sans-serif, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Archivo', ui-sans-serif, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    letterSpacing: "0.04em"
  hand:
    fontFamily: "'Permanent Marker', 'Marker Felt', cursive"
    fontSize: "34px"
    fontWeight: 400
    lineHeight: 1
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "6": "24px"
  "8": "32px"
  "10": "40px"
  "14": "56px"
components:
  button-whatsapp:
    backgroundColor: "{colors.posca-yellow}"
    textColor: "{colors.asphalt-900}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "58px"
  button-dark:
    backgroundColor: "{colors.asphalt-900}"
    textColor: "{colors.posca-white}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "48px"
  button-outline:
    textColor: "{colors.asphalt-900}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "48px"
  vehicle-card:
    backgroundColor: "{colors.concrete-50}"
    rounded: "{rounded.lg}"
    padding: "12px 14px 14px"
  price-on-glass:
    textColor: "{colors.posca-white}"
    typography: "{typography.hand}"
  search-field:
    backgroundColor: "{colors.concrete-50}"
    textColor: "{colors.asphalt-900}"
    rounded: "{rounded.md}"
    height: "48px"
  shortcut-tab:
    textColor: "{colors.asphalt-900}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "44px"
  header:
    backgroundColor: "{colors.asphalt-900}"
    textColor: "{colors.posca-white}"
---

# Design System: JF Veículos

## Overview

**Creative North Star: "Preço no Para-brisa"**

O site é o pátio da loja. Em revenda de bairro, o preço vai escrito à mão, com caneta posca, direto no vidro do veículo: grande, torto, amarelo e branco. Este sistema faz o mesmo com cada moto. A foto é o vidro. O preço, o modelo e o recado ("revisada · laudo ok") são escritos por cima dela com letra de pincel. Todo o resto é letreiro de loja, em caixa alta condensada, sem enfeite.

A tela tem dois chãos: concreto claro de dia e asfalto à noite (o botão de tema alterna). O vidro, o cabeçalho, a vitrine do topo e o rodapé são sempre escuros, porque são os lugares onde a posca aparece. A cor de destaque é a tinta da posca: amarelo por padrão, trocável pela equipe em /admin > Aparência.

Este sistema substitui o anterior (cards brancos arredondados, botões em pílula, ícones em quadradinhos, gradientes). Ele recusa o padrão de "site gerado": nada de selo acima do título, nada de linha de três cartões com ícone, nada de número grande com legenda pequena no topo.

**Key Characteristics:**
- O preço de cada veículo é escrito à mão sobre a foto, nunca num rótulo cinza abaixo.
- Uma tinta só (posca), sempre sobre escuro ou como fundo inteiro com texto escuro.
- Títulos em Archivo 800 condensado e em caixa alta. A letra de pincel fica só para preço, modelo e recados curtos.
- Cantos secos (4–8px), sem sombra difusa e sem pílulas.
- O botão principal é sempre a barra de posca do WhatsApp, larga e alta.

## Colors

Asfalto, vidro, concreto e uma tinta.

### Primary
- **Posca Amarela** (#F6E23A): barra do WhatsApp, faixa de venda/troca, selo "220 itens checados", contador de favoritos, borda inferior do cabeçalho, sublinhado de links e seleção de texto. Em texto, só sobre fundo escuro. O token é `--accent`, definido pelo tema do CMS.
- **Tinta da Posca no Claro** (#5C5000): versão escura da tinta, para textos e números de destaque sobre o concreto claro (`--accent-strong`).

### Neutral
- **Asfalto** (#16191B / #101214 / #1E2225): cabeçalho, vitrine do topo, rodapé, chão do tema escuro e texto principal no tema claro.
- **Vidro** (#262D31 / #4A565C): fundo de foto, painel de destaque e botões flutuantes sobre a foto.
- **Concreto** (#E9E7E2 chão, #F4F3EF cartões, #DDDAD3 / #C9C7C1 linhas): o chão do tema claro.
- **Posca Branca** (#F7F7F2): preço escrito no vidro e texto sobre escuro.
- **Grafite** (#4E5559): texto secundário no claro.

### Named Rules
**The One Ink Rule.** A tela tem uma tinta só: a cor de posca do tema. Use sempre `--accent` e `--on-accent`, nunca um hex fixo, ou a troca de tema no CMS quebra.

**The Ink Needs Dark Rule.** A posca nunca vira texto sobre o concreto claro. Ou ela é o fundo (com `--on-accent` por cima), ou é texto sobre asfalto ou vidro.

## Typography

**Display/Body Font:** Archivo (largura variável 75–100, pesos 400–900)
**Hand Font:** Permanent Marker (a caneta da loja), fixa em `--font-hand`

**Character:** Letreiro e caneta. Archivo condensado em caixa alta faz a voz de placa da loja. A letra de pincel é a mão de quem escreve o preço no vidro.

### Hierarchy
- **Display** (800, clamp 36–56px, 1.02, `font-stretch: 80%`, caixa alta): título da vitrine e títulos de página.
- **Headline** (800, clamp 26–36px, 1.08, condensado, caixa alta): títulos de seção (`.jf-h2`).
- **Title** (800, 18px, condensado, caixa alta): nome do veículo no card ("HONDA" em cinza e o modelo em preto).
- **Body** (400, 15–17px, 1.5): textos corridos, com no máximo 65ch.
- **Label** (700–800, 13–15px, tracking 0.03–0.08em, caixa alta): botões, atalhos e navegação.
- **Hand** (Permanent Marker, 34px no card, 48–92px na vitrine, girado de −2° a −4°): preço, modelo/ano e recados.

### Named Rules
**The Price Is Handwritten Rule.** Todo preço visível de veículo é escrito em `--font-hand`, levemente torto, sobre a foto ou num cartão. Nunca em Archivo.

**The Pen Is Rare Rule.** A letra de pincel só aparece em preço, modelo, recado curto e numeração. Nunca em parágrafos, botões ou navegação.

## Layout

Container de 1240px com margens de 24px (16px no celular). As seções ficam a 56px uma da outra (44px no celular). A vitrine divide o topo em 1.35fr de foto e 1fr de texto. Abaixo de 980px ela empilha, com a foto em cima. A grade de veículos tem 4 colunas, depois 3 (1100px), 2 (980px) e 1 (620px). No celular, o card é vertical, com a foto 4:3 em largura total. Os atalhos de estoque e os depoimentos rolam na horizontal.

## Elevation & Depth

Sem sombras difusas. A profundidade vem do contraste entre chão e vidro: painéis escuros sobre concreto claro e um reflexo diagonal (faixa branca a 10–13% de opacidade) no canto da foto. Um escurecimento de baixo para cima garante que a posca leia sobre qualquer foto.

### Named Rules
**The Glass Not Shadow Rule.** Para destacar algo, use vidro escuro ou borda de 1–2px, nunca `box-shadow` difuso.

## Shapes

Cantos secos: 4px em selos e botões internos, 6px em botões e campos, 8px em cards e painéis. Nada de pílulas. A única forma inclinada é a escrita à mão (de −1,5° a −5°). As caixas ficam retas.

## Components

### Buttons
- **WhatsApp (principal):** barra de posca em largura total no celular, 58px de altura, Archivo 800 em caixa alta, ícone do WhatsApp em `currentColor`. O hover mistura 12–14% de escuro na tinta.
- **Dark:** asfalto com texto em posca branca. Usado sobre a faixa amarela.
- **Outline:** borda de 2px na cor do texto. O hover inverte as cores.
- **Focus:** contorno de 2px em `--focus-ring` (asfalto no claro, posca no escuro).

### Vehicle Card
- Foto 4:3 com reflexo e escurecimento. O preço é escrito à mão no canto inferior esquerdo, com um traço que aparece ao entrar na tela (`.jf-write`).
- Botão de favorito quadrado de 44px sobre a foto. As setas da galeria só aparecem no hover.
- O corpo tem a marca em cinza, o modelo em caixa alta e, abaixo, "ano · km · câmbio" numa linha só, sem chips.
- O preço tem uma cópia acessível no corpo, porque a camada sobre a foto fica `aria-hidden`.

### Search & Shortcuts
- Campo de busca com borda de 2px na cor do texto, botão "Buscar" em asfalto e anel de posca ao focar.
- Atalhos ("Motos 12", "Até R$ 20 mil 7") em abas retangulares de 44px, com contagem em `tabular-nums`.

### Ficha (por que comprar aqui)
- Lista numerada à mão ("1.", "2.", "3.") com título em caixa alta e descrição, ao lado do selo de posca "220 itens checados", levemente torto.

### Navigation
- Cabeçalho de asfalto, sempre escuro, com 3px de posca embaixo. Nome da loja em caixa alta condensada e tagline à mão em posca. Links em caixa alta com sublinhado de posca no hover. No celular, menu sanfonado com links grandes separados por linhas.

## Do's and Don'ts

### Do:
- **Do** escrever o preço à mão sobre a foto em todo lugar onde um veículo aparece.
- **Do** usar `--accent` / `--on-accent` / `--accent-strong` para a tinta, nunca um hex fixo.
- **Do** manter a barra de WhatsApp em posca como a ação mais visível de cada tela.
- **Do** manter alvos de toque de 44px ou mais.
- **Do** respeitar `prefers-reduced-motion`: o traço do preço aparece sem animação.

### Don't:
- **Don't** colocar selo pequeno acima de título (eyebrow).
- **Don't** fazer fileiras de cartões iguais com ícone, título e texto.
- **Don't** usar pílulas, sombras difusas, gradientes decorativos ou glifos (✓, ★) no lugar de ícones.
- **Don't** usar a letra de pincel em parágrafos, botões ou menus.
- **Don't** colocar texto em posca sobre o concreto claro.
