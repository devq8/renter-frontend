import React from "react";
import Box from "@mui/joy/Box";
import Chip from "@mui/joy/Chip";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import Cloud from "@mui/icons-material/Cloud";

function ChipIcon({ text, icon }) {
  function iconOption(icon) {
    switch (icon) {
      case "Flexible":
        return <AltRouteIcon />;
      case "Cloud":
        return <Cloud />;
      default:
        return null;
    }
  }

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <Chip
        variant="soft"
        color="success"
        size="lg"
        startDecorator={iconOption(icon)}
      >
        {text}
      </Chip>
    </Box>
  );
}

export default ChipIcon;
