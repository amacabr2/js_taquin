<?php

    if (isset($_POST['recherche']) and is_numeric($_POST['recherche']) and $_POST['recherche'] == 1) {
        $list = rechercheFile();
        echo json_encode($list);
    }

    /**
     * Cherche dans le répertoire d'image les images proposées
     * @return array
     */
    function rechercheFile() {
        $list = [];
        if ($dossier = opendir('../img/jeu')) {
            while(false !== ($fichier = readdir($dossier))) {
                if ($fichier != '.' and $fichier != '..') {
                    array_push($list, $fichier);
                }
            }
        }
        return $list;
    }