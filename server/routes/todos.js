const express = require("express");

// ファイル操作モジュール
const fs = require("fs");

// ファイルパスを安全に扱うためのモジュール
const path = require("path");
const router = express.Router();

// todos.json の場所を絶対パスで指定
const FILE_PATH = path.join(__dirname, "../todos.json");

// 全ToDoを取得
router.get("/", (req, res) => {

  // ファイルを同期的に読み込み
  const data = fs.readFileSync(FILE_PATH, "utf8");
  const todos = JSON.parse(data || "[]");
  res.json(todos);
});

// ToDoを追加
router.post("/", (req, res) => {
  const { text } = req.body; // フロントから送られたテキストが格納
  const data = fs.readFileSync(FILE_PATH, "utf8");
  const todos = JSON.parse(data || "[]");

  // タスク生成
  const newTodo = { id: Date.now(), text, completed: false }; // Date.now()で一意なidを生成
  todos.push(newTodo);

  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
  res.json(newTodo);
});

// ToDoを削除
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data = fs.readFileSync(FILE_PATH, "utf8");
  const todos = JSON.parse(data || "[]");

  const filtered = todos.filter((todo) => todo.id !== id);

  fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 2));
  res.json({ success: true });
});

// ToDoを完了/未完了にする
router.put("/:id",(req, res) => {
  const id = parseInt(req.params.id, 10);
  const { completed } = req.body;
  const data = fs.readFileSync(FILE_PATH, "utf8");
  const todos = JSON.parse(data || "[]");

  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Todoが見つかりません" });
  }

  // テキストを更新
  todos[index].completed = completed;

  // JSONファイルに保存
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));

  res.json(todos[index]);
})

// ToDoを編集
router.put("/:id",(req, res) => {
  const id = parseInt(req.params.id, 10);
  const { text } = req.body; // フロントから送られたテキストが格納
  const data = fs.readFileSync(FILE_PATH, "utf8");
  const todos = JSON.parse(data || "[]");

  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Todoが見つかりません" });
  }

  // テキストを更新
  todos[index].text = text;

  // JSONファイルに保存
  fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));

  res.json(todos[index]);
})

module.exports = router;
