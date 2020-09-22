import React, { useEffect, useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';

import customersAPI from '../services/customersAPI';
import { toast } from 'react-toastify';
import FormContentLoader from '../components/loader/FormContentLoader';
const CustomerPage = ({match,history}) => {
  const {id = "new" }=match.params;
 
    const [customer,setCustomer]=useState({
        lastName:"",
        firstName:"",
        email:"",
        company:""

    });
    const [errors, setErrors] = useState({
      lastName: "",
      firstName: "",
      email: "",
      company: "",
    });
    const [editing,setEditing ] = useState(false);
  const [loading, setLoading] = useState(false);

    const fetechCustomer = async (id) =>{
      try {
        
        const { firstName, lastName, email, company } = await customersAPI.find(id);
         
     
        setCustomer({firstName,lastName,email,company});
        setLoading(false);
      } catch (error) {
        toast.error("Le client n'a pas pu étre chargé");
 history.replace("/customers");
      }

    }

    useEffect(() => {
      if(id !== "new"){
        setLoading(true);
         setEditing(true);
         fetechCustomer(id);

        };
      
    }, [id])

    const handleChange=({currentTarget})=>{
        const {name,value}=currentTarget;
        setCustomer({...customer,[name]:value})
    };
    const handleSubmit=async event=>{
        event.preventDefault();
        try {
          setErrors({});
          if(editing){
            await customersAPI.update(id,customer);
            toast.success("Le client a bien été modifié");
            
          }else{
            
            await customersAPI.create(customer);
            toast.success("Le client a bien été créé");
              history.replace("/customers");
          }


        } catch ({response}) {
          const { violations }=response.data;
           if(violations){
             const apiErrors={};
             violations.forEach(({propertyPath,message}) =>
              {apiErrors[propertyPath]=message;}
              );
setErrors(apiErrors);
toast.error("Des erreurs dans votre formulaire !");
           }
        }
       
    };
    return (
      <>
        {(!editing && <h1>Création d'un client</h1>) || (<h1>Modification du client</h1>)}
     { loading && <FormContentLoader/>}
      {!loading &&  <form onSubmit={handleSubmit}>
          <Field
            name="lastName"
            value={customer.lastName}
            label="Nom de famille"
            placeholder="Nom de famille du client"
            onChange={handleChange}
            error={errors.lastName}
          />
          <Field
            name="firstName"
            value={customer.firstName}
            label="Prénom"
            placeholder="Prénom du client"
            onChange={handleChange}
            error={errors.firstName}
          />
          <Field
            name="email"
            value={customer.email}
            label="Email"
            placeholder="Adresse email du client"
            type="email"
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            name="company"
            value={customer.company}
            label="Entreprise"
            placeholder="Entreprise du client"
            onChange={handleChange}
            error={errors.company}
          />
          <div className="form-groupe">
            <button className="btn btn-success">Enregistrer</button>
            <Link to="/customers" className="btn btn-link">
              Retour à la liste
            </Link>
          </div>
        </form>}
      </>
    );
}
 
export default CustomerPage;
