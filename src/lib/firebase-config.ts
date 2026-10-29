// Firebase web config. Public by design: access is enforced by firestore.rules.
// Hardcoded (not read from env) so deployed builds don't depend on build-time env vars.
export const firebaseConfig = {
  apiKey: "AIzaSyCsIAyxNhTeF1rujBxcbO4mg7VVlmGj-S0",
  authDomain: "dr-prema.firebaseapp.com",
  projectId: "dr-prema",
  messagingSenderId: "932294354895",
  appId: "1:932294354895:web:9563e42a5f87af2f3dd4ba",
};
