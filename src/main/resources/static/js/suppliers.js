let myJson;
const section = document.querySelector("section");
let user = document.querySelector("#value_user").value;

if (user.length == 0) {
    user = null;
}
fetch("suppliers/addSuppliers").then(onResponse, onError).then(onJson);
if (document.querySelector("#input_login")) {
    document.querySelector("#input_login").addEventListener("click", openModal);
}
if (document.querySelector("#profile")) {
    document.querySelector("#profile").addEventListener("click", openModal);
}
if (document.querySelector("#input_register")) {
    document.querySelector("#input_register").addEventListener("click", openModal);
}
if (document.querySelector("#logout")) {
    document.querySelector("#logout").addEventListener("click", logout);
}
if (document.querySelector("#logout_res")) {
    document.querySelector("#logout_res").addEventListener("click", logout);
}
if (document.querySelector("#delete_profile")) {
    document.querySelector("#delete_profile").addEventListener("click", checkDeleteProfile);
}
document.querySelector("#modal_block").addEventListener("click", doNothing);
document.querySelector("#register_username").addEventListener("blur", checkRegisterUsername);
document.querySelector("#register_password").addEventListener("blur", checkRegisterPassword);
document.querySelector("#register_confirm_password").addEventListener("blur", checkRegisterConfirmPassword);
document.querySelector("#register_email").addEventListener("blur", checkRegisterEmail);
document.querySelector("#login_username").addEventListener("blur", checkLoginUsernamePassword);
document.querySelector("#login_password").addEventListener("blur", checkLoginUsernamePassword);
document.querySelector("#input_search").addEventListener("keyup", searchBlock);
/* Finisce la fetch, viene richiamata la funzione continueExe() che continuerà con la creazione della pagina */


/* Start Function Declarations */

function continueExe() {
    createBlocks();
}

function searchBlock(event) {
    const str = event.currentTarget.value.toLowerCase();
    const blockList = document.querySelectorAll(".block");
    for (const block of blockList) {
        const title = block.querySelector(".name").textContent.toLowerCase();

        if (str != "") {
            block.classList.add("hidden");
        } else {
            block.classList.remove("hidden");
        }
        let j = 0, i = 0;
        for (i = 0; i < str.length; i++) {
            if (str[i] == title[i]) {
                j++;
            }
        }
        if (i == j) {
            block.classList.remove("hidden");
        }

    }
}

function openModal(event) {
    document.querySelector("#modal").classList.remove("hidden");
    document.querySelector("#modal").classList.add("flex");
    document.body.classList.add("no_scroll");
    document.querySelector("#modal_block").classList.remove("hidden");
    document.querySelector("#modal_block").classList.add("flex");
    document.querySelector("#modal_error").classList.add("hidden");

    const modal_title = document.querySelector("#modal_title");
    const modal_button = document.querySelector("#modal_button");

    if (event.currentTarget.id == "input_login") {
        for (const err of document.querySelectorAll("#modal_content_login .error")) {
            err.textContent = "";
        }
        document.querySelector("#modal_content_login").classList.remove("hidden");
        document.querySelector("#modal_content_login").classList.add("flex");
        modal_title.textContent = "Accesso";
        modal_button.value = "Accedi";
        modal_button.addEventListener("click", login);
    } else if (event.currentTarget.id == "input_register") {
        for (const err of document.querySelectorAll("#modal_content_register .error")) {
            err.textContent = "";
        }
        document.querySelector("#modal_content_register").classList.remove("hidden");
        document.querySelector("#modal_content_register").classList.add("flex");
        modal_title.textContent = "Registrazione";
        modal_button.value = "Registrati";
        modal_button.addEventListener("click", register);
    } else if (event.currentTarget.id == "profile") {
        document.querySelector("#modal_content_profile").classList.remove("hidden");
        document.querySelector("#modal_content_profile").classList.add("flex");
        modal_title.textContent = "Profilo";
        modal_button.value = "Aggiorna profilo";
        modal_button.addEventListener("click", update);
    }
}

function checkDeleteProfile(event) {
    document.querySelector("#buttons span").textContent = "(Clicca di nuovo per eliminare il tuo profilo)";
    document.querySelector("#delete_profile").removeEventListener("click", checkDeleteProfile);
    document.querySelector("#delete_profile").addEventListener("click", deleteProfile);
}

function deleteProfile(event) {
    fetch("suppliers/deleteProfile").then(onResponse, onError).then(onAccess);
}

function logout(event) {
    fetch("suppliers/logout").then(onResponse, onError).then(onAccess);
}

function update(event) {
    const form = formUpdate();
    if (form != null)
        fetch("suppliers/update", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
}

function login() {
    const form = formLogin();
    if (form != null)
        fetch("suppliers/login", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
}

function register() {
    const form = formRegister();
    if (form != null)
        fetch("suppliers/register", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
}

function onAccess(json) {

    switch (json[0]) {
        case "error_login_username":
            /* Username non esiste */
            document.querySelector("#block_login_username .error").textContent = "Errore username non esiste";
            break;
        case "error_login_password":
            /* Password errata */
            document.querySelector("#block_login_password .error").textContent = "Errore password errata";
            document.querySelector("#login_password").value = "";
            break;
        case "error_register_username_exists":
            /* Username non disponibile (Già in uso) */
            document.querySelector("#block_register_username .error").textContent = "Errore username non disponibile";
            break;
        case "error_register_username":
            document.querySelector("#block_register_username .error").textContent = "Errore username";
            break;
        case "error_register_password":
            document.querySelector("#block_register_password .error").textContent = "Errore password";
            break;
        case "error_register_email":
            document.querySelector("#block_register_email .error").textContent = "Errore email";
            break;
        case "login":
        case "register":
        case "logout":
        case "update":
        case "delete":
            window.location.reload();
            break;
        default:
            console.log("Error: " + json + " -- " + json[0]);
            break;

    }
}

function checkLoginUsernamePassword() {
    document.querySelector("#block_login_username .error").textContent = "";
    document.querySelector("#block_login_password .error").textContent = "";
    document.querySelector("#modal_error").classList.add("hidden");
}

function formLogin() {

    if (!checkLogin()) {
        return null;
    }
    const form = new FormData();
    const username = document.querySelector("#login_username").value;
    const password = document.querySelector("#login_password").value;

    form.append("username", username);
    form.append("password", password);

    return form;
}

function checkLogin() {

    const login_username = document.querySelector("#login_username").value;
    const login_password = document.querySelector("#login_password").value;

    if (login_username == "" || login_password == "") {
        document.querySelector("#modal_error").classList.remove("hidden");
        return false;
    }

    const username_error = document.querySelector("#block_login_username .error").textContent;
    const password_error = document.querySelector("#block_login_password .error").textContent;

    if (username_error == "" && password_error == "") {
        return true;
    } else {
        document.querySelector("#modal_error").classList.remove("hidden");
        return false;
    }
}

function formRegister() {

    if (!checkRegister()) {
        return null;
    }
    const form = new FormData();
    const username = document.querySelector("#register_username").value;
    const password = document.querySelector("#register_password").value;
    const confirm_password = document.querySelector("#register_confirm_password").value;
    const email = document.querySelector("#register_email").value;
    const name = document.querySelector("#register_name").value;
    const address = document.querySelector("#register_address").value;

    form.append("username", username);
    form.append("password", password);
    form.append("confirm_password", confirm_password);
    form.append("email", email);
    form.append("name", name);
    form.append("address", address);

    return form;
}

function checkRegister() {

    const register_username = document.querySelector("#register_username").value;
    const register_password = document.querySelector("#register_password").value;
    const register_confirm_password = document.querySelector("#register_confirm_password").value;
    const register_email = document.querySelector("#register_email").value;

    if (register_username == "" || register_password == "" || register_email == "" || register_confirm_password == "") {
        document.querySelector("#modal_error").classList.remove("hidden");
        return false;
    }

    const username_error = document.querySelector("#block_register_username .error").textContent;
    const password_error = document.querySelector("#block_register_password .error").textContent;
    const confirm_password_error = document.querySelector("#block_register_confirm_password .error").textContent;
    const email_error = document.querySelector("#block_register_email .error").textContent;

    if (username_error == "" && password_error == "" && email_error == "" && confirm_password_error == "") {
        return true;
    } else {
        document.querySelector("#modal_error").classList.remove("hidden");
        return false;
    }

}

function formUpdate() {
    const form = new FormData();
    const name = document.querySelector("#profile_name").value;
    const address = document.querySelector("#profile_address").value;

    form.append("name", name);
    form.append("address", address);

    return form;
}

function checkRegisterUsername(event) {
    document.querySelector("#modal_error").classList.add("hidden");
    if (!/^[a-zA-Zà-ù0-9_]{1,15}$/.test(event.currentTarget.value)) {
        document.querySelector("#block_register_username .error").textContent = "Errore username non valido";
        if (event.currentTarget.value.length > 15) {
            const span = document.createElement("span");
            span.textContent = "(Troppi caratteri)";
            document.querySelector("#block_register_username .error").appendChild(span);
        }
    } else
        document.querySelector("#block_register_username .error").textContent = "";
}

function checkRegisterPassword(event) {
    document.querySelector("#modal_error").classList.add("hidden");
    document.querySelector("#block_register_password .error").textContent = "";
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()*+,.-/:;<=>?@[{}ç£_'§€"]).{8,15}$/.test(event.currentTarget.value)) {
        /* Check lunghezza */
        if (event.currentTarget.value.length > 15 || event.currentTarget.value.length < 8) {
            const span = document.createElement("span");
            span.textContent = "(Lunghezza non valida)";
            document.querySelector("#block_register_password .error").appendChild(span);
        }
        /* Check lettera maiuscola */
        if (!/^(?=.*[A-Z]).{0,15}$/.test(event.currentTarget.value)) {
            const span = document.createElement("span");
            span.textContent = "(Inserire almeno un carattere maiuscolo)";
            document.querySelector("#block_register_password .error").appendChild(span);
        }
        /* Check numero */
        if (!/^(?=.*[0-9]).{0,15}$/.test(event.currentTarget.value)) {
            const span = document.createElement("span");
            span.textContent = "(Inserire almeno un numero)";
            document.querySelector("#block_register_password .error").appendChild(span);
        }
        /* Check simbolo */
        if (!/^(?=.*[!#$%&()*+,.-/:;<=>?@[{}ç£_'§€"]).{0,15}$/.test(event.currentTarget.value)) {
            const span = document.createElement("span");
            span.textContent = "(Inserire almeno un simbolo)";
            document.querySelector("#block_register_password .error").appendChild(span);
        }
    }
}

function checkRegisterConfirmPassword(event) {
    document.querySelector("#modal_error").classList.add("hidden");
    if (event.currentTarget.value != document.querySelector("#register_password").value) {
        document.querySelector("#block_register_confirm_password .error").textContent = "(Le password non coincidono)";
    } else {
        document.querySelector("#block_register_confirm_password .error").textContent = "";
    }
}

function checkRegisterEmail(event) {
    document.querySelector("#modal_error").classList.add("hidden");
    if (!/^([A-Za-z0-9à-ù_\-\.])+\@([A-Za-z0-9à-ù_\-\.])+\.([A-Za-zà-ù]{2,4})$/.test(event.currentTarget.value)) {
        document.querySelector("#block_register_email .error").textContent = "Errore email non valida";
    } else
        document.querySelector("#block_register_email .error").textContent = "";
}

function closeModal() {
    document.querySelector("#modal_block").classList.remove("flex");
    document.querySelector("#modal_block").classList.add("hidden");
    if (document.querySelector("#modal_content_login").classList.contains("flex")) {
        document.querySelector("#modal_content_login").classList.remove("flex");
        document.querySelector("#modal_content_login").classList.add("hidden");
        document.querySelector("#modal_button").removeEventListener("click", login);
    }
    if (document.querySelector("#modal_content_register").classList.contains("flex")) {
        document.querySelector("#modal_content_register").classList.remove("flex");
        document.querySelector("#modal_content_register").classList.add("hidden");
        document.querySelector("#modal_button").removeEventListener("click", register);
    }
    if (document.querySelector("#modal_content_profile").classList.contains("flex")) {
        document.querySelector("#modal_content_profile").classList.remove("flex");
        document.querySelector("#modal_content_profile").classList.add("hidden");
        document.querySelector("#modal_button").removeEventListener("click", update);
        document.querySelector("#buttons span").textContent = "";
        document.querySelector("#delete_profile").removeEventListener("click", deleteProfile);
        document.querySelector("#delete_profile").addEventListener("click", checkDeleteProfile);
    }
}

function showProducts(event) {
    event.currentTarget.parentNode.querySelector(".products").classList.remove("hidden");
    event.currentTarget.removeEventListener("click", showProducts);
    event.currentTarget.addEventListener("click", hideProducts);
}

function hideProducts(event) {
    event.currentTarget.parentNode.querySelector(".products").classList.add("hidden");
    event.currentTarget.removeEventListener("click", hideProducts);
    event.currentTarget.addEventListener("click", showProducts);
}

function doNothing(event) {
    event.stopPropagation();
}

function onResponse(response) {
    return response.json();
}

function onError(error) {
    console.log("Error: " + error);
}

function onJson(json) {
    myJson = json;
    continueExe();
}

/* Main Function */

function createBlocks() {

    /* Creation all main blocks */
    let block;
    let info, name, address;
    let products, products_title, product, product_name, product_info, span;

    for (const obj of myJson) {

        /* Creation Block */
        block = document.createElement("div");
        block.classList.add("block");
        section.appendChild(block);

        /* Creation Info */
        info = document.createElement("div");
        info.classList.add("info");
        block.appendChild(info);
        /* Creation Name */
        name = document.createElement("h1");
        name.classList.add("name");
        name.textContent = obj.name;
        info.appendChild(name);
        /* Creation Address*/
        address = document.createElement("span");
        address.classList.add("address");
        address.textContent = "Indirizzo: " + obj.address;
        info.appendChild(address);

        if (user == null) {
            continue;
        }
        info.addEventListener("click", showProducts);
        info.classList.add("cursor");

        /* Creation Products */
        products = document.createElement("div");
        products.classList.add("products", "hidden");
        block.appendChild(products);
        /* Creation Products_Title */
        products_title = document.createElement("h1");
        products_title.classList.add("products_title");
        products_title.textContent = "Prodotti Disponibili";
        products.appendChild(products_title);

        if (obj.products.length == 0) {
            const b = document.createElement("h1");
            b.classList.add("noProducts");
            b.textContent = "Nessun prodotto disponibile !";
            products.appendChild(b);
        }

        for (const prod of obj.products) {

            /* Creation Product */
            product = document.createElement("div");
            product.classList.add("product");
            products.appendChild(product);
            /* Creation Product_Name */
            product_name = document.createElement("h1");
            product_name.classList.add("product_name");
            product_name.textContent = prod.name[0].toUpperCase() + prod.name.substring(1).toLowerCase();
            product.appendChild(product_name);
            /* Creation Product_Info */
            product_info = document.createElement("div");
            product_info.classList.add("product_info");
            product.appendChild(product_info);
            /* Creation Span quantity */
            span = document.createElement("span");
            span.textContent = "Quantità disponibile: " + prod.quantity;
            product_info.appendChild(span);
            /* Creation Span cost */
            span = document.createElement("span");
            span.textContent = "Prezzo unitario: " + prod.cost + " €";
            product_info.appendChild(span);
        }
    }

}
