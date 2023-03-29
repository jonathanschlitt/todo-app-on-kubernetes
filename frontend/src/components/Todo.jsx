import { Disclosure, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';

import { useState } from 'react';
import Modal from './Modal';

import Spinner from './Spinner';

import {
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from '../app/services/todo/todoApi';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Todo = ({ todo }) => {
  let [isOpen, setIsOpen] = useState(false);

  const [updateTodo, { isUpdateLoading }] = useUpdateTodoMutation();
  const [deleteTodo, { isDeleteLoading }] = useDeleteTodoMutation();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const toggleOpenAndUpdate = () => {
    return () => {
      updateTodo({ ...todo, showDetails: !todo.showDetails });
      // dispatch(updateTodo({ ...todo, showDetails: !todo.showDetails }));
    };
  };

  if (isUpdateLoading || isDeleteLoading) {
    return <Spinner />;
  }

  return (
    <div className="">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button
                onClick={toggleOpenAndUpdate()}
                className={classNames(
                  'flex w-full justify-between rounded-lg p-4 text-left text-sm font-medium text-green-900 duration-200 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75',
                  todo.active
                    ? 'bg-green-100 hover:bg-green-200'
                    : 'bg-gray-200 hover:bg-gray-300'
                )}
              >
                <div className="flex w-full justify-between">
                  <span>{todo.name}</span>
                  <ChevronDownIcon
                    className={`${
                      open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-green-500`}
                  />
                </div>
              </Disclosure.Button>
              <Transition
                show={todo.showDetails}
                enter="transition duration-500 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-300 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel
                  className={classNames(
                    'p-4 mt-1 text-sm text-gray-500  rounded-lg  duration-200',
                    todo.active
                      ? 'bg-lime-50 hover:bg-lime-100'
                      : 'bg-gray-100 hover:bg-gray-200'
                  )}
                >
                  <div>
                    <p>{todo.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span>Deadline: </span>
                        <span>{todo.deadline}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="rounded-full p-1.5 hover:bg-red-200 duration-100"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteTodo(todo._id);
                            // dispatch(deleteTodo(todo._id));
                          }}
                        >
                          <TrashIcon className="h-5 w-5 text-red-600" />
                        </button>
                        <button
                          className="rounded-full p-1.5 hover:bg-orange-200 duration-100"
                          onClick={(e) => {
                            e.preventDefault();
                            openModal();
                          }}
                        >
                          <PencilIcon className="h-5 w-5 text-orange-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>

      <Modal
        update={true}
        isOpen={isOpen}
        closeModal={closeModal}
        todo={todo}
      />
    </div>
  );
};
export default Todo;
