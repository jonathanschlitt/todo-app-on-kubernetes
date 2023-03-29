import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { logoutSuccess } from '../app/services/auth/authSlice';

const Navigation = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  return (
    <div className="w-full">
      <nav className="bg-green-500 py-3">
        <div className="mx-auto max-w-3xl flex justify-center space-x-6">
          <Link
            to="/"
            className="text-green-50 text-lg sm:text-xl font-semibold hover:bg-green-400 duration-200 py-1 px-2 rounded-md"
          >
            Todo App
          </Link>
          {user ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch(logoutSuccess());
              }}
              className="text-green-50 text-lg sm:text-xl font-semibold hover:bg-green-400 duration-200 py-1 px-2 rounded-md"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="text-green-50 text-lg sm:text-xl font-semibold hover:bg-green-400 duration-200 py-1 px-2 rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};
export default Navigation;
