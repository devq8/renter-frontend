import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { changeAmountFormat, changeDatesFormat } from "../../utils/format";

export default function InvoiceCard({
  invoice,
  onChange,
  flexible,
  isChecked,
}) {
  return (
    <Card variant="outlined">
      <Box sx={{ p: 2 }}>
        {/* Upper Side */}
        <Stack direction="row" justifyContent="space-between">
          {/* Column - Checkbox, Invoice Title & Type */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Checkbox
              checked={isChecked}
              disabled={!flexible}
              onChange={onChange}
            />
            <Stack direction="column" alignItems="start">
              <Typography gutterBottom variant="h6" component="div">
                {invoice.invoice_title}
              </Typography>
              <Typography gutterBottom component="div" color="text.secondary">
                {invoice.invoice_type}
              </Typography>
            </Stack>
          </Stack>
          {/* Column - Amount */}
          <Stack direction="column" justifyContent="space-evenly">
            <Typography gutterBottom variant="h6" component="div">
              KD {changeAmountFormat(invoice.invoice_amount)}
            </Typography>
            <Chip
              label={invoice.invoice_status}
              color="warning"
              variant="outlined"
            />
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
          <Stack direction="column" spacing={1}>
            <Typography gutterBottom variant="body2">
              Invoice #{invoice.id} issued on{" "}
              {changeDatesFormat(invoice.invoice_date)} and due on{" "}
              {changeDatesFormat(invoice.due_date)}
            </Typography>
            <Typography gutterBottom variant="body2">
              Period from <b>{changeDatesFormat(invoice.from_date)}</b> to{" "}
              <b>{changeDatesFormat(invoice.to_date)}</b>
            </Typography>
            {invoice.description && (
              <Typography gutterBottom variant="body2">
                {invoice.description}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
