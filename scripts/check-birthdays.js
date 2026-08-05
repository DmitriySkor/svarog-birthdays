import admin from 'firebase-admin';

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const today = new Date();

const month =
    String(today.getMonth() + 1)
        .padStart(2, '0');

const day =
    String(today.getDate())
        .padStart(2, '0');

const snapshot =
    await db.collection('employees').get();

const birthdays =
    snapshot.docs
        .map(doc => doc.data())
        .filter(emp => {

            if (!emp.active) {
                return false;
            }

            const [, empMonth, empDay] =
                emp.birthday.split('-');

            return (
                empMonth === month &&
                empDay === day
            );
        });

if (!birthdays.length) {

    console.log(
        'Сьогодні іменинників немає'
    );

    process.exit(0);
}

const names =
    birthdays
        .map(emp => `🎉 ${emp.name}`)
        .join('\n');

const message = `
🎂 Сьогодні день народження

${names}
`;

await fetch(
    `https://ntfy.sh/${process.env.NTFY_TOPIC}`,
    {
        method: 'POST',
        body: message
    }
);

console.log(
    'Повідомлення відправлено'
);