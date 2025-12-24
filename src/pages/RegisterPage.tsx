import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useApi } from "../hooks/useApi";

const inputSx = {
  maxWidth: 420,
  width: "100%",
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

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useApi();

  const [formData, setFormData] = useState({
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (
      !formData.login ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Заполните все поля.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }

    try {
      setIsSubmitting(true);

      await registerUser({
        username: formData.login,
        email: formData.email,
        password: formData.password,
      });

      // Показываем модальное окно после успешной регистрации
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error("Register failed:", err);
      setError(err?.message || "Не удалось создать аккаунт.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Создать аккаунт"
      sideTitle="Добро пожаловать в Kaban X"
      sideSubtitle="Войдите, чтобы управлять канбан доской и пользоваться инструментами!"
      sideButtonText="Войти"
      onSideButtonClick={() => navigate("/login")}
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
          placeholder="Логин"
          value={formData.login}
          onChange={handleChange("login")}
          sx={inputSx}
        />

        <OutlinedInput
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          sx={inputSx}
        />

        <OutlinedInput
          placeholder="Пароль"
          type="password"
          value={formData.password}
          onChange={handleChange("password")}
          sx={inputSx}
        />

        <OutlinedInput
          placeholder="Повторите пароль"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange("confirmPassword")}
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
          {isSubmitting ? "Создаём..." : "Начать"}
        </Button>
      </Box>

      {/* Модальное окно успешной регистрации */}
      <Dialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      >
        <DialogTitle>Регистрация успешна!</DialogTitle>
        <DialogContent>
          <Typography>
            На вашу почту {formData.email} отправлено письмо с подтверждением
            регистрации.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/login")} color="primary">
            Войти
          </Button>
        </DialogActions>
      </Dialog>
    </AuthLayout>
  );
};

export default RegisterPage;
