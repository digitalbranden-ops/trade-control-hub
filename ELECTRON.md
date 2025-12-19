# 🖥️ Trade Control Hub - App Desktop

## Instalação das Dependências

Execute no terminal:

```bash
npm install electron electron-builder concurrently wait-on --save-dev
```

## Adicionar Scripts ao package.json

Adicione estes scripts no seu `package.json`:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:8080 && electron .\"",
    "electron:build": "npm run build && electron-builder",
    "electron:preview": "npm run build && electron ."
  }
}
```

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run electron:dev` | Abre o app em modo desenvolvimento (com hot-reload) |
| `npm run electron:preview` | Testa o app com os arquivos de produção |
| `npm run electron:build` | Gera o instalador `.exe` na pasta `release/` |

## Modo Desenvolvimento

```bash
npm run electron:dev
```

Isso vai:
1. Iniciar o servidor Vite na porta 8080
2. Esperar o servidor estar pronto
3. Abrir a janela do Electron
4. Abrir o DevTools automaticamente

## Gerar Instalador

```bash
npm run electron:build
```

Isso vai:
1. Fazer o build do React (`npm run build`)
2. Empacotar tudo com Electron Builder
3. Gerar o instalador em `release/Trade Control Hub Setup.exe`

## Estrutura de Arquivos

```
projeto/
├── electron/
│   ├── main.js      # Processo principal do Electron
│   └── preload.js   # Script de segurança (bridge)
├── electron-builder.json  # Configuração do instalador
├── dist/            # Build do React (gerado)
└── release/         # Instaladores (gerado)
```

## Ícone do App

O ícone está em `public/pwa-512x512.png`. Para um ícone melhor no Windows:
1. Crie um arquivo `.ico` com várias resoluções
2. Coloque em `build/icon.ico`
3. Atualize o `electron-builder.json`

## Integração com o Bot Python

O app já está preparado para comunicar com o bot Python via:
- HTTP API (atual): `http://127.0.0.1:5000`
- IPC (futuro): Comunicação direta via `preload.js`

## Troubleshooting

### Erro: "ERR_CONNECTION_REFUSED"
O servidor Vite não está rodando. Use `npm run electron:dev` que inicia ambos.

### Erro: "Cannot find module 'electron'"
Execute: `npm install electron --save-dev`

### App abre em branco
Verifique se fez o build: `npm run build`
