import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

function APIAlert({ open, setOpen }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>OpenAi API Key Limit</DialogTitle>
          <DialogDescription className="py-8">
            Due to the OpenAi API key limit, you can only use short pdfs. Less
            than a page content is recommended to proceed.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>We are sorry for the inconvenience.</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default APIAlert;
