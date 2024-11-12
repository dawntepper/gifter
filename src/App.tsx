import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Home from "./pages/Home";
import ResultsHistory from "./pages/ResultsHistory";
import SavedLists from "./pages/SavedLists";
import SearchResults from "./pages/SearchResults";
import GiftListDetail from "./pages/GiftListDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-background antialiased">
          <Header />
          <main className="container mx-auto min-h-[calc(100vh-4rem)] bg-background px-4 pb-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/results-history" element={<ResultsHistory />} />
              <Route path="/lists" element={<SavedLists />} />
              <Route path="/lists/:listId" element={<GiftListDetail />} />
              <Route path="/search-results" element={<SearchResults />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
