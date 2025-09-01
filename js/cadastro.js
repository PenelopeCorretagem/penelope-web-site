const baseURL = "http://localhost:3000/usuarios";

document.getElementById("btn_cadastrar").addEventListener("click", cadastrar)

async function cadastrar() {
    const nomeValor = document.getElementById("input_nome").value;
    const cpfValor = document.getElementById("input_cpf").value;
    const emailValor = document.getElementById("input_email").value;
    const dataNascimentoValor = document.getElementById("input_data_nascimento").value;
    const rendaMensalValor = document.getElementById("input_renda_mensal").value;
    const senhaValor = document.getElementById("input_senha").value;

    try {
        await fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                nome: nomeValor,
                cpf: cpfValor,
                email: emailValor,
                dataNascimento: dataNascimentoValor,
                rendaMensal: rendaMensalValor,
                senha: senhaValor
            })
        })

        alert("Cadastro realizado com sucesso")
        window.location.href = "login.html"
    }
    catch {
        alert("Ocorreu algum erro no processo")
    }
}