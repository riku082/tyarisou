import { initializeApp } from "firebase/app";
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

// ニックネーム取得（localStorageから）
let nickname = localStorage.getItem('nickname');
if (!nickname) {
  nickname = prompt('ニックネームを入力してください（10文字以内）');
  if (nickname) {
    nickname = nickname.slice(0, 10);
    localStorage.setItem('nickname', nickname);
  }
}

// Firestoreやランキング関連のコードをすべて削除
// windowに公開（HTMLからも呼べるように）
window.sendScoreToRanking = sendScoreToRanking;
window.fetchRanking = fetchRanking; 