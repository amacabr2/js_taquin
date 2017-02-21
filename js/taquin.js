let xhr;
let imgChoisit = "choix2.jpeg";

const plateau = document.getElementById('plateau');
const plateauImg = document.getElementById('plateau-img');
const choixImage = document.getElementById('choixImage');
const listImgInModal = document.getElementById('listImgInModal');

/**
 * Fonction appelé dès le chargement de la page
 */
function register() {

    plateau.style.height = plateau.offsetWidth / 1.2 + "px";

    if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
    else if (window.ActiveXObject) xhr = new ActiveXObject("Microsoft.XMLHTTP");

    rechercheImg();
    remplirPlateau();

}

/**
 * Effectue une requète Ajax pour récupéré les image pour l'affichage
 */
function rechercheImg() {

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let listImg = JSON.parse(this.responseText);
            addImgInModal(listImg);
        }
    };

    xhr.open('POST', '../backend/rechercheImg.php', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("recherche=1");

}

/**
 * Ajoute les images au modal
 */
function addImgInModal(listImg) {
    console.log(listImg);
    let container = document.createElement('div');
    container.className = "container-fluid";
    for (let i = 0; i < listImg.length; i++) {
        let row = document.createElement('div');
        row.className = "row";
        let col = document.createElement('div');
        col.className = "col-offset-lg-2 col-lg-8";
        col.style.width = '100%';
        let img = document.createElement('img');
        img.className = "img-responsive img-choix";
        img.src = "../img/jeu/" + listImg[i];
        console.log(img.src);
        img.setAttribute("onclick", `choixImg("${listImg[i]}")`);
        img.setAttribute("data-dismiss", "modal");
        col.appendChild(img);
        row.appendChild(col);
        container.appendChild(row);
    }
    listImgInModal.appendChild(container)
}

/**
 * Enregistre le choix de l'image
 * @param img
 */
function choixImg(img) {
    imgChoisit = img;
    remplirPlateau();
}

function remplirPlateau() {
    plateauImg.src = `../img/jeu/${imgChoisit}`;
}