import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
// import { login } from '../api/auth/authSlice';

import Spinner from '../components/Spinner';

import { useLoginMutation } from '../app/services/auth/authApi';
import { loginSuccess } from '../app/services/auth/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoginLoading }] = useLoginMutation();

  const { user } = useSelector((state) => state.auth);

  const defaultValues = {
    email: 'test@todoapp.com',
    password: 'Test1234',
  };

  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm();

  const onSubmit = async (loginData) => {
    try {
      const data = await login(loginData).unwrap();
      dispatch(loginSuccess(data));
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate, dispatch]);

  if (isLoginLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="pt-48">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-green-600">
              Login
            </h2>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray">
              Do not have an account?{' '}
              <span>
                Click{' '}
                <Link
                  to={'/register'}
                  className="text-green-600 underline hover:text-green-700"
                >
                  here
                </Link>{' '}
                to register!
              </span>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email Adresse
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Email Adresse"
                  {...register('email', { required: true })}
                  defaultValue={defaultValues.email}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Passwort
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Passwort"
                  {...register('password', { required: true })}
                  defaultValue={defaultValues.password}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
