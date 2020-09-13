
import React ,{useState} from 'react'
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import usersAPI from '../services/usersAPI';
import UsersAPI from "../services/usersAPI";
const RegisterPage = ({history}) => {
    const [user, setUser] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password :"",
        passwordConfirm:""
    });
    const [errors, setErrors] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password :"",
        passwordConfirm:""
    });
     const handleChange = ({ currentTarget }) => {
       const { name, value } = currentTarget;
       setUser({ ...user, [name]: value });
     };
     const handleSubmit=async(event)=>{
         event.preventDefault();
         const apiErrors = {};
         if(user.password !== user.passwordConfirm){
             apiErrors.passwordConfirm="Votre mot de passe n'est pas conforme avec le mot de passe original";
             setErrors(apiErrors);
             return;
         }
        try {
          await usersAPI.register(user);
          setErrors({});
         history.replace('/login');
         
        } catch ({ response }) {
          const { violations } = response.data;
          if (violations) {
            violations.forEach(({ propertyPath, message }) => {
              apiErrors[propertyPath] = message;
            });
            setErrors(apiErrors);
          }
        }

     }
    return ( <>
    <h1>
        Inscription</h1>
        <form onSubmit={handleSubmit}>
           <Field name="firstName" label="Prénom" 
           placeholder="votre joli prénom"
           error={errors.firstName}
           value={user.firstName}
           onChange={handleChange}
           /> 
           <Field name="lastName" label="Nom de famille" 
           placeholder="Votre nom de famille"
           error={errors.lastName}
           value={user.lastName}
           onChange={handleChange}
           /> 
           <Field name="email" label="Adresse email" 
           placeholder="votre adresse email"
           type="email"
           error={errors.email}
           value={user.email}
           onChange={handleChange}
           /> 
           <Field name="password" label="Mot de passe" 
           placeholder="Votre mot de passe ultra sécurisé"
           error={errors.password}
           type="password"
           value={user.password}
           onChange={handleChange}
           /> 
           <Field name="passwordConfirm" label="Confirmation de mot de passe" 
           placeholder="Confirmez votre mot de passe"
           error={errors.passwordConfirm}
           type="password"
           value={user.passwordConfirm}
           onChange={handleChange}
           /> 
           <div className="form-group">
               <button type="submit" className="btn btn-success">
                   Confirmation
                   </button>
                   <Link to="/login" className="btn btn-link"> j'ai déja un compte</Link>
                   </div>
        </form>
        </>
           );
}
 
export default RegisterPage;