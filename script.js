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

  for (let i = 0; i < mensagens.length; i++) {
  /*  if (i == (mensagens.length - 1)) {
      ultimaMensagem = "ultima";
    }
*/

    if (mensagens[i].type === "status") {
      mensagensDoServidor.innerHTML += `
      <div class= "msg status data-identifier="message"" >
         <span >
            (${mensagens[i].time}) </span> <div> </div>  <strong>   ${mensagens[i].from}   </strong> <div> </div> ${mensagens[i].text} </div>`
    }
    else if (mensagens[i].type === "private_message") {
      if (mensagens[i].to === usuario.name) {
        mensagensDoServidor.innerHTML += ` <div class= "msg reservada " data-identifier="message" >  <span >  (${mensagens[i].time}) </span> <div> </div> ${mensagens[i].from} 
        reservadamente para <strong>${usuario} </strong> <div> </div>:  ${mensagens[i].text}  </div>`;
      }
    }

//filtrando msgs
    else if (mensagens[i].type === "message") {
      mensagensDoServidor.innerHTML += ` <div class= "msg normal " data-identifier="message"> 
    <span >(${mensagens[i].time})</span> <div> </div>  <strong> ${mensagens[i].from} </strong>  <div> </div> para Todos: ${mensagens[i].text}  </div>`
    }
    else{
      if (mensagens[i].from === usuario || mensagens[i].to === usuario){
        mensagensDoServidor.innerHTML+= `  <div class= "msg reservada data-identifier="message"" >
        <span >
           (${mensagens[i].time}) </span> <div> </div>  <strong>   ${mensagens[i].from}   </strong> <div> </div> reservadamente para <b> ${mensagens[i].to} </b> ${mensagens[i].text} </div>`
      }
    }

  }
  Scroll();
}

function Scroll() {
  let lastMsg = document.querySelector(".container");
  let ultimaMsg = lastMsg.lastElementChild
  ultimaMsg.scrollIntoView();
}

function atualizar() {
  statusDoUsuario = setInterval(usuarioLogado, 5000);
  statusDaMsg = setInterval(carregarNovasMensagens, 3000);

}
atualizar();

function usuarioLogado() {
  const status = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", usuario);
  status.then(function (resposta){
    console.log("usuario ta on")
  })
  status.catch(function(erro){
    console.log(erro.response);
    alert("humm, deu ruim pra tu")
    window.location.reload();
  })
}

function carregarNovasMensagens() {
  const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
  promessa.then(carregaMensagensDoServidor);
}


function enviarMensagem() {
  let texto = document.querySelector("footer input").value;
  const mensagemUsuario = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", {
    from: usuario.name,
    to: "Todos",
    text: texto,
    type: "message"
  });
  mensagemUsuario.then( function(resposta){
    console.log("Enviada com success!!")
  });
  mensagemUsuario.catch(falhaAoEnviar);
  texto = "";
}


function falhaAoEnviar(erro) {
  alert('vish, falha ao enviar sua msg')
  window.location.reload()
}




