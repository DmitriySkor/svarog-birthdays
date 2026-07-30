export async function getEmployees() {
  const response = await fetch('./data/employees.json');
  return await response.json();
}