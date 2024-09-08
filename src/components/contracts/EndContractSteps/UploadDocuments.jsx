import React, { useState } from "react";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import { Box, Stack } from "@mui/material";
import FileInput from "../../../utils/form/FileInput";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
import FolderIcon from "@mui/icons-material/Folder";

function UploadDocuments({
  contract,
  setEvacuatedUnitFile,
  setMewClearanceFile,
}) {
  const handleFileChange = (event, setFile) => {
    const files = event.target.files;
    if (files.length) {
      setFile(files[0]);
    }
  };

  return (
    <>
      <Typography level="h1" marginBottom={3}>
        Upload Documents
      </Typography>
      <Stack spacing={2} display="flex">
        {/* <Card variant="outlined"> */}
        <FileInput onChange={handleFileChange} />
        {/* </Card> */}
        <Box
          sx={(theme) => ({
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            "& > div": {
              boxShadow: "none",
              "--Card-padding": "0px",
              // "--Card-radius": theme.vars.radius.sm,
            },
          })}
        >
          <Card variant="outlined" orientation="horizontal">
            <CardOverflow>
              <AspectRatio ratio="1" sx={{ minWidth: 80 }}>
                <div>
                  <FolderIcon />
                </div>
              </AspectRatio>
            </CardOverflow>
            <Box sx={{ py: { xs: 1, sm: 2 }, pr: 2 }}>
              <Typography level="title-sm" color="primary">
                videos-hike.zip
              </Typography>
              <Typography level="body-xs">100 MB</Typography>
            </Box>
          </Card>
        </Box>
        <Box
          sx={(theme) => ({
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            "& > div": {
              boxShadow: "none",
              "--Card-padding": "0px",
              // "--Card-radius": theme.vars.radius.sm,
            },
          })}
        >
          <Card variant="outlined" orientation="horizontal">
            <CardOverflow>
              <AspectRatio ratio="1" sx={{ minWidth: 80 }}>
                <div>
                  <FolderIcon />
                </div>
              </AspectRatio>
            </CardOverflow>
            <Box sx={{ py: { xs: 1, sm: 2 }, pr: 2 }}>
              <Typography level="title-sm" color="primary">
                videos-hike.zip
              </Typography>
              <Typography level="body-xs">100 MB</Typography>
            </Box>
          </Card>
        </Box>
      </Stack>
    </>
  );
}

export default UploadDocuments;
