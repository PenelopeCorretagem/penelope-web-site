const baseURL = "http://localhost:3000/imoveis";

listar();

document.getElementById("btn_cadastrar").addEventListener("click", cadastrar);

async function cadastrar() {
  const titulo = document.getElementById("input_titulo").value;
  const descricao = document.getElementById("input_descricao").value;
  const diferenciais = document.getElementById("input_diferenciais").value;
  const regiao = document.getElementById("input_regiao").value;

  if (!titulo || !descricao || !regiao) return alert("Preencha todos os campos obrigatórios!");

  try {
    await fetch(baseURL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ titulo, descricao, diferenciais, regiao })
    });
    alert("Imóvel cadastrado com sucesso!");
    limparFormulario();
    listar();
  } catch (error) {
    console.error(error);
    alert("Ocorreu um erro");
  }
}

async function listar() {
  const response = await fetch(baseURL);
  const imoveis = await response.json();

  const lista = document.getElementById("lista_imoveis");
  lista.innerHTML = "";

  imoveis.forEach(imovel => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>${imovel.titulo}</b> (${imovel.regiao})</p>
      <p>${imovel.descricao}</p>
      <p>Diferenciais: ${imovel.diferenciais}</p>
      <button class="editar" data-id="${imovel.id}">Editar</button>
      <button class="excluir" data-id="${imovel.id}">Excluir</button>
    `;
    lista.appendChild(div);
  });

  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const imovel = imoveis.find(i => i.id == id);

      document.getElementById("input_titulo").value = imovel.titulo;
      document.getElementById("input_descricao").value = imovel.descricao;
      document.getElementById("input_diferenciais").value = imovel.diferenciais;
      document.getElementById("input_regiao").value = imovel.regiao;

      const btnCadastrar = document.getElementById("btn_cadastrar");
      btnCadastrar.textContent = "Salvar Alterações";

      const novoBtn = btnCadastrar.cloneNode(true);
      btnCadastrar.replaceWith(novoBtn);

      novoBtn.addEventListener("click", async () => {
        await fetch(`${baseURL}/${id}`, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            titulo: document.getElementById("input_titulo").value,
            descricao: document.getElementById("input_descricao").value,
            diferenciais: document.getElementById("input_diferenciais").value,
            regiao: document.getElementById("input_regiao").value
          })
        });
        alert("Imóvel atualizado com sucesso!");
        novoBtn.textContent = "Cadastrar";
        limparFormulario();
        listar();
      });
    });
  });

  document.querySelectorAll(".excluir").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (!confirm("Deseja realmente excluir este imóvel?")) return;
      await fetch(`${baseURL}/${id}`, { method: "DELETE" });
      listar();
    });
  });
}

function limparFormulario() {
  document.getElementById("input_titulo").value = "";
  document.getElementById("input_descricao").value = "";
  document.getElementById("input_diferenciais").value = "";
  document.getElementById("input_regiao").value = "";
}
