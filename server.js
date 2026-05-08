const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

// ───────────────────────────────────────────────
// Banco de dados em memória (para fins de demo)
// ───────────────────────────────────────────────
let album = [
  {
    id: "fig_001",
    codigo: "BRA-010",
    jogador: "Vinicius Jr.",
    selecao: "Brasil",
    posicao: "Atacante",
    raridade: "lendaria",
    repetida: false,
    quantidade: 1,
    criadoEm: new Date("2025-05-01T10:00:00Z").toISOString(),
  },
  {
    id: "fig_002",
    codigo: "ARG-010",
    jogador: "Lionel Messi",
    selecao: "Argentina",
    posicao: "Atacante",
    raridade: "lendaria",
    repetida: true,
    quantidade: 3,
    criadoEm: new Date("2025-05-02T14:30:00Z").toISOString(),
  },
  {
    id: "fig_003",
    codigo: "FRA-007",
    jogador: "Kylian Mbappé",
    selecao: "França",
    posicao: "Atacante",
    raridade: "lendaria",
    repetida: true,
    quantidade: 2,
    criadoEm: new Date("2025-05-03T09:00:00Z").toISOString(),
  },
];

// ───────────────────────────────────────────────
// Middleware de autenticação (x-api-key)
// ───────────────────────────────────────────────
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      erro: "NAO_AUTORIZADO",
      mensagem: "API Key inválida ou ausente. Informe o header x-api-key.",
    });
  }
  next();
});

// ───────────────────────────────────────────────
// GET /api/v1/figurinhas — Listar todas
// ───────────────────────────────────────────────
app.get("/api/v1/figurinhas", (req, res) => {
  const { selecao, repetida, raridade } = req.query;

  let resultado = [...album];

  if (selecao) {
    resultado = resultado.filter((f) =>
      f.selecao.toLowerCase().includes(selecao.toLowerCase())
    );
  }

  if (repetida !== undefined) {
    const rep = repetida === "true";
    resultado = resultado.filter((f) => f.repetida === rep);
  }

  if (raridade) {
    resultado = resultado.filter((f) => f.raridade === raridade);
  }

  res.json({ total: resultado.length, figurinhas: resultado });
});

// ───────────────────────────────────────────────
// POST /api/v1/figurinhas — Cadastrar figurinha
// ───────────────────────────────────────────────
app.post("/api/v1/figurinhas", (req, res) => {
  const { codigo, jogador, selecao, posicao, raridade } = req.body;

  if (!codigo || !jogador || !selecao || !posicao) {
    return res.status(400).json({
      erro: "DADOS_INVALIDOS",
      mensagem: "Os campos 'codigo', 'jogador', 'selecao' e 'posicao' são obrigatórios.",
    });
  }

  const padraoCode = /^[A-Z]{3}-[0-9]{3}$/;
  if (!padraoCode.test(codigo)) {
    return res.status(400).json({
      erro: "DADOS_INVALIDOS",
      mensagem: "O 'codigo' deve seguir o formato GRP-NNN (ex: BRA-010).",
    });
  }

  // Verifica se já existe
  const existente = album.find((f) => f.codigo === codigo);
  if (existente) {
    existente.quantidade += 1;
    existente.repetida = true;
    return res.status(201).json({
      mensagem: "Figurinha já existia! Quantidade incrementada e marcada como repetida.",
      figurinha: existente,
    });
  }

  const novaFigurinha = {
    id: `fig_${uuidv4().slice(0, 8)}`,
    codigo,
    jogador,
    selecao,
    posicao,
    raridade: raridade || "comum",
    repetida: false,
    quantidade: 1,
    criadoEm: new Date().toISOString(),
  };

  album.push(novaFigurinha);

  res.status(201).json({
    mensagem: "Figurinha cadastrada com sucesso!",
    figurinha: novaFigurinha,
  });
});

// ───────────────────────────────────────────────
// GET /api/v1/figurinhas/:id — Buscar por ID
// ───────────────────────────────────────────────
app.get("/api/v1/figurinhas/:id", (req, res) => {
  const figurinha = album.find((f) => f.id === req.params.id);

  if (!figurinha) {
    return res.status(404).json({
      erro: "NAO_ENCONTRADO",
      mensagem: `Figurinha com id '${req.params.id}' não encontrada.`,
    });
  }

  res.json(figurinha);
});

// ───────────────────────────────────────────────
// DELETE /api/v1/figurinhas/:id — Remover figurinha
// ───────────────────────────────────────────────
app.delete("/api/v1/figurinhas/:id", (req, res) => {
  const index = album.findIndex((f) => f.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      erro: "NAO_ENCONTRADO",
      mensagem: `Figurinha com id '${req.params.id}' não encontrada.`,
    });
  }

  const figurinha = album[index];
  const removerTodas = req.query.removerTodas === "true";

  if (!removerTodas && figurinha.quantidade > 1) {
    figurinha.quantidade -= 1;
    if (figurinha.quantidade === 1) figurinha.repetida = false;
    return res.json({
      mensagem: "Uma cópia da figurinha foi removida.",
      figurinhaRemovida: false,
    });
  }

  album.splice(index, 1);

  res.json({
    mensagem: "Figurinha removida com sucesso!",
    figurinhaRemovida: true,
  });
});

// ───────────────────────────────────────────────
// GET /api/v1/figurinhas/repetidas/contagem
// ───────────────────────────────────────────────
app.get("/api/v1/figurinhas/repetidas/contagem", (req, res) => {
  const repetidas = album.filter((f) => f.repetida);

  const porSelecao = Object.values(
    repetidas.reduce((acc, f) => {
      if (!acc[f.selecao]) acc[f.selecao] = { selecao: f.selecao, quantidade: 0 };
      acc[f.selecao].quantidade += f.quantidade - 1;
      return acc;
    }, {})
  );

  const totalRepetidas = porSelecao.reduce((sum, s) => sum + s.quantidade, 0);

  res.json({ totalRepetidas, porSelecao });
});

// ───────────────────────────────────────────────
// Start
// ───────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🏆 Figurinhas Copa 2026 API rodando em http://localhost:${PORT}`);
  console.log(`📖 Documentação: http://localhost:${PORT}/docs`);
});
