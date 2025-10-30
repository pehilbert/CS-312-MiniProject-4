import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EditPost from './pages/EditPost';
import DeletePost from './pages/DeletePost';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [user_id, setUserId] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user_id={user_id} />} />
        <Route path="/login" element={<Login setUserId={setUserId} />} />
        <Route path="/signup" element={<Signup setUserId={setUserId} />} />
        <Route path="/edit/:id/:user_id" element={<EditPost />} />
        <Route path="/delete/:id/:user_id" element={<DeletePost />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
