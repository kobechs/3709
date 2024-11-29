let count = 0;
let interval = 0.01;
let timer;
let dom, scoreDom;
let isRunning = false;
let audio, modalAudio, closeAudio;
let currentPage = 1;
let score = 0;
let consecutivePerfects = 0;
let clickCount = 0;

 function showControlButtons() {
        // 操作ボタンを表示し、新しいボタンを非表示にする
        document.getElementById("controlButtons").style.display = "block";
        document.getElementById("showButtons").style.display = "none";
        allclear();
        document.getElementById("helpBtn").style.display = "none";
        document.getElementById("funMessage").style.display = "none";
        document.getElementById("menu").style.display = "none";
    }
     function hideControlButtons() {
        // 操作ボタンを非表示にし、「操作ボタンを表示」ボタンを再表示する
        document.getElementById("controlButtons").style.display = "none";
        document.getElementById("showButtons").style.display = "block";

        // モーダルタブと「遊び方(p)」ボタン、メッセージを再表示にする
        document.getElementById("helpBtn").style.display = "block";
        document.getElementById("funMessage").style.display = "block"; // メッセージを再表示にする
        document.getElementById("menu").style.display = "block";
    }

function toggleModal() {
    const modal = document.getElementById("modal");
    const isModalOpen = modal.style.display === "block";
    modal.style.display = isModalOpen ? "none" : "block";

    if (!isModalOpen) {
        modalAudio.play().catch(error => {
            console.error("音声の再生に失敗しました:", error);
        });
    } else {
        closeAudio.play().catch(error => {
            console.error("音声の再生に失敗しました:", error);
        });
    }
}

function switchPage(pageNumber) {
    document.getElementById("page1").style.display = (pageNumber === 1) ? "block" : "none";
    document.getElementById("page2").style.display = (pageNumber === 2) ? "block" : "none";
}

function nextPage() {
    currentPage = (currentPage === 1) ? 2 : 1;
    switchPage(currentPage);
}

function init() {

    dom = document.getElementById("count");
    dom.textContent = count2time(count);

    scoreDom = document.getElementById("score");
    scoreDom.textContent = "スコア: " + score;

    audio = new Audio('ss5.mp3');
    modalAudio = new Audio('lite.mp3');
    closeAudio = new Audio('etil.mp3');

    const highlight = document.querySelector('.highlight');
    highlight.addEventListener('click', function() {
        document.body.style.backgroundColor = (document.body.style.backgroundColor === 'white') ? 'black' : 'white';
        audio.play();
        clickCount++;

        if (clickCount % 2 === 0) {
            scoreDom.style.color = 'white';
        } else {
            scoreDom.style.color = 'black';
        }
    });

    document.addEventListener('keydown', handleKeydown);

    document.getElementById("helpBtn").addEventListener("click", toggleModal);
    document.getElementById("closeBtn").addEventListener("click", toggleModal);
    document.getElementById("nextPageBtn").addEventListener("click", nextPage);
    document.getElementById("prevPageBtn").addEventListener("click", nextPage);

    switchPage(1);
}

function count2time(count) {
    let seconds = (count % 60).toFixed(2);
    return ("0" + seconds).slice(-5);
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(function() {
            count += interval;
            dom.textContent = count2time(count);
        }, interval * 1000);
    }
}

function stopTimer() {
    clearInterval(timer);
    isRunning = false;
    evaluateTime(count);
}

function resetTimer() {
    clearInterval(timer); // タイマーをクリア
    isRunning = false; // タイマーが停止していることを明示
    count = 0;
    dom.textContent = count2time(count);
}

function allclear(){
     score = 0;
consecutivePerfects = 0;
consecutiveNearPerfects = 0;
consecutiveClosePerfects = 0;
consecutivePenalty = 0;
}

function handleKeydown(event) {
    if (event.code === 'KeyS') {
        startTimer();
    } else if (event.code === 'KeyT') {
        stopTimer();
    } else if (event.code === 'KeyR') {
        resetTimer();
    } else if (event.code === 'KeyP') {
        toggleModal(); 
    } else if (event.code === 'Escape') {
        document.getElementById("modal").style.display = "none";
        closeAudio.play().catch(error => {
            console.error("音声の再生に失敗しました:", error);
        });
    }
}

document.addEventListener('DOMContentLoaded', init);
function resetCounters(resetPerfect = true, resetNearPerfect = true, resetClosePerfect = true, resetPenalty = true)
{
if (resetPerfect) {
    consecutivePerfects = 0;
}
if (resetNearPerfect) {
    consecutiveNearPerfects = 0;
}
if (resetClosePerfect) {
    consecutiveClosePerfects = 0;
}
if (resetPenalty) {
    consecutivePenalty = 0;
}
}

function evaluateTime(time) {
if (time.toFixed(2) == 5.00) {
    score += 500;
    consecutivePerfects+= 3;
    score += 500 * (consecutivePerfects - 3);
    consecutiveNearPerfects++;
    consecutiveClosePerfects++;
    resetCounters(false, false, false, true)

} else if (time > 4.96 && time < 5.04) {
    score += 200;
    consecutiveNearPerfects++;
    score += 200 * (consecutiveNearPerfects - 1);

    resetCounters(true, false, false, true);
    consecutiveClosePerfects++;

} else if (time > 4.94 && time < 5.06) {
    score += 100;
    consecutiveClosePerfects++;
    score += 100 * (consecutiveClosePerfects - 1);

    resetCounters(true, true, false, true);

} else if (time > 4.91 && time < 5.09) {
   const randomScores = [
    { value: 100, weight: 10 },  // 10%
    { value: 50, weight: 20 },   // 20%
    { value: -50, weight: 30 },  // 30%
    { value: -100, weight: 40 }  // 40%
];
    const totalWeight = randomScores.reduce((sum, option) => sum + option.weight, 0);
const random = Math.random() * totalWeight;

let cumulativeWeight = 0;
let randomAdjustment = 0;
for (const option of randomScores) {
    cumulativeWeight += option.weight;
    if (random < cumulativeWeight) {
        randomAdjustment = option.value;
        break;
    }
}
console.log(`ランダム調整: ${randomAdjustment}`);

// スコアに加算または減算
score = Math.max(0, score + randomAdjustment);

   resetCounters();

} else if (time > 4.89 && time < 5.11) {
    score = Math.max(0, score - 200);
    consecutivePenalty++;
     score = Math.max(0, score - 200 * (consecutivePenalty - 1));

   resetCounters(true, true, true, false);

} else {

    alert("ゲームオーバー！\nスコア: " + score + "\n最終タイム: " + time.toFixed(2) + " 秒" );
    resetGame();
    return;
}

scoreDom.textContent = "スコア: " + score;
}

function resetGame() {
score = 0;
consecutivePerfects = 0;
consecutiveNearPerfects = 0;
consecutiveClosePerfects = 0;
consecutivePenalty = 0;
resetTimer();
scoreDom.textContent = "スコア: " + score;
}

function goTotop() {
        window.location.href = 'index.html';
}



// ランキング
function saveScoreToLocalStorage(score) {
// ローカルストレージに保存されたスコアを取得
let scores = JSON.parse(localStorage.getItem('scores')) || [];

// 現在のスコアを追加
scores.push(score);

// スコアを降順に並び替えてトップ5を保存
scores.sort((a, b) => b - a);
scores = scores.slice(0, 5);

localStorage.setItem('scores', JSON.stringify(scores));
}

function resetGame() {
saveScoreToLocalStorage(score); // スコアを保存
score = 0;
consecutivePerfects = 0;
consecutiveNearPerfects = 0;
consecutiveClosePerfects = 0;
consecutivePenalty = 0;
resetTimer();
scoreDom.textContent = "スコア: " + score;
}
