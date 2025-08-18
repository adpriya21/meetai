import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/responsive-dialog";

export const useConfirm = (
  title: string,
  description: string,
): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmDialog = () => (
    <ResponsiveDialog
      open={promise !== null}
      onOpenChange={handleClose}
      title={title}
      description={description}
    >
      <div className="pt-4 w-full flex flex-col-reverse lg:flex-row gap-2 items-center justify-end">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="w-full lg:w-auto px-4 py-2 rounded-lg transition-colors hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="destructive"
          className="w-full lg:w-auto px-4 py-2 rounded-lg transition-colors hover:bg-red-700 text-white"
        >
          Confirm
        </Button>
      </div>
    </ResponsiveDialog>
  );

  return [ConfirmDialog, confirm];
};
