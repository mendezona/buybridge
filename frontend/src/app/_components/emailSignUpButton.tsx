import { EnvelopeOpenIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

export function EmailSignUpButton() {
  return (
    <Button className="rounded border border-border bg-primary py-2 font-bold text-primary-foreground hover:bg-primary-foreground hover:text-primary">
      <EnvelopeOpenIcon className="mr-2 h-4 w-4" />
      Get my early access
    </Button>
  );
}
