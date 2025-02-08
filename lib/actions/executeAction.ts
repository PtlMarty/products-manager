type Options<T> = {
  actionFn: () => Promise<T>;
  successMessage?: string;
};

export async function executeAction<T>(options: Options<T>): Promise<T> {
  if (!options || typeof options !== "object") {
    throw new Error("Options must be an object");
  }

  if (typeof options.actionFn !== "function") {
    throw new Error("actionFn must be a function");
  }

  try {
    const result = await options.actionFn();
    return result;
  } catch (error) {
    console.error("Action error:", error);
    throw error instanceof Error ? error : new Error("Action failed");
  }
}
