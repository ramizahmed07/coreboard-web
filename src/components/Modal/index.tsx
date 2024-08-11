import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface ModalProps {
  title: string;
  trigger: JSX.Element;
  children: React.ReactNode;
  description: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({
  title,
  trigger,
  description,
  open,
  setOpen,
  children,
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='mt-3'>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
Modal.displayName = 'Modal';
