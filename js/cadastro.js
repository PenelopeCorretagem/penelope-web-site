import { NumberUtils, PasswordUtils, StringUtils } from './Utils/index.js';

const baseURL = "http://localhost:3000/usuarios";

document.getElementById("btn_cadastrar").addEventListener("click", cadastrar);

document.getElementById("btn_toggle_senha").addEventListener("click", () => {
    PasswordUtils.toggleSenha("input_senha");
});

async function cadastrar() {
    const nome = document.getElementById("input_nome").value;
    const cpf = document.getElementById("input_cpf").value;
    const email = document.getElementById("input_email").value;
    const dataNascimento = document.getElementById("input_data_nascimento").value;
    let rendaMensal = document.getElementById("input_renda_mensal").value;
    const senha = document.getElementById("input_senha").value;

    const { status, mensagem } = validarCampos(cpf, email, senha);
    if (!status) return alert(mensagem);

    if (rendaMensal) {
        rendaMensal = NumberUtils.formatarMoeda(rendaMensal);
    }

    try {
        await fetch(baseURL, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                nome,
                cpf,
                email,
                dataNascimento,
                rendaMensal,
                senha
            })
        });

        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
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
