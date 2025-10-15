import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface RunningTextProps {
  text: string;
  backgroundColor: string;
}

const RunningText: React.FC<RunningTextProps> = ({ text, backgroundColor }) => {
  const textColor =
    backgroundColor.toLowerCase() === "#ffffff" ||
    backgroundColor.toLowerCase() === "white"
      ? "#B963FF"
      : "#FFFFFF";

  const repeatedText = `${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • ${text} • `;

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#1E1E1E",
        overflow: "hidden",
        padding: "16px 0",
        position: "relative",
        whiteSpace: "nowrap",
        zIndex: "-10",
      }}
    >
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          display: "inline-block",
          willChange: "transform",
        }}
      >
        <Typography
          sx={{
            fontSize: {
              xs: 18,
              sm: 22,
              md: 26,
            },
            fontWeight: 500,
            color: textColor,
            fontFamily: "Geologica, Arial, sans-serif",
            letterSpacing: "0.5px",
            display: "inline-block",
          }}
        >
          {repeatedText}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default RunningText;
