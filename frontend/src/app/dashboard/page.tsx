import { type Item } from "@prisma/client";
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
    <div className="w-full max-w-xs">
      <div>
        {data ? (
          data.map((item: Item) => <div key={item.id}>{item.name}</div>)
        ) : (
          <p>No items found</p>
        )}
      </div>
    </div>
  );
}
