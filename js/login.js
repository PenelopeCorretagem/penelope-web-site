import { NumberUtils, PasswordUtils, StringUtils } from "./Utils/index.js";

const baseURL = "http://localhost:3000/usuarios";

document.getElementById("btn_entrar").addEventListener("click", entrar);

async function entrar() {
    const email = document.getElementById("input_email").value;
    const senha = document.getElementById("input_senha").value;

    if (!email || !senha) return alert("Preencha todos os campos!");

    const { status, mensagem } = validarCampos(email, senha);
    if (!status) return alert(mensagem);

    try {
        const request = await fetch(`${baseURL}?email=${email}&senha=${senha}`);
        const data = await request.json();

        if (data.length > 0) {
            alert("Login realizado com sucesso!");
            window.location.href = "https://www.figma.com/proto/Yu6nsEwnLqOgig6hKa1ql0/Penelope-Corretora?node-id=0-1&p=f&t=kjmS4ofnXXewimHm-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1";
            return;
        }

        alert("Email ou senha incorretos");
    }
    catch {
        alert("Ocorreu algum erro no processo");
    }
}

function validarCampos(email, senha) {
    if (!StringUtils.validarEmail(email)) return { status: false, mensagem: "Email inválido" };
    if (senha.length < 6) return { status: false, mensagem: "A senha deve ter pelo menos 6 caracteres" };
    return { status: true, mensagem: "" };
}
