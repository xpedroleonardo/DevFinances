const modal = document.querySelector(".modal-overlay").classList;
const tbody = document.querySelector("tbody");

function toggle() {
  if (modal.contains("active")) {
    modal.remove("active");
  } else {
    modal.add("active");
  }
}

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("devfinance")) || [];
  },
  set(transactions) {
    localStorage.setItem("devfinance", JSON.stringify(transactions));
  },
};

const Transaction = {
  all: Storage.get(),
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
  formatAmount(value) {
    value = value * 100;
    return Math.round(value);
  },
  formatDate(date) {
    const spliteDate = date.split("-");
    return `${spliteDate[2]}/${spliteDate[1]}/${spliteDate[0]}`;
  },
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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    tbody.appendChild(tr);
  },
  innerHTMLTransaction({ description, date, amount }, index) {
    const classCss = amount > 0 ? "income" : "expense";
    amount = Utils.formatCurrency(amount);

    const html = `
      <td class="description">${description}</td>
      <td class=${classCss}>${amount}</td>
      <td class="date">${date}</td>
      <td>
        <img
          onclick="Transaction.remove(${index})"
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
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),
  getValues() {
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value,
    };
  },
  formatData() {
    let { description, amount, date } = this.getValues();

    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },
  validateFields() {
    const { description, amount, date } = this.getValues();

    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Preencha todos os campos");
    }
  },
  clearFields() {
    this.description.value = "";
    this.amount.value = "";
    this.date.value = "";
  },
  submit(event) {
    event.preventDefault();
    try {
      this.validateFields();
      const transaction = this.formatData();
      Transaction.add(transaction);
      this.clearFields();
      toggle();
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction);
    DOM.updateBalance();
    Storage.set(Transaction.all);
  },
  reload() {
    DOM.clearTransactions();
    this.init();
  },
};

App.init();
