const baseURL = "http://localhost:3000/agendamentos";

listar();

document.getElementById("btn_agendar").addEventListener("click", agendar);

async function agendar() {
  const imovel = document.getElementById("input_imovel").value;
  const data = document.getElementById("input_data").value;
  const hora = document.getElementById("input_hora").value;

  if (!imovel || !data || !hora) return alert("Preencha todos os campos!");

  try {
    await fetch(baseURL, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ imovel, data, hora })
    });
    alert("Agendamento realizado com sucesso!");
    limparFormulario();
    listar();
  } catch (error) {
    console.error(error);
    alert("Erro ao agendar");
  }
}

async function listar() {
  const response = await fetch(baseURL);
  const agendamentos = await response.json();

  const lista = document.getElementById("lista_agendamentos");
  lista.innerHTML = "";

  agendamentos.forEach(ag => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><b>${ag.imovel}</b> - ${ag.data} ${ag.hora}</p>
      <button class="editar" data-id="${ag.id}">Editar</button>
      <button class="excluir" data-id="${ag.id}">Excluir</button>
    `;
    lista.appendChild(div);
  });

  document.querySelectorAll(".editar").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const ag = agendamentos.find(a => a.id == id);

      document.getElementById("input_imovel").value = ag.imovel;
      document.getElementById("input_data").value = ag.data;
      document.getElementById("input_hora").value = ag.hora;

      const btnAgendar = document.getElementById("btn_agendar");
      btnAgendar.textContent = "Salvar Alterações";

      const novoBtn = btnAgendar.cloneNode(true);
      btnAgendar.replaceWith(novoBtn);

      novoBtn.addEventListener("click", async () => {
        await fetch(`${baseURL}/${id}`, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            imovel: document.getElementById("input_imovel").value,
            data: document.getElementById("input_data").value,
            hora: document.getElementById("input_hora").value
          })
        });
        alert("Agendamento atualizado com sucesso!");
        novoBtn.textContent = "Agendar";
        limparFormulario();
        listar();
      });
    });
  });

  document.querySelectorAll(".excluir").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (!confirm("Deseja realmente excluir este agendamento?")) return;
      await fetch(`${baseURL}/${id}`, { method: "DELETE" });
      listar();
    });
  });
}

function limparFormulario() {
  document.getElementById("input_imovel").value = "";
  document.getElementById("input_data").value = "";
  document.getElementById("input_hora").value = "";
}
