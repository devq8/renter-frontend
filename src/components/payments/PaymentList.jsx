import React from "react";
import Breadcrumb from "../../utils/Breadcrumb";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BlockIcon from "@mui/icons-material/Block";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Checkbox,
  Avatar,
  Chip,
  IconButton,
  Link,
  Typography,
  Table,
  Sheet,
} from "@mui/joy";
import { changeAmountFormat, changeDateTimeFormat } from "../../utils/format";
import { useQuery } from "@tanstack/react-query";
import { getAllPaymentsList } from "../../utils/api/payment";
import Input from "@mui/joy/Input";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Divider from "@mui/joy/Divider";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuItem from "@mui/joy/MenuItem";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import Dropdown from "@mui/joy/Dropdown";
import { iconButtonClasses } from "@mui/joy/IconButton";
import { useNavigate } from "react-router";

function PaymentList() {
  const navigate = useNavigate();

  const columns = [
    {
      field: "id",
      headerName: "No.",
      //   flex: 0.01,
      disableColumnMenu: true,
      maxWidth: 50,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "payment_date",
      headerName: "Paid On",
      // type: 'number',
      flex: 0.1,
      //   minWidth: 200,
      editable: false,
      cellClassName: "font-bold",
    },
    {
      field: "payment_status",
      headerName: "Status",
      // type: 'number',
      flex: 0.1,
      // width: 110,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "payment_method",
      headerName: "Method",
      // type: 'number',
      flex: 0.1,
      // width: 110,
      editable: false,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "invoices",
      headerName: "Invoices",
      // type: 'number',
      flex: 0.1,
      //   maxWidth: 80,
      disableColumnMenu: true,
      editable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "payment_amount",
      headerName: "Amount",
      // type: 'number',
      flex: 0.1,
      maxWidth: 110,
      disableColumnMenu: true,
      editable: false,
      cellClassName: "font-bold",
      align: "right",
      headerAlign: "center",
    },
    {
      field: "details",
      headerName: "",
      flex: 0.001,
      //   minWidth: 110,
      disableColumnMenu: true,
      editable: false,
      align: "right",
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/payment/${params.row.id}`)}
        >
          <NavigateNextIcon />
        </Button>
      ),

      //   renderCell: (params) => ,
    },
  ];
  //   const [open, setOpen] = React.useState(false);
  //   const [selected, setSelected] = React.useState([]);
  //   const [order, setOrder] = React.useState("desc");

  //   const renderFilters = () => (
  //     <React.Fragment>
  //       <FormControl size="sm">
  //         <FormLabel>Status</FormLabel>
  //         <Select
  //           size="sm"
  //           placeholder="Filter by status"
  //           slotProps={{ button: { sx: { whiteSpace: "nowrap" } } }}
  //         >
  //           <Option value="paid">Paid</Option>
  //           <Option value="pending">Pending</Option>
  //           <Option value="refunded">Refunded</Option>
  //           <Option value="cancelled">Cancelled</Option>
  //         </Select>
  //       </FormControl>
  //       <FormControl size="sm">
  //         <FormLabel>Category</FormLabel>
  //         <Select size="sm" placeholder="All">
  //           <Option value="all">All</Option>
  //           <Option value="refund">Refund</Option>
  //           <Option value="purchase">Purchase</Option>
  //           <Option value="debit">Debit</Option>
  //         </Select>
  //       </FormControl>
  //       <FormControl size="sm">
  //         <FormLabel>Customer</FormLabel>
  //         <Select size="sm" placeholder="All">
  //           <Option value="all">All</Option>
  //           <Option value="olivia">Olivia Rhye</Option>
  //           <Option value="steve">Steve Hampton</Option>
  //           <Option value="ciaran">Ciaran Murray</Option>
  //           <Option value="marina">Marina Macdonald</Option>
  //           <Option value="charles">Charles Fulton</Option>
  //           <Option value="jay">Jay Hoper</Option>
  //         </Select>
  //       </FormControl>
  //     </React.Fragment>
  //   );
  //   const rows = [
  //     {
  //       id: "INV-1234",
  //       date: "Feb 3, 2023",
  //       status: "Refunded",
  //       customer: {
  //         initial: "O",
  //         name: "Olivia Ryhe",
  //         email: "olivia@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1233",
  //       date: "Feb 3, 2023",
  //       status: "Paid",
  //       customer: {
  //         initial: "S",
  //         name: "Steve Hampton",
  //         email: "steve.hamp@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1232",
  //       date: "Feb 3, 2023",
  //       status: "Refunded",
  //       customer: {
  //         initial: "C",
  //         name: "Ciaran Murray",
  //         email: "ciaran.murray@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1231",
  //       date: "Feb 3, 2023",
  //       status: "Refunded",
  //       customer: {
  //         initial: "M",
  //         name: "Maria Macdonald",
  //         email: "maria.mc@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1230",
  //       date: "Feb 3, 2023",
  //       status: "Cancelled",
  //       customer: {
  //         initial: "C",
  //         name: "Charles Fulton",
  //         email: "fulton@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1229",
  //       date: "Feb 3, 2023",
  //       status: "Cancelled",
  //       customer: {
  //         initial: "J",
  //         name: "Jay Hooper",
  //         email: "hooper@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1228",
  //       date: "Feb 3, 2023",
  //       status: "Refunded",
  //       customer: {
  //         initial: "K",
  //         name: "Krystal Stevens",
  //         email: "k.stevens@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1227",
  //       date: "Feb 3, 2023",
  //       status: "Paid",
  //       customer: {
  //         initial: "S",
  //         name: "Sachin Flynn",
  //         email: "s.flyn@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1226",
  //       date: "Feb 3, 2023",
  //       status: "Cancelled",
  //       customer: {
  //         initial: "B",
  //         name: "Bradley Rosales",
  //         email: "brad123@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1225",
  //       date: "Feb 3, 2023",
  //       status: "Paid",
  //       customer: {
  //         initial: "O",
  //         name: "Olivia Ryhe",
  //         email: "olivia@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1224",
  //       date: "Feb 3, 2023",
  //       status: "Cancelled",
  //       customer: {
  //         initial: "S",
  //         name: "Steve Hampton",
  //         email: "steve.hamp@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1223",
  //       date: "Feb 3, 2023",
  //       status: "Paid",
  //       customer: {
  //         initial: "C",
  //         name: "Ciaran Murray",
  //         email: "ciaran.murray@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1221",
  //       date: "Feb 3, 2023",
  //       status: "Refunded",
  //       customer: {
  //         initial: "M",
  //         name: "Maria Macdonald",
  //         email: "maria.mc@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1220",
  //       date: "Feb 3, 2023",
  //       status: "Paid",
  //       customer: {
  //         initial: "C",
  //         name: "Charles Fulton",
  //         email: "fulton@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1219",
  //       date: "Feb 3, 2023",
  //       status: "Cancelled",
  //       customer: {
  //         initial: "J",
  //         name: "Jay Hooper",
  //         email: "hooper@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1218",
  //       date: "Feb 3, 2023",
  //       status: "Cancelled",
  //       customer: {
  //         initial: "K",
  //         name: "Krystal Stevens",
  //         email: "k.stevens@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1217",
  //       date: "Feb 3, 2023",
  //       status: "Paid",
  //       customer: {
  //         initial: "S",
  //         name: "Sachin Flynn",
  //         email: "s.flyn@email.com",
  //       },
  //     },
  //     {
  //       id: "INV-1216",
  //       date: "Feb 3, 2023",
  //       status: "Cancelled",
  //       customer: {
  //         initial: "B",
  //         name: "Bradley Rosales",
  //         email: "brad123@email.com",
  //       },
  //     },
  //   ];

  const { data: payments } = useQuery(["payments"], () => getAllPaymentsList());
  const paymentItems = payments?.data || [];
  //   console.log("Payments:", paymentItems);
  const handleRowClick = (params) => {
    // navigate(`/payments/${unique_payment_identifier}/${params.row.id}`);
  };
  //   function RowMenu() {
  //     return (
  //       <Dropdown>
  //         <MenuButton
  //           slots={{ root: IconButton }}
  //           slotProps={{
  //             root: { variant: "plain", color: "neutral", size: "sm" },
  //           }}
  //         >
  //           <MoreHorizRoundedIcon />
  //         </MenuButton>
  //         <Menu size="sm" sx={{ minWidth: 140 }}>
  //           <MenuItem>Edit</MenuItem>
  //           <MenuItem>Rename</MenuItem>
  //           <MenuItem>Move</MenuItem>
  //           <Divider />
  //           <MenuItem color="danger">Delete</MenuItem>
  //         </Menu>
  //       </Dropdown>
  //     );
  //   }
  //   function descendingComparator(a, b, orderBy) {
  //     if (b[orderBy] < a[orderBy]) {
  //       return -1;
  //     }
  //     if (b[orderBy] > a[orderBy]) {
  //       return 1;
  //     }
  //     return 0;
  //   }

  //   function getComparator(order, orderBy) {
  //     return order === "desc"
  //       ? (a, b) => descendingComparator(a, b, orderBy)
  //       : (a, b) => -descendingComparator(a, b, orderBy);
  //   }

  //   function stableSort(array, comparator) {
  //     const stabilizedThis = array.map((el, index) => [el, index]);
  //     stabilizedThis.sort((a, b) => {
  //       const order = comparator(a[0], b[0]);
  //       if (order !== 0) {
  //         return order;
  //       }
  //       return a[1] - b[1];
  //     });
  //     return stabilizedThis.map((el) => el[0]);
  //   }

  return (
    <>
      <header className="bg-transparent">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 flex flex-col justify-between">
          <Breadcrumb main={{ title: "Payments", url: "/payment" }} sub={[]} />
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Payments
            </h1>
          </div>
        </div>
      </header>
      <main>
        {/* <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Box
            component="main"
            className="MainContent"
            sx={{
              px: { xs: 2, md: 6, lg: 10 },
              pt: {
                xs: "calc(12px + var(--Header-height))",
                sm: "calc(12px + var(--Header-height))",
                md: 3,
              },
              pb: { xs: 2, sm: 2, md: 3 },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 1,
            }}
          >
            <Sheet
              className="SearchAndFilters-mobile"
              sx={{
                display: { xs: "flex", sm: "none" },
                my: 1,
                gap: 1,
              }}
            >
              <Input
                size="sm"
                placeholder="Search"
                startDecorator={<SearchIcon />}
                sx={{ flexGrow: 1 }}
              />
              <IconButton
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={() => setOpen(true)}
              >
                <FilterAltIcon />
              </IconButton>
              <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                  <ModalClose />
                  <Typography id="filter-modal" level="h2">
                    Filters
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Sheet
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {renderFilters()}
                    <Button color="primary" onClick={() => setOpen(false)}>
                      Submit
                    </Button>
                  </Sheet>
                </ModalDialog>
              </Modal>
            </Sheet>
            <Box
              className="SearchAndFilters-tabletUp"
              sx={{
                borderRadius: "sm",
                py: 2,
                display: { xs: "none", sm: "flex" },
                flexWrap: "wrap",
                gap: 1.5,
                "& > *": {
                  minWidth: { xs: "120px", md: "160px" },
                },
              }}
            >
              <FormControl sx={{ flex: 1 }} size="sm">
                <FormLabel>Search for order</FormLabel>
                <Input
                  size="sm"
                  placeholder="Search"
                  startDecorator={<SearchIcon />}
                />
              </FormControl>
              {renderFilters()}
            </Box>
            <Sheet
              className="OrderTableContainer"
              variant="outlined"
              sx={{
                display: { xs: "none", sm: "initial" },
                width: "100%",
                borderRadius: "sm",
                flexShrink: 1,
                overflow: "auto",
                minHeight: 0,
              }}
            >
              <Table
                aria-labelledby="tableTitle"
                stickyHeader
                hoverRow
                sx={{
                  "--TableCell-headBackground":
                    "var(--joy-palette-background-level1)",
                  "--Table-headerUnderlineThickness": "1px",
                  "--TableRow-hoverBackground":
                    "var(--joy-palette-background-level1)",
                  "--TableCell-paddingY": "4px",
                  "--TableCell-paddingX": "8px",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        width: 48,
                        textAlign: "center",
                        padding: "12px 6px",
                      }}
                    >
                      <Checkbox
                        size="sm"
                        indeterminate={
                          selected.length > 0 && selected.length !== rows.length
                        }
                        checked={selected.length === rows.length}
                        onChange={(event) => {
                          setSelected(
                            event.target.checked
                              ? rows.map((row) => row.id)
                              : []
                          );
                        }}
                        color={
                          selected.length > 0 || selected.length === rows.length
                            ? "primary"
                            : undefined
                        }
                        sx={{ verticalAlign: "text-bottom" }}
                      />
                    </th>
                    <th style={{ width: 120, padding: "12px 6px" }}>
                      <Link
                        underline="none"
                        color="primary"
                        component="button"
                        onClick={() =>
                          setOrder(order === "asc" ? "desc" : "asc")
                        }
                        fontWeight="lg"
                        endDecorator={<ArrowDropDownIcon />}
                        sx={{
                          "& svg": {
                            transition: "0.2s",
                            transform:
                              order === "desc"
                                ? "rotate(0deg)"
                                : "rotate(180deg)",
                          },
                        }}
                      >
                        Invoice
                      </Link>
                    </th>
                    <th style={{ width: 140, padding: "12px 6px" }}>Date</th>
                    <th style={{ width: 140, padding: "12px 6px" }}>Status</th>
                    <th style={{ width: 240, padding: "12px 6px" }}>
                      Customer
                    </th>
                    <th style={{ width: 140, padding: "12px 6px" }}> </th>
                  </tr>
                </thead>
                <tbody>
                  {stableSort(rows, getComparator(order, "id")).map((row) => (
                    <tr key={row.id}>
                      <td style={{ textAlign: "center", width: 120 }}>
                        <Checkbox
                          size="sm"
                          checked={selected.includes(row.id)}
                          color={
                            selected.includes(row.id) ? "primary" : undefined
                          }
                          onChange={(event) => {
                            setSelected((ids) =>
                              event.target.checked
                                ? ids.concat(row.id)
                                : ids.filter((itemId) => itemId !== row.id)
                            );
                          }}
                          slotProps={{
                            checkbox: { sx: { textAlign: "left" } },
                          }}
                          sx={{ verticalAlign: "text-bottom" }}
                        />
                      </td>
                      <td>
                        <Typography level="body-xs">{row.id}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.date}</Typography>
                      </td>
                      <td>
                        <Chip
                          variant="soft"
                          size="sm"
                          startDecorator={
                            {
                              Paid: <CheckRoundedIcon />,
                              Refunded: <AutorenewRoundedIcon />,
                              Cancelled: <BlockIcon />,
                            }[row.status]
                          }
                          color={
                            {
                              Paid: "success",
                              Refunded: "neutral",
                              Cancelled: "danger",
                            }[row.status]
                          }
                        >
                          {row.status}
                        </Chip>
                      </td>
                      <td>
                        <Box
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        >
                          <Avatar size="sm">{row.customer.initial}</Avatar>
                          <div>
                            <Typography level="body-xs">
                              {row.customer.name}
                            </Typography>
                            <Typography level="body-xs">
                              {row.customer.email}
                            </Typography>
                          </div>
                        </Box>
                      </td>
                      <td>
                        <Box
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        >
                          <Link level="body-xs" component="button">
                            Download
                          </Link>
                          <RowMenu />
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
            <Box
              className="Pagination-laptopUp"
              sx={{
                pt: 2,
                gap: 1,
                [`& .${iconButtonClasses.root}`]: { borderRadius: "50%" },
                display: {
                  xs: "none",
                  md: "flex",
                },
              }}
            >
              <Button
                size="sm"
                variant="outlined"
                color="neutral"
                startDecorator={<KeyboardArrowLeftIcon />}
              >
                Previous
              </Button>

              <Box sx={{ flex: 1 }} />
              {["1", "2", "3", "…", "8", "9", "10"].map((page) => (
                <IconButton
                  key={page}
                  size="sm"
                  variant={Number(page) ? "outlined" : "plain"}
                  color="neutral"
                >
                  {page}
                </IconButton>
              ))}
              <Box sx={{ flex: 1 }} />

              <Button
                size="sm"
                variant="outlined"
                color="neutral"
                endDecorator={<KeyboardArrowRightIcon />}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box> */}
        <div className="mx-auto max-w-7xl py-3 sm:px-6 lg:px-8">
          <Box
            sx={{
              width: "100%",
              background: "white",
              marginBottom: "20px",
            }}
          >
            <DataGrid
              autoHeight
              rows={paymentItems.map((payment) => ({
                id: payment.id,
                payment_date: changeDateTimeFormat(payment.payment_date),
                payment_status:
                  payment.payment_status.charAt(0).toUpperCase() +
                  payment.payment_status.slice(1).toLowerCase(),
                payment_method:
                  payment.payment_method.charAt(0).toUpperCase() +
                  payment.payment_method.slice(1).toLowerCase(),
                invoices: payment.invoices.length,
                payment_amount: `KD ${changeAmountFormat(
                  payment.payment_amount
                )}`,
                reference_token: payment.reference_token,
              }))}
              columns={columns}
              autosizeOptions={{
                includeHeaders: true,
                includeOutliers: true,
                outliersFactor: 1,
                expand: true,
              }}
              pageSizeOptions={[10, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
            />
          </Box>
        </div>
      </main>
    </>
  );
}

export default PaymentList;
