<?php

    try {
        $bdd = new PDO('mysql:host=localhost;dbname=js_taquin;charset=utf8', 'amacabr2', 'sub@bg10');
        array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION);
    } catch(Exception $e) {
        die('Erreur : '.$e->getMessage());
    }


