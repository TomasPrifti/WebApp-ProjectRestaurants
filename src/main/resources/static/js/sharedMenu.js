document.querySelector("#button_menu").addEventListener("click", openMenu);
document.querySelector("#modal_menu").addEventListener("click", doNothing);
document.querySelector("#modal").addEventListener("click", startCloseModal);

/* Functions */

function openMenu(event) {
    document.querySelector("#modal").classList.remove("hidden");
    document.querySelector("#modal").classList.add("flex");
    document.querySelector("#modal_menu").classList.remove("hidden");
    document.querySelector("#modal_menu").classList.add("flex");
    document.body.classList.add("no_scroll");
}

function startCloseModal(event) {
    document.body.classList.remove("no_scroll");
    document.querySelector("#modal").classList.remove("flex");
    document.querySelector("#modal").classList.add("hidden");
    document.querySelector("#modal_menu").classList.remove("flex");
    document.querySelector("#modal_menu").classList.add("hidden");
    if (typeof closeModal !== "undefined")
        closeModal();
}

function doNothing(event) {
    event.stopPropagation();
}
