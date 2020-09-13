import React, { useEffect, useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';

import customersAPI from '../services/customersAPI';
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
    const fetechCustomer = async (id) =>{
      try {
        
        const { firstName, lastName, email, company } = await customersAPI.find(id);
         
     
        setCustomer({firstName,lastName,email,company})
      } catch (error) {
 history.replace("/customers");
      }

    }

    useEffect(() => {
      
      if(id !== "new"){
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
          if(editing){
            await customersAPI.update(id,customer);
           
          }else{

           await customersAPI.create(customer);
              history.replace("/customers");
          }

            setErrors({});
        } catch ({response}) {
          const {violations}=response.data;
           if(violations){
             const apiErrors={};
             violations.forEach(({propertyPath,message}) =>
              {apiErrors[propertyPath]=message;}
              );
setErrors(apiErrors);
           }
        }
       
    };
    return (
      <>
        {(!editing && <h1>Création d'un client</h1>) || (<h1>Modification du client</h1>)}
        <form onSubmit={handleSubmit}>
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
        </form>
      </>
    );
}
 
export default CustomerPage;
