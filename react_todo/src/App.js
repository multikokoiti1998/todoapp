import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Container, Box, TextField, Button, List, ListItem, ListItemText, IconButton, Typography, LinearProgress } from '@mui/material';
import { CheckCircleOutline, CheckCircle } from '@mui/icons-material';
import { v4 as uuid4 } from 'uuid';

const APP_KEY = 'sampleApp';

function App() {
  const savedState = localStorage.getItem(APP_KEY);
  const initialState = savedState ? JSON.parse(savedState) : {
    todos: [],
    level: 1,
    currentWidth: 0,
    lastTodoTime: null
  };

  const [todos, setTodos] = useState(initialState.todos);
  const [level, setLevel] = useState(initialState.level);
  const [currentWidth, setCurrentWidth] = useState(initialState.currentWidth);
  const [lastTodoTime, setLastTodoTime] = useState(initialState.lastTodoTime);
  const todoNameRef = useRef();

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
    const checkTimeAndNotify = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // 毎朝6時に5つのTODOを自動追加
      if (hours >= 6 && minutes >= 0) {
        const newTodos = [
          { id: uuid4(), name: "ベットを整える", completed: false },
          { id: uuid4(), name: "今日の目標入力", completed: false },
          { id: uuid4(), name: "ダンスルーチン", completed: false },
          { id: uuid4(), name: "水を飲む", completed: false },
          { id: uuid4(), name: "日光を浴びる", completed: false }
        ];
        setTodos((prevTodos) => [...prevTodos, ...newTodos]);
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
        setLevel(prevLevel => Math.max(0, prevLevel - 2)); // レベルが0未満にならないようにする
      }
    };

    // 毎分チェックする
    const interval = setInterval(checkTimeAndNotify, 60000*60*24);//インターバル24時間

    // クリーンアップ
    return () => clearInterval(interval);
  }, [lastTodoTime, todos]);

  const handleAddTodo = () => {
    const name = todoNameRef.current.value;
    if (name === '') return;
    setTodos((prevTodos) => {
      return [...prevTodos, { id: uuid4(), name: name, completed: false }];
    });
    setLastTodoTime(new Date().toISOString());
    todoNameRef.current.value = null;
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
    <Container maxWidth="sm" className="app-container">
      <Box mt={4} mb={2} textAlign="center">
        <Typography variant="h4">TODOリスト</Typography>
      </Box>
      <Box display="flex" mb={2}>
        <TextField
          inputRef={todoNameRef}
          label="新しいタスク"
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAddTodo}>
          追加
        </Button>
      </Box>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => toggleTodo(todo.id)}>
              {todo.completed ? <CheckCircle color="success" /> : <CheckCircleOutline />}
            </IconButton>
          }>
            <ListItemText primary={todo.name} />
          </ListItem>
        ))}
      </List>
      <Box mt={2}>
        <Typography variant="subtitle1">残りのタスク: {todos.filter((todo) => !todo.completed).length}</Typography>
        <Typography variant="subtitle1">漢レベル: {level}</Typography>
        <LinearProgress variant="determinate" value={currentWidth} />
      </Box>
    </Container>
  );
}

export default App;
