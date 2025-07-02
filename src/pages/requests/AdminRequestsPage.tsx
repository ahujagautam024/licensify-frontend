import axios from "axios";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ITEMS_PER_PAGE = 5;

const statusColors = {
  accepted: "bg-green-100 text-green-700 border-green-300",
  rejected: "bg-red-100 text-red-700 border-red-300",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const AdminRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<"accepted" | "rejected" | null>(null);
  const [page, setPage] = useState(1);
  const userId = useAuthStore((s) => s.userId);

  const handleConfirm = async () => {
    if (!selected || !action || !comment.trim()) return;

    try {
      await axios.patch(`${API_BASE}/licenses/updateRequests`, {
        requestId: selected._id,
        userId: selected.user,
        licenseId: selected.licenseId,
        status: action,
        comment,
        adminId: userId,
      });
      const response = await axios.get(
        `${API_BASE}/licenses/getAllPendingRequests`
      );
      setRequests(response.data || []);
    } catch (err) {
      console.error("Update failed", err);
      // Optional: show error toast
    } finally {
      setSelected(null);
      setComment("");
      setAction(null);
      setOpen(false);
    }
  };

  const filtered =
    tab === "pending"
      ? requests.filter((r) => r.status === "pending")
      : requests.filter((r) => r.status !== "pending");

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/licenses/getAllPendingRequests`
        );
        setRequests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch pending requests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-muted-foreground pt-10">Loading...</p>
    );
  }

  if (paginated.length < 1 && !loading) {
    return (
      <p className="text-center text-muted-foreground pt-10">
        No requests found.
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Tabs
        defaultValue="pending"
        value={tab}
        onValueChange={(val) => {
          setTab(val);
          setPage(1); // reset pagination when tab changes
        }}
      >
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          {/* <TabsTrigger value="processed">Accepted / Rejected</TabsTrigger> */}
        </TabsList>

        <TabsContent value={tab}>
          <div className="flex flex-col gap-4 mt-4">
            {paginated.length > 0 ? (
              paginated.map((req) => (
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
                      <h3 className="text-base font-semibold">
                        {req.licenseName}
                      </h3>
                      <Badge
                        className={`rounded-full px-3 py-0.5 text-xs font-medium border ${
                          statusColors[req.status]
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
                    {tab === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <Dialog open={open} onOpenChange={setOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelected(req);
                                setAction("accepted");
                                setOpen(true);
                              }}
                            >
                              Accept
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approve Request</DialogTitle>
                            </DialogHeader>
                            <Textarea
                              placeholder="Add admin comment..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                            <DialogFooter>
                              <Button onClick={handleConfirm}>Confirm</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setSelected(req);
                                setAction("rejected");
                                setOpen(true);
                              }}
                            >
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Request</DialogTitle>
                            </DialogHeader>
                            <Textarea
                              placeholder="Reason for rejection..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                            />
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                onClick={handleConfirm}
                              >
                                Reject
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground pt-10">
                No requests found.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination className="justify-center pt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  />
                </PaginationItem>
                <PaginationItem className="px-4 text-sm font-medium text-muted-foreground">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminRequestsPage;
