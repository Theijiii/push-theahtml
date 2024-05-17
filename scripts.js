/* let startTime;
let timerInterval;
let pomodoros = [];
const pomodoroDuration = 25 * 60; // 25 minutes in seconds

const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');

const totalPomodorosDisplay = document.getElementById('total-pomodoros');
const totalTimeDisplay = document.getElementById('total-time');
const averageDurationDisplay = document.getElementById('average-duration');
const startTimesList = document.getElementById('start-times');

startButton.addEventListener('click', startPomodoro);
stopButton.addEventListener('click', stopPomodoro);
resetButton.addEventListener('click', resetPomodoro);

function startPomodoro() {
    if (timerInterval) {
        alert("A Pomodoro is already running!");
        return;
    }
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    pomodoros.push({ startTime: startTime, duration: pomodoroDuration });
}

function stopPomodoro() {
    if (!timerInterval) {
        alert("No Pomodoro is running!");
        return;
    }
    clearInterval(timerInterval);
    const currentPomodoro = pomodoros.pop();
    const endTime = Date.now();
    const actualDuration = Math.round((endTime - startTime) / 1000);
    currentPomodoro.duration = actualDuration;
    pomodoros.push(currentPomodoro);
    timerInterval = null;
    updateStatistics();
}

function resetPomodoro() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerDisplay.textContent = formatTime(pomodoroDuration);
}

function updateTimer() {
    const elapsedTime = Math.round((Date.now() - startTime) / 1000);
    const remainingTime = pomodoroDuration - elapsedTime;
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        alert("Pomodoro completed!");
    }
    timerDisplay.textContent = formatTime(remainingTime);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateStatistics() {
    const totalPomodoros = pomodoros.length;
    const totalTime = pomodoros.reduce((sum, p) => sum + p.duration, 0);
    const averageDuration = totalTime / totalPomodoros;
    totalPomodorosDisplay.textContent = totalPomodoros;
    totalTimeDisplay.textContent = (totalTime / 60).toFixed(2);
    averageDurationDisplay.textContent = (averageDuration / 60).toFixed(2);
    updateStartTimes();
}

function updateStartTimes() {
    startTimesList.innerHTML = '';
    pomodoros.forEach(p => {
        const li = document.createElement('li');
        li.textContent = new Date(p.startTime).toLocaleString();
        startTimesList.appendChild(li);
    });
}*/
let startTime;
let timerInterval;
let pomodoros = [];
let pomodoroDuration = 25 * 60; // 25 minutes in seconds by default

const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const taskInput = document.getElementById('task-input');
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');

const totalPomodorosDisplay = document.getElementById('total-pomodoros');
const totalTimeDisplay = document.getElementById('total-time');
const averageDurationDisplay = document.getElementById('average-duration');
const startTimesList = document.getElementById('start-times');

const weeklyChartCtx = document.getElementById('weeklyChart').getContext('2d');
const monthlyChartCtx = document.getElementById('monthlyChart').getContext('2d');
let weeklyChart;
let monthlyChart;

startButton.addEventListener('click', startPomodoro);
stopButton.addEventListener('click', stopPomodoro);
resetButton.addEventListener('click', resetPomodoro);

function startPomodoro() {
    if (timerInterval) {
        alert("A Pomodoro is already running!");
        return;
    }
    if (!taskInput.value.trim()) {
        alert("Please enter a task before starting the Pomodoro.");
        return;
    }
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    pomodoroDuration = (hours * 60 + minutes) * 60; // Set the custom duration
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    pomodoros.push({ task: taskInput.value, startTime: startTime, duration: pomodoroDuration });
    timerDisplay.textContent = formatTime(pomodoroDuration);
}

function stopPomodoro() {
    if (!timerInterval) {
        alert("No Pomodoro is running!");
        return;
    }
    clearInterval(timerInterval);
    const currentPomodoro = pomodoros.pop();
    const endTime = Date.now();
    const actualDuration = Math.round((endTime - startTime) / 1000);
    currentPomodoro.duration = actualDuration;
    pomodoros.push(currentPomodoro);
    timerInterval = null;
    updateStatistics();
}

function resetPomodoro() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerDisplay.textContent = formatTime(pomodoroDuration);
    taskInput.value = '';
    hoursInput.value = 0; // Reset to default hours
    minutesInput.value = 25; // Reset to default minutes
}

function updateTimer() {
    const elapsedTime = Math.round((Date.now() - startTime) / 1000);
    const remainingTime = pomodoroDuration - elapsedTime;
    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        alert("Pomodoro completed!");
        resetPomodoro();
    } else {
        timerDisplay.textContent = formatTime(remainingTime);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateStatistics() {
    const totalPomodoros = pomodoros.length;
    const totalTime = pomodoros.reduce((sum, p) => sum + p.duration, 0);
    const averageDuration = totalTime / totalPomodoros;

    const weeklyPomodoros = getPomodorosWithinDays(7);
    const weeklyTotalTime = weeklyPomodoros.reduce((sum, p) => sum + p.duration, 0);

    const monthlyPomodoros = getPomodorosWithinDays(30);
    const monthlyTotalTime = monthlyPomodoros.reduce((sum, p) => sum + p.duration, 0);

    totalPomodorosDisplay.textContent = totalPomodoros;
    totalTimeDisplay.textContent = (totalTime / 60).toFixed(2);
    averageDurationDisplay.textContent = (averageDuration / 60).toFixed(2);

    updateStartTimes();
    updateCharts(weeklyPomodoros, monthlyPomodoros);
}

function getPomodorosWithinDays(days) {
    const now = Date.now();
    return pomodoros.filter(p => (now - p.startTime) <= days * 24 * 60 * 60 * 1000);
}

function updateStartTimes() {
    startTimesList.innerHTML = '';
    pomodoros.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${new Date(p.startTime).toLocaleString()} - ${p.task}`;
        startTimesList.appendChild(li);
    });
}

function updateCharts(weeklyPomodoros, monthlyPomodoros) {
    const weeklyLabels = getLastNDaysLabels(7);
    const monthlyLabels = getLastNDaysLabels(30);

    const weeklyData = getPomodorosCountByDays(weeklyPomodoros, 7);
    const monthlyData = getPomodorosCountByDays(monthlyPomodoros, 30);

    if (weeklyChart) weeklyChart.destroy();
    if (monthlyChart) monthlyChart.destroy();

    weeklyChart = new Chart(weeklyChartCtx, {
        type: 'bar',
        data: {
            labels: weeklyLabels,
            datasets: [{
                label: 'Pomodoros',
                data: weeklyData,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    monthlyChart = new Chart(monthlyChartCtx, {
        type: 'bar',
        data: {
            labels: monthlyLabels,
            datasets: [{
                label: 'Pomodoros',
                data: monthlyData,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getLastNDaysLabels(n) {
    const labels = [];
    for (let i = n - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString());
    }
    return labels;
}

function getPomodorosCountByDays(pomodoros, days) {
    const counts = Array(days).fill(0);
    const now = Date.now();
    pomodoros.forEach(p => {
        const dayIndex = Math.floor((now - p.startTime) / (24 * 60 * 60 * 1000));
        if (dayIndex < days) {
            counts[days - 1 - dayIndex]++;
        }
    });
    return counts;
}

