import { NumberUtils, PasswordUtils, StringUtils } from "./Utils/index.js";

const baseURL = "http://localhost:3000/usuarios";

document.getElementById("btn_cadastrar").addEventListener("click", cadastrar);
document.getElementById("toggle_senha").addEventListener("click", () => {
  PasswordUtils.toggleSenha("input_senha");
});

let rendaMensal = document.getElementById("input_renda_mensal");
rendaMensal.addEventListener("change", () => {
  rendaMensal.value = NumberUtils.formatarMoeda(rendaMensal.value);
});

async function cadastrar() {
  const nome = document.getElementById("input_nome").value;
  const cpf = document.getElementById("input_cpf").value;
  const email = document.getElementById("input_email").value;
  const dataNascimento = document.getElementById("input_data_nascimento").value;
  const numeroRendaMensal = Number(rendaMensal.value.replace(/\D/g, "")) / 100;
  const senha = document.getElementById("input_senha").value;

  const { status, mensagem } = validarCampos(cpf, email, senha);
  if (!status) return alert(mensagem);

  try {
    await fetch(baseURL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        nome,
        cpf,
        email,
        dataNascimento,
        rendaMensal: numeroRendaMensal,
        senha
      })
    });

    alert("Cadastro realizado com sucesso!");
    limparFormulario();
    listar();
  } catch (error) {
    console.error(error);
    alert("Ocorreu algum erro no processo");
  }
}

function validarCampos(cpf, email, senha) {
  if (!StringUtils.validarCPF(cpf)) return { status: false, mensagem: "CPF inválido" };
  if (!StringUtils.validarEmail(email)) return { status: false, mensagem: "Email inválido" };
  if (senha.length < 6) return { status: false, mensagem: "A senha deve ter pelo menos 6 caracteres" };
  return { status: true, mensagem: "" };
}

async function listar() {
  const response = await fetch(baseURL);
  const usuarios = await response.json();

  const lista = document.getElementById("lista_usuarios");
  lista.innerHTML = "";

  usuarios.forEach(usuario => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>${usuario.nome}</b> (${usuario.email})</p>
      <p>CPF: ${usuario.cpf}</p>
      <p>Renda: R$ ${usuario.rendaMensal}</p>
      <button class="editar" data-id="${usuario.id}">Editar</button>
      <button class="excluir" data-id="${usuario.id}">Excluir</button>
    `;
    lista.appendChild(div);
  });

  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const usuario = usuarios.find(u => u.id == id);

      document.getElementById("input_nome").value = usuario.nome;
      document.getElementById("input_cpf").value = usuario.cpf;
      document.getElementById("input_email").value = usuario.email;
      document.getElementById("input_data_nascimento").value = usuario.dataNascimento;
      document.getElementById("input_renda_mensal").value = usuario.rendaMensal;
      document.getElementById("input_senha").value = usuario.senha;

      const btnCadastrar = document.getElementById("btn_cadastrar");
      btnCadastrar.textContent = "Salvar Alterações";

      const novoBtn = btnCadastrar.cloneNode(true);
      btnCadastrar.replaceWith(novoBtn);

      novoBtn.addEventListener("click", async () => {
        await fetch(`${baseURL}/${id}`, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            nome: document.getElementById("input_nome").value,
            cpf: document.getElementById("input_cpf").value,
            email: document.getElementById("input_email").value,
            dataNascimento: document.getElementById("input_data_nascimento").value,
            rendaMensal: Number(
              document.getElementById("input_renda_mensal").value.replace(/\D/g, "")
            ) / 100,
            senha: document.getElementById("input_senha").value
          })
        });

        alert("Usuário atualizado com sucesso!");
        novoBtn.textContent = "Cadastrar";
        limparFormulario();
        listar();
      });
    });
  });

  document.querySelectorAll(".excluir").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      await deletar(id);
    });
  });
}

async function deletar(id) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

  await fetch(`${baseURL}/${id}`, { method: "DELETE" });
  listar();
}

function limparFormulario() {
  document.getElementById("input_nome").value = "";
  document.getElementById("input_cpf").value = "";
  document.getElementById("input_email").value = "";
  document.getElementById("input_data_nascimento").value = "";
  document.getElementById("input_renda_mensal").value = "";
  document.getElementById("input_senha").value = "";
}

listar();

window.deletar = deletar;
