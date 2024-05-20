import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

export function EmailSignUpButton() {
  return (
    <Button className="bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary border-border rounded border px-4 py-2 font-bold">
      <EnvelopeOpenIcon className="mr-2 h-4 w-4" />
      Get my early access
    </Button>
  );
}
