<?php
namespace App\Events;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber {
    public function updateJwtData(JWTCreatedEvent $event){
        $user=$event->getUser();
        $data=$event->getData();
        $data['firstName']=$user->getFirstName();
        $data['LastName']=$user->getLastName();
        $event->setData($data);
        //dd($event->getData());
    }
}