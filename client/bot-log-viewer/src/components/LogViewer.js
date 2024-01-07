import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const dummyLogs = [
    { id: 1, timestamp: '2024-01-01 12:00:00', message: 'First log entry', level: 'info' },
    { id: 2, timestamp: '2024-01-01 12:05:00', message: 'Second log entry', level: 'error' },
    // Add more dummy logs as needed
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/logs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, []);

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Log Viewer
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>``
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LogViewer;

