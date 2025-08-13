document.getElementById('searchBtn').addEventListener('click', fetchWord);
document.getElementById('wordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') fetchWord();
});

async function fetchWord() {
    const word = document.getElementById('wordInput').value.trim();
    const resultCard = document.getElementById('result');

    if (!word) {
        alert("Please enter a word");
        return;
    }

    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/dictionary?word=${word}`, {
            method: 'GET',
            headers: { 'X-Api-Key': 'tmzQqPk8v0EuGfP1d7pWBw==sTExHT0IOuEvNul1' }
        });

        if (!response.ok) throw new Error("Word not found");

        const data = await response.json();

        document.getElementById('word').textContent = data.word || 'N/A';
        document.getElementById('definition').textContent = data.definition || 'No definition available';
        document.getElementById('valid').textContent = data.valid ? 'Yes' : 'No';

        resultCard.classList.remove('hidden');
    } catch (error) {
        alert("Error fetching word: " + error.message);
        resultCard.classList.add('hidden');
    }
}
