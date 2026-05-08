# ⚽ Figurinhas Copa do Mundo 2026 — API

API REST para gerenciar seu álbum de figurinhas da Copa do Mundo 2026!

## 📋 Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/v1/figurinhas` | Listar todas as figurinhas |
| `POST` | `/api/v1/figurinhas` | Cadastrar nova figurinha |
| `GET` | `/api/v1/figurinhas/:id` | Buscar figurinha por ID |
| `DELETE` | `/api/v1/figurinhas/:id` | Remover figurinha do álbum |
| `GET` | `/api/v1/figurinhas/repetidas/contagem` | Contar figurinhas repetidas |

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/figurinhas-copa2026.git
cd figurinhas-copa2026

# Instale as dependências
npm install

# Configure o .env
cp .env.example .env
# Edite o .env com sua API Key

# Rode o servidor
npm run dev
```

O servidor vai subir em `http://localhost:3000`.

## 🔑 Autenticação

Todas as rotas exigem o header `x-api-key`:

```bash
curl -H "x-api-key: minha-chave-secreta" http://localhost:3000/api/v1/figurinhas
```

## 📖 Exemplos de uso

### Listar figurinhas

```bash
curl -H "x-api-key: minha-chave-secreta" \
  "http://localhost:3000/api/v1/figurinhas?selecao=Brasil"
```

### Cadastrar figurinha

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: minha-chave-secreta" \
  -d '{"codigo":"BRA-010","jogador":"Vinicius Jr.","selecao":"Brasil","posicao":"Atacante","raridade":"lendaria"}' \
  http://localhost:3000/api/v1/figurinhas
```

### Remover figurinha

```bash
curl -X DELETE \
  -H "x-api-key: minha-chave-secreta" \
  http://localhost:3000/api/v1/figurinhas/fig_001
```

### Contar repetidas

```bash
curl -H "x-api-key: minha-chave-secreta" \
  http://localhost:3000/api/v1/figurinhas/repetidas/contagem
```

## 📄 Documentação OpenAPI

O arquivo `openapi.yaml` contém a especificação completa da API no formato OpenAPI 3.0, compatível com Redocly, Swagger UI e outras ferramentas.

## 🏆 Copa do Mundo 2026

A Copa do Mundo 2026 será realizada nos Estados Unidos, Canadá e México — a primeira edição com 48 seleções participantes!

---

Feito com ❤️ para os colecionadores de figurinha!
