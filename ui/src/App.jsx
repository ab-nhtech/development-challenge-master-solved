import React, { useState, useEffect } from "react";
import "./App.css";
import Table from "./components/table.jsx";
import { Container, Button } from "@material-ui/core";
import formatCurrency from "./utils/formatCurrency";

import { getUsers } from "./services/users.js";
import { getApplications } from "./services/applications.js";
import { getPayments, createPayment } from "./services/payments.js";

const App = () => {
  /**
   * Hydrate data for the table and set state for users, applications, and payments
   */
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const [usersData, applicationsData, paymentsData] = await Promise.all([
        getUsers(),
        getApplications(),
        getPayments(),
      ]);

      setUsers(usersData.body);
      setApplications(applicationsData.body);
      setPayments(paymentsData.body);
      setDataLoaded(true);
    }
    fetchData();
  }, []);

  const initiatePayment = async ({ applicationUuid, requestedAmount }) => {
    const { body } = await createPayment({
      applicationUuid,
      requestedAmount,
    });
    setPayments([...payments, body]);
  };

  let tableData = [];
  if (dataLoaded) {
    tableData = users.map(({ uuid, name, email }) => {
      const { requestedAmount, uuid: applicationUuid } =
      applications.find((application) => application.userUuid === uuid) || {};
      const { paymentAmount, paymentMethod } =
      payments.find(
        (payment) => payment.applicationUuid === applicationUuid
      ) || {};
      var assert = require('assert');
      return {
        uuid,
        name,
        email,
        requestedAmount: formatCurrency(requestedAmount),
        paymentAmount: formatCurrency(paymentAmount),
        paymentMethod,
        // initiatePayment: !paymentAmount? (

          initiatePayment: requestedAmount && !paymentAmount? (
            //test case: true
              assert.equal(requestedAmount && !paymentAmount, true),
            //test case: false
            // assert.equal(!paymentAmount, false),

            //   function assert() {
            //     if (!paymentAmount) {
            //         throw new Error(false || "Assertion failed");
            //     }
            // },
          <Button
            onClick={() =>
              initiatePayment({
                applicationUuid,
                requestedAmount,
              })
            }
            variant="contained"
          >
            Pay
          </Button>
        ) : null,
      };
    });
  }

  return (
    <div className="App">
      <Container>{dataLoaded && <Table data={tableData} />}</Container>
    </div>
  );
};

export default App;
