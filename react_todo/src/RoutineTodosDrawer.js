import React, { useRef } from 'react';
import {  Divider, Box, TextField, Button, List, ListItem, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function RoutineTodosDrawer({ routineTodos, handleAddRoutineTodo, handleRoutineTodoChange, handleDeleteRoutineTodo, handleAddAllRoutineTodos }) {
  const todoNameRef = useRef(null);

  const onAddRoutineTodo = () => {
    const newTodoName = todoNameRef.current.value.trim();
    if (newTodoName !== '') {
      handleAddRoutineTodo(newTodoName); // 親コンポーネントの関数を呼び出し、タスクを追加
      todoNameRef.current.value = ''; // 入力フィールドをクリア
    }
  };

  const onAddAllRoutineTodos = () => {
    handleAddAllRoutineTodos(); // 全てのルーティンタスクを App.js の todos に追加
  };


  return (
      <Box width={200} p={2}>
        <Typography variant="h6">ルーティン</Typography>
        <List>
          {routineTodos.length > 0 ? (
            routineTodos.map((todo) => (
              <ListItem key={todo.id} secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteRoutineTodo(todo.id)}>
                  <DeleteIcon />
                </IconButton>
              }>
                <TextField
                  value={todo.name}
                  onChange={(e) => handleRoutineTodoChange(todo.id, e.target.value)}
                  fullWidth
                />
              </ListItem>
            ))
          ) : (
            <Typography>ルーティンがありません</Typography>
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
            ルーティンを追加
          </Button>
          <Button variant="contained" color="primary" onClick={onAddAllRoutineTodos} sx={{mt:1}}>
            TODOに追加
          </Button>
        </Box>
      </Box>
  );
}

export default RoutineTodosDrawer;
