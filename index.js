import http from 'http';
import { EventEmitter } from 'events';

const taskEmitter = new EventEmitter();

let tasks = [
    { id: 1, descricao: 'Tarefa 1', status: 'aguardando' },
    { id: 2, descricao: 'Tarefa 2', status: 'aguardando' }
];

taskEmitter.on('criacao', (task) => {
    console.log(`Nova tarefa criada:
    ID: ${task.id}
    Descrição: ${task.descricao}
    Status: ${task.status}
    Data: ${new Date().toLocaleString()}`);
  });
  
  taskEmitter.on('finalizacao', (task) => {
    console.log(`Tarefa finalizada:
    ID: ${task.id}
    Descrição: ${task.descricao}
    Status Final: ${task.status}
    Data: ${new Date().toLocaleString()}`);
  });
  
  taskEmitter.on('consultado', (tasks) => {
    console.log(`Consulta realizada:
    Total de tarefas: ${tasks.length}
    Data: ${new Date().toLocaleString()}`);
  });
  
  taskEmitter.on('status-alterado', (task) => {
    console.log(`Status alterado na tarefa ${task.id}:
    Para: ${task.status}
    Horário: ${new Date().toLocaleTimeString()}`);
  });

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/tasks') {

        taskEmitter.emit('consultado', tasks);

        res.end(JSON.stringify(tasks));
        return;
    }

    if (req.method === 'POST' && req.url === '/tasks') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {

                const { descricao } = JSON.parse(body);
                const newTask = {
                    id: tasks.length + 1,
                    descricao,
                    status: 'aguardando'
                };
                tasks.push(newTask);

                taskEmitter.emit('criacao', newTask);

                res.statusCode = 201;
                res.end(JSON.stringify(newTask));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Dados inválidos' }));
            }
        });
        return;
    }

    if (req.method === 'PATCH' && req.url.startsWith('/tasks/')) {
        const parts = req.url.split('/');
        const id = parseInt(parts[2]);

        const task = tasks.find(t => t.id === id);
        if (!task) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Tarefa não encontrada' }));
        }

        if (parts[3] === 'status') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const { status } = JSON.parse(body);
                    task.status = status;
                    
                    taskEmitter.emit('status-alterado', task);

                    res.end(JSON.stringify(task));
                } catch (error) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Dados inválidos' }));
                }
            });
            return;

        } else if (parts[3] === 'finish') {
            task.status = 'finalizado';

            taskEmitter.emit('finalizacao', task);

            res.end(JSON.stringify(task));
            return;
        }
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
});

server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});