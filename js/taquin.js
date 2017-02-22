let xhr;
let imgChoisit = "choix2.jpeg";
let taille = 4;
let msec = 0;
let sec = 0;
let min = 0;

const plateau = document.getElementById('plateau');
const plateauImg = document.getElementById('plateau-img');
const choixImage = document.getElementById('choixImage');
const listImgInModal = document.getElementById('listImgInModal');
const info = document.getElementById('info');

/**
 * Fonction appelé dès le chargement de la page
 */
function register() {

    plateau.style.height = plateau.offsetWidth / 1.2 + "px";

    if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
    else if (window.ActiveXObject) xhr = new ActiveXObject("Microsoft.XMLHTTP");

    rechercheImg();
    remplirPlateau();

    info.innerText = "Bienvenue sur le jeu DragonBall Taquin";

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

/**
 * Ajoute l'image choisit au plateau
 */
function remplirPlateau() {
    plateauImg.src = `../img/jeu/${imgChoisit}`;
}

/**
 * Donne la taille du taquin et annonce le début du jeu
 * @param t
 */
function setTaille(t) {
    taille = t;
    setTimeout(function () {
        info.innerText = "Attention le jeu va bientôt commencer, mémorisez bien l'image.";
        setTimeout(function () {
            info.innerText = "A vos marque...";
            setTimeout(function () {
                info.innerText = "...prêt...";
                setTimeout(function () {
                    info.innerText = "...partezzzzzz!!!!!!!!!!!!!!!!";
                    setTimeout(function () {
                        startChrono();
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 2000);
    }, 1000);
}

/**
 * Démarre le chrono
 */
function startChrono(){

    msec++;
    if (msec > 99) {
        msec = 0;
        sec++
    }
    if (sec > 59) {
        sec = 0;
        min++;
    }

    let s_msec;
    let s_sec;
    let s_min;

    if (min < 10) s_min = "0" + min;
    if (sec < 10) s_sec = "0" + sec;
    if(msec < 10) s_msec = "00" + msec;
    if(msec < 100) s_msec = "0" + msec;

    info.innerHTML =  "<b>Chrono : </b><br>" + s_min + ":" + s_sec + ":" + s_msec;
    setTimeout("startChrono()", 10);

}