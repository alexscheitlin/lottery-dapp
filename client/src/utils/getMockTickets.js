const getMockTickets = () => {
  return new Promise((resolve, reject) => {
    // dummy tickets for UI testing
    const tickets = [];
    tickets.push({ id: 1, number: 1, price: 1.1 });
    tickets.push({ id: 2, number: 6, price: 1.1 });
    tickets.push({ id: 3, number: 4, price: 1.1 });

    setTimeout(function () {
      resolve(tickets);
    }, 1000);
  });
}


export default getMockTickets;
