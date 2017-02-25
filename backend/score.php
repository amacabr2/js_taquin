<?php

    include 'connexionBdd.php';

    if (isset($_POST['pseudo']) and isset($_POST['min']) and is_numeric($_POST['min']) and isset($_POST['sec']) and is_numeric($_POST['sec']) and isset($_POST['taille']) and is_numeric($_POST['taille'])) {

        $pseudo = htmlspecialchars($_POST['pseudo']);
        $min = htmlspecialchars($_POST['min']);
        $sec = htmlspecialchars($_POST['sec']);
        $taille = htmlspecialchars($_POST['taille']);

        $temps = (string)$min . ":" . (string)$sec;

        if (enregisterScore($bdd, $pseudo, $temps, $taille)) echo 1;
        else echo 0;

    }

    function enregisterScore($bdd, $pseudo, $temps, $taille) {

        $rq = $bdd->prepare("
            insert into score (pseudo, temps, taille)
            values (:pseudo, :temps, :taille)
         ");

        if ($rq->execute(array(
            'pseudo' => $pseudo,
            'temps' => $temps,
            'taille' => $taille
        ))) return true;

        return false;
    }