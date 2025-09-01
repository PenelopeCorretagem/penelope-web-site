const baseURL = "http://localhost:3000/usuarios";

document.getElementById("btn_entrar").addEventListener("click", entrar)

async function entrar() {
    const email = document.getElementById("input_email").value;
    const senha = document.getElementById("input_senha").value;

    try {
        const resquest = await fetch(`${baseURL}/?email=${email}&senha=${senha}`);
        const data = await resquest.json();
        if (data.length > 0) {
            alert("Login realizado");
            window.location.href = "https://youtu.be/ItQoBbQGMvY?si=mHicbDn55SItJcDZ";
            return;
        }

        alert("Email ou senha incorretos");
    }
    catch {
        alert("Ocorreu algum erro no processo");
    }
}