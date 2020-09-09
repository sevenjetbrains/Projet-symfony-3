import React ,{useState, useContext} from 'react';

import AuthAPI from '../services/authAPI';
import AuthContext from '../contexts/AuthContext';

const LoginPage = ({history}) => {
  const {setIsAuthenticated}=useContext(AuthContext);
    const [credentials,setCredentials]=useState({
        username : "",
        password :""
    });
    const [error,setError]=useState("");
    //Gestion des champs
    const handleChange=({currentTarget})=>{
      
        const {value,name}=currentTarget;
        setCredentials({...credentials,[name]:value});
    }
    //Gestion du submit
    const handleSubmit =async event=>{
        event.preventDefault();
        try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
        } catch (error) {
          setError(
            "Aucun compte ne posséde cette adresse ou alors les informations ne correspondent pas"
          );
        }
    }
    return (
      <>
        <h1>connexion a l'application</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Adresse email</label>
            <input
            value={credentials.username}
            onChange={handleChange}
              type="email"
              id="username"
              placeholder="Adresse email de connexion"
              name="username"
              className={"form-control" + (error && " is-invalid")}
            />
              {error && <p className="invalid-feedback"> {error} </p>}
              </div>
            <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
            value={credentials.password}
            onChange={handleChange}
              type="password"
              id="password"
              placeholder="mot de passe"
              name="password"
              className="form-control"
            />
          </div>
          <div className="form-group"><button type="submit" className="btn btn-success">je me connecte</button></div>
        </form>
      </>
    );
}
 
export default LoginPage;