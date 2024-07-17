let Questions = [];
let currentQuestion = 0;
let score = 0;
const questag = document.getElementById("ques");
const startBtn = document.getElementById("start-btn");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const resetBtn = document.getElementById("reset-btn");
const actionButtons = document.getElementById("action-buttons");

async function fetchQuestions() {
    try {
        const resp = await fetch("https://opentdb.com/api.php?amount=10");
        if (!resp.ok) {
            throw new Error("Failed to fetch questions");
        }
        const data = await resp.json();
        Questions = data.results;

        if (Questions.length > 0) {
            loadQues();
        } else {
            questag.innerHTML = `<h5>No Questions Found</h5>`;
        }
    } catch (error) {
        console.error(error);
        questag.innerHTML = `<h5>${error.message}</h5>`;
    }
}

function loadQues() {
    const opt = document.getElementById("opt");

    let currQuesText = Questions[currentQuestion].question;
    questag.innerHTML = currQuesText;

    opt.innerHTML = ""; // Clear previous options
    const correctAnswer = Questions[currentQuestion].correct_answer;
    const incorrectAnswers = Questions[currentQuestion].incorrect_answers;

    const options = [correctAnswer, ...incorrectAnswers];
    options.sort(() => Math.random() - 0.5); // Shuffle the options

    options.forEach((option, idx) => {
        const opnDiv = document.createElement("div");
        const optionTag = document.createElement("input");
        const labelTag = document.createElement("label");

        optionTag.type = 'radio';
        optionTag.name = 'answer';
        optionTag.id = `option${idx}`;
        optionTag.value = option;

        labelTag.textContent = option;
        labelTag.htmlFor = `option${idx}`;

        opnDiv.appendChild(optionTag);
        opnDiv.appendChild(labelTag);

        opt.appendChild(opnDiv);
    });

    // Reset buttons
    submitBtn.disabled = false;
    nextBtn.disabled = true;

    // Hide next button on last question
    if (currentQuestion === Questions.length - 1) {
        nextBtn.style.display = 'none';
        resetBtn.style.display = 'inline-block'; // Show reset button on last question
    } else {
        nextBtn.style.display = 'inline-block';
        resetBtn.style.display = 'none'; // Hide reset button on other questions
    }

    // Show action buttons and hide start button after loading questions
    actionButtons.style.display = 'block';
    startBtn.style.display = 'none';
}

function handleSubmit() {
    const selectedAns = document.querySelector('input[name="answer"]:checked');
    if (!selectedAns) {
        alert("Please select an answer!");
        return;
    }
    checkAnswer(selectedAns.value);
    submitBtn.disabled = true;
    nextBtn.disabled = false;

    // Show end quiz button on last question
    if (currentQuestion === Questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.textContent = 'End Quiz';
    }
}

function checkAnswer(selectedValue) {
    if (selectedValue === Questions[currentQuestion].correct_answer) {
        score++;
    }
}

function nextQuestion() {
    if (currentQuestion < Questions.length - 1) {
        currentQuestion++;
        loadQues();
    }
}

function endQuiz() {
    document.getElementById("opt").style.display = "none";
    document.getElementById("ques").style.display = "none";
    actionButtons.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    showTotal();
}

function showTotal() {
    const totalScore = document.getElementById('score');
    totalScore.innerHTML = `<h3>Your Score: ${score}/${Questions.length}</h3>`;
    Questions.forEach((ques, idx) => {
        totalScore.innerHTML += `<p>${idx + 1}: ${ques.correct_answer}</p>`;
    });

    // Show reset button if score is less than 5
    if (score < 5) {
        resetBtn.style.display = 'inline-block';
    }
}

function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById("opt").style.display = "block";
    document.getElementById("ques").style.display = "block";
    document.getElementById("score").innerHTML = "";
    submitBtn.textContent = 'Submit';
    resetBtn.style.display = 'none'; // Hide reset button after reset
    fetchQuestions();
}

startBtn.addEventListener("click", () => {
    fetchQuestions();
});

submitBtn.addEventListener("click", () => {
    if (currentQuestion === Questions.length - 1) {
        endQuiz();
    } else {
        handleSubmit();
    }
});

nextBtn.addEventListener("click", nextQuestion);
resetBtn.addEventListener("click", resetQuiz);
