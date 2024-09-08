import React from "react";
import Typography from "@mui/joy/Typography";
import { Box, Stack } from "@mui/material";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Card from "@mui/joy/Card";
import Switch from "@mui/joy/Switch";

function TenantNotifications({
  contract,
  setSendNotification,
  sendNotification,
}) {
  return (
    <>
      <Typography level="h1" marginBottom={3}>
        Contract Details
      </Typography>
      <Stack spacing={2}>
        <Card variant="outlined">
          <Typography level="h2" fontSize="xl">
            Notification Details
          </Typography>
          <Box display="flex">
            <Box width="100%" marginX={3} marginY={3}>
              <Box width="50%">
                <Stack spacing={2}>
                  <FormControl size="md">
                    <FormLabel>Notification Method</FormLabel>
                    <Input value={contract.get_notification_method_display} />
                  </FormControl>
                  {contract.get_notification_method_display === "WhatsApp" ? (
                    <FormControl size="md">
                      <FormLabel>Notification Mobile</FormLabel>
                      <Input value={contract.notification_mobile} />
                    </FormControl>
                  ) : (
                    <FormControl size="md">
                      <FormLabel>Notification Email</FormLabel>
                      <Input value={contract.notification_email} />
                    </FormControl>
                  )}
                </Stack>
              </Box>
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                marginTop="25px"
              >
                <Typography level="h2" fontSize="xl" marginRight="15px">
                  Do you want to send notification to tenant?
                </Typography>
                <Switch
                  // color={cancelInvoices ? "danger" : "success"}
                  onChange={(event) =>
                    setSendNotification(event.target.checked)
                  }
                  size="md"
                  checked={sendNotification}
                  slotProps={{
                    track: {
                      children: (
                        <React.Fragment>
                          <Typography
                            component="span"
                            level="inherit"
                            sx={{ ml: "7px" }}
                          >
                            Yes
                          </Typography>
                          <Typography
                            component="span"
                            level="inherit"
                            sx={{ mr: "7px" }}
                          >
                            No
                          </Typography>
                        </React.Fragment>
                      ),
                    },
                  }}
                  sx={{
                    "--Switch-thumbSize": "30px",
                    "--Switch-trackWidth": "67px",
                    "--Switch-trackHeight": "31px",
                  }}
                />
              </Box>
            </Box>
            {/* <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Area</FormLabel>
                  <Input value={contract.unit.property_fk.area} />
                </FormControl>
                <FormControl size="md">
                  <FormLabel>Floor</FormLabel>
                  <Input value={contract.unit.floor} />
                </FormControl>
              </Stack>
            </Box> */}
          </Box>
        </Card>
      </Stack>
    </>
  );
}

export default TenantNotifications;
