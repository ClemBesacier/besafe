<?php

// src/Controller/LuckyController.php
namespace App\Controller;

use App\Controller\HomeController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// ...

class HomeController extends AbstractController
{
    /**
     * @Route("/")
     */
    public function home()
    {
        return $this->render('home.html.twig', []);
    }
}