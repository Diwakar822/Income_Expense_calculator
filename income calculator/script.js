const totalIncomeElement = document.getElementById("totalIncome");
const totalExpensesElement = document.getElementById("totalExpenses");
const netBalanceElement = document.getElementById("netBalance");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const entryListElement = document.getElementById("entryList");
const addBtn = document.getElementById("addBtn");
const filterInputs = document.getElementsByName("filter");

let entries = JSON.parse(localStorage.getItem("entries")) || [];

function updateLocalStorage() {
    localStorage.setItem("entries", JSON.stringify(entries));
}

function calculateTotals() {
    let totalIncome = 0;
    let totalExpenses = 0;
    
    entries.forEach(entry => {
        if (entry.type === 'income') {
            totalIncome += entry.amount;
        } else {
            totalExpenses += entry.amount;
        }
    });

    totalIncomeElement.textContent = totalIncome;
    totalExpensesElement.textContent = totalExpenses;
    netBalanceElement.textContent = totalIncome - totalExpenses;
}

function renderEntries() {
    entryListElement.innerHTML = "";
    const filterValue = Array.from(filterInputs).find(input => input.checked).value;

    entries.forEach((entry, index) => {
        if (filterValue === 'all' || entry.type === filterValue) {
            const li = document.createElement("li");
            li.textContent = `${entry.description}: $${entry.amount}`;
            li.appendChild(createEditButton(index));
            li.appendChild(createDeleteButton(index));
            entryListElement.appendChild(li);
        }
    });
}

function createEditButton(index) {
    const button = document.createElement("span");
    button.textContent = "Edit";
    button.className = "edit";
    button.onclick = () => {
        descriptionInput.value = entries[index].description;
        amountInput.value = entries[index].amount;
        typeInput.value = entries[index].type;
        addBtn.textContent = "Update Entry";
        addBtn.onclick = () => updateEntry(index);
    };
    return button;
}

function createDeleteButton(index) {
    const button = document.createElement("span");
    button.textContent = "Delete";
    button.className = "delete";
    button.onclick = () => {
        entries.splice(index, 1);
        updateLocalStorage();
        calculateTotals();
        renderEntries();
    };
    return button;
}

function addEntry() {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (!description || isNaN(amount) || amount <= 0) return;

    entries.push({ description, amount, type });
    updateLocalStorage();
    calculateTotals();
    renderEntries();

    descriptionInput.value = "";
    amountInput.value = "";
}

function updateEntry(index) {
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    if (!description || isNaN(amount) || amount <= 0) return;

    entries[index] = { description, amount, type };
    updateLocalStorage();
    calculateTotals();
    renderEntries();

    descriptionInput.value = "";
    amountInput.value = "";
    addBtn.textContent = "Add Entry";
    addBtn.onclick = addEntry;
}

addBtn.onclick = addEntry;

filterInputs.forEach(input => {
    input.addEventListener("change", renderEntries);
});

calculateTotals();
renderEntries();
