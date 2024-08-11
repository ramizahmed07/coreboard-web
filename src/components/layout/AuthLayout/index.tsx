export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='w-full'>
      <div className='px-4 sm:px-0 max-w-[350px] m-auto mt-20 space-y-6 text-center'>
        {children}
      </div>
    </div>
  );
};
