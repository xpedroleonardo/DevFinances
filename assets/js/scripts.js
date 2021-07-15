const modal = document.querySelector(".modal-overlay").classList;
const tbody = document.querySelector("tbody");

function toggle() {
  if (modal.contains("active")) {
    modal.remove("active");
  } else {
    modal.add("active");
  }
}

const transactions = [
  {
    description: "Luz",
    amount: -50000,
    date: "01/01/2021",
  },
  {
    description: "Site",
    amount: 500000,
    date: "05/04/2021",
  },
  {
    description: "Internet",
    amount: -20000,
    date: "05/05/2021",
  },
];

const Transaction = {
  all: transactions,
  add(transaction) {
    this.all.push(transaction);
    App.reload();
  },
  remove(index) {
    this.all.splice(index, 1);
    App.reload();
  },
  income() {
    let income = 0;
    this.all.forEach(({ amount }) => {
      if (amount > 0) {
        income += amount;
      }
    });

    return income;
  },
  expenses() {
    let expense = 0;
    this.all.forEach(({ amount }) => {
      if (amount < 0) {
        expense += amount;
      }
    });

    return expense;
  },
  total() {
    return this.income() + this.expenses();
  },
};

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const DOM = {
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);
    tbody.appendChild(tr);
  },
  innerHTMLTransaction({ description, date, amount }) {
    const classCss = amount > 0 ? "income" : "expense";
    amount = Utils.formatCurrency(amount);

    const html = `
      <td class="description">${description}</td>
      <td class=${classCss}>${amount}</td>
      <td class="date">${date}</td>
      <td>
        <img
          src="assets/img/minus.svg"
          alt="Remover transação"
          draggable="false"
        />
      </td>`;

    return html;
  },
  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.income()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },
  clearTransactions() {
    tbody.innerHTML = "";
  },
};

const Form = {
  submit(event) {
    event.preventDefault();
    console.log("ola");
  },
};

const App = {
  init() {
    Transaction.all.forEach((transaction) => DOM.addTransaction(transaction));
    DOM.updateBalance();
  },
  reload() {
    DOM.clearTransactions();
    this.init();
  },
};

App.init();
