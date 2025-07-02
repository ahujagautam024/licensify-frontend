import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ITEMS_PER_PAGE = 10;

const LicensesPage = () => {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLicense, setSelectedLicense] = useState<any>(null);
  const [comment, setComment] = useState("");
  const userId = useAuthStore((s) => s.userId);
  const role = useAuthStore((s) => s.role);

  const filtered = licenses.filter((l) =>
    l._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleRequestSubmit = async () => {
    try {
      await axios.post(
          `${API_BASE}/licenses/createRequest`, {
        user_id: userId,
        licenseName: selectedLicense._id,
        comment,
      });

    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setSelectedLicense(null);
      setComment("");
      setOpen(false);
    }
  };

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/licenses/getUnassignedLicenses`
        );
        setLicenses(data);
      } catch (error) {
        console.error("Failed to fetch licenses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  if (loading) {
    return <div className="p-4">Loading licenses...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <Input
        placeholder="Search licenses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {paginated.map((license) => (
          <Card key={license._id}>
            <CardHeader className="p-0">
              <img
                src={license.image}
                alt={license._id}
                className="h-24 w-full object-contain bg-white border-b rounded-t-md"
              />
            </CardHeader>
            <CardContent className="py-2 space-y-2">
              <CardTitle className="text-sm font-semibold leading-tight">
                {license._id}
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                Price: ${license.price.toFixed(2)}
              </div>
              <Badge variant="outline">Available: {license.count}</Badge>
            </CardContent>
            {role === "user" && (
              <CardFooter>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="w-full cursor-pointer"
                    variant="secondary"
                    onClick={(e) => {
							        e.preventDefault();
                      setSelectedLicense(license);
                      setOpen(true);
                    }}
                  >
                    Request License
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      Request: {selectedLicense?.name || license._id}
                    </DialogTitle>
                  </DialogHeader>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment (optional)"
                  />
                  <DialogFooter className="mt-4">
                    <Button
                      className="cursor-pointer"
                      onClick={handleRequestSubmit}
                    >
                      Submit Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
            )}
            
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              />
            </PaginationItem>
            <PaginationItem>
              Page {page} of {totalPages}
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default LicensesPage;
