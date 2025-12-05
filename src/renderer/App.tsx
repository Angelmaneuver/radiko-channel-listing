import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';

import { RadikoScheduleBoard } from './components/component';

import './App.css';
import './globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RadikoScheduleBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
