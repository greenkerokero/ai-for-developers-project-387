import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { OwnerLayout } from "@/components/layout/OwnerLayout";

import { EventTypesPage as PublicEventTypesPage } from "@/pages/public/event-types-page";
import { EventTypeDetailPage } from "@/pages/public/event-type-detail-page";
import { BookingPage } from "@/pages/public/booking-page";

import { DashboardPage } from "@/pages/owner/dashboard-page";
import { OwnerEventTypesPage } from "@/pages/owner/event-types-page";
import { EventTypeFormPage } from "@/pages/owner/event-type-form-page";
import { EventTypeEditPage } from "@/pages/owner/event-type-edit-page";
import { AvailabilityPage } from "@/pages/owner/availability-page";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicEventTypesPage />} />
            <Route path="/:slug" element={<EventTypeDetailPage />} />
            <Route path="/:slug/book" element={<BookingPage />} />
          </Route>

          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="event-types" element={<OwnerEventTypesPage />} />
            <Route path="event-types/new" element={<EventTypeFormPage />} />
            <Route path="event-types/:slug/edit" element={<EventTypeEditPage />} />
            <Route path="availability" element={<AvailabilityPage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
