import React, { useState, useRef } from 'react';
import { Drawer, Divider, Box, TextField, Button, List, ListItem, Typography, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';

function RoutineTodosDrawer() {
  const [routineTodos, setRoutineTodos] = useState([]);
  const todoNameRef = useRef(null);

  const onAddRoutineTodo = () => {
    const newTodoName = todoNameRef.current.value.trim();
    if (newTodoName !== '') {
      setRoutineTodos(prevTodos => [
        ...prevTodos,
        { id: uuidv4(), name: newTodoName, completed: false }
      ]);
      todoNameRef.current.value = ''; // 入力フィールドをクリア
    }
  };

  const handleTodoChange = (id, newName) => {
    setRoutineTodos(prevTodos =>
      prevTodos.map(todo => todo.id === id ? { ...todo, name: newName } : todo)
    );
  };

  const handleDeleteTodo = (id) => {
    setRoutineTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
      <Box width={250} p={2}>
        <Typography variant="h6">ルーティンのタスク</Typography>
        <List>
          {routineTodos.length > 0 ? (
            routineTodos.map((todo) => (
              <ListItem key={todo.id} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(todo.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <TextField
                  value={todo.name}
                  onChange={(e) => handleTodoChange(todo.id, e.target.value)}
                  fullWidth
                />
              </ListItem>
            ))
          ) : (
            <Typography>ルーティンのタスクがありません</Typography>
          )}
        </List>
        <Divider />
        <Box mt={2} textAlign="center">
          <TextField
            inputRef={todoNameRef}
            label="新しいタスク"
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={onAddRoutineTodo}>
            ルーティンのタスクを追加
          </Button>
        </Box>
      </Box>
  );
}

export default RoutineTodosDrawer;
