//create new shop page
"use client";
import { Button } from "@/components/ui/atoms/button";
import { Input } from "@/components/ui/atoms/input";
import { useShops } from "@/lib/hooks/useShops";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewShopPage() {
  const router = useRouter();
  const { handleCreateShop } = useShops();
  // shop name
  const [name, setName] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await handleCreateShop(name);
      if (result.success) {
        router.push(`/dashboard/shops/${result.data?.id}`);
        router.refresh();
      } else {
        throw new Error(result.error?.message || "Failed to create shop");
      }
    } catch (error) {
      console.error("Error creating shop:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create shop"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen overflow-hidden items-center justify-center flex flex-col">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
        Create New Shop
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col gap-3 justify-center items-center">
          <label htmlFor="name" className="block mb-2">
            Shop Name
          </label>
          <Input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={1}
          />
          <div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Shop"}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </form>
    </div>
  );
}
