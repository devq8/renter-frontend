import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { changeAmountFormat, changeDatesFormat } from "../../utils/format";
import InvoiceCard from "./InvoiceCard";

export default function ContractCard({
  contract,
  handleCheckboxChange,
  selectedInvoices,
}) {
  const invoices = contract.invoices.map((invoice) => {
    return (
      <InvoiceCard
        key={invoice.id}
        invoice={invoice}
        flexible={contract.flexible}
        onChange={(event) =>
          handleCheckboxChange(invoice.id, event.target.checked)
        }
        isChecked={selectedInvoices.includes(invoice.id)}
      />
    );
  });

  return (
    <Box sx={{ mb: 0 }}>
      <Card>
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary" variant="h7">
              {contract.unit.property_fk.name}
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
                {contract.unit.number}
              </Typography>
            </Stack>
            {/* <Stack direction="column">
              <Typography gutterBottom variant="h5" component="div">
                KD {changeAmountFormat(contract.total_pending_amount)}
              </Typography>
            </Stack> */}
          </Stack>
          <Typography color="text.secondary" variant="body2">
            This contract has been started on{" "}
            {changeDatesFormat(contract.start_date)} and the monthly rent is KD{" "}
            {changeAmountFormat(contract.rent)}.
          </Typography>
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
              <Stack direction="row" spacing={1}>
                <Typography gutterBottom variant="body2">
                  Unit type
                </Typography>
                <Chip
                  color="primary"
                  label={contract.unit.unit_type}
                  size="small"
                />
              </Stack>
            </Stack>
            <Stack direction="column">
              {contract.flexible && (
                <Chip color="success" label="Flexible" size="small" />
              )}
            </Stack>
          </Stack>
        </Box>
      </Card>
      <div className="my-2 mx-3 space-y-3">{invoices}</div>
    </Box>
  );
}
