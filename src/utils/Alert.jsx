import React from "react";

function Alert({ title, message }) {
  return (
    <div class="flex w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div class="flex items-center justify-center w-12 bg-red-500">
        <svg
          class="w-6 h-6 text-white fill-current"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
        </svg>
      </div>

      <div class="px-4 py-2 -mx-3">
        <div class="mx-3">
          <span class="font-semibold text-red-500 dark:text-red-400">
            {title}
          </span>
          <p class="text-sm text-gray-600 dark:text-gray-200">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default Alert;

// import * as React from "react";
// import Alert from "@mui/joy/Alert";
// import Box from "@mui/joy/Box";
// import Button from "@mui/joy/Button";
// import CircularProgress from "@mui/joy/CircularProgress";
// import Typography from "@mui/joy/Typography";
// import Warning from "@mui/icons-material/Warning";

// export function Alert() {
//   return (
//     <Alert
//       variant="soft"
//       color="danger"
//       invertedColors
//       startDecorator={
//         <CircularProgress size="lg" color="danger">
//           <Warning />
//         </CircularProgress>
//       }
//       sx={{ alignItems: "flex-start", gap: "1rem" }}
//     >
//       <Box sx={{ flex: 1 }}>
//         <Typography level="title-md">Lost connection</Typography>
//         <Typography level="body-md">
//           Please verify your network connection and try again.
//         </Typography>
//         <Box
//           sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
//         >
//           {/* <Button variant="outlined" size="sm">
//         Open network settings
//       </Button> */}
//           <Button variant="solid" size="sm">
//             Try again
//           </Button>
//         </Box>
//       </Box>
//     </Alert>
//   );
// }
