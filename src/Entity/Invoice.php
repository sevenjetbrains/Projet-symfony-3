<?php

namespace App\Entity;


use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 * subresourceOperations={
 * "api_customers_invoices_get_subresource"={
 * "normalization_context"={"groups"={"invoices_subresoure"}}
 * }
 * },
 * attributes={
 * "pagination_enabled"=false,
 * "pagination_items_per_page"=20,
 * "order":{"sentAt":"DESC"}
 * },
 * normalizationContext={"groups"={"invoices_read"}},
 * denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(OrderFilter::class,properties={"amount","sentAt"})
 *  
 */
class Invoice
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","customers_read","invoices_subresoure"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read","customers_read","invoices_subresoure"})
     * @Assert\NotBlank(message="le montant de la facture est obligatoire !")
     * @Assert\Type(type="numeric",message="le montant de la facture doit étre un numérique !")
     * 
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read","customers_read","invoices_subresoure"})
     * @Assert\DateTime(message="la date doit étre au format YYYY-MM-DD")
     * @Assert\NotBlank(message="la date d'envoi doit étre renseignée")
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read","customers_read","invoices_subresoure"})
     * @Assert\NotBlank(message="le status de la facture est obligatoire")
     * @Assert\Choice(choices={"SENT","PAID","CANCELLED"},message="le status doit étre SENT,PAID ou CANCELLED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices",fetch="EAGER")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="le client de la facture doit étre renseigné")
     *
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read","customers_read","invoices_subresoure"})
     * @Assert\NotBlank(message="il faut absolument un chrono pour la facture")
     * @Assert\Type(type="integer",message="le chrono doit étre un nombre !")
     */
    private $chrono;
    /**
     * Permet de récupérer le user a qui appartient finalement la facture 
     * @Groups({"invoices_read","invoices_subresoure"})
     *
     * @return User
     */
    public function getUser():User {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount( $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt( $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
