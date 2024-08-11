import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <>
      <div className='bg-white absolute left-0 top-0 w-full h-full'>
        <div className='text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <h1 className='text-6xl font-bold text-gray-800'>404</h1>
          <p className='text-2xl text-gray-600 mt-4'>Not Found</p>
          <p className='text-gray-500 mt-2 mb-5'>
            The resource requested could not be found on this server!
          </p>
          <Link
            replace
            to='/'
            className='border p-3 rounded-sm border-gray-500'
          >
            Back to home
          </Link>
        </div>
      </div>
    </>
  );
};
