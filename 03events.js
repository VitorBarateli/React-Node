import { EventEmitter } from 'events';

const notificador = new EventEmitter();

notificador.on('notificacao', (dados) => {
  if (dados && dados.mensagem) {
    console.log(`Notificação: ${dados.mensagem}`);
  } else {
    console.log('Nenhuma notificação disponível.');
  }
});

function enviarNotificacao() {
  const random = Math.random();
  console.log('Random:', random);
  const temDados = random > 0.5;
  if (temDados) {
    notificador.emit('notificacao', { mensagem: 'Você tem uma nova mensagem!' });
  } else {
    notificador.emit('notificacao', null);
  }
}

setInterval(enviarNotificacao, 5000);