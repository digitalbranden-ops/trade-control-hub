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

### 4.1 - Criar conta no GitHub (se não tiver):
1. Acesse: https://github.com
2. Clique em **"Sign up"**
3. Preencha email, senha e nome de usuário
4. Confirme o email

### 4.2 - Conectar Lovable ao GitHub:

**No Lovable (onde você está agora):**

1. Olhe no canto superior direito, clique no ícone de **engrenagem (⚙️ Settings)**
2. Na janela que abrir, clique na aba **"GitHub"** no menu lateral esquerdo
3. Clique no botão verde **"Connect to GitHub"**
4. Uma nova janela vai abrir pedindo para fazer login no GitHub - faça login
5. Clique em **"Authorize Lovable"** (autorizar)
6. Volte para o Lovable
7. Clique no botão **"Create Repository"**
8. Escolha um nome para o repositório (ex: "trading-panel")
9. Clique em **"Create"**
10. **AGUARDE** - vai aparecer "Syncing..." e depois um ✓ verde

**✅ PRONTO! Agora seu código JÁ ESTÁ no GitHub!**

### 4.3 - Copiar o link do repositório:

1. Ainda na aba GitHub do Lovable, você verá o nome do repositório criado
2. Clique nele - vai abrir o GitHub no navegador
3. Na página do GitHub, clique no botão verde **"<> Code"**
4. Copie o link HTTPS (será algo como: `https://github.com/SEU_USUARIO/trading-panel.git`)

### 4.4 - Baixar o código no seu computador:

1. Abra o **Prompt de Comando** (digite "cmd" na busca do Windows)
2. Digite este comando para ir para a Área de Trabalho:
```
cd Desktop
```
3. Digite o comando abaixo, **COLE o link que você copiou** no lugar indicado:
```
git clone COLE_O_LINK_AQUI
```

**Exemplo real:**
```
git clone https://github.com/joao123/trading-panel.git
```

4. Pressione **Enter** e aguarde baixar
5. Entre na pasta do projeto:
```
cd trading-panel
```

**✅ PRONTO! O código está no seu computador!**

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
