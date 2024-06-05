import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { changeAmountFormat, changeDatesFormat } from "../../utils/format";
import InvoiceCard from "./InvoiceCard";
import DescriptionIcon from "@mui/icons-material/Description";

export default function ContractCard({ contract }) {
  const invoices = contract.invoices.map((invoice) => {
    return <InvoiceCard key={invoice.id} invoice={invoice} />;
  });

  return (
    <Box sx={{ mb: 6 }}>
      <Card>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center">
            <DescriptionIcon fontSize="large" sx={{ mr: 2 }} />
            <Stack direction="column" alignItems="left">
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary" variant="h7">
                  {contract.unit.property_fk?.name ?? ""}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Typography gutterBottom variant="h5" component="div">
                    {contract.unit.number ?? ""}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="column">
              <Typography gutterBottom variant="body2">
                Contract No. {contract.id ?? ""}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Typography gutterBottom variant="body2">
                  Unit type
                </Typography>
                <Chip
                  color="primary"
                  label={contract.unit.unit_type?.name ?? ""}
                  size="small"
                />
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Card>
      <div className="my-2 mx-3 space-y-3">{invoices}</div>
    </Box>
  );
}
