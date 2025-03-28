import { BrowserRouter, Route, Routes } from 'react-router';
import { ThemeProvider } from './components/theme-provider';
import { LoadUser, Login, Register } from './pages';


const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
