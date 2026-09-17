import React, { useState } from "react";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import Interviews from "./pages/Interviews";
import Blog from "./pages/Blog";
import Graveyard from "./pages/Graveyard";
import Products from "./pages/Products";
import AdminDashboard from "./admin/AdminDashboard";
import InterviewDetail from "./pages/Interviewdetail";

// Lightweight client-side router (no react-router dependency).
function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  React.useEffect(() => {
    const onNav = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onNav);
    return () => window.removeEventListener("popstate", onNav);
  }, []);

  return path;
}

function App() {
  const path = useRoute();

  if (path.startsWith("/admin")) {
    return <AdminDashboard />;
  }

  // /interviews/:id -> detail page
  const detailMatch = path.match(/^\/interviews\/([^/]+)/);
  if (detailMatch) {
    return (
      <>
        <Navbar />
        <InterviewDetail id={detailMatch[1]} />
      </>
    );
  }

  let Page = Home;
  if (path.startsWith("/interviews")) Page = Interviews;
  else if (path.startsWith("/blog")) Page = Blog;
  else if (path.startsWith("/graveyard")) Page = Graveyard;
  else if (path.startsWith("/products")) Page = Products;

  return (
    <>
      <Navbar />
      <Page />
    </>
  );
}

export default App;