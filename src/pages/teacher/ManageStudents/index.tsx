import CreateStudent from '../../../components/CreateStudent';
import PageContainer from '../../../components/PageContainer';
import StudentList from '../../../components/StudentList';

export default function ManageStudents() {
  return (
    <PageContainer>
      <div className='flex justify-end mt-4'>
        <CreateStudent />
      </div>
      <StudentList />
    </PageContainer>
  );
}
