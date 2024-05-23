import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import FormHelperText from "@mui/joy/FormHelperText";
import Key from "@mui/icons-material/Key";
import CircularProgress from "@mui/joy/CircularProgress";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { IMaskInput } from "react-imask";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  sendOTPCode,
  verifyOTPCode,
  getManagerName,
} from "../../utils/api/utils";
import { addTenant } from "../../utils/api/tenants";
import WarningIcon from "@mui/icons-material/Warning";
import Alert from "@mui/joy/Alert";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import Logo from "../../assets/logo-nomargins.png";
import { InputFileUpload } from "../../utils/InputFileUpload";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ClearIcon from "@mui/icons-material/Clear";
import FileCopyIcon from "@mui/icons-material/FileCopy"; // Default file icon
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"; // PDFs
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"; // Docs
import ImageIcon from "@mui/icons-material/Image"; // Images

// Define the TextMaskAdapter component for Civil ID
const CivilIdMaskAdapter = React.forwardRef(function CivilIdMaskAdapter(
  props,
  ref
) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="000000000000" // 12 digits mask
      definitions={{
        0: /[0-9]/, // Only allow numbers
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

// Adapter for the OTP input field with a 4-digit mask
const OtpMaskAdapter = React.forwardRef(function OtpMaskAdapter(props, ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="0000" // 4 digits mask
      definitions={{
        0: /[0-9]/, // Only allow numbers
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

const MobileMaskAdapter = React.forwardRef(function MobileMaskAdapter(
  props,
  ref
) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="00000000" // 8 digits mask
      definitions={{
        0: /[0-9]/, // Only allow numbers
      }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

export default function TenantSignupForm() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managerName, setManagerName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const queryClient = useQueryClient();

  const addTenantMutation = useMutation((tenant) => addTenant(tenant, uid), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tenants"]);
      toast.success("Your information has been submitted successfully.");
      navigate(`/`);
    },
    onError: (error) => {
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(`Error signing up.\nPlease contact your property manager.`);
      }
    },
  });

  //   Mobile Verifications States
  const [isClickable, setIsClickable] = useState(true);
  const [timer, setTimer] = useState(0);
  const [checkingOTP, setCheckingOTP] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);

  const verifyOtp = async (otp) => {
    console.log(`I'm inside verifyOtp function`);
    const verifyData = { phone: `+965${mobile}`, code: otp };

    setCheckingOTP(true);
    setVerificationResult(null);

    try {
      const response = await verifyOTPCode(verifyData);

      if (response.status === 200) {
        setVerificationResult("success");
        setIsMobileVerified(true);
        console.log("Mobile verification success!", verificationResult);
      } else if (response.status === 429) {
        setIsMobileVerified(false);
        toast.error(
          "You've made too many requests. Please try again in 3 minutes."
        );
      } else {
        setIsMobileVerified(false);
        setVerificationResult("error");
        console.log("Verification failed!", verificationResult);
      }
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Handle rate limit error
        toast.error(
          "You've made too many requests. Please try again in 3 minutes."
        );
      } else {
        console.error("Verification failed:", error);
        setVerificationResult("error");
      }
    } finally {
      setCheckingOTP(false);
    }
  };

  //   Get Manager name from UID
  useEffect(() => {
    if (uid) {
      fetchManagerName(uid);
    } else {
      setManagerName("");
    }
  }, []);

  const fetchManagerName = async (uid) => {
    try {
      const response = await getManagerName(uid);
      if (response.status === 200) {
        if (
          response.data.legal_name === "" ||
          response.data.legal_name === null
        ) {
          setManagerName(
            response.data.user.first_name + " " + response.data.user.last_name
          );
        } else {
          setManagerName(response.data.legal_name);
        }
      } else {
        setManagerName("");
      }
    } catch (error) {
      setManagerName("");
    }
  };

  async function handleSendOTP(mobile) {
    let response = ""; // Change the declaration from const to let

    if (isClickable) {
      setOtpRequested(true);
      setIsClickable(false);
      setTimer(180); // 3 minutes in seconds

      try {
        response = await sendOTPCode(mobile); // Live production function
        toast.success(`OTP sent successfully. Please check your WhatsApp.`);
      } catch (error) {
        setIsClickable(true);
        setOtpRequested(false);

        console.log("Error :", error);
        if (error.response && error.response.status === 429) {
          toast.error(
            "You've made too many requests. Please try again in 3 minutes."
          );
        } else if (error.response && error.response.status === 409) {
          toast.error(`Mobile number already exists!`);
          setTimer(0);
        } else {
          toast.error(
            "An error occurred while sending OTP. Please try again later."
          );
          setTimer(0);
        }
      }
    }
  }

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 10; // Limit to 10 files

    // Filter out files larger than maxSize
    const validFiles = newFiles.filter((file) => file.size <= maxSize);

    // Check if any files are oversized
    const oversizedFiles = newFiles.filter((file) => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      toast.error("File size exceeds the maximum limit.");
      return;
    }

    // Check if the total count exceeds maxFiles
    if (selectedFiles.length + validFiles.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    // Further checks can be added for specific file types, etc.
    setSelectedFiles((prevFiles) => [
      ...prevFiles,
      ...validFiles.slice(0, maxFiles - selectedFiles.length),
    ]);
  };

  // Function to remove a file from the list
  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Utility function to get the icon based on the file extension
  const getFileIcon = (file) => {
    const extension = file.name.split(".").pop().toLowerCase();
    const fileIcons = {
      pdf: PictureAsPdfIcon,
      doc: InsertDriveFileIcon,
      docx: InsertDriveFileIcon,
      png: ImageIcon,
      jpg: ImageIcon,
      jpeg: ImageIcon,
      bmp: ImageIcon,
      gif: ImageIcon,
      tif: ImageIcon,
      tiff: ImageIcon,
      webp: ImageIcon,
      svg: ImageIcon,
      heif: ImageIcon,
      heic: ImageIcon,
      raw: ImageIcon,
      // Add more file type mappings here
    };
    return fileIcons[extension] || FileCopyIcon;
  };

  // Function to render selected file names
  const renderFileNames = () => (
    <List dense>
      {selectedFiles.map((file, index) => {
        const FileIcon = getFileIcon(file); // Get the icon component for the file type
        return (
          <ListItem key={index}>
            <ListItemIcon>
              <FileIcon />
            </ListItemIcon>
            <ListItemText primary={file.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleRemoveFile(index)}
              >
                <ClearIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );

  // This hook for automatic OTP verification
  useEffect(() => {
    if (otp.length === 4 && mobile.length === 8 && !isMobileVerified) {
      verifyOtp(otp); // Call verifyOtp function when the user has entered 4 digits
    }
  }, [otp]);

  // Effect to handle the countdown timer
  useEffect(() => {
    let interval = null;
    if (!isClickable && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsClickable(true);
    }
    return () => clearInterval(interval);
  }, [isClickable, timer]);

  async function handleSubmit(values) {
    setIsSubmitting(true);

    if (selectedFiles.length < 1) {
      toast.error("Please upload at least one file.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();

    // Append other form data
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    // Append files to formData
    selectedFiles.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    // Append mobile_verified to formData
    formData.append("mobile_verified", true);

    // Log the formData content
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      console.log("Trying to submit data:", formData);
      addTenantMutation.mutate(formData);
    } catch (error) {
      console.error("Error signing up :", error);
      toast.error("Please try again later.");
      setIsSubmitting(false); // Set isSubmitting to false when submission on failure
    } finally {
      setIsSubmitting(false); // Set isSubmitting to false when submission ends
    }
  }

  const formik = useFormik({
    initialValues: {
      english_name: "",
      arabic_name: "",
      mobile: "",
      otp: "",
      email: "",
      password: "",
      confirm_password: "",
      cid: "",
      address: "",
      sponsor: "",
      paci: "",
    },
    validationSchema: Yup.object({
      english_name: Yup.string().required("Required"),
      arabic_name: Yup.string().required("Required"),
      mobile: Yup.string()
        .matches(/^\d{8}$/, "Please enter a valid Kuwait mobile number")
        .required("WhatsApp number is required"),
      otp: Yup.string()
        .required("OTP is required")
        .matches(/^\d{4}$/, "OTP must be 4 digits"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters long")
        .required("Password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      cid: Yup.string()
        .matches(/^\d{12}$/, "Civil ID must be 12 digits")
        .required("Civil ID is required"),
      address: Yup.string().required("Address is required"),
      sponsor: Yup.string(),
      paci: Yup.string(),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      <Box
        sx={(theme) => ({
          width:
            "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
          transition: "width var(--Transition-duration)",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width:
              "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
            maxWidth: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{
              py: 3,
              display: "flex",
              alignItems: "left",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <img
                src={Logo}
                alt="Warba United Logo"
                style={{ width: "auto", height: 32 }}
              />
            </Box>
            {/* <Typography>Language Changer</Typography> */}
          </Box>
          {managerName === "" || managerName === null ? (
            // Show an alert if the URL is invalid
            <Box
              sx={{
                my: "auto",
                py: 2,
                pb: 5,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: 400,
                maxWidth: "100%",
                mx: "auto",
                borderRadius: "sm",
                "& form": {
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                },
                [`& .${formLabelClasses.asterisk}`]: {
                  visibility: "hidden",
                },
              }}
            >
              <Alert
                startDecorator={<WarningIcon />}
                variant="outlined"
                color="danger"
              >
                Invalid URL, please contact your property manager.
              </Alert>
            </Box>
          ) : (
            <Box
              component="main"
              sx={{
                my: "auto",
                py: 2,
                pb: 5,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: 400,
                maxWidth: "100%",
                mx: "auto",
                borderRadius: "sm",
                "& form": {
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                },
                [`& .${formLabelClasses.asterisk}`]: {
                  visibility: "hidden",
                },
              }}
            >
              <Stack gap={4}>
                {/* <Typography level="h3">Theme Mode is {mode}</Typography> */}

                <Stack gap={1}>
                  <Typography level="h3">Tenant Registration</Typography>

                  <FormLabel level="body-sm">
                    You are registering for a property that is managed by{" "}
                    <b>{managerName}</b>.
                  </FormLabel>
                </Stack>

                {/* <Button
                variant="soft"
                color="neutral"
                fullWidth
                // startDecorator={<GoogleIcon />}
              >r
                Continue with Google
              </Button> */}
              </Stack>

              {/* <Divider
              sx={(theme) => ({
                [theme.getColorSchemeSelector("light")]: {
                  color: { xs: "#FFF", md: "text.tertiary" },
                  "--Divider-lineColor": {
                    xs: "#FFF",
                    md: "var(--joy-palette-divider)",
                  },
                },
              })}
            >
              or
            </Divider> */}

              {/* Signup Form */}
              <Stack gap={4} sx={{ mt: 2 }}>
                <form
                  onSubmit={formik.handleSubmit}
                  encType="multipart/form-data"
                >
                  {/* Form Fields */}
                  <FormControl
                    required
                    error={
                      formik.touched.english_name &&
                      Boolean(formik.errors.english_name)
                    }
                  >
                    <FormLabel>Full Name (English)</FormLabel>
                    <Input
                      type="text"
                      disabled={managerName === "" || managerName === null}
                      name="english_name"
                      placeholder="As written in your Civil ID"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.english_name}
                    />
                    {formik.touched.english_name &&
                      formik.errors.english_name && (
                        <FormHelperText sx={{ color: "danger" }}>
                          <InfoOutlined
                            sx={{
                              verticalAlign: "middle",
                              mr: 0.5,
                              color: "danger",
                            }}
                          />
                          {formik.errors.english_name}
                        </FormHelperText>
                      )}
                  </FormControl>
                  <FormControl
                    required
                    error={
                      formik.touched.arabic_name &&
                      Boolean(formik.errors.arabic_name)
                    }
                  >
                    <FormLabel>Full Name (Arabic)</FormLabel>
                    <Input
                      type="text"
                      name="arabic_name"
                      disabled={managerName === "" || managerName === null}
                      placeholder="As written in your Civil ID"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.arabic_name}
                    />
                    {formik.touched.arabic_name &&
                      formik.errors.arabic_name && (
                        <FormHelperText sx={{ color: "danger" }}>
                          <InfoOutlined
                            sx={{
                              verticalAlign: "middle",
                              mr: 0.5,
                              color: "danger",
                            }}
                          />
                          {formik.errors.arabic_name}
                        </FormHelperText>
                      )}
                  </FormControl>
                  {/* WhatsApp Mobile Number */}
                  <FormControl
                    error={
                      formik.touched.mobile && Boolean(formik.errors.mobile)
                    }
                  >
                    <FormLabel>WhatsApp Number</FormLabel>
                    <Input
                      name="mobile"
                      onChange={(e) => {
                        if (!isMobileVerified) {
                          formik.handleChange(e);
                          setMobile(e.target.value);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobile}
                      disabled={
                        isMobileVerified ||
                        managerName === "" ||
                        managerName === null
                      }
                      slotProps={{ input: { component: MobileMaskAdapter } }}
                      startDecorator={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <WhatsAppIcon />
                          <span>+965</span>
                        </Stack>
                      }
                      endDecorator={
                        !isMobileVerified && (
                          <Button
                            onClick={() => handleSendOTP(formik.values.mobile)}
                            disabled={
                              !isClickable ||
                              managerName === "" ||
                              managerName === null
                            }
                          >
                            {isClickable
                              ? "Send OTP"
                              : `${Math.floor(timer / 60)}:${(
                                  "0" +
                                  (timer % 60)
                                ).slice(-2)} until resend`}
                          </Button>
                        )
                      }
                    />
                    {formik.touched.mobile && formik.errors.mobile && (
                      <FormHelperText sx={{ color: "danger" }}>
                        <InfoOutlined
                          sx={{
                            verticalAlign: "middle",
                            mr: 0.5,
                            color: "danger",
                          }}
                        />
                        {formik.errors.mobile}
                      </FormHelperText>
                    )}
                  </FormControl>
                  {!isMobileVerified && otpRequested && (
                    <FormControl
                      error={Boolean(
                        formik.touched.otp &&
                          (formik.errors.otp || verificationResult === "error")
                      )}
                    >
                      <FormLabel>OTP</FormLabel>
                      <Input
                        name="otp"
                        disabled={
                          mobile.length !== 8 ||
                          managerName === "" ||
                          managerName === null
                        }
                        placeholder="Enter OTP"
                        value={formik.values.otp}
                        onChange={(e) => {
                          formik.handleChange(e);
                          setOtp(e.target.value);
                        }}
                        onBlur={formik.handleBlur}
                        slotProps={{ input: { component: OtpMaskAdapter } }}
                        endDecorator={
                          checkingOTP ? (
                            <CircularProgress size="sm" />
                          ) : verificationResult === "success" ? (
                            <CheckCircleOutlined color="success" />
                          ) : verificationResult === "error" ? (
                            <CancelOutlinedIcon color="error" />
                          ) : null
                        }
                      />
                      {(formik.touched.otp && formik.errors.otp) ||
                        (verificationResult === "error" && (
                          <FormHelperText color="error">
                            {formik.errors.otp ||
                              "OTP verification failed. Please try again."}
                          </FormHelperText>
                        ))}
                    </FormControl>
                  )}

                  <FormControl
                    error={formik.touched.email && Boolean(formik.errors.email)}
                  >
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      disabled={managerName === "" || managerName === null}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <FormHelperText sx={{ color: "danger" }}>
                        <InfoOutlined
                          sx={{
                            verticalAlign: "middle",
                            mr: 0.5,
                            color: "danger",
                          }}
                        />
                        {formik.errors.email}
                      </FormHelperText>
                    )}
                  </FormControl>
                  {/* Password Field */}
                  <FormControl
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                  >
                    <FormLabel>Password</FormLabel>
                    <Stack
                      spacing={0.5}
                      // sx={{
                      //   "--hue": Math.min(password.length * 10, 120),
                      // }}
                    >
                      <Input
                        name="password"
                        type="password"
                        disabled={managerName === "" || managerName === null}
                        startDecorator={<Key />}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <FormHelperText sx={{ color: "error.main" }}>
                          <InfoOutlined
                            sx={{
                              verticalAlign: "middle",
                              mr: 0.5,
                              color: "error.main",
                            }}
                          />
                          {formik.errors.password}
                        </FormHelperText>
                      )}
                    </Stack>
                  </FormControl>
                  {/* Confirm Password Field */}
                  <FormControl
                    error={
                      formik.touched.confirm_password &&
                      Boolean(formik.errors.confirm_password)
                    }
                  >
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      name="confirm_password"
                      disabled={managerName === "" || managerName === null}
                      startDecorator={<Key />}
                      value={formik.values.confirm_password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.confirm_password &&
                      formik.errors.confirm_password && (
                        <FormHelperText sx={{ color: "error.main" }}>
                          <InfoOutlined
                            sx={{
                              verticalAlign: "middle",
                              mr: 0.5,
                              color: "error.main",
                            }}
                          />
                          {formik.errors.confirm_password}
                        </FormHelperText>
                      )}
                  </FormControl>
                  {/* Civil ID */}
                  <FormControl
                    error={formik.touched.cid && Boolean(formik.errors.cid)}
                  >
                    <FormLabel>Civil ID</FormLabel>
                    <Input
                      type="text"
                      name="cid"
                      disabled={managerName === "" || managerName === null}
                      value={formik.values.cid}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      slotProps={{ input: { component: CivilIdMaskAdapter } }}
                    />
                    {formik.touched.cid && formik.errors.cid && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        <InfoOutlined
                          sx={{
                            verticalAlign: "middle",
                            mr: 0.5,
                            color: "error.main",
                          }}
                        />
                        {formik.errors.cid}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                  >
                    <FormLabel>Address</FormLabel>
                    <Input
                      type="text"
                      name="address"
                      disabled={managerName === "" || managerName === null}
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="As written in your Civil ID"
                    />
                    {formik.touched.address && formik.errors.address && (
                      <FormHelperText sx={{ color: "error.main" }}>
                        <InfoOutlined
                          sx={{
                            verticalAlign: "middle",
                            mr: 0.5,
                            color: "error.main",
                          }}
                        />
                        {formik.errors.address}
                      </FormHelperText>
                    )}
                  </FormControl>
                  <FormControl>
                    <FormLabel>Sponsor</FormLabel>
                    <Input
                      type="text"
                      name="sponsor"
                      disabled={managerName === "" || managerName === null}
                      value={formik.values.sponsor}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="As written in your Civil ID"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>PACI</FormLabel>
                    <Input
                      type="text"
                      name="paci"
                      disabled={managerName === "" || managerName === null}
                      value={formik.values.paci}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="As written in your Civil ID"
                    />
                    <FormHelperText sx={{ color: "black" }}>
                      (Optional)
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <InputFileUpload
                      text={"Upload Documents"}
                      onFileChange={(event) => handleFileChange(event)}
                    />
                    <Typography
                      startDecorator={<InfoOutlined />}
                      my={2}
                      level="body-xs"
                      sx={{ textAlign: "justify", color: "black" }}
                    >
                      You are allowed to upload up to 10 files. Max file size is
                      5MB.
                    </Typography>
                    <Typography
                      startDecorator={<InfoOutlined />}
                      level="body-xs"
                      sx={{ textAlign: "justify", color: "black" }}
                    >
                      Please ensure that you upload the following documents for
                      yourself and your family (including wife and children):
                      Civil IDs, Passports, and Marriage Certificate.
                    </Typography>
                    {renderFileNames()}
                  </FormControl>
                  <Stack gap={4}>
                    <Button
                      type="submit"
                      fullWidth
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      startDecorator={
                        isSubmitting ? <CircularProgress size="sm" /> : null
                      }
                    >
                      {isSubmitting ? "Loading..." : "Register"}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Box>
          )}
          <Box component="footer" sx={{ py: 2 }}>
            <Typography
              level="body-xs"
              textAlign="center"
              sx={{ color: "black" }}
            >
              © Warba United Co. {new Date().getFullYear()}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://wuc-static.s3.eu-north-1.amazonaws.com/static/images/kuwait_towers.png)",
          // For Dark Theme
          // [theme.getColorSchemeSelector("dark")]: {
          //   backgroundImage:
          //     "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
          // },
        })}
      />
    </>
  );
}
