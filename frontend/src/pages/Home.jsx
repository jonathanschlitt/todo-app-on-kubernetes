import { useSelector } from 'react-redux';

import Search from '../components/Search';
import Spinner from '../components/Spinner';
import Todo from '../components/Todo';

import { useGetTodosQuery } from '../app/services/todo/todoApi';
import { Tab } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Home = () => {
  const { todos } = useSelector((state) => state.todos);
  const user = useSelector((state) => state.auth.user);

  const { isLoading } = useGetTodosQuery();

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

      <div className="w-full px-4 py-8">
        <Tab.Group>
          <Tab.List className="flex space-x-1 max-w-2xl mx-auto rounded-xl bg-green-300 p-1 shadow-md">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-lime-500',

                  selected
                    ? 'bg-white shadow'
                    : 'text-lime-800 hover:bg-white/[0.12] hover:text-lime-600'
                )
              }
            >
              Alle Todos
            </Tab>

            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-lime-500',

                  selected
                    ? 'bg-white shadow'
                    : 'text-lime-800 hover:bg-white/[0.12] hover:text-lime-600'
                )
              }
            >
              Todo
            </Tab>

            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-lime-500',

                  selected
                    ? 'bg-white shadow'
                    : 'text-lime-800 hover:bg-white/[0.12] hover:text-lime-600'
                )
              }
            >
              Done
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel className={classNames('rounded-xl bg-white py-3')}>
              <div className="max-w-4xl mx-auto my-8">
                {/* <h3 className="text-green-500 font-semibold text-center mt-4 mb-2 text-3xl">
                  Alle Todos
                </h3> */}
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
                  {todos?.map((todo) => (
                    <Todo key={todo._id} todo={todo} />
                  ))}
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel className={classNames('rounded-xl bg-white py-3')}>
              <div className="max-w-4xl mx-auto my-8">
                {/* <h3 className="text-green-500 font-semibold text-center mt-4 mb-2 text-3xl">
                  To Do
                </h3> */}
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
                  {todos?.map((todo) =>
                    todo.active ? <Todo key={todo._id} todo={todo} /> : null
                  )}
                </div>
              </div>
            </Tab.Panel>

            <Tab.Panel className={classNames('rounded-xl bg-white py-3')}>
              <div className="max-w-4xl mx-auto my-8">
                {/* <h3 className="text-green-500 font-semibold text-center mt-4 mb-2 text-3xl">
                  Done
                </h3> */}
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
                  {todos?.map((todo) =>
                    !todo.active ? <Todo key={todo._id} todo={todo} /> : null
                  )}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};
export default Home;
