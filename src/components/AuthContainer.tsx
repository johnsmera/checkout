"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";

export function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isLogin ? "Entrar" : "Criar Conta"}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? "Entre com sua conta para continuar" 
              : "Crie uma nova conta para começar"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? <LoginForm /> : <RegisterForm />}
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
            </p>
            <Button
              variant="link"
              onClick={toggleMode}
              className="text-blue-600 hover:text-blue-800"
            >
              {isLogin ? "Criar conta" : "Fazer login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
