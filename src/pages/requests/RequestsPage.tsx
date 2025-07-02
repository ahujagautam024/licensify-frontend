import axios from "axios";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { useAuthStore } from "@/store/useAuthStore";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  accepted: "bg-green-100 text-green-700 border-green-300",
  rejected: "bg-red-100 text-red-700 border-red-300",
};

const ITEMS_PER_PAGE = 5;
const statusOptions = ["all", "pending", "accepted", "rejected"];

const RequestsPage = () => {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((s) => s.userId);

  const filtered = requests.filter((req) => {
    const matchesStatus =
      selectedStatus === "all" || req.status === selectedStatus;
    const matchesSearch = req.licenseName
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.post(`${API_BASE}/licenses/myRequests`, {
          user_id: userId,
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRequests();
    }
  }, [userId]);

  if (loading) {
    return <div className="p-4">Loading licenses...</div>;
  }
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          className="max-w-sm"
          placeholder="Search licenses..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              onClick={() => {
                setSelectedStatus(status);
                setPage(1);
              }}
              className="text-sm capitalize"
            >
              {status === "all" ? "All" : status}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {paginated.length > 0 ? (
          paginated.reverse().map((req) => (
            <div
              key={req._id}
              className="flex gap-4 rounded-xl border p-4 shadow-sm hover:shadow-md transition bg-background"
            >
              <img
                src={req.image}
                alt={req.licenseName}
                className="h-14 w-14 rounded-md object-contain border bg-white p-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold">{req.licenseName}</h3>
                  <Badge
                    className={`rounded-full px-3 py-0.5 text-xs font-medium border ${
                      statusColors[req.status as keyof typeof statusColors]
                    }`}
                  >
                    {req.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm space-y-2">
                  {req.comments.map((comment, idx) => (
                    <div key={idx} className="pl-2 border-l-2 border-muted">
                      <span className="font-medium capitalize">
                        {comment.user}:
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {comment.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground text-sm pt-12">
            No requests match your filters.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center pt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
            </PaginationItem>
            <PaginationItem>
              Page {page} of {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default RequestsPage;
