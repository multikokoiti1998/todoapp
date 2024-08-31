import React from 'react';
import { List, ListItem, ListItemText, IconButton, Box, Typography } from '@mui/material';
import { CheckCircleOutline, CheckCircle } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

function TodoList({ todos, toggleTodo, deleteTodo }) {
  return (
    <List>
      {todos && todos.length > 0 ? (
        todos.map((todo) => (
          <ListItem key={todo.id} secondaryAction={
            <Box>
              <IconButton edge="end" aria-label="toggle" onClick={() => toggleTodo(todo.id)}>
                {todo.completed ? <CheckCircle color="success" /> : <CheckCircleOutline />}
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          }>
            <ListItemText primary={todo.name} />
          </ListItem>
        ))
      ) : (
        <Typography>タスクがありません</Typography>
      )}
    </List>
  );
}

export default TodoList;

