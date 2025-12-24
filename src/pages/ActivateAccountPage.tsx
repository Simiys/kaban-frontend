import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useApi } from "../hooks/useApi";

const ActivateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { activateAccount } = useApi();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Токен активации отсутствует.");
      return;
    }

    const activate = async () => {
      try {
        await activateAccount(token);
        setStatus("success");
      } catch (err: any) {
        setStatus("error");
        setError(
          err?.message ||
            "Не удалось активировать аккаунт. Возможно, ссылка устарела."
        );
      }
    };

    activate();
  }, [token, activateAccount]);

  return (
    <AuthLayout
      title="Активация аккаунта"
      sideTitle="Kaban X"
      sideSubtitle="Завершаем регистрацию"
      sideButtonText="Войти"
      onSideButtonClick={() => navigate("/")}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        {status === "loading" && (
          <>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Активируем ваш аккаунт…</Typography>
          </>
        )}

        {status === "success" && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Аккаунт успешно активирован!
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Теперь вы можете войти в систему.
            </Typography>
          </>
        )}

        {status === "error" && (
          <>
            <Typography sx={{ color: "#ff6b6b", mb: 2 }}>{error}</Typography>
            <Button variant="outlined" onClick={() => navigate("/login")}>
              Перейти к входу
            </Button>
          </>
        )}
      </Box>
    </AuthLayout>
  );
};

export default ActivateAccountPage;
