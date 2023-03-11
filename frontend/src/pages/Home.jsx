import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodos } from '../api/todo/todoSlice';
import Search from '../components/Search';
import Spinner from '../components/Spinner';
import Todo from '../components/Todo';

const Home = () => {
  const dispatch = useDispatch();
  const { todos, isLoading } = useSelector((state) => state.todos);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="my-8 px-4">
      <h1 className="text-lime-500 font-bold text-3xl sm:text-4xl md:text-5xl text-center pt-8">
        Todo Dashboard
      </h1>

      <h2 className="text-center text-gray-700 py-4 font-medium">
        Willkommen zurück,{' '}
        <span className="text-green-600">
          {user?.surname} {user.lastname}
        </span>
      </h2>

      <Search />

      <div className="max-w-4xl mx-auto my-8">
        <h3 className="text-green-500 font-semibold text-center mt-4 mb-2 text-3xl">
          Alle Todos
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
          {todos?.map((todo) => (
            <Todo key={todo._id} todo={todo} />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto my-8">
        <h3 className="text-green-500 font-semibold text-center mt-4 mb-2 text-3xl">
          To Do
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
          {todos?.map((todo) =>
            todo.active ? <Todo key={todo._id} todo={todo} /> : null
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto my-8">
        <h3 className="text-green-500 font-semibold text-center mt-4 mb-2 text-3xl">
          Done
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
          {todos?.map((todo) =>
            !todo.active ? <Todo key={todo._id} todo={todo} /> : null
          )}
        </div>
      </div>
    </div>
  );
};
export default Home;
