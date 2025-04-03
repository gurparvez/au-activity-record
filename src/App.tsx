import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './components/theme-provider';
import MyRoutes from './routes/routes';

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <MyRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
