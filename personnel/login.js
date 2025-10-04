document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = this.identifiant.value;
    const mdp = this.mdp.value;
    fetch('login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `identifiant=${encodeURIComponent(id)}&mdp=${encodeURIComponent(mdp)}`
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert('Connexion réussie !');
            // Redirection ou affichage de l'espace personnel
        } else {
            alert(data.message || 'Erreur de connexion.');
        }
    });
});
