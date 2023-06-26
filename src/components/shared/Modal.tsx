import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

export default function Modal({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}: ModalProps) {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-[99]" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-800/70" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all md:w-[600px]">
                  <Dialog.Title
                    as="h3"
                    className="mb-2 text-center text-lg font-medium uppercase leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <hr />
                  <div
                    onClick={handleClose}
                    className="absolute right-3 top-3 cursor-pointer rounded-full p-2 hover:bg-[#f1f5f9]"
                  >
                    <X size={20} />
                  </div>
                  <div className="mt-2">{body}</div>
                  <div className="mt-2 flex flex-row gap-4">
                    {secondaryAction && secondaryActionLabel && (
                      <Button
                        disabled={disabled}
                        onClick={handleSecondaryAction}
                        variant={"outline"}
                        className="w-full border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white"
                      >
                        {secondaryActionLabel}
                      </Button>
                    )}
                    <Button
                      className="w-full bg-rose-600 text-white hover:bg-rose-500 hover:shadow-md hover:shadow-rose-500"
                      disabled={disabled}
                      onClick={handleSubmit}
                    >
                      {actionLabel}
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-col">{footer}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
