import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [formData, setFormData] = useState({ auid: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login form submitted", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-96 p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
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
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
