// This module handles saving and loading reservation data using localStorage
export function saveToLocal(reservations) {
  localStorage.setItem('reservations', JSON.stringify(reservations));
}

// Load array of reservations from localStorage
export function loadFromLocal() {
  const data = localStorage.getItem('reservations');
   // If data exists, parse it back to an array; otherwise, return an empty array
  return data ? JSON.parse(data) : [];
}
