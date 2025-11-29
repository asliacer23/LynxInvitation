import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { About } from "./pages/About";
import { Blog } from "./pages/Blog";
import { Docs } from "./pages/Docs";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { Cookies } from "./pages/Cookies";
import { Disclaimer } from "./pages/Disclaimer";
import Client1Homepage from '@/pagesforcustomers/Client1/Client1';
import AdminClient1 from '@/pagesforcustomers/Client1/AdminClient1/AdminClient1';
import Client2Homepage from '@/pagesforcustomers/Client2/Client2';
import AdminClient2 from '@/pagesforcustomers/Client2/AdminClient2/AdminClient2';
import Invitation from '@/pagesforcustomers/Client1/Invitation';
import ErrorBoundary from "@/components/ErrorBoundary";
import { Chatbot } from "@/components/Chatbot";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Chatbot />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            
            {/* Client1 Routes (Wedding) */}
            <Route path="/client1" element={<Client1Homepage />} />
            <Route path="/client1/*" element={<Client1Homepage />} />
            <Route path="/client1/admin" element={<AdminClient1 />} />
            <Route path="/invitation" element={<Invitation />} />

            {/* Client2 Routes (Debut) */}
            <Route path="/client2" element={<Client2Homepage />} />
            <Route path="/client2/*" element={<Client2Homepage />} />
            <Route path="/client2/admin" element={<AdminClient2 />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
