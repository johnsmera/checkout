"use client";

import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@/components/ui/button";
import { RegisterForm } from "@/components/RegisterForm";
import { Logo } from "@/components/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const renderFooterActions = () => {
    return (
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
        </p>
        <Button
          variant="link"
          onClick={toggleMode}
          className="text-primary hover:text-primary/80"
        >
          {isLogin ? "Criar conta" : "Fazer login"}
        </Button>
      </div>
    );
  };

  const renderCardHeader = () => {
    return (
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">
          {isLogin ? "Fazer login" : "Criar Conta"}
        </CardTitle>
      </CardHeader>
    );
  };

  const renderLogo = () => {
    return (
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>
    );
  };

  const renderCardContent = () => {
    return (
      <CardContent>{isLogin ? <LoginForm /> : <RegisterForm />}</CardContent>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        {renderLogo()}

        <Card className="w-full shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          {renderCardHeader()}
          {renderCardContent()}
          {renderFooterActions()}
        </Card>
      </div>
    </div>
  );
}
