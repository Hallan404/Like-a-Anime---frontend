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

// Adiciona evento de clique no botão salvar
saveButton.addEventListener("click", () => {
  fields.forEach((field, index) => {
    makeNonEditable(field, editIcons[index]);
  });
});
