import React, { useState } from "react";
import { Box, Button, Typography, OutlinedInput } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useApi } from "../hooks/useApi";

const inputSx = {
  width: "100%",
  maxWidth: 420,
  mb: 2,

  px: 2,
  py: 1.6,

  backgroundColor: "#242424",
  color: "#fff",
  fontSize: "1rem",
  fontFamily: '"Times New Roman", Times, serif',
  borderRadius: "12px",

  "& fieldset": {
    border: "none",
  },

  "&::placeholder": {
    color: "#999",
  },

  "@media (max-width:600px)": {
    maxWidth: "100%",
  },
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApi();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: "login" | "password") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);

      await login({
        email: formData.login,
        password: formData.password,
      });

      navigate("/main");
    } catch (err: any) {
      setError(
        err?.message || "Не удалось войти. Проверьте данные и попробуйте снова."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Вход в аккаунт"
      sideTitle="Добро пожаловать в Kaban X"
      sideSubtitle="Зарегистрируйтесь, чтобы управлять канбан доской и пользоваться инструментами!"
      sideButtonText="Регистрация"
      onSideButtonClick={() => navigate("/register")}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <OutlinedInput
          placeholder="Логин или email"
          value={formData.login}
          onChange={handleChange("login")}
          sx={inputSx}
        />

        <OutlinedInput
          placeholder="Пароль"
          type="password"
          value={formData.password}
          onChange={handleChange("password")}
          sx={inputSx}
        />

        {error && (
          <Typography
            sx={{
              color: "#ff6b6b",
              fontSize: "0.95rem",
              mb: 1,
              textAlign: "center",
            }}
          >
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          sx={{
            mt: 1,
            width: "60%",
            maxWidth: 260,
            py: 1.6,

            borderRadius: "999px",
            border: "2px solid black",
            backgroundColor: "black",
            color: "white",

            fontSize: "1rem",
            fontFamily: '"Times New Roman", Times, serif',
            transition: "all 0.25s ease",

            "&:hover": {
              backgroundColor: "transparent",
              color: "black",
            },

            "@media (max-width:600px)": {
              width: "100%",
            },
          }}
        >
          {isSubmitting ? "Входим..." : "Войти"}
        </Button>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
