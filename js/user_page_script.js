const fields = document.querySelectorAll(".field-value.editable");
const editIcons = document.querySelectorAll(".edit-icon");
const expandIcon = document.querySelector(".expand-icon");
const expandableField = document.querySelector(".field-value.expandable");
const animeList = document.querySelector(".anime-list");
const saveButton = document.querySelector(".save-button");

// Função que torna o campo editável
function makeEditable(field, editIcon) {
  field.contentEditable = "true";
  field.style.backgroundColor = "lightyellow";
  editIcon.style.display = "none";
  saveButton.style.display = "block";
}

// Função que torna o campo não-editável
function makeNonEditable(field, editIcon) {
  field.contentEditable = "false";
  field.style.backgroundColor = "transparent";
  editIcon.style.display = "inline-block";
  saveButton.style.display = "none";
}

// Adiciona evento de clique no ícone de edição
editIcons.forEach((editIcon, index) => {
  editIcon.addEventListener("click", () => {
    makeEditable(fields[index], editIcon);
  });
});

// Adiciona evento de clique no ícone de expandir
expandIcon.addEventListener("click", () => {
  if (animeList.classList.contains("collapsed")) {
    animeList.classList.toggle("expanded");
    expandIcon.title = "Expandir";
    expandIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
  } else {
    animeList.classList.toggle("collapsed");
    expandIcon.title = "Recolher";
    expandIcon.innerHTML = '<i class="fas fa-chevron-up"></i>';
  }
});

// escondendo a senha:
const togglePassword = document.querySelector(".toggle-password");
const passwordField = document.querySelector("#loged-user-password");
const passwordMasked = "*".repeat(passwordField.textContent.length);

let passwordUnmasked = localStorage
  .getItem("passwordUnmasked")
  .replace(/"/g, "");

togglePassword.addEventListener("click", () => {
  if (passwordField.dataset.type === "text") {
    passwordField.dataset.type = "password";
    passwordField.textContent = passwordMasked;
    togglePassword.innerHTML = '<i class="far fa-eye"></i>';
  } else if (passwordField.dataset.type === "password") {
    passwordField.dataset.type = "text";
    passwordField.textContent = passwordUnmasked;
    togglePassword.innerHTML = '<i class="far fa-eye-slash"></i>';
  }
});
// Adiciona evento de clique no botão salvar
saveButton.addEventListener("click", () => {
  const loged_user_id = localStorage.getItem("loged_user_id");
  const data_user_update = {
    nome: fields[0].textContent,
    apelido: fields[1].textContent,
    email: fields[2].textContent,
    senha: fields[3].textContent,
  };

  fetch(
    `http://hallandeoliveira.pythonanywhere.com/usuarios/atualizar/${loged_user_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data_user_update),
    }
  )
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error());
  fields.forEach((field, index) => {
    console.log(field.textContent, index);
    makeNonEditable(field, editIcons[index]);
  });
});
