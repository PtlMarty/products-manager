type Options<T> = {
  actionFn: () => Promise<T>;
  successMessage?: string;
};

export async function executeAction<T>({
  actionFn,
  successMessage = "Action completed successfully",
}: Options<T>): Promise<T> {
  try {
    const result = await actionFn();
    return result;
  } catch (error) {
    console.error("Action error:", error);
    throw error instanceof Error ? error : new Error("Action failed");
  }
}
