import {
    getEmployees,
    addEmployee,
    deleteEmployee,
    updateEmployee,
    login,
    logout,
    authState
} from './firebase.js';

const form = document.getElementById('employeeForm');
const list = document.getElementById('employeesList');
const message = document.getElementById('message');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const adminContent = document.getElementById('adminContent');
let editingId = null;

loginBtn.addEventListener('click', async () => {

    try {

        await login(
            emailInput.value,
            passwordInput.value
        );

    } catch (error) {

        alert('Невірний логін або пароль');

        console.error(error);
    }
});

logoutBtn.addEventListener('click', async () => {

    await logout();
});

function showMessage(text) {

    message.textContent = text;

    setTimeout(() => {
        message.textContent = '';
    }, 3000);
}

document.getElementById('cancelEdit')
    .addEventListener('click', () => {

        form.reset();

        editingId = null;

        document.querySelector('#employeeForm button[type="submit"]')
            .textContent = 'Додати співробітника';
    });

function formatBirthday(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long'
    });
}

async function renderEmployees() {
    const employees = await getEmployees();
    
    employees.sort((a, b) =>
        a.name.localeCompare(b.name, 'uk')
    );

    list.innerHTML = '';

    employees.forEach(employee => {

        const item = document.createElement('div');
        item.className = 'employee-card';

        item.innerHTML = `
        <div class="employee_info">
            <strong>${employee.name}</strong>
            ${formatBirthday(employee.birthday)}
        </div>
        <div class="employee_btn">
        <button class="edit-btn">
            Редагувати
        </button>

        <button class="delete-btn">
            Видалити
        </button>
        </div>
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
            showMessage('✓ Співробітника видалено');
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

        showMessage('✓ Зміни збережено');

    } else {

        await addEmployee(
            employeeData
        );

        showMessage('✓ Співробітника додано');
    }

    form.reset();

    editingId = null;

    document.querySelector('#employeeForm button')
        .textContent = 'Додати співробітника';

    renderEmployees();
});

const ALLOWED_EMAIL = 'rionskey@gmail.com';

authState(user => {
    

    if (user) {

        try {

            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            adminContent.style.display = 'block';
            emailInput.style.display = 'none';
            passwordInput.style.display = 'none';

            renderEmployees();

        } catch (error) {
            console.error('AUTH BLOCK ERROR:', error);
        }

    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        adminContent.style.display = 'none';
        emailInput.style.display = 'inline-block';
        passwordInput.style.display = 'inline-block';
    }
});