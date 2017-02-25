const plateau = document.getElementById('plateau');
const plateauImg = document.getElementById('plateau-img');
const choixImage = document.getElementById('choixImage');
const listImgInModal = document.getElementById('listImgInModal');
const info = document.getElementById('info');
const puzzle = document.getElementById('puzzle');
const context = puzzle.getContext('2d');

let xhr;
let sec = 0;
let min = 0;
let chrono;
let img;
let imgChoisit;
let tabPartImg, tabBtn;
let caseVide = {};
let caseClique = {};
let t1, t2, t3, t4;
let taille = 4;
let tailleCanvas = puzzle.width;
let tailleTuile = tailleCanvas / taille;
let resolu = false;

// Suit le mouvement de la souris pour savoir ou on clique
puzzle.onclick = function(e) {
    caseClique.x = Math.floor((e.pageX - 410) / tailleTuile);
    caseClique.y = Math.floor((e.pageY - 90) / tailleTuile);
    console.log("e.pageX = " + e.pageX);
    console.log("e.pageY = " + e.pageY);
    console.log("offsetLeft = " + this.offsetLeft);
    console.log("offsetTop = " + this.offsetLeft);
    console.log("caseClique.x = " + caseClique.x);
    console.log("caseClique.y = " + caseClique.y);
    console.log("caseVide.x = " + caseVide.x);
    console.log("caseVide.y = " + caseVide.y);
    console.log("------------------------------------------------------------------------------------------------------");
    if (distance(caseClique.x, caseClique.y, caseVide.x, caseVide.y) == 1) {
        deplaceTuile(caseVide, caseClique);
        drawPuzzle();
    }
    if (resolu) {
        //setTimeout(function() {alert("You resolu it!");}, 500);
        demandePseudo();
    }
};

/**
 * Fonction appelé dès le chargement de la page
 */
function register() {

    info.innerText = "Bienvenue sur le jeu DragonBall Taquin";
    img = new Image();
    imgChoisit = "choix1.jpeg";

    if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
    else if (window.ActiveXObject) xhr = new ActiveXObject("Microsoft.XMLHTTP");

    rechercheImg();
    choixImg(imgChoisit);

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
    setTaille(taille)
}

/**
 * Ajoute l'image choisit au plateau
 */
function remplirPlateau() {
    img.src = `../img/jeu/${imgChoisit}`;
    context.drawImage(img, 0, 0);
}

/**
 * Donne la taille du taquin et annonce le début du jeu
 * @param t
 */
function setTaille(t) {

    taille = t;
    tailleTuile = tailleCanvas / taille;
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    clearTimeout(t4);
    clearTimeout(chrono);
    sec = 0;
    min = 0;
    info.innerText = "Attention le jeu va bientôt commencer, mémorisez bien l'image.";

    t1 = setTimeout(function () {
        info.innerText = "A vos marque...";
        t2 = setTimeout(function () {
            info.innerText = "...prêt...";
            t3 = setTimeout(function () {
                info.innerText = "...partezzzzzz!!!!!!!!!!!!!!!!";
                t4 = setTimeout(function () {
                    startChrono();
                    setTab();
                    drawPuzzle();
                }, 1000);
            }, 1000);
        }, 1000);
    }, 2000);

}

/**
 * S'occupe du chrono
 */
function startChrono(){

    sec++;
    if (sec > 59) {
        sec = 0;
        min++;
    }

    let s_sec;
    let s_min;

    if (min < 10) s_min = "0" + min;
    else s_min = min;
    if (sec < 10) s_sec = "0" + sec;
    else s_sec = sec;

    info.innerHTML =  "<b>Chrono : </b><br>" + s_min + ":" + s_sec;
    chrono = setTimeout("startChrono()", 1000);

}

/**
 * Définit et initialise la carte virtuelle
 */
function setTab() {

    tabPartImg = new Array(taille);

    for (let i = 0; i < taille; ++i) {

        tabPartImg[i] = new Array(taille);

        for (let j = 0; j < taille; ++j) {
            tabPartImg[i][j] = {};
            tabPartImg[i][j].x = (taille - 1) - i;
            tabPartImg[i][j].y = (taille - 1) - j;
        }

    }

    caseVide.x = tabPartImg[taille - 1][taille - 1].x;
    caseVide.y = tabPartImg[taille - 1][taille - 1].y;

}

/**
 * Redessine la carte
 */
function drawPuzzle() {

    context.clearRect(0, 0, tailleCanvas, tailleCanvas);
    console.log("tailleTuile = " + tailleTuile);

    for (let i = 0; i < taille; ++i) {
        for (let j = 0; j < taille; ++j) {
            let x = tabPartImg[i][j].x;
            let y = tabPartImg[i][j].y;
            if(i != caseVide.x || j != caseVide.y || resolu == true) {
                context.drawImage(img, x * tailleTuile, y * tailleTuile, tailleTuile, tailleTuile, i * tailleTuile, j * tailleTuile, tailleTuile, tailleTuile);
            }
        }
    }

}

/**
 * Permet de savoir si la case cliqué se trouve à côté de la case vide,
 * on calcul pour cela la distance entre la case cliqué et la case vide
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number}
 */
function distance(x1, y1, x2, y2) {
    console.log("x1 = " + x1);
    console.log("y1 = " + y1);
    console.log("x2 = " + x2);
    console.log("y2 = " + y2);
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);

}

/**
 * Déplace la tuile
 * @param toLoc
 * @param fromLoc
 */
function deplaceTuile(toLoc, fromLoc) {
    if (!resolu) {
        tabPartImg[toLoc.x][toLoc.y].x = tabPartImg[fromLoc.x][fromLoc.y].x;
        tabPartImg[toLoc.x][toLoc.y].y = tabPartImg[fromLoc.x][fromLoc.y].y;
        tabPartImg[fromLoc.x][fromLoc.y].x = taille - 1;
        tabPartImg[fromLoc.x][fromLoc.y].y = taille - 1;
        toLoc.x = fromLoc.x;
        toLoc.y = fromLoc.y;
        isGagne();
    }
}

/**
 * Permet de savoir qunad le puzzle est résolu
 */
function isGagne() {
    let flag = true;
    for (let i = 0; i < taille; ++i) {
        for (let j = 0; j < taille; ++j) {
            if (tabPartImg[i][j].x != i ||tabPartImg[i][j].y != j) {
                flag = false;
            }
        }
    }
    resolu = flag;
}

