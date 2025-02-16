"use client";
import "react-toastify/dist/ReactToastify.css";
import * as TableLogic from "./tableLogic";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";

export default function TablePage() {
  const {
    table,
    loading,
    setLoading,
    error,
    setError,
    saveTable,
    updateCellValue,
    addColumn,
    selectedCell,
    setSelectedCell,
    saving,
    addRow,
    deleteTable,
    deleteColumn,
    deleteRow,
    updateCellBackground,
    editedBackgroundColor,
    router,
    setEditedHeader,
    selectedColumn,
    setSelectedColumn,
    resetSelection,
    calculateOverlayVisible,
    setCalculateOverlayVisible,
    handleCalculateButtonClick,
    handleOverlayOptionClick,
    columnCells,
    setColumnCells,
  } = TableLogic.useTableLogic();

  const [recentTables, setRecentTables] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
          fetchRecentTables(data.user.id);
        } else {
          setError("Failed to fetch table");
          router.replace("/login");
        }
      } catch (e) {
        setError("Error getting user: " + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchRecentTables = async (userId: string) => {
    try {
      const res = await fetch("/api/get-tables", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          userId: userId.toString(),
        },
      });

      const data = await res.json();
      if (res.ok) {
        const sortedTables = data.tables
          .filter((t: any) => t.id !== table?.id)
          .sort(
            (a: any, b: any) =>
              new Date(b.lastUpdatedAt).getTime() -
              new Date(a.lastUpdatedAt).getTime()
          )
          .slice(0, 5);

        setRecentTables(sortedTables);
      } else {
        console.error("Failed to fetch recent tables:", data.error);
      }
    } catch (error) {
      console.error("Error fetching recent tables:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="border-t-4 border-teal-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!table) {
    return <p className="text-center text-red-500">Table not found</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-gray-800 p-6 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
          Recently Worked On Tables
        </h2>
        <div className="space-y-4">
          {recentTables.length > 0 ? (
            recentTables.map((recentTable) => (
              <div
                key={recentTable.id}
                className="p-4 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                onClick={() => router.push(`/tables/${recentTable.id}`)}
              >
                <h3 className="text-lg font-semibold truncate bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                  {recentTable.title || "Untitled"}
                </h3>
                <p className="text-sm truncate text-gray-300">
                  {recentTable.description || "No description available"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No recent tables found.</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent cursor-pointer hover:underline"
            onClick={() => router.push("/tables")}
          >
            Tables
          </h1>
          <button
            onClick={() => router.push("/pinboard")}
            className="text-sm bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent hover:underline"
          >
            Back to Pinboard
          </button>
        </div>

        {/* Table Editor */}
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <h1 className="text-3xl font-bold mb-4 text-left bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            {table.title}
          </h1>
          <div className="overflow-auto">
            <table className="table-auto w-full border-collapse border border-gray-600">
              <thead>
                <tr>
                  {table.columns.map((column: any) => (
                    <th
                      key={column.id}
                      className="border border-gray-600 p-2 bg-gray-700"
                    >
                      <input
                        type="text"
                        value={column.header || ""}
                        onClick={() => {
                          resetSelection();
                          setSelectedColumn(column);
                          setColumnCells(column.cells);
                        }}
                        onChange={(e) => setEditedHeader(e.target.value)}
                        className="bg-transparent w-full border-none outline-none text-center bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent placeholder-blue-600"
                        placeholder="Header"
                      />
                    </th>
                  ))}
                  <th>
                    <button
                      className="bg-gradient-to-r from-blue-400 to-blue-200 text-gray-900 px-2 py-1 rounded-md hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 transition"
                      onClick={addColumn}
                    >
                      + Add Column
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {table.rows.map((row: any) => (
                  <tr key={row.id}>
                    {row.cells.map((cell: any) => (
                      <td
                        key={cell.id}
                        className="border border-gray-600 p-4 cursor-pointer"
                        onClick={() => {
                          resetSelection();
                          setSelectedCell(cell);
                        }}
                        style={{
                          backgroundColor: cell.backgroundColor || "#1e293b",
                          outline:
                            selectedCell?.id === cell.id ||
                            (selectedColumn &&
                              selectedColumn.id === cell.columnId)
                              ? "2px solid #06b6d4"
                              : "none",
                        }}
                      >
                        <input
                          type="text"
                          value={cell.value || ""}
                          onChange={(e) =>
                            updateCellValue(cell.id, e.target.value)
                          }
                          className="bg-transparent w-full border-none outline-none text-center text-black"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td>
                    <button
                      className="bg-gradient-to-r from-blue-400 to-blue-200 text-gray-900 px-2 py-1 rounded-md w-[100%] hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 transition"
                      onClick={addRow}
                    >
                      + Add Row
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Pane */}
        <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent mb-4">
            Table Details
          </h2>
          <ul className="space-y-5 text-gray-300">
            {selectedCell && (
              <li className="flex items-center">
                <span>Background Color:</span>
                <input
                  type="color"
                  value={editedBackgroundColor}
                  onChange={(e) =>
                    updateCellBackground(selectedCell.id, e.target.value)
                  }
                  className="ml-2"
                />
              </li>
            )}

            <button
              onClick={saveTable}
              className="w-full mt-6 py-2 rounded-md bg-gradient-to-r from-blue-400 to-blue-200 text-gray-900 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 transition"
            >
              {saving ? (
                <div className="w-4 h-4 border-t-4 border-gray-900 border-solid rounded-full animate-spin mx-auto"></div>
              ) : (
                "Save"
              )}
            </button>

            <button
              onClick={handleCalculateButtonClick}
              className="w-full mt-4 py-2 rounded-md bg-gradient-to-r from-blue-400 to-blue-200 text-gray-900 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-300 transition"
            >
              Calculate
            </button>

            <button
              onClick={deleteTable}
              className="w-full mt-4 bg-gradient-to-r from-red-600 to-red-500 text-gray-100 py-2 rounded-md hover:bg-gradient-to-r hover:from-red-700 hover:to-red-600 transition"
            >
              Delete Table
            </button>
          </ul>
        </div>
      </div>
    </div>
  );
}
