import React, { useEffect, useState } from "react";
import Pagination from "../components/pagination";
import customersAPI from "../services/customersAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loader/TableLoader";

const CustomersPage = (props) => {
  const [customers, setCustomers] = useState([]);
  const [currentPage ,setCurrentPage] = useState(1);
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(true);

  const fetchCustomers= async ()=> {
    try {
      const data= await customersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
        toast.error("Impossible de charger les clients");
    }
  }
  useEffect(() => {
fetchCustomers();

  
    }, []);
  const handleDelete = async (id) => {
    console.log(id);
    const originalCustomers=[...customers];
    //
    setCustomers(customers.filter(customer =>customer.id !== id));

    //
    try {
      await customersAPI.delete(id);
      toast.success("Le client a bien été supprimé");
    } catch (error) {
      setCustomers(originalCustomers);
      toast.error("la suppression du client n'a pas pu fonctionner");
     
    }
    /*-- methode 2
    customersAPI.delete()
    .then(response => console.log(response))
    .catch(error => {
      setCustomers(originalCustomers);
      console.log(error.response);
    });--*/
  }
  const handlePageChange = page => {
    setCurrentPage(page);
  }
  const handleSearch= ({currentTarget}) => {
  
    
   
    setSearch(currentTarget.value);
    setCurrentPage(1);
  }
  const itemsPerPage=10;
  const filteredCustomers=customers.filter(c =>
    c.firstName.toLowerCase().includes(search.toLocaleLowerCase()) ||
    c.lastName.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );
    
   

  const paginatedCustomers =Pagination.getData(filteredCustomers,currentPage,itemsPerPage);

  return (
    <>
    <div className="d-flex mb-3 justify-content-between align-items-center">
      <h1>Liste des clients</h1>
      <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>

    </div>
      <div className="form-group">
        <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher..."/>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id.</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Facture</th>
            <th className="text-center">Montant total</th>
            <th></th>
          </tr>
        </thead>
        { !loading &&<tbody>
          {paginatedCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <Link to={"/customers/" + customer.id}>
                  {customer.firstName} {customer.lastName}
                </Link>
              </td>
              <td>{customer.email}</td>
              <td>{customer.company}</td>
              <td className="text-center">
                <span className="badge badge-primary">
                  {customer.invoices.length}
                </span>
              </td>
              <td className="text-center">
                {customer.totalAmount.toLocaleString()} $
              </td>
              <td>
                <button
                  onClick={() => handleDelete(customer.id)}
                  disabled={customer.invoices.length > 0}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody> }
      </table>
    { loading &&  <TableLoader />}
      { itemsPerPage < filteredCustomers.length && <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length} onPageChanged={handlePageChange} />}
      
    </>
  );
};

export default CustomersPage;
