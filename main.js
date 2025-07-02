// Firebaseの初期化
const firebaseConfig = {
  apiKey: "AIzaSyC_HcHZGly2GijG7Y07oSZSjrxP3CUCMRA",
  authDomain: "abab-3k6tdx.firebaseapp.com",
  projectId: "abab-3k6tdx",
  storageBucket: "abab-3k6tdx.firebasestorage.app",
  messagingSenderId: "5046366384",
  appId: "1:5046366384:web:4149441302f1f42e250b75"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ニックネーム取得（localStorageから）
let nickname = localStorage.getItem('nickname');
if (!nickname) {
  nickname = prompt('ニックネームを入力してください（10文字以内）');
  if (nickname) {
    nickname = nickname.slice(0, 10);
    localStorage.setItem('nickname', nickname);
  }
}

// スコア送信
window.sendScoreToRanking = async function(score) {
  if (!nickname || !score || score <= 0) return;
  try {
    // 既存の最高スコアを取得
    const querySnapshot = await db.collection("scores")
      .where("nickname", "==", nickname)
      .orderBy("score", "desc")
      .limit(1)
      .get();

    let shouldUpdate = true;
    if (!querySnapshot.empty) {
      const best = querySnapshot.docs[0].data();
      if (best.score >= score) {
        shouldUpdate = false;
      } else {
        // 既存のドキュメントを削除
        await db.collection("scores").doc(querySnapshot.docs[0].id).delete();
      }
    }

    if (shouldUpdate) {
      await db.collection("scores").add({
        nickname: nickname,
        score: score,
        created: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('新記録で送信成功');
    } else {
      console.log('自己ベスト未更新のため送信しません');
    }
  } catch (e) {
    console.error('送信失敗', e);
  }
}

// ランキング取得
window.fetchRanking = async function() {
  const snapshot = await db.collection("scores").orderBy("score", "desc").limit(10).get();
  return snapshot.docs.map(doc => doc.data());
};

function showGameOver() {
  // ... 既存の処理 ...
  finalScoreEl.innerText = `最終スコア: ${score}`;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem(HIGH_SCORE_KEY, highScore);
    finalScoreEl.innerText += ' (ハイスコア更新！)';
  }
  gameOverScreen.classList.remove('hidden');
  lockBodyScroll && lockBodyScroll();
  // ... 既存の処理 ...
} 