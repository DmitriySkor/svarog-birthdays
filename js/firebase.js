import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8VXmkXbjF4qTLx06VDGp6UXSCBhPVJ6Y",
  authDomain: "svarog-birthdays.firebaseapp.com",
  projectId: "svarog-birthdays",
  storageBucket: "svarog-birthdays.firebasestorage.app",
  messagingSenderId: "223994779378",
  appId: "1:223994779378:web:78397482981f8bd310a26b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export async function getEmployees() {

    const snapshot = await getDocs(
        collection(db, "employees")
    );

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

export async function addEmployee(employee) {

    await addDoc(
        collection(db, "employees"),
        employee
    );
}

export async function deleteEmployee(id) {

    await deleteDoc(
        doc(db, "employees", id)
    );
}

export async function updateEmployee(id, employee) {

    await updateDoc(
        doc(db, "employees", id),
        employee
    );
}

export async function login(email, password) {

    return await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
}

export async function logout() {

    return await signOut(auth);
}

export function authState(callback) {

    return onAuthStateChanged(
        auth,
        callback
    );
}

export async function exportEmployees() {

    const snapshot = await getDocs(
        collection(db, "employees")
    );

    return snapshot.docs.map(doc => ({
        ...doc.data()
    }));
}

export async function importEmployees(data) {

    const snapshot = await getDocs(
        collection(db, "employees")
    );

    const existingEmployees =
        snapshot.docs.map(doc => doc.data());

    let imported = 0;
    let skipped = 0;

    for (const employee of data) {

        const exists =
            existingEmployees.some(existing =>
                existing.name === employee.name &&
                existing.birthday === employee.birthday
            );

        if (!exists) {

            await addDoc(
                collection(db, "employees"),
                employee
            );

            imported++;

        } else {

            skipped++;
        }
    }

    return {
        imported,
        skipped
    };
}