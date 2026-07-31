import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA8VXmkXbjF4qTLx06VDGp6UXSCBhPVJ6",
    authDomain: "svarog-birthdays.firebaseapp.com",
    projectId: "svarog-birthdays",
    storageBucket: "svarog-birthdays.firebasestorage.app",
    messagingSenderId: "223994779378",
    appId: "1:223994779378:web:78397482981f8bd310a26b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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