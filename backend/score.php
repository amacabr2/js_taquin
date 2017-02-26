<?php

    include 'connexionBdd.php';

    if (isset($_POST['pseudo']) and isset($_POST['min']) and is_numeric($_POST['min']) and isset($_POST['sec']) and is_numeric($_POST['sec']) and isset($_POST['taille']) and is_numeric($_POST['taille'])) {

        $pseudo = htmlspecialchars($_POST['pseudo']);
        $min = htmlspecialchars($_POST['min']);
        $sec = htmlspecialchars($_POST['sec']);
        $taille = htmlspecialchars($_POST['taille']);

        $temps = (int)$min * 60 + (int)$sec;

        if (enregisterScore($bdd, $pseudo, $temps, $taille)) echo 1;
        else echo 0;

    } else if (isset($_POST['taille']) and is_numeric($_POST['taille'])) {

        $taille = htmlspecialchars($_POST['taille']);

        $result = recupererScoreByTaille($bdd, $taille);

        echo json_encode($result);

    }

    /**
     * Enregistre le score en base de données
     * @param $bdd
     * @param $pseudo
     * @param $temps
     * @param $taille
     * @return bool
     */
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

    /**
     * Récupère les scores par rapport à la taille
     * @param $bdd
     * @param $taille
     * @return mixed
     */
    function recupererScoreByTaille($bdd, $taille) {

        $rq = $bdd->prepare("
            select * from score 
            where taille = :taille
            order by temps
        ");

        $rq->execute(array(
           'taille' => $taille
        ));

        return $rq->fetchAll();

    }