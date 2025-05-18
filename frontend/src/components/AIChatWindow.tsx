import React from 'react';
import { Box, Paper, TextField, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const AIChatWindow: React.FC = () => {
  const [messages, setMessages] = React.useState([
    { id: 1, text: 'Hello! How can I help you manage your tasks today?', sender: 'ai' },
  ]);
  const [inputValue, setInputValue] = React.useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { id: messages.length + 1, text: inputValue, sender: 'user' }]);
      // Simulate AI response
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          { id: prevMessages.length + 1, text: `I received: "${inputValue}". I'm still learning to interact with tasks.`, sender: 'ai' },
        ]);
      }, 1000);
      setInputValue('');
    }
  };

  return (
    <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>AI Assistant</Typography>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 1, border: '1px solid #eee', borderRadius: '4px' }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              mb: 1,
              p: 1,
              borderRadius: '4px',
              bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.200',
              color: msg.sender === 'user' ? 'primary.contrastText' : 'text.primary',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              ml: msg.sender === 'user' ? 'auto' : undefined,
              mr: msg.sender === 'ai' ? 'auto' : undefined,
            }}
          >
            {msg.text}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Message Vecta..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          sx={{ mr: 1 }}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AIChatWindow;
