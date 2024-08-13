import useFetchStudents from '../../api/use-fetch-students';
import UpdateStudent from '../UpdateStudent';
import DeleteStudent from '../DeleteStudent';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Loader } from '../Loader';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { User } from '../../contexts/auth';

export default function StudentList() {
  const { data, isLoading } = useFetchStudents();
  const navigate = useNavigate();
  const { students } = data || {};

  return (
    <div className='mt-5'>
      {isLoading && <Loader />}

      <div className='w-full'>
        <Table>
          <TableCaption>A list of students.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>No</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Link</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students?.map((user: User, idx: number) => (
              <TableRow key={user._id}>
                <TableCell className='font-medium'>{idx + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => navigate(`/student/${user._id}`)}
                    variant='secondary'
                  >
                    Go to Pages
                  </Button>
                </TableCell>
                <TableCell className='text-right space-x-2'>
                  <UpdateStudent user={user} />
                  <DeleteStudent userId={user._id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
