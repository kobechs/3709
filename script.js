function goTo5sPage() {
    window.location.href = '5s.html';
}
function goToCredits(){
window.location.href = 'credits.html';
}



// モーダルタブ

function showRanking() {
// ローカルストレージからスコアを取得
const scores = JSON.parse(localStorage.getItem('scores')) || [];

// ランキングのHTMLを生成
let rankingHtml = "<ol>";
scores.forEach((score, index) => {
rankingHtml += `<li>第${index + 1}位: ${score} 点</li>`;
});
rankingHtml += "</ol>";

// ランキングをモーダルの内容に挿入
const rankingContent = document.getElementById("rankingContent");
rankingContent.innerHTML = rankingHtml;

// モーダルを表示
document.getElementById("rankingModal").style.display = "block";
}

function closeRankingModal() {
document.getElementById("rankingModal").style.display = "none";
}

// モーダル外クリックで閉じる処理
window.onclick = function(event) {
const modal = document.getElementById("rankingModal");
if (event.target === modal) {
modal.style.display = "none";
}
}
