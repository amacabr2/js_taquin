const plateau = document.getElementById('plateau');
const choixImage = document.getElementById('choixImage');
const listImgInModal = document.getElementById('listImgInModal');
const info = document.getElementById('info');
const errorPseudo = document.getElementById("errorPseudo");
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

    if (distance(caseClique.x, caseClique.y, caseVide.x, caseVide.y) == 1) {
        deplaceTuile(caseVide, caseClique);
        drawPuzzle();
    }

    if (resolu) {
        clear();
        remplirPlateau();
        demandePseudo();
    }

};

/**
 * Fonction appelé dès le chargement de la page
 */
function register() {

    info.innerText = "Bienvenue sur le jeu DragonBall Taquin";
    errorPseudo.style.display = "none";
    img = new Image();
    imgChoisit = "choix1.jpeg";

    if (window.XMLHttpRequest) xhr = new XMLHttpRequest();
    else if (window.ActiveXObject) xhr = new ActiveXObject("Microsoft.XMLHTTP");

    rechercheImg();
    choixImg(imgChoisit);
    setTab();

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
    clear();
    imgChoisit = img;
    remplirPlateau();
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
    clear();
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
    resolu = false;
    document.getElementById("pseudo").value = "";

}

/**
 * Redessine la carte
 */
function drawPuzzle() {

    context.clearRect(0, 0, tailleCanvas, tailleCanvas);

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

/**
 * Affiche le modal bootstrap pour de mander le pseudo du joueur
 */
function demandePseudo() {
    $(function () {
        $("#enregistrePseudo").modal("show");
    });
}

/**
 * Sauvegarde le score dans la base de données
 */
function sauvegarde() {

    if (resolu) {

        let pseudo = document.getElementById("pseudo").value;

        if (pseudo.length == 0) {
            setTimeout(function () {
                errorPseudo.style.display = "block";
                demandePseudo();
            }, 1000);
        } else {

            errorPseudo.style.display = "none";
            resolu = false;

            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseText == 1) {
                        alert("Votre a été enregistré")
                    } else {
                        alert("Erreur dans l'enregistrement, tant pis pour vous si c'était un bon score");
                    }
                }
            };

            xhr.open('POST', '../backend/score.php', true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send("pseudo=" + pseudo + "&min=" + min + "&sec=" + sec + "&taille=" + taille);

        }

    }

}

/**
 * Récupère les scores par rapport à la taille demandé
 * @param t
 */
function getScore(t) {

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            afficheScore(JSON.parse(this.responseText), t);
        }
    };

    xhr.open('POST', '../backend/score.php', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("taille=" + t);
}

/**
 * Affiche les meilleurs scores dans un modal
 * @param tab
 */
function afficheScore(tab, t) {

    console.log(tab);

    const meileurScore = document.getElementById("meileurScore");
    const myModalLabel3 = document.getElementById("myModalLabel3");

    meileurScore.innerHTML = "";

    let row = document.createElement('div');
    row.className = "row";

    let col = document.createElement('div');
    col.className = "col-offset-lg-2 col-lg-8";
    col.style.width = '100%';

    let table = document.createElement('table');
    table.className = "table table-striped table-bordered";
    table.style.textAlign = "center";

    let thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th class="center">Place</th>
            <th class="center">Pseudo</th>
            <th class="center">Temps</th>
        </tr>
    `;

    let tbody = document.createElement('tbody');

    for (let i = 0; i < 3; i++) {

        let tr = document.createElement('tr');

        if (tab[i] != undefined) {

            let tdPlace = document.createElement('td');
            tdPlace.innerText = (i + 1);

            let tdPseudo = document.createElement('td');
            tdPseudo.innerText = tab[i]['pseudo'];

            let tdTemps = document.createElement('td');
            tdTemps.innerText = tab[i]['temps'];

            tr.appendChild(tdPlace);
            tr.appendChild(tdPseudo);
            tr.appendChild(tdTemps);

        } else {
            let tdVide = document.createElement('td');
            tdVide.setAttribute('colspan', '3');
            tdVide.innerText = " - ";
            tr.appendChild(tdVide);
        }

       tbody.appendChild(tr);

    }

    table.appendChild(thead);
    table.appendChild(tbody);
    col.appendChild(table);
    row.appendChild(col);
    meileurScore.appendChild(row);
    myModalLabel3.innerText = "Meilleur score taille " + t;

    $(function () {
        $("#afficheScore").modal("show");
    });

}

/**
 * Arrète tous les timeout en cour
 */
function clear() {
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    clearTimeout(t4);
    clearTimeout(chrono);
}