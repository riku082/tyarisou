import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_HcHZGly2GijG7Y07oSZSjrxP3CUCMRA",
  authDomain: "abab-3k6tdx.firebaseapp.com",
  projectId: "abab-3k6tdx",
  storageBucket: "abab-3k6tdx.firebasestorage.app",
  messagingSenderId: "5046366384",
  appId: "1:5046366384:web:4149441302f1f42e250b75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
async function sendScoreToRanking(score) {
  if (!nickname || !score || score <= 0) return;
  try {
    // 既存の最高スコアを取得
    const q = query(
      collection(db, "scores"),
      where("nickname", "==", nickname),
      orderBy("score", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    let shouldUpdate = true;
    if (!querySnapshot.empty) {
      const best = querySnapshot.docs[0].data();
      if (best.score >= score) {
        shouldUpdate = false;
      } else {
        // 既存のドキュメントを削除
        await deleteDoc(doc(db, "scores", querySnapshot.docs[0].id));
      }
    }

    if (shouldUpdate) {
      await addDoc(collection(db, "scores"), {
        nickname: nickname,
        score: score,
        created: serverTimestamp()
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
async function fetchRanking() {
  try {
    const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(10));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (e) {
    console.error('ランキング取得失敗', e);
    return [];
  }
}

// windowに公開（HTMLからも呼べるように）
window.sendScoreToRanking = sendScoreToRanking;
window.fetchRanking = fetchRanking; 