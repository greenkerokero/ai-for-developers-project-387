namespace BookingApi;

// ─── Custom scalars ───

/** A UUID v4 string identifier. */
@format("uuid")
scalar uuid extends string;

/** An email address. */
@format("email")
scalar email extends string;

/** A URL-friendly slug identifier. */
@pattern("^[a-z0-9]+(?:-[a-z0-9]+)*$")
scalar slug extends string;

// ─── Pagination ───

/** A paginated list of items. */
model PaginatedList<T> {
  /** The list of items on this page. */
  items: T[];

  /** Total number of items across all pages. */
  totalCount: int64;

  /** The offset of the first item in this page. */
  offset: int32;

  /** The maximum number of items per page. */
  limit: int32;
}

// ─── Error responses ───

/** Standard error response body. */
@error
model ApiError {
  /** Machine-readable error code. */
  code: string;

  /** Human-readable error message. */
  message: string;

  /** Optional additional details. */
  details?: string[];
}
