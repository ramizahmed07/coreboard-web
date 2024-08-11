import React, { Suspense } from 'react';
import { Route, Routes as RoutesGroup } from 'react-router-dom';
import RootLayout from '../components/layout/RootLayout';
import { PrivateRoute } from './privateRoute';
import { NotFound } from '../pages/NotFound';
import { Loader } from '../components/Loader';

const Signin = React.lazy(() => import('../pages/Signin'));
const Signup = React.lazy(() => import('../pages/Signup'));
const Home = React.lazy(() => import('../pages/Home'));
const ManageStudents = React.lazy(
  () => import('../pages/teacher/ManageStudents')
);
const StudentPages = React.lazy(() => import('../pages/teacher/StudentPages'));

export default function Routes() {
  return (
    <Suspense fallback={<Loader />}>
      <RoutesGroup>
        <Route element={<RootLayout />}>
          <Route index path='/signin' element={<Signin />} />
          <Route index path='/signup' element={<Signup />} />
          <Route
            path='/manage-students'
            element={
              <PrivateRoute teacher>
                <ManageStudents />
              </PrivateRoute>
            }
          />
          <Route
            path='/student/:id'
            element={
              <PrivateRoute teacher>
                <StudentPages />
              </PrivateRoute>
            }
          />
          <Route
            path='/'
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path='*' element={<NotFound />} />
        </Route>
      </RoutesGroup>
    </Suspense>
  );
}
