import { BrowserRouter, Route, Routes } from 'react-router';
import { ThemeProvider } from './components/theme-provider';
import { LoadUser } from './pages';


const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoadUser />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
