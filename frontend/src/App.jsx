import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

import { useSelector } from 'react-redux';
import Navigation from './components/Navigation';

import { Toaster } from 'react-hot-toast';

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 5000,
        }}
      />
      <div className="">
        <Navigation />
        <Routes>
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </div>
    </>
  );
};
export default App;
