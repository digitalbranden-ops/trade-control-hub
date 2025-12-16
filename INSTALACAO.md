# Guia Completo de Instalação - Trading Panel

Este guia vai te ajudar a instalar e rodar o painel de trading no seu computador, mesmo sem experiência em programação.

---

## 📋 O que você vai precisar instalar

1. **Node.js** - Para rodar o painel web (frontend)
2. **Git** - Para baixar o código do GitHub
3. **Python** - Para rodar o bot de trading (backend)

---

## 🔧 PASSO 1: Instalar o Node.js

1. Acesse: https://nodejs.org/
2. Clique no botão verde **"LTS"** (versão recomendada)
3. Execute o arquivo baixado
4. Clique em **"Next"** em todas as telas
5. Marque a opção **"Automatically install necessary tools"** se aparecer
6. Clique em **"Install"** e depois **"Finish"**

### ✅ Verificar se instalou corretamente:
1. Abra o **Prompt de Comando** (digite "cmd" na busca do Windows)
2. Digite e pressione Enter:
```
node --version
```
3. Deve aparecer algo como `v20.x.x` ou `v22.x.x`

---

## 🔧 PASSO 2: Instalar o Git

1. Acesse: https://git-scm.com/downloads
2. Clique em **"Windows"** (ou seu sistema operacional)
3. Execute o arquivo baixado
4. Clique em **"Next"** em todas as telas (pode deixar tudo padrão)
5. Clique em **"Install"** e depois **"Finish"**

### ✅ Verificar se instalou corretamente:
1. Abra um **novo** Prompt de Comando
2. Digite e pressione Enter:
```
git --version
```
3. Deve aparecer algo como `git version 2.x.x`

---

## 🔧 PASSO 3: Instalar o Python

1. Acesse: https://www.python.org/downloads/
2. Clique no botão amarelo **"Download Python 3.x.x"**
3. Execute o arquivo baixado
4. **IMPORTANTE**: Marque a caixa **"Add Python to PATH"** na primeira tela!
5. Clique em **"Install Now"**
6. Clique em **"Close"** quando terminar

### ✅ Verificar se instalou corretamente:
1. Abra um **novo** Prompt de Comando
2. Digite e pressione Enter:
```
python --version
```
3. Deve aparecer algo como `Python 3.x.x`

---

## 📥 PASSO 4: Conectar ao GitHub e Baixar o Código

### 4.1 - Conectar o Lovable ao GitHub (faça isso no navegador):
1. No Lovable, clique em **Settings** (engrenagem) no canto superior direito
2. Clique na aba **"GitHub"**
3. Clique em **"Connect to GitHub"**
4. Faça login na sua conta GitHub (ou crie uma em github.com)
5. Autorize o Lovable
6. Clique em **"Create Repository"**
7. Aguarde criar o repositório

### 4.2 - Baixar o código no seu computador:
1. Abra o Prompt de Comando
2. Navegue até onde quer salvar (exemplo: Desktop):
```
cd Desktop
```
3. Clone o repositório (substitua SEU_USUARIO pelo seu usuário do GitHub):
```
git clone https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
```
4. Entre na pasta do projeto:
```
cd NOME_DO_REPOSITORIO
```

---

## 🚀 PASSO 5: Instalar e Rodar o Painel Web (Frontend)

1. No Prompt de Comando, dentro da pasta do projeto, digite:
```
npm install
```
2. Aguarde instalar (pode demorar alguns minutos)
3. Quando terminar, digite:
```
npm run dev
```
4. Vai aparecer uma mensagem com o endereço local
5. Abra o navegador e acesse: **http://localhost:8080**

### 🎉 Pronto! O painel web está rodando!

---

## 🐍 PASSO 6: Configurar o Bot Python (Backend)

O bot Python é o arquivo `server.py` que você já tem. Ele precisa estar na mesma rede/computador.

### 6.1 - Instalar dependências do Python:
Abra um **novo** Prompt de Comando e digite:
```
pip install fastapi uvicorn ccxt python-dotenv websockets
```

### 6.2 - Rodar o bot:
Na pasta onde está o `server.py`, digite:
```
python server.py
```

O bot vai rodar em **http://localhost:5000**

---

## 📁 Estrutura de Pastas Final

```
Seu Desktop/
└── trading-panel/          ← Pasta do painel web (este projeto)
    ├── src/
    ├── package.json
    └── ...

└── seu-bot/                ← Pasta do seu bot Python (separada)
    ├── server.py
    ├── config.json
    └── ...
```

---

## ▶️ Como Usar no Dia a Dia

### Para iniciar tudo:

**Terminal 1 - Painel Web:**
```
cd Desktop/trading-panel
npm run dev
```

**Terminal 2 - Bot Python:**
```
cd Desktop/seu-bot
python server.py
```

**Navegador:**
Acesse http://localhost:8080

---

## 🔴 Solução de Problemas Comuns

### "npm não é reconhecido como comando"
- Reinicie o computador após instalar o Node.js

### "python não é reconhecido como comando"
- Reinstale o Python marcando "Add Python to PATH"
- Ou tente usar `python3` ao invés de `python`

### "git não é reconhecido como comando"
- Reinicie o computador após instalar o Git

### "Erro de conexão com o bot"
- Verifique se o bot Python está rodando na porta 5000
- Verifique se não há firewall bloqueando

### O painel mostra "Falha ao conectar com o bot"
- Isso é normal se o bot Python não estiver rodando
- Inicie o bot com `python server.py`

---

## 📞 Resumo dos Comandos

| Ação | Comando |
|------|---------|
| Instalar dependências web | `npm install` |
| Rodar painel web | `npm run dev` |
| Instalar dependências Python | `pip install fastapi uvicorn ccxt` |
| Rodar bot Python | `python server.py` |

---

## 🎯 Checklist Final

- [ ] Node.js instalado
- [ ] Git instalado  
- [ ] Python instalado
- [ ] Código baixado do GitHub
- [ ] `npm install` executado
- [ ] `npm run dev` funcionando
- [ ] Bot Python configurado
- [ ] `python server.py` funcionando
- [ ] Painel acessível em http://localhost:8080

**Parabéns! Seu sistema está pronto! 🚀**
