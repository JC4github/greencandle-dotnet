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

interface DialogProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoDialog({ message, isOpen, onClose }: DialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

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
          <AlertDialogHeader>Report Saving</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{message}</AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose} name="ok-button">OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
