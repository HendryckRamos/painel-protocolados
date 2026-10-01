# Painel de Protocolados - DPE/PA Belém (Setembro/2026)

Este projeto contém o painel interativo com os dados de produtividade e análise de matérias (Família vs. Cível) da Defensoria Pública do Estado do Pará (Comarca de Belém), com destaque para o **NIES (Núcleo das Instituições de Ensino Superior)** e o **Núcleo de Família**.

---

## 📁 Estrutura de Arquivos da Pasta

```
painel-protocolados/
├── index.html   # Estrutura visual da aplicação (páginas, abas e tabelas)
├── style.css    # Design moderno, responsivo com tema dark e glassmorphism
├── data.js      # Base com todos os 474 processos de setembro/2026
├── app.js       # Lógica dinâmica das abas, filtros e comparador
└── README.md    # Instruções de publicação e uso
```

---

## 🚀 Como Executar Localmente

Basta dar um duplo clique no arquivo [`index.html`](index.html) para abrir diretamente em qualquer navegador (Google Chrome, Microsoft Edge, Firefox, Safari).

*Não é necessário instalar nenhum servidor web ou software adicional.*

---

## 🌐 Como Colocar Online

### Opção 1: GitHub Pages (Gratuito e Simples)
1. Crie um repositório no seu GitHub (ex: `painel-protocolados`).
2. Faça o upload de todos os arquivos desta pasta (`index.html`, `style.css`, `data.js`, `app.js`).
3. Vá em **Settings** > **Pages** > em *Branch*, selecione `main` (ou `master`) e clique em **Save**.
4. O GitHub gerará um link público gratuito (ex: `https://seu-usuario.github.io/painel-protocolados/`).

### Opção 2: Netlify Drop (Em 10 segundos, sem login obrigatório)
1. Acesse [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arraste a pasta inteira `painel-protocolados` para a tela.
3. Pronto! O site ficará no ar instantaneamente com um link público que você pode compartilhar.

### Opção 3: Vercel
1. Acesse [vercel.com](https://vercel.com).
2. Importe o repositório ou faça deploy estático da pasta.

---

## 📊 Regras e Ajustes de Negócio
- **Interdição / Curatela (58):** Enquadrada na matéria **Cível** (conforme instrução).
- **Alimentos, Divórcios e Guardas:** Matéria de **Família**.
- **Reclamações Pré-Processuais e Homologações:** Procedimentos de conciliação e mediação do Núcleo da Família / NAEFA.
