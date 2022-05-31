const Modal = {
    open() { //Abre o modal e adiciona a active class ao modal
        document.querySelector('.modal-overlay').classList.add('active');
    },

    close() { //Fecha o modal e remove active do modal
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions))
    }
}

const Valores = {
    all: Storage.get(),
    
    add(transaction) {
        Valores.all.push(transaction)
        App.reload()
    },

    remove(index) {
        Valores.all.splice(index, 1)
        App.reload()
    },

    incomes() {
        //somar as entradas
        let income = 0;
        Valores.all.forEach(t => {//arrow function, faz a soma dos valores
            if (t.amount > 0) {
                income += t.amount
            }
        })
        return income;
    },

    expenses() {
        //somar as saídas 
        let expenses = 0;
        Valores.all.forEach(t => { //arrow function
            if (t.amount < 0) {
                expenses += t.amount
            }
        })
        return expenses;
    },

    total() {
        //entradas - saídas
        return Valores.incomes() + Valores.expenses()
    }


}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index) {

        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        const html =
            `
                        <td class="description">${transaction.description}</td>
                        <td class="${CSSclass}">${amount}</td>
                        <td class="date">${transaction.date}</td>
                        <td>
                            <img onclick="Valores.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
                        </td>
                    `
        return html
    },

    updateBalance() {
        document
            .querySelector("#incomeDisplay")
            .innerHTML = Utils.formatCurrency(Valores.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Valores.expenses())
        document.getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Valores.total())
    },

    clearValores() {
        DOM.transactionsContainer.innerHTML = ''
    }
}

const Utils = {
    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },
    formatCurrency(value) {

        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField() { //Verificar se todas as informações foram preenchidas
        const { description, amount, date } = Form.getValues()
        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Por favor preencha todos os campos!")


        }
    },

    formatValues() {// formatar os dados para Salvar
        let { description, amount, date } = Form.getValues()
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
            Form.description.value = ""
            Form.amount.value = ""
            Form.date.value = ""
        },

    submit(event) {

        event.preventDefault()

        try {
            Form.validateField()
            const transaction = Form.formatValues()
            Valores.add(transaction)
            Form.clearFields()
            Modal.close()
        } catch (error) {
            window.alert(error.message)
        }
    }
}

const App = {
    init() {
        Valores.all.forEach((transaction, index) => {
            DOM.addTransaction(transaction, index)
        })
        DOM.updateBalance()
        Storage.set(Valores.all)
    },
    reload() {
        DOM.clearValores()
        App.init()
    },
}

    App.init()


