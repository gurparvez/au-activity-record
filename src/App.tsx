
import { ThemeProvider } from "./components/theme-provider"
import { Button } from "./components/ui/button"
import Navbar from "./components/ui/Navbar"
import { ThemeToggle } from "./components/ui/theme-toggle"
import Login from "./pages/Login"

const App = () => {

  const click = () => {
    console.log("Click");
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <h1>Hello</h1>
      <Button onClick={click}>Click</Button> */}
      <ThemeToggle />
      <Navbar />
      <Login />
    </ThemeProvider>
  )
}

export default App
