import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const TransactionListSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden w-full">
      {/* HEADER SKELETON */}
      <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-100">
        <Skeleton className="w-full md:max-w-md h-11 rounded-md bg-gray-100" />
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="w-24 h-11 rounded-md bg-gray-100" />
          <Skeleton className="w-24 h-11 rounded-md bg-gray-100" />
        </div>
      </div>

      {/* TABLE SKELETON */}
      <div className="overflow-x-auto w-full">
        <Table className="w-full table-fixed min-w-[850px]">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-none">
              <TableHead className="pl-8 h-12">
                <Skeleton className="h-3 w-16 rounded bg-gray-200" />
              </TableHead>
              <TableHead className="h-12">
                <Skeleton className="h-3 w-12 rounded bg-gray-200" />
              </TableHead>
              <TableHead className="h-12">
                <Skeleton className="h-3 w-24 rounded bg-gray-200" />
              </TableHead>
              <TableHead className="h-12">
                <Skeleton className="h-3 w-16 rounded bg-gray-200" />
              </TableHead>
              <TableHead className="h-12">
                <Skeleton className="h-3 w-12 rounded bg-gray-200 mx-auto" />
              </TableHead>
              <TableHead className="pr-8 h-12">
                <Skeleton className="h-3 w-16 rounded bg-gray-200 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(10)].map((_, i) => (
              <TableRow key={i} className="border-b border-gray-100">
                <TableCell className="pl-8 py-4">
                  <Skeleton className="h-3 w-20 rounded bg-gray-100" />
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-3 w-12 rounded bg-gray-100" />
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-100" />
                    <Skeleton className="h-3 w-32 rounded bg-gray-100" />
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Skeleton className="h-3 w-20 rounded-full bg-gray-100" />
                </TableCell>
                <TableCell className="py-4 text-center">
                  <Skeleton className="h-3 w-12 rounded-full bg-gray-100 mx-auto" />
                </TableCell>
                <TableCell className="pr-8 py-4 text-right">
                  <Skeleton className="h-3 w-20 rounded bg-gray-100 ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION SKELETON */}
      <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-white text-sm">
        <Skeleton className="h-3 w-48 rounded bg-gray-100" />
        <div className="flex gap-1.5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
};
