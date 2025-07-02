import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { format, isBefore, addDays, parseISO } from "date-fns";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ITEMS_PER_PAGE = 12;

const MyLicensesPage = () => {
  const userId = useAuthStore((s) => s.userId);
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const response = await axios.post(
          `${API_BASE}/licenses/getMyLicenses`,
          {
            user_id: userId,
          }
        );
        setLicenses(response.data);
      } catch (error) {
        console.error("Error fetching licenses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchLicenses();
  }, [userId]);

  const filtered = licenses.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const today = new Date();
  const soonThreshold = addDays(today, 7);

  return (
    <div className="p-4 space-y-6">
      <Input
        placeholder="Search licenses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      {totalPages == 0 && !loading && (
        <p>No licenses</p>
      )}

      {loading ? (
        <p>Loading licenses...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {paginated.map((license) => {
              const expiryDate = parseISO(license.expiry);
              const isExpired = isBefore(expiryDate, today);
              const isExpiringSoon =
                !isExpired && isBefore(expiryDate, soonThreshold);

              return (
                <Card key={license._id}>
                  <CardHeader className="p-0">
                    <img
                      src={license.image}
                      alt={license.name}
                      className="h-24 w-full object-contain bg-white border-b rounded-t-md"
                    />
                  </CardHeader>
                  <CardContent className="py-4 space-y-2">
                    <CardTitle className="text-sm font-semibold leading-tight">
                      {license.name}
                    </CardTitle>
                    <div className="text-xs text-muted-foreground">
                      Price: ${license.price.toFixed(2)}
                    </div>
                    <div className="text-xs">
                      Expiry:{" "}
                      <span
                        className={
                          isExpiringSoon ? "text-red-500 font-medium" : ""
                        }
                      >
                        {format(expiryDate, "MMM dd, yyyy")}
                      </span>
                    </div>
                    {isExpired && <Badge variant="destructive">Expired</Badge>}

                    {!isExpired && isExpiringSoon && (
                      <Badge
                        variant="outline"
                        className="text-red-600 border-red-600"
                      >
                        Expiring Soon
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
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
        </>
      )}
    </div>
  );
};

export default MyLicensesPage;
