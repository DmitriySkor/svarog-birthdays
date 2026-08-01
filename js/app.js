import {
     getEmployees,
     login,
     authState 
    } from './firebase.js';

    const loginBtn = document.getElementById('loginBtn');
    const calendarContent = document.getElementById('calendarContent');

async function loadEmployees() {
    return await getEmployees();
}


    loginBtn.addEventListener(
    'click',
    async () => {

        try {

            await login(
                document.getElementById('email').value,
                document.getElementById('password').value
            );

        } catch (error) {

            alert('Невірний логін або пароль');
        }
    }
);

function getBirthdayDateForYear(birthday, year) {
    const date = new Date(birthday);
    return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getUpcomingBirthdays(employees) {
    const today = new Date();

    return employees
        .map(emp => {
            const birth = new Date(emp.birthday);

            let nextBirthday = new Date(
                today.getFullYear(),
                birth.getMonth(),
                birth.getDate()
            );

            if (nextBirthday < today) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }

            return {
                ...emp,
                nextBirthday
            };
        })
        .sort((a, b) => a.nextBirthday - b.nextBirthday)
        .slice(0, 10);
}

function renderUpcoming(employees) {

    const container =
        document.getElementById('upcomingList');

    container.innerHTML = '';

    getUpcomingBirthdays(employees)
        .forEach(emp => {

            const div = document.createElement('div');

            div.className = 'birthday-item';

            div.innerHTML = `
                <strong>${emp.name}</strong><br>
                ${emp.nextBirthday.toLocaleDateString(
                    'uk-UA',
                    {
                        day: 'numeric',
                        month: 'long'
                    }
                )}
            `;

            container.appendChild(div);
        });
}

function renderTodayBirthdays(employees) {
    const today = new Date();

    const birthdays = employees.filter(emp => {
        const birth = new Date(emp.birthday);

        return (
            birth.getDate() === today.getDate() &&
            birth.getMonth() === today.getMonth()
        );
    });

    if (!birthdays.length) return;

    document.getElementById('todayBirthdays')
        .classList.remove('hidden');

    document.getElementById('todayList').innerHTML =
        birthdays.map(emp => `<p>${emp.name}</p>`).join('');
}

async function initCalendar() {

    const employees = (await getEmployees())
        .filter(emp => emp.active);

    renderUpcoming(employees);
    renderTodayBirthdays(employees);

    const currentYear =
        new Date().getFullYear();

    const events = employees.map(emp => ({
        title: emp.name,
        start: getBirthdayDateForYear(
            emp.birthday,
            currentYear
        ),
        allDay: true
    }));

    const calendar =
        new FullCalendar.Calendar(
            document.getElementById('calendar'),
            {
                locale: 'uk',
                firstDay: 1,
                initialView: 'dayGridMonth',
                height: 'auto',

                buttonText: {
                    today: 'Сьогодні'
                },

                events,

                eventClick(info) {
                    alert(info.event.title);
                }
            }
        );

    calendar.render();
}

authState(async user => {

    if (user) {

        document
            .getElementById('authBlock')
            .style.display = 'none';

        calendarContent.style.display =
            'block';

        await initCalendar();

    } else {

        document
            .getElementById('authBlock')
            .style.display = 'block';

        calendarContent.style.display =
            'none';
    }
});