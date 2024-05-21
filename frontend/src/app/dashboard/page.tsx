import { SignOutButton } from "@clerk/nextjs";
import { type Item } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/server";

export default async function Dashboard() {
  return (
    <main className="flex-1">
      <CrudShowcase />
    </main>
  );
}

async function CrudShowcase() {
  const data: Item[] = await api.items.getAll();

  return (
    <div>
      <div className="flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="relative flex w-full max-w-md flex-col gap-4 px-6">
          <div className="p8 flex justify-center">
            <h1 className="text-center text-4xl font-bold text-gray-900 dark:text-gray-100">
              Dashboard - Under Construction
            </h1>
          </div>
          <div className="p8 flex justify-center">
            <SignOutButton>
              <Button variant="secondary">Sign Out</Button>
            </SignOutButton>
          </div>
        </div>
      </div>
      <div className="w-full max-w-xs">
        <h1>UNDER CONSTRUCTION - DASHBOARD PAGE</h1>
        <div>
          {data ? (
            data.map((item: Item) => <div key={item.id}>{item.name}</div>)
          ) : (
            <p>No items found</p>
          )}
        </div>
      </div>
    </div>
  );
}
