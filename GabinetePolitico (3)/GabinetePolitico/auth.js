// Função para simular login e salvar no armazenamento local
function login(event) {
  event.preventDefault(); // evita que o formulário recarregue a página

  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  // Aqui você pode trocar por uma verificação mais segura, se quiser
  if (usuario === "admin" && senha === "1234") {
    localStorage.setItem("logado", "true");
    window.location.href = "painel.html"; // redireciona para o painel
  } else {
    alert("Usuário ou senha incorretos!");
  }
}

// Função para proteger páginas que exigem login
function protegerPagina() {
  const logado = localStorage.getItem("logado");

  if (logado !== "true") {
    window.location.href = "login.html"; // redireciona para o login se não estiver logado
  }
}

// Função para logout
function logout() {
  localStorage.removeItem("logado");
  window.location.href = "login.html"; // volta para a tela de login
}
