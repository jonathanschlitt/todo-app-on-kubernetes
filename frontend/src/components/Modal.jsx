import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from 'react-hot-toast';

import Spinner from './Spinner';

import {
  useAddTodoMutation,
  useUpdateTodoMutation,
} from '../app/services/todo/todoApi';

const Modal = ({ isOpen, closeModal, update, todo }) => {
  const defaultValues = update ? todo : {};

  const [addTodo, { isLoading }] = useAddTodoMutation();
  const [updateTodo, { isUpdateLoading }] = useUpdateTodoMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (update) {
      updateTodo({ ...data, _id: todo._id });
      // dispatch(updateTodo({ ...data, _id: todo._id }));
      closeModal();
      reset();
      toast.success('Todo Item wurde erfolgreich geändert.');
    } else {
      addTodo(data);

      // dispatch(addTodo(data));
      closeModal();
      reset();
      toast.success('Todo Item wurde erfolgreich erstellt.');
    }
  };

  if (isLoading || isUpdateLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-green-600 bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {update
                      ? 'Todo Item bearbeiten'
                      : 'Neues Todo Item erstellen'}
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                      <div className="mb-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <div className="mt-1">
                          <input
                            {...register('name', { required: true })}
                            defaultValue={update ? defaultValues.name : ''}
                            type="text"
                            name="name"
                            id="name"
                            className="shadow-sm focus:ring-lime-500 focus:border-lime-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          {errors.name?.type === 'required' && (
                            <p
                              role="alert"
                              className="text-xs mt-1 text-orange-700 animate-pulse"
                            >
                              Bitte geben einen Namen ein.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Beschreibung
                        </label>
                        <div className="mt-1">
                          <textarea
                            {...register('description', { required: true })}
                            defaultValue={
                              update ? defaultValues.description : ''
                            }
                            type="text"
                            name="description"
                            id="description"
                            className="shadow-sm focus:ring-lime-500 focus:border-lime-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          {errors.name?.type === 'required' && (
                            <p
                              role="alert"
                              className="text-xs mt-1 text-orange-700 animate-pulse"
                            >
                              Bitte geben fügen Sie eine Beschreibung hinzu.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="deadline"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Deadline
                        </label>
                        <div className="mt-1">
                          <input
                            {...register('deadline', { required: true })}
                            defaultValue={update ? defaultValues.deadline : ''}
                            type="text"
                            name="deadline"
                            id="deadline"
                            className="shadow-sm focus:ring-lime-500 focus:border-lime-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                          {errors.name?.type === 'required' && (
                            <p
                              role="alert"
                              className="text-xs mt-1 text-orange-700 animate-pulse"
                            >
                              Bitte geben Sie eine Deadline an.
                            </p>
                          )}
                        </div>

                        <div className="py-1">
                          <label
                            htmlFor="active"
                            className="text-sm font-medium text-gray-700"
                          >
                            Aktiv?
                          </label>
                          <div className="mt-1">
                            <input
                              type="checkbox"
                              {...register('active')}
                              defaultChecked={
                                update ? defaultValues.active : false
                              }
                              name="active"
                              id="active"
                              className="shadow-sm focus:ring-lime-500 focus:border-lime-500 block sm:text-sm border-gray-300 rounded-md w-5 h-5 text-green-500"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-x-4">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        >
                          <span>
                            {update ? 'Änderungen speichern' : 'Erstellen'}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={() => {
                            closeModal();
                            reset();
                          }}
                        >
                          Abbrechen
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
export default Modal;
