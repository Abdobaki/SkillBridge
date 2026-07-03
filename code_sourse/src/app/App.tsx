import { Toaster } from 'sonner';
import { RouterProvider } from 'react-router';
import { router } from './router';

export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <RouterProvider router={router} />
    </>
  );
}