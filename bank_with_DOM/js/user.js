const setDataToStorage = (name, data) => {
    if (!Array.isArray(data)) data = []
    data = JSON.stringify(data)
    localStorage.setItem(name, data)
}
const getDataFromStorage = (name) => {
    let data;
    try {
        data = JSON.parse(localStorage.getItem(name))
        if (!Array.isArray(data)) throw new Error('Error')
    }
    catch (exp) {
        data = []
    }
    return data
}
const createElement = (element, parent, classes = '', textContent = '', Attrbuts = []) => {
    const ele = document.createElement(element);
    parent.appendChild(ele);
    ele.classList = classes;
    ele.textContent = textContent;
    Attrbuts.forEach(att => {
        ele.setAttribute(att.name, att.value)
    })
    return ele
}
const addUser = document.querySelector('#addUser');
let lastId;
try {
    lastId = getDataFromStorage('bank')[getDataFromStorage('bank').length - 1].id
}
catch (e) {
    lastId = 4999;
}
const usersHeader = [
    { name: 'id', storeValue: null, stValue: 'value', default: _ => lastId + 1, },
    { name: 'name', storeValue: 'value' },
    { name: 'address', storeValue: 'value' },
    { name: 'phone', storeValue: 'value' },
    { name: 'intiBalance', storeValue: 'value' },
    { name: 'transactions', storeValue: null, default: _ => [] },
];

if (addUser) {
    const users = getDataFromStorage('bank')
    addUser.addEventListener('submit', function (e) {
        const user = {}
        e.preventDefault()
        usersHeader.forEach(ele => {
            if (!ele.storeValue) user[ele.name] = ele.default()
            else user[ele.name] = this.elements[ele.name][ele.storeValue]
        })
        user.transactions = [{ transactionType: 'add', value: +this.elements.intiBalance.value }]
        users.push(user)
        setDataToStorage('bank', users)
        this.reset()
        window.location.replace("index.html")
    })
}
const usersTable = document.querySelector('#usersTable')
const drawData = () => {
    usersTable.innerHTML = "";
    users = getDataFromStorage('bank')

    if (users.length === 0) {
        let tr = createElement('tr', usersTable, 'alert alert-danger')
        createElement('td', tr, '', 'No Users Yet', [{ name: 'colspan', value: 7 }])
    } else {
        users.forEach((user, index) => {
            let tr = createElement('tr', usersTable)
            usersHeader.forEach(el => {
                if (el.name === 'transactions') ''
                else createElement('td', tr, '', user[el.name])
            })
            td = createElement('td', tr, '', user.transactions.length)
            td = createElement('td', tr)
            const add_withDraw = createElement('button', td, 'btn btn-outline-warning m-1', 'Add / withDraw')
            add_withDraw.addEventListener('click', _ => add_withDrawTransaction(index))
            const transaction = createElement('button', td, 'btn btn-outline-success m-1', 'Transaction')
            transaction.addEventListener('click', _ => transactions(index))
            const editBtn = createElement('button', td, 'btn btn-outline-success m-1', 'Edit')
            editBtn.addEventListener('click', (e) => editUser(index))
            const delBtn = createElement('button', td, 'btn btn-outline-danger m-1', 'Delete')
            delBtn.addEventListener('click', (e) => deleteUser(user.id))
        })
    }
}
if (usersTable) drawData()

const deleteUser = (userId) => {
    const newData = getDataFromStorage('bank').filter(user => user.id !== userId);
    setDataToStorage('bank', newData);
    drawData()
}
const add_withDrawTransaction = (index) => {
    setDataToStorage('userIndex', [index])
    window.location.replace('add_transaction.html')
}
const editUser = (index) => {
    setDataToStorage('userIndex', [index])
    window.location.replace('edit.html')
}
const transactions = (index) => {
    setDataToStorage('userIndex', [index])
    window.location.replace('transactions.html')
}
const editUserForm = document.querySelector('#editUserForm');
if (editUserForm) {
    const id = getDataFromStorage('userIndex')[0]
    const users = getDataFromStorage('bank')
    usersHeader.forEach(ele => {
        if (!ele.storeValue) ""
        else editUserForm.elements[ele.name][ele.storeValue] = users[id][ele.name]
    })
    editUserForm.addEventListener('submit', function (e) {
        e.preventDefault()
        usersHeader.forEach(ele => {
            if (!ele.storeValue) ""
            else users[id][ele.name] = this.elements[ele.name][ele.storeValue]
        })
        setDataToStorage('bank', users)
        alert('Account Edit Successfuly')
    })
}
const addTransaction = document.querySelector("#addTransaction");

const drawSingleUser = () => {
    const content = document.querySelectorAll('.col-6 span')
    content.textContent = ""
    const id = getDataFromStorage('userIndex')[0]
    const users = getDataFromStorage('bank')
    usersHeader.forEach((head, i) => {
        if (head.name === 'transactions') content[i].textContent = users[id][head.name].length
        else content[i].textContent = users[id][head.name]
    })
}
if (addTransaction) {
    drawSingleUser()
    addTransaction.addEventListener('submit', function (e) {
        const id = getDataFromStorage('userIndex')[0]
        const users = getDataFromStorage('bank')
        e.preventDefault()
        const newTrans = {}

        newTrans.transactionType = this.elements.type.value;
        newTrans.value = +this.elements.value.value;

        users[id].transactions.push(newTrans)
        setDataToStorage('bank', users)
        this.reset()
        drawSingleUser()
        if (confirm('Transaction added Successfuly do you want redirect to Transactions?')) window.location.replace('transactions.html')
        else ""
    })
}
const userTable = document.querySelector('#userTable')
const privateHead = [
    { name: 'id', storeValue: null },
    { name: 'name', storeValue: null },
    { name: 'transactions', storeValue: 'transactionType' },
    { name: 'transactions', storeValue: 'value' },
]
if (userTable) {
    const id = getDataFromStorage('userIndex')[0]
    user = getDataFromStorage('bank')[id]
    drawSingleUser()
    let x = 0;
    user.transactions.forEach(trans => {
        let tr = createElement('tr', userTable)
        privateHead.forEach(head => {
            let td = createElement('td', tr)
            if (!head.storeValue) td.textContent = user[head.name]
            else td.textContent = trans[head.storeValue]
        })
        trans.transactionType === 'add' ? x += +trans.value : x -= +trans.value

    })
    let tr = createElement('tr', userTable)
    createElement('td', tr, 'fw-bold', 'Total Balance', [{ name: 'colspan', value: 3 }])
    createElement('td', tr, 'fw-bold', '$' + x)

}