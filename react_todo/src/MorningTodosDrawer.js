import React, { useRef } from 'react';
import { Box, Typography, List, ListItem, TextField, Button, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function MorningTodosDrawer({ defaultMorningTodos, handleTodoChange, handleAddMorningTodos }) {
  const todoNameRef = useRef(null); // タスク追加用のref

  // 新しいタスクを追加する関数
  const onAddMorningTodo = () => {
    const newTodoName = todoNameRef.current.value.trim(); // 空白を除去
    if (newTodoName !== '') {
      handleAddMorningTodos(newTodoName); // 親コンポーネントの関数を呼び出し、タスクを追加
      todoNameRef.current.value = ''; // テキストフィールドをクリア
    }
  };

  // タスクを削除する関数
  const handleDeleteTodo = (id) => {
    handleTodoChange(id, ''); // 親コンポーネントに削除を依頼する
  };

  return (
    <Box width={200} p={2}>
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
                onChange={(e) => handleTodoChange(todo.id, e.target.value)} // タスク名の変更を反映
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
          inputRef={todoNameRef} // 新しいタスクを追加するフィールドのref
          label="新しいタスク"
          variant="outlined"
          fullWidth
        />
        <Button variant="contained" color="secondary" onClick={onAddMorningTodo} style={{ marginTop: '10px' }}>
          朝のタスクを追加
        </Button>
      </Box>
    </Box>
  );
}

export default MorningTodosDrawer;
