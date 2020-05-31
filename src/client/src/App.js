import React from 'react';
import './App.css';

const axios = require('axios');

const baseURL = 'http://localhost:8080/api';

function App() {
	async function fetchPossibleUser () {
		try {
      const response = await axios.get(`${baseURL}/auth/success`, { withCredentials: true, headers: { 'Access-Control-Allow-Credentials': true } });
			console.log(response);
		} catch (e) { console.error(e); }
	}

	React.useEffect(() => {
		fetchPossibleUser();
	}, []);

  const login = () => {
    window.location.href = baseURL + '/auth';
  }

  return (
    <div className="App">
      <button onClick={login}>Entrar com USP</button>
    </div>
  );
}

export default App;
