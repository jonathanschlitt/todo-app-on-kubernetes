import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from './Modal';
import { useDispatch } from 'react-redux';
import { searchTodos } from '../api/todo/todoSlice';

const Search = () => {
  const dispatch = useDispatch();
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const { register, handleSubmit, getValues } = useForm();

  const onSubmit = (data) => {
    // console.log(JSON.stringify(data.search));
    dispatch(searchTodos(data.search));
  };

  const searchShowAll = () => {
    if (getValues('search') === '') {
      dispatch(searchTodos(''));
    } else {
    }
  };

  return (
    <div className="mx-auto max-w-xl p-4 rounded-md shadow-md my-8 flex justify-between items-center gap-x-2">
      <form
        className="flex items-center max-w-md flex-1"
        onChange={handleSubmit(onSubmit)}
        onBlur={searchShowAll}
      >
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
          </div>
          <input
            {...register('search', { required: true })}
            type="text"
            id="search"
            className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-lime-500 focus:border-lime-500 block w-full pl-10 p-2 border-green-600"
            placeholder="Search"
          ></input>
        </div>
      </form>

      <div>
        <button
          className="bg-green-500 text-green-50 p-2 rounded-md flex items-center hover:bg-lime-500 duration-300 ease-in-out"
          onClick={(e) => {
            e.preventDefault();
            openModal();
          }}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <div>
        <Modal isOpen={isOpen} openModal={openModal} closeModal={closeModal} />
      </div>
    </div>
  );
};
export default Search;
