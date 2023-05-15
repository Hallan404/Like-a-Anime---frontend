// Nesse  documento criaremos as conexões com a api e BD

// Registrando novo usuario
const form = document.querySelector("#register");
form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.querySelector("#name").value;
  const username = form.querySelector("#username").value;
  const email = form.querySelector("#email").value;
  const password = form.querySelector("#password").value;
  const data = {
    nome: name,
    apelido: username,
    email: email,
    senha: password,
  };

  fetch("http://hallandeoliveira.pythonanywhere.com/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(`Conta criada com Sucesso\nBem vindo ao time ${name}`);
        window.location.replace("login.html");
      } else {
        alert("Já temos uma conta vinculada a esse email!");
        form.reset();
      }
    })
    .catch((error) => console.error(error));
});

// Fazendoo login
// Variavel de controle de login
let isLoged = false;
// gravando a variavel no localstorage do navegador
if (localStorage.getItem("isLoged") === "true") {
  isLoged = true;
}

// Criando uma função para pegar os dados do usuario logado
// variavel de controle dos dados do usuario logado
let loged_user_data = {};

let type = "";
let nome_de_user = "";
const login_form = document.querySelector("#login-form");
login_form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const username = login_form.querySelector("#username").value;
  const password = login_form.querySelector("#password").value;

  // testando se é um nome de usuario ou email:
  const isEmail = (data) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(data);
  };
  // variavel de controle dos dados de login
  let login_data = {};
  // variavel que estipula o tipo de user name será usado
  if (isEmail(username)) {
    localStorage.setItem("tipo", "email");
    localStorage.setItem("nome_de_user", username);
    login_data = {
      email: username,
      senha: password,
    };
  } else {
    localStorage.setItem("tipo", "nome_usuario");
    localStorage.setItem("nome_de_user", username);
    login_data = {
      apelido: username,
      senha: password,
    };
  }
  fetch("http://hallandeoliveira.pythonanywhere.com/verificar-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login_data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        // Avisando que o login foi bem sucedido
        alert(`Logado com sucesso!\nBem vindo de volta ${username}`);
        // Alterando a variavel de controle e gravando a nova situação no localstorage
        isLoged = true;
        localStorage.setItem("isLoged", true);
        // Preenchendo a variavel com os dados do usuario logado

        // redirecionando para a pagina inicial
        window.location.replace("/index.html");
      } else {
        alert(`${data.error}`);
        login_form.reset();
      }
    })
    .catch((error) => console.error(error));
});

// Criando as modificações se o usuario estiver logado
const btn_entrar = document.querySelector("#btn-entrar");
const btn_entrar_text = document.querySelector("#btn-entrar-text");
const header = document.querySelector(".header");

if (isLoged) {
  btn_entrar_text.textContent = "Conta";
  btn_entrar.setAttribute("href", "/pages/user.html");
  const btn_sair = document.createElement("button");
  btn_sair.classList.add("btn-out");
  btn_sair.textContent = "Sair";
  header.appendChild(btn_sair);
  btn_sair.addEventListener("click", () => {
    localStorage.removeItem("isLoged");
    window.location.href = "index.html";
  });
} else {
  btn_entrar_text.textContent = "Entrar";
}
