function login(event) {
  event.preventDefault();
  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  if (usuario === "admin" && senha === "1234") {
    localStorage.setItem("logado", "true");
    window.location.href = "painel.html";
  } else {
    alert("Usuário ou senha incorretos!");
  }
}

function protegerPagina() {
  const logado = localStorage.getItem("logado");
  if (logado !== "true") {
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem("logado");
  window.location.href = "index.html";
}
