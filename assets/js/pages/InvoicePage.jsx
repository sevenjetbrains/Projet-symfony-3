import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import FormContentLoader from "../components/loader/FormContentLoader";
import CustomersAPI from "../services/customersAPI";

import InvoicesAPI from "../services/invoicesAPI";
const InvoicePage = ({history,match}) => {
  const { id="new" }=match.params;
  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT",
  });
  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: "",
  });
  const [editing, setEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading,setLoading]=useState(true);

  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      setLoading(false);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      toast.error("Impossible de charger les clients");
history.replace("/invoices") ;
    
    }
  };


  const fetchInvoice=async id =>{
    try {
     
  
  
      const { amount, status, customer } = await InvoicesAPI.find(id);
   
      setInvoice({amount,status,customer: customer.id});
      setLoading(false);
    } catch (error) {
      toast.error("Impossible de charger la facture demandée");
      history.replace('/invoices');
      
    }
  }
  useEffect(() => {
  fetchCustomers();
  }, []);
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
      }
  }, [id]);
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if(editing){
        await InvoicesAPI.update(id,invoice);
        toast.success("la facture a bien été modifiée");
          
      }else{

         await InvoicesAPI.create(invoice);
          toast.success("la facture a bien été enregistrer");
        history.replace("/invoices");
      }
    } catch ({ response }) {
      
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        toast.error("Des erreurs dans votre formulaire");
      }
    }
  };
  return (
    <>
      {(!editing && <h1>Création d'une facture</h1>) || (<h1> Modification d'une facture </h1>)}
    {loading && <FormContentLoader />}
      {!loading && <form onSubmit={handleSubmit}>
      <Field
          name="amount"
          type="number"
          placeholder="montant de la facture"
          label="montant"
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />
        <Select
          name="customer"
          label="Client"
          onChange={handleChange}
          value={invoice.customer}
          error={errors.customer}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          label="status"
          onChange={handleChange}
          value={invoice.status}
          error={errors.status}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>}
    </>
  );
};

export default InvoicePage;
