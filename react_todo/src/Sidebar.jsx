import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Drawer, Box, Typography } from '@mui/material';

function Sidebar({ onDateChange }) {
  const [date, setDate] = useState(new Date());

  const handleChange = newDate => {
    setDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  return (
    <Drawer variant="permanent" anchor="left">
      <Box p={2} width={250} textAlign="center">
        <Typography variant="h6">カレンダー</Typography>
        <Calendar onChange={handleChange} value={date} />
      </Box>
    </Drawer>
  );
}

export default Sidebar;
