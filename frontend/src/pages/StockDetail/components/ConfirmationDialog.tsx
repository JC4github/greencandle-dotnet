import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfirmationDialog({ isOpen, onClose }: DialogProps) {
  const navigate = useNavigate();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const onLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <>
      <AlertDialog
        onClose={onClose}
        isOpen={isOpen}
        isCentered
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Warning!</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Please Login to Generate the Stock Report!
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" ml={3} onClick={onLogin}>
              Login
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
