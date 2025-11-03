// Express読み込み　Webサーバーを作るフレームワーク
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT ||3001;

// ミドルウェア
app.use(cors());
app.use(express.json());

// ルート読み込み
const todoRoutes = require("./routes/todos");
app.use("/api/todos", todoRoutes);

// 起動確認
app.get("/", (req, res) => {
  res.json({ message: "Node.js サーバーが起動しています！" });
});

// エラーハンドリング
app.use((req, res, next) => {
  res.status(404).json({ error: "エンドポイントが存在しません。" });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
