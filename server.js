const http = require('http');
const { ServiceBusClient } = require("@azure/service-bus");

// Obtendo as credenciais e o nome da fila através de variáveis de ambiente
const connectionString = process.env.SERVICE_BUS_CONNECTION_STRING;
const queueName = process.env.SERVICE_BUS_QUEUE_NAME;

// Validação simples para garantir que as variáveis foram definidas
if (!connectionString || !queueName) {
  console.error("Erro: Defina as variáveis de ambiente SERVICE_BUS_CONNECTION_STRING e SERVICE_BUS_QUEUE_NAME.");
  process.exit(1);
}

const sbClient = new ServiceBusClient(connectionString);
const sender = sbClient.createSender(queueName);

const usuarios = [
  { id: 1, nome: 'Ana', cargo: 'Desenvolvedora' },
  { id: 2, nome: 'Carlos', cargo: 'Analista' }
];

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({
      mensagem: 'API simples em JS rodando com sucesso. teste',
      rotasDisponiveis: {
        "GET /": "Retorna esta mensagem.",
        "GET /usuarios": "Retorna a lista de usuários.",
        "POST /enviar-tarefa": "Envia uma mensagem para o Azure Service Bus."
      }
    }, null, 2));
    return;
  }

  if (req.url === '/enviar-tarefa' && req.method === 'POST') {
    try {
      const novaMensagem = { 
        titulo: "Processar relatório pesado", 
        dataCriacao: new Date() 
      };

      await sender.sendMessages({ body: novaMensagem });

      res.writeHead(201);
      res.end(JSON.stringify({ status: "Sucesso", mensagem: "Tarefa enviada para o Service Bus!" }));
    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({ erro: "Falha ao enviar ao Service Bus", detalhes: error.message }));
    }
    return;
  }

  if (req.url === '/usuarios' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(usuarios));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ erro: 'Endpoint não encontrado' }));
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
  // iniciarConsumidor();
});

async function iniciarConsumidor() {
  const receiver = sbClient.createReceiver(queueName);
  
  console.log("Aguardando mensagens do Service Bus...");

  receiver.subscribe({
    processMessage: async (message) => {
      console.log("Mensagem recebida do Service Bus:", message.body);
    },
    processError: async (args) => {
      console.error("Erro no processamento da mensagem:", args.error);
    }
  });
}