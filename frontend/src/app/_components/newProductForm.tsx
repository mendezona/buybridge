"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";
import { LoadingSpinner } from "./loadingSpinner";

const FormSchema = z.object({
  ean: z.string().regex(/^\d{12,13}$/, {
    message: "EAN must be a 12 or 13 digit number.",
  }),
});
type FormValues = z.infer<typeof FormSchema>;

export function NewProductForm() {
  const { mutate } = api.items.submitNewProductEAN.useMutation();
  const [loading, setLoading] = useState<boolean>(false);

  // Use the useForm hook with the resolver and default values
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ean: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: FormValues) {
    setLoading(true);
    mutate(
      { ean: data.ean },
      {
        onSuccess: () => {
          setLoading(false);
          toast({
            title: "You submitted the following values:",
            description: (
              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                <code className="text-white">{data.ean}</code>
              </pre>
            ),
          });
        },
        onError: () => {
          setLoading(false);
          toast({
            title: "Error",
            description: "There was an error submitting the form.",
            // status: "error",
          });
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          disabled={loading}
          control={form.control}
          name="ean"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add new product</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter European Article Number (EAN)"
                  {...field}
                />
              </FormControl>
              <FormDescription>EAN = European Article Number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading && <LoadingSpinner showText={false} />}
          {loading ? "Submitting product..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
