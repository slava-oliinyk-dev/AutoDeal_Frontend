import styles from "./Modal.module.scss";
import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
  contentClassName?: string;
  bodyClassName?: string;
  closeClassName?: string;
};

export const Modal = ({ open, onOpenChange, title, children, contentClassName, bodyClassName, closeClassName }: ModalProps) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalOverlay} />

        <Dialog.Content className={`${styles.modalContent} ${contentClassName ?? ""}`}>
          {title && <Dialog.Title className={styles.modalTitle}>{title}</Dialog.Title>}

          <div className={`${styles.modalBody} ${bodyClassName ?? ""}`}>{children}</div>

          <Dialog.Close asChild>
            <button className={`${styles.modalClose} ${closeClassName ?? ""}`} aria-label="Close modal">
              ×
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
