import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from "./components/header";
import Home from './components/Home';
import Footer from './pages/Footer';

/* Router-free shell so the build can prerender it with a StaticRouter
   (see src/entry-server.jsx). The browser wraps it in BrowserRouter. */
export function AppShell() {
  return (
    <div className="text-tertiary">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-accent focus:text-dark focus:font-black"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='*' element={<p>Page not found😏</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
