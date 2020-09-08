import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/pagination";
const CostumersPageWithPagination = (props) => {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
      )
      .then((response) => {
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
      })

      .catch((error) => console.log(error.response));
  }, [currentPage]);
  const handleDelete = (id) => {
    console.log(id);
    const originalCustomers = [...customers];
    //
    setCustomers(customers.filter((customer) => customer.id !== id));

    //
    axios
      .delete("http://127.0.0.1:8000/api/customers/" + id)
      .then((response) => console.log(response))
      .catch((error) => {
        setCustomers(originalCustomers);
        console.log(error.response);
      });
  };
  const handlePageChange = (page) => {
      setCustomers([]);
    setCurrentPage(page);
  };

  const paginatedCustomers = Pagination.getData(
    customers,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <h1>Liste des clients(pagination)</h1>
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
        <tbody>
            {customers.length === 0 && (<tr>
                <td>chargement ...</td>
            </tr>)}
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <a href="#">
                  {customer.firstName} {customer.lastName}
                </a>
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
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default CostumersPageWithPagination;
