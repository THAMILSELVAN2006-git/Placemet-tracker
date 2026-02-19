import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestConnection = () => {
  const [testResult, setTestResult] = useState(null);
  const [dbResult, setDbResult] = useState(null);

  useEffect(() => {
    testBackend();
  }, []);

  const testBackend = async () => {
    try {
      // Test basic connection
      const testRes = await axios.get('http://localhost:5000/api/test/test');
      setTestResult(testRes.data);

      // Test database
      const dbRes = await axios.get('http://localhost:5000/api/test/db-check');
      setDbResult(dbRes.data);
    } catch (error) {
      console.error('Backend test failed:', error);
      setTestResult({ error: error.message });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Backend Connection Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Basic Connection:</h3>
        <pre>{JSON.stringify(testResult, null, 2)}</pre>
      </div>

      <div>
        <h3>Database Check:</h3>
        <pre>{JSON.stringify(dbResult, null, 2)}</pre>
      </div>

      <button onClick={testBackend}>Retest</button>
    </div>
  );
};

export default TestConnection;