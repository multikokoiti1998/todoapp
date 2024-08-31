import React from 'react';
import { Drawer, Divider, Box, TextField, Button, List, ListItem, Typography } from '@mui/material';

function MorningTodosDrawer({ defaultMorningTodos, handleTodoChange, handleAddMorningTodos }) {
  return (
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
  );
}

export default MorningTodosDrawer;
