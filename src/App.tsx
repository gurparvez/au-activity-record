import { BrowserRouter, Route, Routes } from 'react-router';
import { ThemeProvider } from './components/theme-provider';
import { HomeHOD, LoadUser, Login, Register } from './pages';


const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeHOD />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
