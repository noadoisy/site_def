// Remplace l'URL par celle de ton backend Render ou Railway
const API_URL = 'https://api-noadoisy.onrender.com/api/login'; 

document.querySelector('.login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const identifiant = this.identifiant.value;
  const mdp = this.mdp.value;
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ identifiant, mdp })
  });
  const data = await res.json();
  if (data.success) {
    if (data.role === 'admin') {
      window.location.href = '/personnel/admin.html';
    } else {
      window.location.href = '/personnel/user.html';
    }
  } else {
    alert(data.error || 'Erreur de connexion');
  }
});
