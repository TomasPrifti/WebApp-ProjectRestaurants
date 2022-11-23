/* Foodish */
/* https://foodish-api.herokuapp.com/images/somefoodish/ <-- api1*/

/* Main Code */
const MAX_LATERAL_BLOCK = 5;
let NUM_IMAGE = 0;
let myJson;
let user = document.querySelector("#value_user").value;

if (user.length == 0) {
    user = null;
}
const section = document.querySelector("section");
createLateralBlocks();
const lateralImageList = document.querySelectorAll(".lateral_image");
newImages();
document.querySelector("#input_images").addEventListener("click", newImages);
document.querySelector("#input_text").addEventListener("keyup", searchBlock);
if (user != null) {
    document.querySelector("#logout").addEventListener("click", logout);
    document.querySelector("#transactions").addEventListener("click", openModal);
    document.querySelector("#modal_block_transactions").addEventListener("click", doNothing);
}
checkUser();

/* Start Function Declarations */

/* API Functions */

function searchOnWeb1() {
    fetch("products/api1").then(onResponse, onError).then(onJson1);
}
function onResponse(response) {
    return response.json();
}
function onError(error) {
    console.log("Errore: " + error);
}
function onJson1(json) {
    lateralImageList[NUM_IMAGE++].src = json[0];
    /* Soluzione all'errore */
    /* if (NUM_IMAGE == MAX_LATERAL_BLOCK * 2) {
        NUM_IMAGE = 0;
    } */
}

/* Generic Functions */

function newImages() {
    NUM_IMAGE = 0; //Forse è meglio dentro l'altra funzione
    for (let i = 0; i < MAX_LATERAL_BLOCK * 2; i++) {
        searchOnWeb1();
    }
}

function checkUser() {
    if (user == null) {
        document.querySelector("#input_text").classList.add("hidden");
        document.querySelector("#products").classList.remove("yscroll");
        const noUser = document.createElement("div");
        noUser.id = "noUser";
        document.querySelector("#products").appendChild(noUser);
        const h2 = document.createElement("h2");
        h2.textContent = "Per poter visualizzare tutti i Prodotti";
        const h1 = document.createElement("h1");
        h1.textContent = "Accedi o Registrati";
        noUser.appendChild(h2);
        noUser.appendChild(h1);
    } else if (user == "supplier") {
        document.querySelector("#input_addProduct").addEventListener("click", openModal);
        document.querySelector("#title_blocks").textContent = "I Miei Prodotti";
        document.querySelector("#modal_block_suppliers").addEventListener("click", doNothing);
        document.querySelector("#input_block_modify").addEventListener("click", modifyProduct);
        document.querySelector("#input_block_delete").addEventListener("click", checkDeleteProduct);
        document.querySelector("#input_block_add").addEventListener("click", addProduct);
        fetch("products/showMyProducts").then(onResponse, onError).then(createBlocks);
    } else if (user == "restaurant") {
        document.querySelector("#modal_block_restaurants").addEventListener("click", doNothing);
        document.querySelector("#input_block_buy").addEventListener("click", sendTransaction);
        document.querySelector("#input_block_buy_quantity").addEventListener("keyup", elaborateTotalCost);
        fetch("products/showAllProducts").then(onResponse, onError).then(createBlocks);
    }
}

function searchBlock(event) {
    const str = event.currentTarget.querySelector("#input_content").value.toLowerCase();
    const productList = document.querySelectorAll(".product");
    for (const product of productList) {
        const title = product.querySelector(".product_name").textContent.toLowerCase();

        if (str != "") {
            product.classList.add("hidden");
        } else {
            product.classList.remove("hidden");
        }
        let j = 0, i = 0;
        for (i = 0; i < str.length; i++) {
            if (str[i] == title[i]) {
                j++;
            }
        }
        if (i == j) {
            product.classList.remove("hidden");
        }

    }
}

function elaborateTotalCost(event) {
    const quantity = event.currentTarget.value;
    const cost = document.querySelector("#block_buy_cost").textContent.substring(17, document.querySelector("#block_buy_cost").textContent.length - 2);
    let totalCost = quantity * cost;
    if (totalCost.toString().indexOf(".") != -1) {
        totalCost = totalCost.toString().substring(0, totalCost.toString().indexOf(".") + 3);
    }
    document.querySelector("#block_buy_total_cost span").textContent = totalCost;
}

function openModal(event) {
    document.querySelector("#modal").classList.remove("hidden");
    document.querySelector("#modal").classList.add("flex");
    document.body.classList.add("no_scroll");
    if (event.currentTarget.classList.contains("product_button_modify")) {
        document.querySelector("#modal_block_suppliers").classList.remove("hidden");
        document.querySelector("#modal_block_suppliers").classList.add("flex");
        document.querySelector("#modal_block_modify").classList.remove("hidden");
        document.querySelector("#modal_block_modify").classList.add("flex");
        fillFormModify(event);
    } else if (event.currentTarget.id == "input_addProduct") {
        document.querySelector("#modal_block_suppliers").classList.remove("hidden");
        document.querySelector("#modal_block_suppliers").classList.add("flex");
        document.querySelector("#modal_block_add").classList.remove("hidden");
        document.querySelector("#modal_block_add").classList.add("flex");
    } else if (event.currentTarget.classList.contains("product_button_buy")) {
        showSuppliers(event);
        document.querySelector("#modal_block_choose").dataset.idproduct = event.currentTarget.parentNode.dataset.idproduct;
        document.querySelector("#modal_block_choose span").textContent = event.currentTarget.parentNode.querySelector(".product_name").textContent.toUpperCase();
        document.querySelector("#modal_block_restaurants").classList.remove("hidden");
        document.querySelector("#modal_block_restaurants").classList.add("flex");
        document.querySelector("#modal_block_choose").classList.remove("hidden");
        document.querySelector("#modal_block_choose").classList.add("flex");
    } else if (event.currentTarget.classList.contains("product_button_choose")) {
        document.querySelector("#modal_block_buy").dataset.idproduct = document.querySelector("#modal_block_choose").dataset.idproduct;
        document.querySelector("#modal_block_buy").dataset.idsupplier = event.currentTarget.parentNode.dataset.idsupplier;
        document.querySelector("#block_buy_name_product").textContent = "Nome del Prodotto: " + document.querySelector("#modal_title_product").textContent;
        document.querySelector("#block_buy_name_supplier").textContent = "Nome del Fornitore: " + event.currentTarget.parentNode.querySelector(".supplier_name").textContent;
        document.querySelector("#block_buy_cost").textContent = event.currentTarget.parentNode.querySelectorAll(".product_info span")[1].textContent;
        document.querySelector("#block_buy_quantity span").textContent = event.currentTarget.parentNode.querySelectorAll(".product_info span")[0].textContent;
        document.querySelector("#modal_block_choose").classList.remove("flex");
        document.querySelector("#modal_block_choose").classList.add("hidden");
        document.querySelector("#modal_block_buy").classList.remove("hidden");
        document.querySelector("#modal_block_buy").classList.add("flex");
    } else if (event.currentTarget.id == "transactions") {
        document.querySelector("#modal_block_transactions").classList.remove("hidden");
        document.querySelector("#modal_block_transactions").classList.add("flex");
        fetch("products/showTransactions").then(onResponse, onError).then(createTransactionsBlock);
    }
}

function closeModal() {
    if (document.querySelector("#modal_block_transactions").classList.contains("flex")) {
        document.querySelector("#modal_block_transactions").classList.remove("flex");
        document.querySelector("#modal_block_transactions").classList.add("hidden");
    }
    if (user == "supplier") {
        if (document.querySelector("#modal_block_suppliers").classList.contains("flex")) {
            document.querySelector("#modal_block_suppliers").classList.remove("flex");
            document.querySelector("#modal_block_suppliers").classList.add("hidden");
        }
        if (document.querySelector("#modal_block_modify").classList.contains("flex")) {
            document.querySelector("#modal_block_modify").classList.remove("flex");
            document.querySelector("#modal_block_modify").classList.add("hidden");
            document.querySelector("#modal_block_modify .error").textContent = "";
            document.querySelector("#input_block_delete").removeEventListener("click", deleteProduct);
            document.querySelector("#input_block_delete").addEventListener("click", checkDeleteProduct);
        }
        if (document.querySelector("#modal_block_add").classList.contains("flex")) {
            document.querySelector("#modal_block_add").classList.remove("flex");
            document.querySelector("#modal_block_add").classList.add("hidden");
            document.querySelector("#modal_block_add .error").textContent = "";
        }
    }
    if (user == "restaurant") {
        if (document.querySelector("#modal_block_restaurants").classList.contains("flex")) {
            document.querySelector("#modal_block_restaurants").classList.remove("flex");
            document.querySelector("#modal_block_restaurants").classList.add("hidden");
        }
        if (document.querySelector("#modal_block_choose").classList.contains("flex")) {
            document.querySelector("#modal_block_choose").classList.remove("flex");
            document.querySelector("#modal_block_choose").classList.add("hidden");
        }
        if (document.querySelector("#modal_block_buy").classList.contains("flex")) {
            document.querySelector("#modal_block_buy").classList.remove("flex");
            document.querySelector("#modal_block_buy").classList.add("hidden");
            document.querySelector("#input_block_buy_quantity").value = "";
            document.querySelector("#block_buy_total_cost span").textContent = "";
            document.querySelector("#modal_block_buy .error").textContent = "";
        }
    }

}

function fillFormModify(event) {
    const id = event.currentTarget.parentNode.dataset.idproduct;
    const name = event.currentTarget.parentNode.querySelector(".product_name").textContent;
    const quantity = event.currentTarget.parentNode.querySelectorAll(".product_info span")[0].textContent;
    const cost = event.currentTarget.parentNode.querySelectorAll(".product_info span")[1].textContent;

    document.querySelector("#modal_block_modify").dataset.idproduct = id;
    document.querySelector("#form_modify span").textContent = "Prodotto: " + name;
    document.querySelector("#block_modify_quantity span").textContent = "Valore attuale: ( " + quantity + " )";
    document.querySelector("#block_modify_cost span").textContent = "Valore attuale: ( " + cost + " )";
}

function showTransactionProducts(event) {
    event.currentTarget.parentNode.querySelector(".transaction_products").classList.remove("hidden");
    event.currentTarget.parentNode.querySelector(".transaction_products").classList.add("flex");
    event.currentTarget.removeEventListener("click", showTransactionProducts);
    event.currentTarget.addEventListener("click", hideTransactionProducts);
}

function hideTransactionProducts(event) {
    event.currentTarget.parentNode.querySelector(".transaction_products").classList.remove("flex");
    event.currentTarget.parentNode.querySelector(".transaction_products").classList.add("hidden");
    event.currentTarget.removeEventListener("click", hideTransactionProducts);
    event.currentTarget.addEventListener("click", showTransactionProducts);
}

function logout(event) {
    fetch("products/logout").then(onResponse, onError).then(onAccess);
}

function modifyProduct(event) {
    const form = checkModifyProduct();
    if (form != null) {
        fetch("products/modifyProduct", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
    }
}

function checkDeleteProduct(event) {
    document.querySelector("#modal_block_modify .error").textContent = "(Clicca di nuovo per eliminare il prodotto)";
    document.querySelector("#input_block_delete").removeEventListener("click", checkDeleteProduct);
    document.querySelector("#input_block_delete").addEventListener("click", deleteProduct);
}

function deleteProduct(event) {
    const form = new FormData();
    const id = event.currentTarget.parentNode.dataset.idproduct;
    form.append("id", id);
    fetch("products/deleteProduct", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
}

function addProduct(event) {
    const form = checkAddProduct();
    if (form != null) {
        fetch("products/addProduct", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
    }
}

function showSuppliers(event) {
    const form = new FormData();
    const id = event.currentTarget.parentNode.dataset.idproduct;
    form.append("id", id);
    fetch("products/showSuppliers", { method: "POST", body: form }).then(onResponse, onError).then(createSuppliersBlock);
}

function sendTransaction(event) {
    const form = checkSendTransaction();
    if (form != null) {
        fetch("products/sendTransaction", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
    }
}

function transactionDeleteProduct(event) {
    const transaction = event.currentTarget.parentNode.parentNode.parentNode;

    if (transaction.querySelectorAll(".product").length == 1) {
        transactionDeleteTransaction(event);
        return;
    }

    const idTransaction = transaction.dataset.idTransaction;
    const product = event.currentTarget.parentNode;
    const idProduct = product.dataset.idProduct;
    const span = transaction.querySelector(".block_transaction_input_text span");

    if (user == "restaurant") {
        for (const obj of myJson) {
            if (obj.idTransaction == idTransaction) {
                for (const prod of obj.products) {
                    if (prod.id == idProduct) {
                        const form = new FormData();
                        form.append("idTransaction", obj.idTransaction);
                        form.append("idSupplier", obj.idSupplier);
                        form.append("idProduct", prod.id);
                        fetch("products/transactionDeleteProduct", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
                        transaction.dataset.totalCost = transaction.dataset.totalCost - product.dataset.totalCost;
                        if (transaction.dataset.totalCost.toString().indexOf(".") != -1) {
                            transaction.dataset.totalCost = transaction.dataset.totalCost.toString().substring(0, transaction.dataset.totalCost.toString().indexOf(".") + 3);
                        }
                        transaction.querySelector(".total_cost").textContent = "Prezzo Totale: " + transaction.dataset.totalCost + " €";
                        product.remove();
                        return;
                    }
                }
            }
        }
    }
    span.textContent = "Errore !";
    span.classList.add("error");
}

function transactionDeleteTransaction(event) {
    let transaction;

    if (event.currentTarget.classList.contains("delete_transaction_product")) {
        transaction = event.currentTarget.parentNode.parentNode.parentNode;
    } else if (event.currentTarget.classList.contains("delete_transaction")) {
        transaction = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
    }

    const idTransaction = transaction.dataset.idTransaction;
    const span = transaction.querySelector(".block_transaction_input_text span");

    if (user == "restaurant") {
        for (const obj of myJson) {
            if (obj.idTransaction == idTransaction) {
                const form = new FormData();
                form.append("idTransaction", obj.idTransaction);
                form.append("idSupplier", obj.idSupplier);
                fetch("products/transactionDeleteTransaction", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
                transaction.remove();
                return;
            }
        }
    }
    span.textContent = "Errore !";
    span.classList.add("error");
}

function transactionSuccessTransaction(event) {
    const transaction = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
    const idTransaction = transaction.dataset.idTransaction;
    const span = transaction.querySelector(".block_transaction_input_text span");

    if (user == "restaurant") {
        for (const obj of myJson) {
            if (obj.idTransaction == idTransaction) {
                const form = new FormData();
                form.append("idTransaction", obj.idTransaction);
                form.append("id", obj.idSupplier);
                fetch("products/transactionSuccessTransaction", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
                for (const product of transaction.querySelectorAll(".product")) {
                    product.querySelector(".delete_transaction_product").remove();
                }
                span.textContent = "Transazione in attesa del Fornitore";
                transaction.querySelector(".block_transaction_input").remove();
                return;
            }
        }
    } else if (user == "supplier") {
        for (const obj of myJson) {
            if (obj.idTransaction == idTransaction) {
                const form = new FormData();
                form.append("idTransaction", obj.idTransaction);
                form.append("id", obj.idRestaurant);
                fetch("products/transactionSuccessTransaction", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
                span.textContent = "Transazione confermata !";
                span.classList.add("green");
                transaction.querySelector(".block_transaction_input").remove();
                return;
            }
        }
    }
    span.textContent = "Errore !";
    span.classList.add("error");
}

function transactionDeclineTransaction(event) {

    const idTransaction = event.currentTarget.parentNode.parentNode.parentNode.parentNode.dataset.idTransaction;
    const span = event.currentTarget.parentNode.parentNode.querySelector("span");

    if (user == "supplier") {
        for (const obj of myJson) {
            if (obj.idTransaction == idTransaction) {
                const form = new FormData();
                form.append("idTransaction", obj.idTransaction);
                form.append("idRestaurant", obj.idRestaurant);
                fetch("products/transactionDeclineTransaction", { method: "POST", body: form }).then(onResponse, onError).then(onAccess);
                span.textContent = "Transazione rifiutata !";
                span.classList.add("error");

                event.currentTarget.parentNode.remove();
                return;
            }
        }
    }
    span.textContent = "Errore !";
    span.classList.add("error");
}

/* Check Methods */

function checkAddProduct() {
    const form = new FormData();
    const name = document.querySelector("#input_block_add_name").value.toLowerCase();
    const quantity = document.querySelector("#input_block_add_quantity").value;
    const cost = document.querySelector("#input_block_add_cost").value;

    if (!/^[a-zA-Zà-ù'\s]{1,20}$/.test(name)) {
        document.querySelector("#modal_block_add .error").textContent = "Errore nome non valido";
        return null;
    } else if (quantity < 0 || quantity % 1 != 0 || quantity == "" || quantity == null) {
        document.querySelector("#modal_block_add .error").textContent = "Errore quantità non valida";
        return null;
    } else if (!checkCost(cost)) {
        document.querySelector("#modal_block_add .error").textContent = "Errore prezzo unitario non valido";
        return null;
    }

    form.append("name", name);
    form.append("quantity", quantity);
    form.append("cost", cost);

    return form;
}

function checkModifyProduct() {
    const form = new FormData();
    const id = document.querySelector("#modal_block_modify").dataset.idproduct;
    const quantity = document.querySelector("#input_block_modify_quantity").value;
    const cost = document.querySelector("#input_block_modify_cost").value;

    if (quantity < 0 || quantity % 1 != 0 || quantity == "" || quantity == null) {
        document.querySelector("#modal_block_modify .error").textContent = "Errore quantità non valida";
        return null;
    } else if (!checkCost(cost)) {
        document.querySelector("#modal_block_modify .error").textContent = "Errore prezzo unitario non valido";
        return null;
    }

    form.append("id", id);
    form.append("quantity", quantity);
    form.append("cost", cost);
    return form;
}

function checkCost(str) {
    if (str == 0) {
        return false;
    } else if (!/^[0-9]{1,10}$/.test(str)) {
        const index1 = str.indexOf(".");
        const index2 = str.indexOf(",");
        if (index1 == -1 && index2 == -1) {
            return false;
        }
        if ((index1 != -1 && index2 != -1)) {
            return false;
        }
        if (index1 != -1)
            if (str.substring(index1 + 1, str.length).indexOf(".") != -1 || !/^[0-9]{1,2}$/.test(str.substring(index1 + 1, str.length))) {
                return false;
            }
        if (index2 != -1)
            if (str.substring(index2 + 1, str.length).indexOf(",") != -1 || !/^[0-9]{1,2}$/.test(str.substring(index2 + 1, str.length))) {
                return false;
            }
    }
    return true;
}

function checkSendTransaction() {
    const form = new FormData();
    const idproduct = document.querySelector("#modal_block_buy").dataset.idproduct;
    const idsupplier = document.querySelector("#modal_block_buy").dataset.idsupplier;
    const quantity = document.querySelector("#input_block_buy_quantity").value;

    if (quantity <= 0 || quantity % 1 != 0 || quantity == "" || quantity == null) {
        document.querySelector("#modal_block_buy .error").textContent = "Errore quantità non valida";
        return null;
    }

    form.append("idproduct", idproduct);
    form.append("idsupplier", idsupplier);
    form.append("quantity", quantity);
    return form;
}

/* OnJson Methods */

function onAccess(json) {

    switch (json[0]) {
        case "addPreference":
            document.querySelector("#form_modal_preference span").textContent = "(Aggiunto ai Preferiti)";
            break;
        case "preferenceExist":
            document.querySelector("#form_modal_preference span").textContent = "(Già presente nei Preferiti)";
            break;
        case "error_addProduct_name":
            document.querySelector("#modal_block_add .error").textContent = "(ERRORE: nome)";
            break;
        case "error_addProduct_quantity":
            document.querySelector("#modal_block_add .error").textContent = "(ERRORE: quantità)";
            break;
        case "error_addProduct_cost":
            document.querySelector("#modal_block_add .error").textContent = "(ERRORE: prezzo unitario)";
            break;
        case "error_sendTransaction_quantity":
            document.querySelector("#modal_block_buy .error").textContent = "(ERRORE: quantità)";
            break;
        case "sendTransaction":
            console.log("success: " + json[0]);
            if (typeof startCloseModal !== "undefined")
                startCloseModal();
            break;
        case "transactionSuccessTransaction":
            if (user == "supplier") {
                fetch("products/showMyProducts").then(onResponse, onError).then(createBlocks);
            }
        case "transactionDeclineTransaction":
        case "transactionDeleteTransaction":
        case "transactionDeleteProduct":
            console.log("success: " + json[0]);
            break;
        case "logout":
        case "addProduct":
        case "deleteProduct":
        case "modifyProduct":
            window.location.reload();
            break;
        default:
            console.log("Error: " + json + " -- " + json[0]);
            break;

    }
}

function createSuppliersBlock(json) {

    const suppliers = document.querySelector("#suppliers");
    suppliers.innerHTML = "";

    if (json.length == 0) {
        const noSupplier = document.createElement("h1");
        noSupplier.id = "noSupplier";
        noSupplier.textContent = "Nessun Fornitore Disponibile !";
        suppliers.appendChild(noSupplier);
        return;
    }

    let supplier;
    let supplier_name, product_info, product_button_choose;
    let span;

    for (const obj of json) {

        /* Creation Supplier */
        supplier = document.createElement("div");
        supplier.dataset.idsupplier = obj.id;
        supplier.classList.add("supplier");
        suppliers.appendChild(supplier);

        /* Creation Supplier_Name */
        supplier_name = document.createElement("h1");
        supplier_name.classList.add("supplier_name");
        supplier_name.textContent = obj.name[0].toUpperCase() + obj.name.substring(1);
        supplier.appendChild(supplier_name);
        /* Creation Product_Info */
        product_info = document.createElement("div");
        product_info.classList.add("product_info");
        supplier.appendChild(product_info);
        /* Creation Product_Button_Choose */
        product_button_choose = document.createElement("input");
        product_button_choose.classList.add("product_button_choose", "cursor");
        product_button_choose.type = "button";
        product_button_choose.value = "Scegli";
        product_button_choose.addEventListener("click", openModal);
        supplier.appendChild(product_button_choose);

        /* Creation Span for Quantity and Cost */
        span = document.createElement("span");
        span.textContent = "Quantità: " + obj.quantity;
        product_info.appendChild(span);
        span = document.createElement("span");
        span.textContent = "Prezzo Unitario: " + obj.cost + " €";
        product_info.appendChild(span);
    }
}

function createTransactionsBlock(json) {

    myJson = json;

    const block_transactions = document.querySelector("#block_transactions");
    block_transactions.innerHTML = "";

    if (json.length == 0) {
        const noProducts = document.createElement("h1");
        noProducts.id = "noProducts";
        noProducts.textContent = "Nessuna Transazione Disponibile !";
        block_transactions.appendChild(noProducts);
        return;
    }

    let transaction;
    let transaction_info, transaction_products;
    let id_transaction, name, date, total_cost;
    let transaction_products_title;

    let product;
    let prodoct_name, product_info, input;
    let span;

    let block_transaction_input_text;
    let block_transaction_input;
    let input1, input2;

    for (const obj of json) {

        /* Creation Transaction */
        transaction = document.createElement("div");
        transaction.classList.add("transaction");
        block_transactions.appendChild(transaction);
        transaction.dataset.idTransaction = obj.idTransaction;

        /* Creation Transaction_Info */
        transaction_info = document.createElement("div");
        transaction_info.classList.add("transaction_info", "cursor");
        transaction_info.addEventListener("click", showTransactionProducts);
        transaction.appendChild(transaction_info);
        /* Creation Id_Transaction */
        id_transaction = document.createElement("span");
        id_transaction.classList.add("id_transaction");
        id_transaction.textContent = obj.idTransaction + "#";
        transaction_info.appendChild(id_transaction);
        /* Creation Name */
        name = document.createElement("h1");
        name.classList.add("name");
        transaction_info.appendChild(name);
        if (user == "restaurant") {
            name.textContent = "Fornitore: " + obj.name;
        } else if (user == "supplier") {
            name.textContent = "Ristorante: " + obj.name;
        }
        /* Creation Date */
        date = document.createElement("span");
        date.classList.add("date");
        if (obj.date == null) {
            date.textContent = "Data: 0000-00-00";
        } else {
            date.textContent = "Data: " + obj.date.substring(0, 10);
        }
        transaction_info.appendChild(date);
        /* Creation Total_Cost */
        total_cost = document.createElement("span");
        total_cost.classList.add("total_cost");
        if (obj.totalCost.toString().indexOf(".") != -1) {
            obj.totalCost = obj.totalCost.toString().substring(0, obj.totalCost.toString().indexOf(".") + 3);
        }
        total_cost.textContent = "Prezzo Totale: " + obj.totalCost + " €";
        transaction_info.appendChild(total_cost);
        transaction.dataset.totalCost = obj.totalCost;

        /* Creation Transaction_Products */
        transaction_products = document.createElement("div");
        transaction_products.classList.add("transaction_products", "hidden");
        transaction.appendChild(transaction_products);
        /* Creation Transaction_Products_Title */
        transaction_products_title = document.createElement("h1");
        transaction_products_title.classList.add("transaction_products_title");
        transaction_products_title.textContent = "Riepilogo Transazione";
        transaction_products.appendChild(transaction_products_title);

        for (const prod of obj.products) {

            /* Creation Product */
            product = document.createElement("div");
            product.classList.add("product");
            transaction_products.appendChild(product);
            if (user == "restaurant") {
                product.dataset.idProduct = prod.id;
            }

            /* Creation Product_Name */
            prodoct_name = document.createElement("h1");
            prodoct_name.classList.add("product_name");
            prodoct_name.textContent = prod.name[0].toUpperCase() + prod.name.substring(1);
            product.appendChild(prodoct_name);

            /* Creation Product_Info */
            product_info = document.createElement("div");
            product_info.classList.add("product_info");
            product.appendChild(product_info);
            /* Creation Span for Quantity */
            span = document.createElement("span");
            span.textContent = "Quantità: " + prod.quantity;
            product_info.appendChild(span);
            /* Creation Span for Cost */
            span = document.createElement("span");
            span.textContent = "Prezzo Unitario: " + prod.cost;
            product_info.appendChild(span);
            /* Creation Span for Total_Cost */
            span = document.createElement("span");
            span.textContent = "Prezzo Totale: " + prod.totalCost + " €";
            product_info.appendChild(span);
            product.dataset.totalCost = prod.totalCost;

            if (user == "restaurant" && obj.isConfirmedSupplier == null && obj.isConfirmedRestaurant == null) {
                /* Creation Input */
                input = document.createElement("input");
                input.classList.add("delete_transaction_product", "cursor");
                input.type = "button";
                input.value = "Elimina";
                input.addEventListener("click", transactionDeleteProduct);
                product.appendChild(input);
            }
        }

        /* Creation Block_Transaction_Input_Text */
        block_transaction_input_text = document.createElement("div");
        block_transaction_input_text.classList.add("block_transaction_input_text");
        transaction_products.appendChild(block_transaction_input_text);

        if (user == "restaurant" && obj.isConfirmedSupplier == null && obj.isConfirmedRestaurant == null) {
            /* Creation Block_Transaction_Input */
            block_transaction_input = document.createElement("div");
            block_transaction_input.classList.add("block_transaction_input");
            block_transaction_input_text.appendChild(block_transaction_input);
            /* Creation Input */
            input1 = document.createElement("input");
            input1.type = "button";
            input1.value = "Conferma Transazione";
            input1.classList.add("confirm_transaction", "cursor");
            input1.addEventListener("click", transactionSuccessTransaction);
            block_transaction_input.appendChild(input1);
            input2 = document.createElement("input");
            input2.type = "button";
            input2.value = "Elimina Transazione";
            input2.classList.add("delete_transaction", "cursor");
            input2.addEventListener("click", transactionDeleteTransaction);
            block_transaction_input.appendChild(input2);
        } else if (user == "supplier" && obj.isConfirmedSupplier == null && obj.isConfirmedRestaurant == true) {
            /* Creation Block_Transaction_Input */
            block_transaction_input = document.createElement("div");
            block_transaction_input.classList.add("block_transaction_input");
            block_transaction_input_text.appendChild(block_transaction_input);
            /* Creation Input */
            input1 = document.createElement("input");
            input1.type = "button";
            input1.value = "Accetta Transazione";
            input1.classList.add("accept_transaction", "cursor");
            input1.addEventListener("click", transactionSuccessTransaction);
            block_transaction_input.appendChild(input1);
            input2 = document.createElement("input");
            input2.type = "button";
            input2.value = "Rifiuta Transazione";
            input2.classList.add("decline_transaction", "cursor");
            input2.addEventListener("click", transactionDeclineTransaction);
            block_transaction_input.appendChild(input2);
        }

        /* Creation Span */
        span = document.createElement("span");
        block_transaction_input_text.appendChild(span);
        if (obj.isConfirmedRestaurant == true) {
            if (obj.isConfirmedSupplier == null) {
                span.textContent = "Transazione in attesa del Fornitore";
            } else if (obj.isConfirmedSupplier == true) {
                span.textContent = "Transazione confermata !";
                span.classList.add("green");
            } else if (obj.isConfirmedSupplier == false) {
                span.textContent = "Transazione rifiutata !";
                span.classList.add("error");
            }
        }
    }
}

function doNothing(event) {
    event.stopPropagation();
}

/* Main Function */

function createBlocks(json) {

    const products = document.querySelector("#products");
    products.innerHTML = "";

    if (json.length == 0) {
        const noProducts = document.createElement("h1");
        noProducts.id = "noProducts";
        noProducts.textContent = "Nessun Prodotto Disponibile !";
        products.appendChild(noProducts);
        return;
    }

    let product;
    let product_name, product_info, product_button;
    let span;

    for (const obj of json) {

        /* Creation Product */
        product = document.createElement("div");
        product.dataset.idproduct = obj.id;
        product.classList.add("product");
        products.appendChild(product);

        /* Creation Product_Name */
        product_name = document.createElement("h1");
        product_name.classList.add("product_name");
        product_name.textContent = obj.name[0].toUpperCase() + obj.name.substring(1).toLowerCase();
        product.appendChild(product_name);
        /* Creation Product_Info */
        product_info = document.createElement("div");
        product_info.classList.add("product_info");
        product.appendChild(product_info);
        /* Creation Product_Button */
        product_button = document.createElement("input");
        product_button.type = "button";
        product_button.addEventListener("click", openModal);
        product.appendChild(product_button);

        /* Creation Span for Total_Quantity and Quantity */
        span = document.createElement("span");
        product_info.appendChild(span);

        if (user == "restaurant") {
            product_button.value = "Acquista";
            product_button.classList.add("product_button_buy", "cursor");
            span.textContent = "Quantità Totale: " + obj.quantity;
        } else if (user == "supplier") {
            product_button.value = "Modifica";
            product_button.classList.add("product_button_modify", "cursor");
            span.textContent = "Quantità: " + obj.quantity;
            /* Creation Span for Cost */
            span = document.createElement("span");
            span.textContent = "Prezzo Unitario: " + obj.cost + " €";
            product_info.appendChild(span);
        }
    }
}

function createLateralBlocks() {
    const lateral_blockList = document.querySelectorAll(".lateral_block");
    let image;

    for (const lateral_block of lateral_blockList) {
        for (let i = 0; i < MAX_LATERAL_BLOCK; i++) {
            image = document.createElement("img");
            image.classList.add("lateral_image");
            lateral_block.appendChild(image);
        }
    }
}
