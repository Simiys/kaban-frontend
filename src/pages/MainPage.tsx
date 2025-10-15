import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

import { useMediaQuery } from "@mui/material";
import Header from "../components/Header";
import RunningText from "../components/RunningText";

const theme = createTheme({
  typography: {
    fontFamily: "Geologica, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#B963FF",
    },
  },
});

// Варианты анимаций
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

function MainPage() {
  // Данные для карточек

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          maxWidth: "100vw",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundColor: "#FFFFFF",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            // filter: "blur(10px)", // размываем только фон
            zIndex: -1, // фон уходит под контент
          },
        }}
      >
        {/* Основной контент страницы */}
        <Box
          sx={{
            // backgroundColor: "#FFFFFF",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
        >
          {/* Главный заголовок с fade-in анимацией */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: 70,
                fontWeight: "bold",
                maxWidth: "1500px",
                color: "#000000",
                textAlign: "center",
                marginTop: 8,
                marginBottom: 6,
                "@media (max-width: 768px)": {
                  fontSize: 40,
                },
                "@media (max-width: 480px)": {
                  fontSize: 35,
                },
              }}
            >
              Kaban X - умная доска для выполнения ваших задач
            </Typography>
          </motion.div>

          <Box
            sx={{
              marginBottom: 7,
            }}
          >
            <motion.div
              style={{
                transform: isMobile ? "rotate(0deg)" : "rotate(1deg)",
                transformOrigin: "center",
              }}
            >
              <RunningText
                text="Простая оптимизация ваших задач"
                backgroundColor="#B963FF"
              />
            </motion.div>
          </Box>

          {/* Кнопка "Начать" с fade-in анимацией */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          >
            <Button
              variant="outlined"
              size="large"
              sx={{
                backgroundColor: "#FFFFFF",
                color: "#1E1E1E",
                minWidth: "300px",
                borderColor: "#1E1E1E",
                borderWidth: 2,
                fontSize: 24,
                fontWeight: "600",
                padding: "16px 48px",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#1E1E1E",
                  color: "#FFFFFF",
                  borderColor: "#1E1E1E",
                },
                "@media (max-width: 480px)": {
                  fontSize: 20,
                  padding: "12px 36px",
                },
              }}
              onClick={() => {}}
            >
              Бета-тест
            </Button>
          </motion.div>

          {/* Заголовок секции с slide-up анимацией */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUpVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: 40,
                fontWeight: "bold",
                maxWidth: "1500px",
                color: "#000000",
                textAlign: "center",
                marginTop: 8,
                marginBottom: 5,
                "@media (max-width: 768px)": {
                  fontSize: 35,
                },
                "@media (max-width: 480px)": {
                  fontSize: 30,
                },
              }}
            >
              Основные функции и преимущества
            </Typography>
          </motion.div>

          {/* Описательный текст с slide-up анимацией */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUpVariants}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: 25,
                fontWeight: "100",
                color: "#000000",
                textAlign: "center",
                maxWidth: "1000px",
                lineHeight: 1.7,
                marginBottom: 8,
                "@media (max-width: 768px)": {
                  fontSize: 20,
                  maxWidth: "600px",
                },
                "@media (max-width: 480px)": {
                  fontSize: 18,
                  maxWidth: "90%",
                },
              }}
            >
              Ваша команда и задачи — в одном месте.
              <br />
              Планируйте, распределяйте и закрывайте задачи вместе.
              <br />
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default MainPage;
