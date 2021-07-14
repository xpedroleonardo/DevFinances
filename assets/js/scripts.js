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
    id: 1,
    description: "Luz",
    amout: -50000,
    date: "01/01/2021",
  },
  {
    id: 2,
    description: "Site",
    amout: 500000,
    date: "05/04/2021",
  },
  {
    id: 3,
    description: "Internet",
    amout: -20000,
    date: "05/05/2021",
  },
];

const Transaction = {
  income() {
    // Entradas
  },
  expenses() {
    // Saídas
  },
  total() {
    // Total restante
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
  innerHTMLTransaction({ description, date, amout }) {
    const classCss = amout > 0 ? "income" : "expense";
    amout = Utils.formatCurrency(amout);

    const html = `
      <td class="description">${description}</td>
      <td class=${classCss}>${amout}</td>
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
};

transactions.forEach((transaction) => DOM.addTransaction(transaction));
