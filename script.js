let mensagens = [];
let usuario = {
  name: ""
}
let statusDoUsuario = null;
let statusDaMsg = null;

function informarNome() {

  usuario = {
    name: prompt("Qual o seu nome?")
  }
  const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", usuario);
  promessa.then(nomeCerto);
  promessa.catch(nomeErrado);

}
informarNome();

function nomeCerto(resposta) {
  console.log(resposta.data);
  const statusCode = resposta.status;
  console.log(statusCode);

  const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
  promessa.then(carregaMensagensDoServidor);

}

function carregaMensagensDoServidor(resposta) {
  console.log(resposta.data);
  mensagens = resposta.data;
  renderizarMensagens();
}

function nomeErrado(erro) {

  alert("vish, deu erro");
  const statusCode = erro.response.status;
  console.log(statusCode);
  if (statusCode === 200 || statusCode === 201) {
    carregaMensagensDoServidor();
  }
  else if (statusCode === 409 || statusCode === 400) {
    informarNome();

  }

}

function renderizarMensagens() {
  let mensagensDoServidor = document.querySelector(".container");
  mensagensDoServidor.innerHTML = "";
  let ultimaMensagem = "";

  for (let i = 0; i < mensagens.length; i++) {
    if (i == (mensagens.length - 1)) {
      ultimaMensagem = "ultima";
    }


    if (mensagens[i].type === "status") {
      mensagensDoServidor.innerHTML += `
      <div class= "msg status ${ultimaMensagem}" >
         <span >
            (${mensagens[i].time}) </span> <div> </div>  <strong>   ${mensagens[i].from}   </strong> <div> </div> ${mensagens[i].text} </div>`
    }
    else if (mensagens[i].type === "private_message") {
      if (mensagens[i].to === usuario.name) {
        mensagensDoServidor.innerHTML += ` <div class= "msg reservada ${ultimaMensagem}" >  <span >  (${mensagens[i].time}) </span> <div> </div> ${mensagens[i].from} reservadamente para <strong>${usuario} </strong> <div> </div>:  ${mensagens[i].text}  </div>`;
      }
    }


    else {
      mensagensDoServidor.innerHTML += ` <div class= "msg normal ${ultimaMensagem}" > 
    <span >(${mensagens[i].time})</span> <div> </div>  <strong> ${mensagens[i].from} </strong>  <div> </div> para Todos: ${mensagens[i].text}  </div>`
    }
  }

  const ultimaMsg = document.querySelector(".ultimaMensagem");
  ultimaMsg.scrollIntoView();

}

function atualizar() {
  statusDoUsuario = setInterval(usuarioLogado, 5000);
  statusDaMsg = setInterval(carregarNovasMensagens, 3000);

}
atualizar();

function usuarioLogado() {
  const status = axios.post("https://mock-api.driven.com.br/api/v4/uol/status",usuario);
  status.then()
}

function carregarNovasMensagens() {
  const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
  promessa.then(carregaMensagensDoServidor);
}



//enviar msg do user
function mandarMsgUser() {
  let texto = document.querySelector("footer p");
  const mensagemUsuario = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {
    from: usuario.name,
    to: "Todos",
    text: texto,
    type: "message"
  });
  mensagemUsuario.then(enviarMsg);
}
mandarMsgUser();

//desaparecer a msg da tela após enviar
function enviarMsg(resposta) {
  const footer = document.querySelector(".rodapé");
  footer.innerHTML = `
     <p>Escreva aqui...</p>
      <ion-icon onclick="mandarMsgUser()" class="ion-icon" name="paper-plane-outline" data-identifier="send-message"></ion-icon>  
  `;
}

