const http = require('http');

const usuarios = [
  { id: 1, nome: 'Ana', cargo: 'Desenvolvedora' },
  { id: 2, nome: 'Carlos', cargo: 'Analista' }
];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      mensagem: 'API simples em JS rodando com sucesso',
      rotasDisponiveis: {
        "GET /": "Retorna esta mensagem de boas-vindas e a lista de rotas disponíveis.",
        "GET /usuarios": "Retorna a lista completa de usuários cadastrados.",
        "GET /status": "Retorna o status online da API e o tempo de atividade (uptime)."
      }
    }, null, 2));
    return;
  }

  if (req.url === '/usuarios' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(usuarios));
    return;
  }

  if (req.url === '/status' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'Online', uptime: process.uptime() }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ erro: 'Endpoint não encontrado' }));
});

server.listen(3000, () => {
  console.log('Servidor rodando');
});