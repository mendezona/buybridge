"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { type ApiReturnedData } from "~/app/api/api.types";
import { LoadingSpinner } from "~/components/loadingSpinner";
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

const FormSchema = z.object({
  ean: z.string().regex(/^\d{12,13}$/, {
    message: "EAN must be a 12 or 13 digit number.",
  }),
});
type FormValues = z.infer<typeof FormSchema>;

export function NewProductForm() {
  const [loading, setLoading] = useState<boolean>(false);

  // Use the useForm hook with the resolver and default values
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ean: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setLoading(true);

    // TODO: Can disguise this a bit more if playing around with maximum serveless duration parameters? (e.g. by using a different API)
    try {
      const errors: string[] = [];

      const addNewProductToAmazonPromise = axios.post(
        "/api/addnewproductamazon",
        {
          ean: data.ean,
        },
      );

      const verifyKauflandProductDataPromise = axios.post(
        "/api/verifykauflandproductdata",
        {
          ean: data.ean,
        },
      );

      const [amazonResponse, kauflandResponse] = await Promise.allSettled([
        addNewProductToAmazonPromise,
        verifyKauflandProductDataPromise,
      ]);

      if (amazonResponse.status === "rejected") {
        errors.push("Error with Amazon product data: " + amazonResponse.reason);
      } else {
        const amazonData = amazonResponse.value.data as ApiReturnedData;
        if (amazonData.error) {
          errors.push("Amazon error: " + amazonData.error);
        }
      }

      if (kauflandResponse.status === "rejected") {
        errors.push(
          "Error with Kaufland product data: " + kauflandResponse.reason,
        );
      } else {
        const kauflandData = kauflandResponse.value.data as ApiReturnedData;
        if (kauflandData.error) {
          errors.push("Kaufland error: " + kauflandData.error);
        }
      }

      setLoading(false);
      if (errors.length > 0) {
        toast({
          title: "Error! :(",
          description: errors.join("; "),
        });
      } else {
        toast({
          title: "Success! :)",
          description:
            "Successfully added product to database, please refresh the page",
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error! :(",
        description: error as string,
      });
    }
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
