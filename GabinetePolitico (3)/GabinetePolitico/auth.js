// Função de login do vereador
function login(event) {
  event.preventDefault(); // evita recarregar a página

  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (usuario === "admin" && senha === "1234") {
    localStorage.setItem("logado", "true");
    window.location.href = "painel.html";
  } else {
    alert("Usuário ou senha incorretos!");
  }
}

// Protege páginas privadas (como o painel)
function protegerPagina() {
  const logado = localStorage.getItem("logado");
  if (logado !== "true") {
    window.location.href = "index.html";
  }
}

// Função de logout
function logout() {
  localStorage.removeItem("logado");
  window.location.href = "index.html"; // voltar para tela de login
}
