import {
    getEmployees,
    addEmployee,
    deleteEmployee,
    updateEmployee
} from './firebase.js';

const form = document.getElementById('employeeForm');
const list = document.getElementById('employeesList');
let editingId = null;

async function renderEmployees() {

    const employees = await getEmployees();
    employees.sort((a, b) =>
        a.name.localeCompare(b.name, 'uk')
    );

    list.innerHTML = '';

    employees.forEach(employee => {

        const item = document.createElement('div');

        item.innerHTML = `
        <strong>${employee.name}</strong>
        (${employee.birthday})

        <button class="edit-btn">
            Редагувати
        </button>

        <button class="delete-btn">
            Видалити
        </button>
    `;

        const editBtn = item.querySelector('.edit-btn');
        const deleteBtn = item.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => {

            document.getElementById('name').value =
                employee.name;

            document.getElementById('birthday').value =
                employee.birthday;

            editingId = employee.id;

            document.querySelector('#employeeForm button')
                .textContent = 'Зберегти зміни';
        });

        deleteBtn.addEventListener('click', async () => {

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

    const employeeData = {
        name: document.getElementById('name').value,
        birthday: document.getElementById('birthday').value,
        active: true
    };

    if (editingId) {

        await updateEmployee(
            editingId,
            employeeData
        );

    } else {

        await addEmployee(
            employeeData
        );
    }

    form.reset();

    editingId = null;

    document.querySelector('#employeeForm button')
        .textContent = 'Додати співробітника';

    renderEmployees();
});

renderEmployees();