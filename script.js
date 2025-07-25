document.addEventListener('DOMContentLoaded', () => {

    // --- DARK MODE TOGGLE ---
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // --- FOKUS MODE TIMER ---
    const startFocusBtn = document.getElementById('startFocusBtn');
    const resetFocusBtn = document.getElementById('resetFocusBtn');
    const timerDisplay = document.getElementById('timerDisplay');
    const focusDurationInput = document.getElementById('focusDuration');

    let timerInterval;
    let isTimerRunning = false;
    let timeInSeconds = parseInt(focusDurationInput.value) * 60; // Default 25 menit

    function updateTimerDisplay() {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        isTimerRunning = true;
        startFocusBtn.innerHTML = '<i class="fas fa-pause"></i> Jeda';
        timerInterval = setInterval(() => {
            timeInSeconds--;
            updateTimerDisplay();
            if (timeInSeconds <= 0) {
                clearInterval(timerInterval);
                alert("Sesi Fokus Selesai! 🎉");
                resetTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        startFocusBtn.innerHTML = '<i class="fas fa-play"></i> Lanjut';
    }

    focusDurationInput.addEventListener('change', () => {
        if (!isTimerRunning) {
            timeInSeconds = parseInt(focusDurationInput.value) * 60;
            updateTimerDisplay();
        }
    });


    function resetTimer() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timeInSeconds = parseInt(focusDurationInput.value) * 60;
        updateTimerDisplay();
        startFocusBtn.innerHTML = '<i class="fas fa-play"></i> Mulai';
    }


    startFocusBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    resetFocusBtn.addEventListener('click', resetTimer);

    updateTimerDisplay(); // Inisialisasi tampilan timer

    // --- TANTANGAN DETOX ---
    const newChallengeInput = document.getElementById('newChallengeInput');
    const addChallengeBtn = document.getElementById('addChallengeBtn');
    const challengeList = document.getElementById('challengeList');

    let challenges = JSON.parse(localStorage.getItem('challenges')) || [];

    function saveChallenges() {
        localStorage.setItem('challenges', JSON.stringify(challenges));
    }

    function renderChallenges() {
        challengeList.innerHTML = '';
        challenges.forEach((challenge, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <div class="challenge-item">
                    <input type="checkbox" id="challenge-${index}" ${challenge.completed ? 'checked' : ''}>
                    <label for="challenge-${index}" class="challenge-item-text ${challenge.completed ? 'completed' : ''}">${challenge.text}</label>
                </div>
                <div class="challenge-item-actions">
                    <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
                </div>
            `;
            challengeList.appendChild(listItem);
        });

        // Tambahkan event listener untuk checkbox dan tombol hapus setelah render
        document.querySelectorAll('#challengeList input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const index = e.target.id.split('-')[1];
                challenges.splice(index, 1, {...challenges [index], completed: e.target.checked});
                saveChallenges();
                renderChallenges(); // Re-render agar tampilan "line-through" pada label terbarui
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const indexToDelete = e.target.dataset.index;
                challenges.splice(indexToDelete, 1);
                saveChallenges();
                renderChallenges();
            });
        });
    }

    addChallengeBtn.addEventListener('click', () => {
        const newText = newChallengeInput.value.trim();
        if (newText) {
            challenges.push({ text: newText, completed: false });
            saveChallenges();
            renderChallenges();
            newChallengeInput.value = '';
        }
    });

    newChallengeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addChallengeBtn.click();
        }
    });

    renderChallenges(); // Render tantangan awal saat halaman dimuat

});