<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\UserRepository;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Form\FormTypeInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="`user`")
 * @UniqueEntity(
 *  fields={"email"},
 *  message="Un compte est déjà associé à cette adresse email"
 * )
 */
class User implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Email()
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(min="8", minMessage="Votre mot de passe doit contenir au moins 8 caractères")
     */
    private $password;

    // Champs qui n'existe pas au sein de la BDD
    /**
     * @Assert\EqualTo(propertyPath="password", message="Votre mot de passe doit être identique à celui saisi ci-dessus")
     */
    public $confirm_password;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getUsername()
    {
        return $this->username;
    }

    // Arguments à corriger
    public function setUsername($username)
    {
        $this->username = $username;
    }

    // public function getFirstname(): ?string
    // {
    //     return $this->firstname;
    // }

    // public function setFirstname(string $firstname): self
    // {
    //     $this->firstname = $firstname;

    //     return $this;
    // }

    // public function getLastname(): ?string
    // {
    //     return $this->lastname;
    // }

    // public function setLastname(string $lastname): self
    // {
    //     $this->lastname = $lastname;

    //     return $this;
    // }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function eraseCredentials() {}

    public function getSalt() {}

    public function getRoles()
    {
        return ['ROLE_USER'];
    }
}
