import React from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { Box, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import { changeAmountFormat, changeDatesFormat } from "../../../utils/format";

function ContractDetails({ contract }) {
  return (
    <>
      <Typography level="h1" marginBottom={3}>
        Contract Details
      </Typography>
      <Stack spacing={2}>
        <Card variant="outlined">
          <Typography level="h2" fontSize="xl">
            Property & Unit Details
          </Typography>
          <Box display="flex">
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Property Name</FormLabel>
                  <Input value={contract.unit.property_fk.name} />
                </FormControl>
                <FormControl size="md">
                  <FormLabel>Unit No.</FormLabel>
                  <Input value={contract.unit.number} />
                </FormControl>
              </Stack>
            </Box>
            <Box width="50%" marginX={3} marginY={3}>
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
            </Box>
          </Box>
        </Card>
        <Card variant="outlined">
          <Typography level="h2" fontSize="xl">
            Tenant Details
          </Typography>
          <Box display="flex">
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Tenant Name</FormLabel>
                  <Input value={contract.tenant.user.english_name} />
                </FormControl>
              </Stack>
            </Box>
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>
                    {contract.get_notification_method_display !== "Email"
                      ? "Mobile"
                      : "Email"}
                  </FormLabel>
                  <Input
                    value={
                      contract.get_notification_method_display == "Email"
                        ? contract.notification_email
                        : contract.notification_mobile
                    }
                  />
                </FormControl>
              </Stack>
            </Box>
          </Box>
        </Card>
        <Card variant="outlined">
          <Typography level="h2" fontSize="xl">
            Contract Details
          </Typography>
          <Box display="flex">
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>Start Date</FormLabel>
                  <Input value={changeDatesFormat(contract.start_date)} />
                </FormControl>
                {/* <FormControl size="md">
                  <FormLabel>Days to expire</FormLabel>
                  <Input
                    value={
                      contract.days_to_expire >= 0
                        ? contract.days_to_expire
                        : "Expired"
                    }
                  />
                </FormControl> */}
                <FormControl size="md">
                  <FormLabel>Rent</FormLabel>
                  <Input
                    startDecorator={"KD"}
                    value={changeAmountFormat(contract.rent)}
                  />
                </FormControl>
              </Stack>
            </Box>
            <Box width="50%" marginX={3} marginY={3}>
              <Stack spacing={2}>
                <FormControl size="md">
                  <FormLabel>End Date</FormLabel>
                  <Input value={changeDatesFormat(contract.end_date)} />
                </FormControl>
                <FormControl
                  size="md"
                  // error={contract.total_pending_amount > 0 ? true : false}
                >
                  <FormLabel>Outstanding Amount</FormLabel>
                  <Input
                    startDecorator={<span>KD</span>}
                    value={contract.total_pending_amount}
                  />
                </FormControl>
              </Stack>
            </Box>
          </Box>
        </Card>
      </Stack>
    </>
  );
}

export default ContractDetails;
