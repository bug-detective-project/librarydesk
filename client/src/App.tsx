import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout.tsx';
import { BookPage } from './pages/BookPage.tsx';
import { BooksPage } from './pages/BooksPage.tsx';
import { LoansPage } from './pages/LoansPage.tsx';
import { NewBookPage } from './pages/NewBookPage.tsx';
import { NotFound } from './pages/NotFound.tsx';
import { ReaderPage } from './pages/ReaderPage.tsx';
import { ReadersPage } from './pages/ReadersPage.tsx';
import { ToastProvider } from './ToastContext.tsx';

export function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<BooksPage />} />
          <Route path="books/new" element={<NewBookPage />} />
          <Route path="books/:id" element={<BookPage />} />
          <Route path="readers" element={<ReadersPage />} />
          <Route path="readers/:id" element={<ReaderPage />} />
          <Route path="loans" element={<LoansPage />} />
          <Route path="loans/:status" element={<LoansPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}
