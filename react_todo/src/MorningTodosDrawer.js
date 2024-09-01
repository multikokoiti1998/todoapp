import React, { useState, useRef } from 'react';
import { Drawer, Divider, Box, TextField, Button, List, ListItem, Typography, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';

function MorningTodosDrawer() {
  const [defaultMorningTodos, setDefaultMorningTodos] = useState([]);
  const todoNameRef = useRef(null);

  const onAddMorningTodo = () => {
    const newTodoName = todoNameRef.current.value.trim();
    if (newTodoName !== '') {
      setDefaultMorningTodos(prevTodos => [
        ...prevTodos,
        { id: uuidv4(), name: newTodoName, completed: false }
      ]);
      todoNameRef.current.value = ''; // 入力フィールドをクリア
    }
  };

  const handleTodoChange = (id, newName) => {
    setDefaultMorningTodos(prevTodos =>
      prevTodos.map(todo => todo.id === id ? { ...todo, name: newName } : todo)
    );
  };

  const handleDeleteTodo = (id) => {
    setDefaultMorningTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  return (
      <Box width={250} p={2}>
        <Typography variant="h6">毎朝のタスク</Typography>
        <List>
          {defaultMorningTodos.length > 0 ? (
            defaultMorningTodos.map((todo) => (
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
            <Typography>朝のタスクがありません</Typography>
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
          <Button variant="contained" color="secondary" onClick={onAddMorningTodo}>
            朝のタスクを追加
          </Button>
        </Box>
      </Box>
    
  );
}

export default MorningTodosDrawer;
