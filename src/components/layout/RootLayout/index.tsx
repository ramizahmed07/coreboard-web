import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from '../../Header';
import { cn } from '../../../lib/utils';

function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('p-10 max-w-5xl m-auto', className)}>{children}</div>
  );
}

export default function RootLayout() {
  return (
    <Container>
      <Toaster closeButton position='bottom-right' />
      <Header />
      <Outlet />
    </Container>
  );
}
