import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ auid: "", password: "", confirmPassword: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        // Register
        alert("Passwords do not match");
        return;
      }
    } else {
      // Login
    }
    console.log("Form submitted", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
    <Card className="w-96 p-6 shadow-lg">
      <CardContent>
        <h2 className="text-2xl font-bold text-center mb-4">{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="auid"
            placeholder="AUID"
            value={formData.auid}
            onChange={handleChange}
            required
            className="w-full"
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full"
          />
          {isRegister && (
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full"
            />
          )}
          <Button type="submit" className="w-full">
            {isRegister ? "Register" : "Login"}
          </Button>
        </form>
        <p className="text-center mt-4 text-sm">
          {isRegister ? "Already have an account?" : "Don't have an account?"} 
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 underline ml-1"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </CardContent>
    </Card>
  </div>
  )
}

export default Login