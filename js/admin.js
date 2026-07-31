import {
    getEmployees,
    addEmployee,
    deleteEmployee
} from './firebase.js';

const form = document.getElementById('employeeForm');
const list = document.getElementById('employeesList');

async function renderEmployees() {

    const employees = await getEmployees();

    list.innerHTML = '';

    employees.forEach(employee => {

        const item = document.createElement('div');

        item.innerHTML = `
            <strong>${employee.name}</strong>
            (${employee.birthday})

            <button data-id="${employee.id}">
                Видалити
            </button>
        `;

        const btn = item.querySelector('button');

        btn.addEventListener('click', async () => {

            if (!confirm('Видалити співробітника?')) {
                return;
            }

            await deleteEmployee(employee.id);

            renderEmployees();
        });

        list.appendChild(item);
    });
}

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    await addEmployee({
        name: document.getElementById('name').value,
        birthday: document.getElementById('birthday').value,
        active: true
    });

    form.reset();

    renderEmployees();
});

renderEmployees();