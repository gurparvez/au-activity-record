import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootState } from "@/store";
import { myAppwrite } from "@/api/appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { formatAttributeKey } from "@/utils";

interface Document {
  $id: string;
  $createdAt: string;
  [key: string]: any;
}

interface Attribute {
  key: string;
  type: string;
  required: boolean;
  array: boolean;
  elements?: string[];
}

interface Filter {
  key: string;
  type: string;
  mode?: string | null; // For string types: "exact", "contains", or null
  value?: string | string[] | null;
  startDate?: string | null; // For $createdAt
  endDate?: string | null; // For $createdAt
}

// Utility function to convert array of objects to CSV
const convertToCSV = (documents: Document[], attributes: Attribute[]): string => {
  if (documents.length === 0) return "";

  // Define CSV headers (use attribute keys)
  const headers = ["id", ...attributes.map((attr) => attr.key)];

  // Map documents to CSV rows
  const rows = documents.map((doc) => {
    const row = [
      doc.$id,
      ...attributes.map((attr) => {
        const value = doc[attr.key];
        if (attr.type === "datetime") {
          return value ? new Date(value).toISOString() : "";
        }
        if (Array.isArray(value)) {
          return `"${value.join(", ")}"`;
        }
        return value !== null && value !== undefined ? `"${value.toString().replace(/"/g, '""')}"` : "";
      }),
    ];
    return row.join(",");
  });

  return [headers.join(","), ...rows].join("\n");
};

// Utility function to trigger CSV download
const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Utility function to apply filters to documents
const applyFilters = (documents: Document[], filters: Filter[], attributes: Attribute[]): Document[] => {
  return documents.filter((doc) => {
    return filters.every((filter) => {
      if (filter.key === "$createdAt") {
        const docDate = new Date(doc.$createdAt);
        const startDate = filter.startDate ? new Date(filter.startDate) : null;
        const endDate = filter.endDate ? new Date(filter.endDate) : null;

        if (startDate && docDate < startDate) return false;
        if (endDate) {
          endDate.setHours(23, 59, 59, 999); // Include entire end date
          if (docDate > endDate) return false;
        }
        return true;
      }

      if (filter.mode === null || filter.value === null || filter.value === "none") return true; // Skip empty or "none" filters
      const docValue = doc[filter.key];
      const attr = attributes.find((a) => a.key === filter.key);

      if (!attr) return true;

      switch (attr.type) {
        case "string":
        case "email":
        case "url":
        case "ip":
          if (!docValue || typeof docValue !== "string") return false;
          if (filter.mode === "exact") {
            return docValue.toLowerCase() === (filter.value as string).toLowerCase();
          } else if (filter.mode === "contains") {
            return docValue.toLowerCase().includes((filter.value as string).toLowerCase());
          }
          return true;
        case "integer":
        case "float":
          return docValue === parseFloat(filter.value as string);
        case "boolean":
          return docValue === (filter.value === "true");
        case "enum":
          return docValue === filter.value;
        case "datetime":
          if (!docValue || !filter.value) return false;
          const docDate = new Date(docValue).toISOString().split("T")[0];
          const filterDate = new Date(filter.value as string).toISOString().split("T")[0];
          return docDate === filterDate;
        default:
          return true;
      }
    });
  });
};

const DownloadRecord = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);

  // Get collection details from Redux store
  const activity = useSelector((state: RootState) =>
    state.activities.activities.find((act) => act.collectionId === id)
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("No collection ID provided");
        setLoading(false);
        return;
      }

      if (!activity) {
        setError("Activity not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all documents for the collection
        const fetchedDocuments = await myAppwrite.getDocumentsOfActivity(id);

        if (fetchedDocuments.length === 0) {
          setError("No documents found in this collection");
          setDocuments([]);
          setFilteredDocuments([]);
          setLoading(false);
          return;
        }

        // Initialize filters based on attributes + $createdAt
        const initialFilters = [
          ...activity.attributes.map((attr) => ({
            key: attr.key,
            type: attr.type,
            mode: attr.type === "string" || attr.type === "email" || attr.type === "url" || attr.type === "ip" ? "none" : null,
            value: null,
          })),
          {
            key: "$createdAt",
            type: "datetime",
            startDate: null,
            endDate: null,
          },
        ];
        setFilters(initialFilters);
        setDocuments(fetchedDocuments);
        setFilteredDocuments(fetchedDocuments);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch documents");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, activity]);

  // Apply filters whenever they change
  useEffect(() => {
    if (documents.length > 0 && activity) {
      const filtered = applyFilters(documents, filters, activity.attributes);
      setFilteredDocuments(filtered);
    }
  }, [filters, documents, activity]);

  // Handle filter mode changes (for string types)
  const handleFilterModeChange = (key: string, mode: string | null) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.key === key ? { ...filter, mode, value: mode === "none" ? null : filter.value } : filter
      )
    );
  };

  // Handle filter value changes
  const handleFilterValueChange = (key: string, value: string | null) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.key === key ? { ...filter, value } : filter
      )
    );
  };

  // Handle date range changes for $createdAt
  const handleDateRangeChange = (key: string, field: "startDate" | "endDate", value: string | null) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.key === key ? { ...filter, [field]: value } : filter
      )
    );
  };

  // Handle clear all filters
  const handleClearAll = () => {
    const resetFilters = filters.map((filter) => ({
      ...filter,
      mode: filter.type === "string" || filter.type === "email" || filter.type === "url" || filter.type === "ip" ? "none" : null,
      value: null,
      startDate: filter.key === "$createdAt" ? null : filter.startDate,
      endDate: filter.key === "$createdAt" ? null : filter.endDate,
    }));
    setFilters(resetFilters);
    setError(null);
  };

  // Handle CSV download
  const handleDownload = () => {
    if (filteredDocuments.length === 0) {
      setError("No documents match the applied filters");
      return;
    }

    const csvContent = convertToCSV(filteredDocuments, activity?.attributes || []);
    const collectionName = activity?.name.replace(/[^a-zA-Z0-9]/g, "_") || "collection";
    downloadCSV(csvContent, collectionName);
    setError(null);
  };

  if (!activity) {
    return <div className="p-4 text-center">Activity not found</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Download Records for {activity.name}</h1>

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" />
          <span>Loading documents...</span>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filters.map((filter) => {
                const attr = activity.attributes.find((a) => a.key === filter.key);
                if (filter.key === "$createdAt") {
                  return (
                    <div key={filter.key} className="space-y-2">
                      <Label>Created At</Label>
                      <div className="flex flex-col gap-2">
                        <div>
                          <Label htmlFor="filter-createdAt-start" className="text-sm">
                            Start Date
                          </Label>
                          <Input
                            id="filter-createdAt-start"
                            type="date"
                            value={filter.startDate as string || ""}
                            onChange={(e) => handleDateRangeChange(filter.key, "startDate", e.target.value || null)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="filter-createdAt-end" className="text-sm">
                            End Date
                          </Label>
                          <Input
                            id="filter-createdAt-end"
                            type="date"
                            value={filter.endDate as string || ""}
                            onChange={(e) => handleDateRangeChange(filter.key, "endDate", e.target.value || null)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={filter.key} className="space-y-2">
                    <Label htmlFor={`filter-mode-${filter.key}`}>
                      {formatAttributeKey(filter.key)}
                    </Label>
                    {(filter.type === "string" || filter.type === "email" || filter.type === "url" || filter.type === "ip") ? (
                      <>
                        <Select
                          onValueChange={(value) => handleFilterModeChange(filter.key, value === "none" ? null : value)}
                          value={filter.mode || "none"}
                        >
                          <SelectTrigger id={`filter-mode-${filter.key}`}>
                            <SelectValue placeholder={`Select filter mode for ${formatAttributeKey(filter.key)}`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No filter</SelectItem>
                            <SelectItem value="exact">Exact match</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                          </SelectContent>
                        </Select>
                        {filter.mode && filter.mode !== "none" && (
                          <Input
                            id={`filter-value-${filter.key}`}
                            type="text"
                            value={filter.value as string || ""}
                            onChange={(e) => handleFilterValueChange(filter.key, e.target.value || null)}
                            placeholder={`Enter ${formatAttributeKey(filter.key)} ${filter.mode === "exact" ? "(exact match)" : "(contains)"}`}
                          />
                        )}
                      </>
                    ) : filter.type === "enum" && attr?.elements ? (
                      <Select
                        onValueChange={(value) => handleFilterValueChange(filter.key, value === "none" ? null : value)}
                        value={filter.value as string || "none"}
                      >
                        <SelectTrigger id={`filter-${filter.key}`}>
                          <SelectValue placeholder={`Select ${formatAttributeKey(filter.key)}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No filter</SelectItem>
                          {attr.elements.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : filter.type === "boolean" ? (
                      <Select
                        onValueChange={(value) => handleFilterValueChange(filter.key, value === "none" ? null : value)}
                        value={filter.value as string || "none"}
                      >
                        <SelectTrigger id={`filter-${filter.key}`}>
                          <SelectValue placeholder={`Select ${formatAttributeKey(filter.key)}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No filter</SelectItem>
                          <SelectItem value="true">True</SelectItem>
                          <SelectItem value="false">False</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={`filter-${filter.key}`}
                        type={filter.type === "integer" || filter.type === "float" ? "number" : "text"}
                        value={filter.value as string || ""}
                        onChange={(e) => handleFilterValueChange(filter.key, e.target.value || null)}
                        placeholder={`Enter ${formatAttributeKey(filter.key)}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? "s" : ""} match the applied filters.
            </p>
            <div className="flex justify-center gap-2">
              <Button
                onClick={handleDownload}
                disabled={filteredDocuments.length === 0}
                className={filteredDocuments.length === 0 ? "opacity-50" : ""}
              >
                Download CSV
              </Button>
              <Button
                variant="outline"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadRecord;