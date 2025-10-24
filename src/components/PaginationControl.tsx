import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { PaginationControlProps } from "@/types";

function PaginationControls({ currentPage, totalPages, onPageChange }: PaginationControlProps): React.JSX.Element {
  return (
    <Pagination className="">
      <PaginationContent className="">
        <PaginationItem>
          <PaginationPrevious
            className=""
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>

        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={false}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage - 1);
              }}
              className=""
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink href="#" isActive className="">
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {currentPage < totalPages && (
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={false}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(currentPage + 1);
              }}
              className=""
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}

        {totalPages > currentPage + 1 && (
          <PaginationItem>
            <PaginationEllipsis className="" />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            className=""
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationControls;
