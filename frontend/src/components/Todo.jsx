import { Disclosure, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { useDispatch } from 'react-redux';
import { deleteTodo } from '../api/todo/todoSlice';
import { useState } from 'react';
import Modal from './Modal';

const Todo = ({ todo }) => {
  const dispatch = useDispatch();

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <div className="">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-green-100 p-4 text-left text-sm font-medium text-green-900 hover:bg-green-200 duration-200 focus:outline-none focus-visible:ring focus-visible:ring-green-500 focus-visible:ring-opacity-75">
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
                show={open}
                enter="transition duration-500 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-300 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="p-4 mt-1 text-sm text-gray-500 bg-lime-50 rounded-lg hover:bg-lime-100 duration-200">
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
                            dispatch(deleteTodo(todo._id));
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
