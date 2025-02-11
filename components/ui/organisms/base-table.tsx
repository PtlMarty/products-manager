import React from "react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface Action<T> {
  icon: React.ReactNode;
  onClick: (item: T) => void;
  label: string;
  className?: string;
}

export interface BaseTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  mobileAccessor?: (item: T) => React.ReactNode;
}

export function BaseTable<T extends { id: string }>({
  data,
  columns,
  actions,
  isLoading,
  emptyMessage = "No data found",
  className = "",
  mobileAccessor,
}: BaseTableProps<T>) {
  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (!data?.length) {
    return <div className="p-4 text-center">{emptyMessage}</div>;
  }

  const renderCellContent = (item: T, accessor: Column<T>["accessor"]) => {
    if (typeof accessor === "function") {
      return accessor(item);
    }
    return String(item[accessor]);
  };

  return (
    <div className={`overflow-x-auto bg-white shadow rounded-lg ${className}`}>
      {/* Mobile View */}
      <div className="block sm:hidden">
        {data.map((item) => (
          <div
            key={item.id}
            className="border-b p-4 space-y-2 hover:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div className="font-medium">
                {mobileAccessor
                  ? mobileAccessor(item)
                  : renderCellContent(item, columns[0].accessor)}
              </div>
              {actions && (
                <div className="flex space-x-2">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => action.onClick(item)}
                      className={action.className}
                      aria-label={action.label}
                    >
                      {action.icon}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              {columns.slice(1).map((column, index) => (
                <div key={index}>
                  {column.header}: {renderCellContent(item, column.accessor)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden sm:block">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 text-left text-sm font-semibold text-gray-600 ${
                    column.className || ""
                  }`}
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={`px-4 py-3 text-sm ${column.className || ""}`}
                  >
                    {renderCellContent(item, column.accessor)}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      {actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => action.onClick(item)}
                          className={action.className}
                          aria-label={action.label}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
