import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Drawer, Divider, Container, Box, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, LinearProgress, Grid } from '@mui/material';
import { CheckCircleOutline, CheckCircle } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

const APP_KEY = 'sampleApp';

function App() {
  const savedState = localStorage.getItem(APP_KEY);
  const initialState = savedState ? JSON.parse(savedState) : {
    todos: [],
    defaultMorningTodos: [],
    level: 1,
    currentWidth: 0,
    lastTodoTime: null
  };

  const [todos, setTodos] = useState(initialState.todos || []);  // 空配列で初期化
  const [level, setLevel] = useState(initialState.level);
  const [defaultMorningTodos, setDefaultMorningTodos] = useState(initialState.defaultMorningTodos || []);  // 空配列で初期化
  const [currentWidth, setCurrentWidth] = useState(initialState.currentWidth);
  const [lastTodoTime, setLastTodoTime] = useState(initialState.lastTodoTime);
  const todoNameRef = useRef(null);

  useEffect(() => {
    const stateToSave = { todos, level, currentWidth, lastTodoTime };
    localStorage.setItem(APP_KEY, JSON.stringify(stateToSave));
  }, [todos, level, currentWidth, lastTodoTime]);

  useEffect(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('通知が許可されました');
      } else {
        console.log('通知が拒否されました');
      }
    });
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('defaultMorningTodos')) {
      const userDefinedTodos = prompt("毎朝追加されるToDo 5つをカンマ区切りで入力してください（例: ベッドを整える, 今日の目標入力, ダンスルーチン, 水を飲む, 日光を浴びる）:");
      if (userDefinedTodos) {
        const todosArray = userDefinedTodos.split(',').map(task => ({
          id: uuidv4(),
          name: task.trim(),
          completed: false
        }));
        setDefaultMorningTodos(todosArray);
        localStorage.setItem('defaultMorningTodos', JSON.stringify(todosArray));
      }
    }
  }, []);

  useEffect(() => {
    const checkTimeAndNotify = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // 毎朝6時に5つのTODOを自動追加
      if (hours >= 6 && minutes >= 0) {
        setTodos((prevTodos) => [...prevTodos, ...defaultMorningTodos.map(todo => ({
          ...todo,
          id: uuidv4(),
          completed: false
        }))]);
        setLastTodoTime(new Date().toISOString());
        new Notification('TODOリマインダー', {
          body: `朝だ、準備しろ！ (${hours}:00)。`,
          icon: '/path/to/icon.png'
        });
      }

      // 8時に最後のTODOが追加されていない場合に通知を送信
      if (hours >= 8 && minutes >= 0) {
        const lastTodoDate = new Date(lastTodoTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 今日の日付の00:00:00に設定

        if (!lastTodoTime || lastTodoDate < today) {
          new Notification('TODOリマインダー', {
            body: `やることやれ (${hours}:00)。`,
            icon: '/path/to/icon.png'
          });
          setLevel(prevLevel => Math.max(0, prevLevel - 1));
        }
      }

      // 未完了のTODOが3つ以上ある場合にレベルをマイナス1
      const incompleteTodos = todos.filter(todo => !todo.completed).length;
      if (incompleteTodos >= 3) {
        setLevel(prevLevel => Math.max(0, prevLevel - 2));
      }
    };

    // 毎分チェックする
    const interval = setInterval(checkTimeAndNotify, 60000);  // 1分ごとにチェック

    // クリーンアップ
    return () => clearInterval(interval);
  }, [lastTodoTime, todos, defaultMorningTodos]);

  const handleAddTodo = () => {
    const name = todoNameRef.current.value;
    if (name === '') return;
    setTodos((prevTodos) => {
      return [...prevTodos, { id: uuidv4(), name: name, completed: false }];
    });
    setLastTodoTime(new Date().toISOString());
    todoNameRef.current.value = ''; // 入力フィールドをクリア
  };

  const handleAddMorningTodos = () => {
    setTodos([...todos, ...defaultMorningTodos.map(todo => ({
      ...todo,
      id: uuidv4(),
      completed: false
    }))]);
  };

  const handleTodoChange = (id, newName) => {
    setDefaultMorningTodos(defaultMorningTodos.map(todo =>
      todo.id === id ? { ...todo, name: newName } : todo
    ));
    localStorage.setItem('defaultMorningTodos', JSON.stringify(defaultMorningTodos));
  };

  const toggleTodo = (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });

    const filteredTodos = newTodos.filter(todo => !todo.completed);
    const newWidth = currentWidth + 20;

    if (newWidth >= 100) {
      setLevel(level + 1);
      setCurrentWidth(0);
    } else {
      setCurrentWidth(newWidth);
    }

    setTodos(filteredTodos);
  };

  return (
    <Grid container spacing={2}>
      {/* Main Content */}
      <Grid item xs={8}>
        <Container maxWidth="sm" className="app-container">
          <Box mt={4} mb={2} textAlign="center">
            <Typography variant="h4">TODOリスト</Typography>
          </Box>
          <Box display="flex" mb={2}>
            <TextField
              inputRef={todoNameRef} // Refを使う
              label="新しいタスク"
              variant="outlined"
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleAddTodo}>
              追加
            </Button>
          </Box>
          <List>
            {todos && todos.length > 0 ? (
              todos.map((todo) => (
                <ListItem key={todo.id} secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => toggleTodo(todo.id)}>
                    {todo.completed ? <CheckCircle color="success" /> : <CheckCircleOutline />}
                  </IconButton>
                }>
                  <ListItemText primary={todo.name} />
                </ListItem>
              ))
            ) : (
              <Typography>タスクがありません</Typography>
            )}
          </List>
          <Box mt={2}>
            <Typography variant="subtitle1">残りのタスク: {todos.filter((todo) => !todo.completed).length}</Typography>
            <Typography variant="subtitle1">漢レベル: {level}</Typography>
            <LinearProgress variant="determinate" value={currentWidth} />
          </Box>
        </Container>
      </Grid>

      {/* Side Drawer for Morning Todos */}
      <Grid item xs={4}>
        <Drawer variant="permanent" anchor="right">
          <Box width={250} p={2}>
            <Typography variant="h6">毎朝のタスク</Typography>
            <List>
              {defaultMorningTodos && defaultMorningTodos.length > 0 ? (
                defaultMorningTodos.map((todo) => (
                  <ListItem key={todo.id}>
                    <TextField
                      value={todo.name}
                      onChange={(e) => handleTodoChange(todo.id, e.target.value)}
                      fullWidth
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>朝のタスクがありません</Typography>
              )}
            </List>
            <Divider />
            <Box mt={2} textAlign="center">
              <Button variant="contained" color="secondary" onClick={handleAddMorningTodos}>
                朝のタスクを追加
              </Button>
            </Box>
          </Box>
        </Drawer>
      </Grid>
    </Grid>
  );
}

export default App;

