import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Container, Box, TextField, Button, Typography, LinearProgress, Grid } from '@mui/material';
import TodoList from './TodoList';
import MorningTodosDrawer from './MorningTodosDrawer';
import RoutineTodosDrawer from './RoutineTodosDrawer';
import { v4 as uuidv4 } from 'uuid';

const APP_KEY = 'sampleApp';

function App() {
  const savedState = localStorage.getItem(APP_KEY);
  const initialState = savedState ? JSON.parse(savedState) : {
    todos: [],
    defaultMorningTodos: [],
    routineTodos: [],
    level: 1,
    currentWidth: 0,
    lastTodoTime: null
  };

  const [todos, setTodos] = useState(initialState.todos || []);
  const [level, setLevel] = useState(initialState.level);
  const [defaultMorningTodos, setDefaultMorningTodos] = useState(initialState.defaultMorningTodos || []);
  const [routineTodos, setRoutineTodos] = useState(initialState.routineTodos || []);
  const [currentWidth, setCurrentWidth] = useState(initialState.currentWidth);
  const [lastTodoTime, setLastTodoTime] = useState(initialState.lastTodoTime);
  const todoNameRef = useRef(null);

  useEffect(() => {
    const stateToSave = { todos, defaultMorningTodos, routineTodos, level, currentWidth, lastTodoTime };
    localStorage.setItem(APP_KEY, JSON.stringify(stateToSave));
    console.log("Saving state to localStorage:", stateToSave);
  }, [todos, defaultMorningTodos, routineTodos, level, currentWidth, lastTodoTime]);
  

  useEffect(() => {
    const checkTimeAndNotify = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

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

      if (hours >= 8 && minutes >= 0) {
        const lastTodoDate = new Date(lastTodoTime);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!lastTodoTime || lastTodoDate < today) {
          new Notification('TODOリマインダー', {
            body: `やることやれ (${hours}:00)。`,
            icon: '/path/to/icon.png'
          });
          setLevel(prevLevel => Math.max(0, prevLevel - 1));
        }
      }

      const incompleteTodos = todos.filter(todo => !todo.completed).length;
      if (incompleteTodos >= 3) {
        setLevel(prevLevel => Math.max(0, prevLevel - 2));
      }
    };

    const interval = setInterval(checkTimeAndNotify, 60000);

    return () => clearInterval(interval);
  }, [lastTodoTime, todos, defaultMorningTodos]);


  const handleAddTodo = () => {
    const name = todoNameRef.current.value;
    if (name === '') return;
    setTodos((prevTodos) => [...prevTodos, { id: uuidv4(), name: name, completed: false }]);
    setLastTodoTime(new Date().toISOString());
    todoNameRef.current.value = '';
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

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <Grid container spacing={2}> 
      <Grid item xs={6}>
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
          <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
          <Box mt={2}>
            <Typography variant="subtitle1">残りのタスク: {todos.filter((todo) => !todo.completed).length}</Typography>
            <Typography variant="subtitle1">漢レベル: {level}</Typography>
            <LinearProgress variant="determinate" value={currentWidth} />
          </Box>
          </Container>
      </Grid>     
      <Grid item xs={3}>
        <MorningTodosDrawer
          defaultMorningTodos={defaultMorningTodos}
          handleTodoChange={handleTodoChange}
          handleAddMorningTodos={handleAddMorningTodos}
        />
      </Grid>
      <Grid item xs={3}>
        <RoutineTodosDrawer />
      </Grid>
      
      

      </Grid> 
    
  );
}

export default App;
