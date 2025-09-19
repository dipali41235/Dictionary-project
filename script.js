class DictionaryApp {
            constructor() {
                this.apiKey = 'tmzQqPk8v0EuGfP1d7pWBw==sTExHT0IOuEvNul1';
                this.recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
                this.initializeEventListeners();
                this.updateRecentSearches();
            }

            initializeEventListeners() {
                const searchBtn = document.getElementById('searchBtn');
                const wordInput = document.getElementById('wordInput');
                const copyBtn = document.getElementById('copyBtn');
                const speakBtn = document.getElementById('speakBtn');

                searchBtn.addEventListener('click', () => this.searchWord());
                wordInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.searchWord();
                });
                wordInput.addEventListener('input', () => this.hideError());

                copyBtn.addEventListener('click', () => this.copyWord());
                speakBtn.addEventListener('click', () => this.speakWord());
            }

            async searchWord() {
                const word = document.getElementById('wordInput').value.trim();
                
                if (!word) {
                    this.showError('Please enter a word to search');
                    return;
                }

                this.showLoading();
                this.hideError();
                this.hideEmptyState();

                try {
                    const response = await fetch(`https://api.api-ninjas.com/v1/dictionary?word=${encodeURIComponent(word)}`, {
                        method: 'GET',
                        headers: { 'X-Api-Key': this.apiKey }
                    });

                    if (!response.ok) {
                        throw new Error('Word not found in dictionary');
                    }

                    const data = await response.json();
                    this.displayResult(data);
                    this.addToRecentSearches(word);
                    
                } catch (error) {
                    this.showError(error.message);
                } finally {
                    this.hideLoading();
                }
            }

            displayResult(data) {
                const wordTitle = document.getElementById('wordTitle');
                const definitionText = document.getElementById('definitionText');
                const validityBadge = document.getElementById('validityBadge');
                const resultSection = document.getElementById('resultSection');

                wordTitle.textContent = data.word || 'Unknown';
                definitionText.textContent = data.definition || 'No definition available';
                
                // Set validity badge
                const isValid = data.valid !== false;
                validityBadge.className = `validity-badge ${isValid ? 'valid' : 'invalid'}`;
                validityBadge.innerHTML = `
                    <span class="material-icons">${isValid ? 'check_circle' : 'cancel'}</span>
                    ${isValid ? 'Valid Word' : 'Invalid Word'}
                `;

                resultSection.style.display = 'block';
                this.currentWord = data.word;
            }

            addToRecentSearches(word) {
                const normalizedWord = word.toLowerCase();
                this.recentSearches = this.recentSearches.filter(w => w.toLowerCase() !== normalizedWord);
                this.recentSearches.unshift(word);
                this.recentSearches = this.recentSearches.slice(0, 10);
                
                localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
                this.updateRecentSearches();
            }

            updateRecentSearches() {
                const recentSearchesDiv = document.getElementById('recentSearches');
                const recentList = document.getElementById('recentList');

                if (this.recentSearches.length === 0) {
                    recentSearchesDiv.style.display = 'none';
                    return;
                }

                recentList.innerHTML = '';
                this.recentSearches.forEach(word => {
                    const item = document.createElement('div');
                    item.className = 'recent-item';
                    item.textContent = word;
                    item.addEventListener('click', () => {
                        document.getElementById('wordInput').value = word;
                        this.searchWord();
                    });
                    recentList.appendChild(item);
                });

                recentSearchesDiv.style.display = 'block';
            }

            copyWord() {
                if (this.currentWord) {
                    navigator.clipboard.writeText(this.currentWord).then(() => {
                        this.showToast('Word copied to clipboard');
                    });
                }
            }

            speakWord() {
                if (this.currentWord && 'speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(this.currentWord);
                    utterance.rate = 0.8;
                    speechSynthesis.speak(utterance);
                }
            }

            showLoading() {
                document.getElementById('loading').style.display = 'block';
                document.getElementById('resultSection').style.display = 'none';
            }

            hideLoading() {
                document.getElementById('loading').style.display = 'none';
            }

            showError(message) {
                const errorMessage = document.getElementById('errorMessage');
                const errorText = document.getElementById('errorText');
                errorText.textContent = message;
                errorMessage.style.display = 'block';
                document.getElementById('resultSection').style.display = 'none';
            }

            hideError() {
                document.getElementById('errorMessage').style.display = 'none';
            }

            hideEmptyState() {
                document.getElementById('emptyState').style.display = 'none';
            }

            showToast(message) {
                // Simple toast notification
                const toast = document.createElement('div');
                toast.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #1a1a1a;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    z-index: 1000;
                    animation: slideUp 0.3s ease;
                `;
                toast.textContent = message;
                document.body.appendChild(toast);

                setTimeout(() => {
                    toast.remove();
                }, 2000);
            }
        }

        
        document.addEventListener('DOMContentLoaded', () => {
            new DictionaryApp();
        });

        // Add slideUp animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
