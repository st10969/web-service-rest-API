const apiUrl = 'api.php';

async function caricaGiochi() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const giochi = await response.json();

        // Svuota la lista nel DOM prima di ripopolarla
        const lista = document.getElementById('lista-giochi');
        lista.innerHTML = '';

        giochi.forEach(g => {
            aggiungiElementoAlDOM(g);
        });

    } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
    }
}

async function aggiungiGioco(event) {

    event.preventDefault();

    // Leggiamo i valori inseriti dall'utente nel form
    const titolo      = document.getElementById('titolo').value;
    const piattaforma = document.getElementById('piattaforma').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titolo, piattaforma })
        });

        // Verifichiamo che il server abbia risposto con successo
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const risultato = await response.json();

        if (risultato.status === 'success') {
            aggiungiElementoAlDOM(risultato.item);

            // Svuota i campi del form dopo l'aggiunta
            document.getElementById('form-gioco').reset();
        } else {
            alert('Errore dal server: ' + risultato.message);
        }

    } catch (error) {
        console.error('Errore durante il salvataggio:', error);
    }
}

function svuotaLista() {
    const lista = document.getElementById('lista-giochi');
    lista.innerHTML = ''; // Rimuove tutti i figli dell'elemento <ul>
}

function aggiungiElementoAlDOM(gioco) {
    const lista = document.getElementById('lista-giochi');

    // Creiamo l'elemento <li> che conterrà il gioco
    const li = document.createElement('li');

    // Span per il titolo con testo in grassetto
    const spanTitolo = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = gioco.titolo; // textContent - sicuro contro XSS
    spanTitolo.appendChild(strong);

    // Badge colorato per la piattaforma
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = gioco.piattaforma; // textContent - sicuro contro XSS

    // Assembliamo: li → [spanTitolo, badge]
    li.appendChild(spanTitolo);
    li.appendChild(badge);

    // Aggiungiamo il <li> in fondo alla lista <ul>
    lista.appendChild(li);
}

// Submit del form - aggiunge un nuovo gioco via POST
document.getElementById('form-gioco').addEventListener('submit', aggiungiGioco);

// Click sul pulsante svuota - resetta la lista visivamente
document.getElementById('btn-svuota').addEventListener('click', svuotaLista);

// Caricamento pagina - recupera i giochi esistenti via GET
window.addEventListener('DOMContentLoaded', caricaGiochi);