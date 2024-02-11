import * as React from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import FormHelperText from "@mui/joy/FormHelperText";
import Key from "@mui/icons-material/Key";
import CircularProgress from "@mui/material/CircularProgress";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { IMaskInput } from "react-imask";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

function ColorSchemeToggle() {
  //   const { onClick, ...other } = props;
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="outlined" color="neutral" disabled />;
  }
  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      aria-label="toggle light/dark mode"
      //   {...other}
      onClick={(event) => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
        // onClick?.(event);
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

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
  // Forms States
  const { uid } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  //   Password States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordMatch(event.target.value === password);
  };
  const handlePasswordChange = (event) => setPassword(event.target.value);
  useEffect(() => {
    setPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  //   Mobile Verifications States
  const [isClickable, setIsClickable] = useState(true);
  const [timer, setTimer] = useState(0);
  const [checkingOTP, setCheckingOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);

  const verifyOtp = async () => {
    setCheckingOTP(true);
    setVerificationResult(null);

    try {
      const response = await fakeApiCall(otp);
      if (response.verified) {
        setVerificationResult("success");
      } else {
        setVerificationResult("error");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setVerificationResult("error");
    } finally {
      setCheckingOTP(false);
    }
  };

  const fakeApiCall = (otp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ verified: otp === "1234" }); // Assume '1234' is the correct OTP
      }, 2000); // Simulate network delay
    });
  };

  function handleSendOTP() {
    if (isClickable) {
      setIsClickable(false);
      setTimer(180); // 5 minutes in seconds
      //   Sending OTP function here.
      console.log("OTP sent.");
    }
  }

  // This hook for automatic OTP verification
  useEffect(() => {
    if (otp.length === 4) {
      verifyOtp(); // Call verifyOtp function when the user has entered 4 digits
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

  const formik = useFormik({
    initialValues: {
      english_name: "",
      arabic_name: "",
      mobile: "",
      email: "",
      password: "",
      cid: "",
      address: "",
      sponsor: "",
      paci: "",
    },
    validationSchema: Yup.object({
      english_name: Yup.string().required("Required!"),
      arabic_name: Yup.string().required("Required!"),
      mobile: Yup.string()
        .matches(/^\d{8}$/, "Please enter a valid Kuwait mobile number")
        .required("WhatsApp number is required"),
      otp: Yup.string()
        .matches(/^\d{4}$/, "OTP must be 4 digits")
        .required("OTP is required"),
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
      sponsor: Yup.string().required("Sponsor name is required"),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true); // Set isSubmitting to true when submission starts

      try {
        console.log("Submitted values:", values);
        // Make the API call to submit the payment data
        // const response = await sendPayment(updatedValues);
        // Redirect to the payment link, if provided in the response
        // if (response.data && response.data.payment_url) {
        //   redirectToPaymentLink(response.data.payment_url);
        // } else {
        //   // Handle case where the payment URL is not provided
        //   console.error("Payment URL not provided in response");
        // }
      } catch (error) {
        console.error("Error signing up :", error);
        toast.error("Please try again later.");
        setIsSubmitting(false); // Set isSubmitting to false when submission on failure
      }
    },
  });

  return (
    <CssVarsProvider defaultMode="light" disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
            "--Cover-width": "50vw", // must be `vw` only
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
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
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <IconButton variant="soft" color="primary" size="sm">
                <BadgeRoundedIcon />
              </IconButton>
              <Typography level="title-lg">Warba United Co.</Typography>
            </Box>
            <ColorSchemeToggle />
          </Box>
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
            <Stack gap={4} sx={{ mb: 2 }}>
              <Stack gap={1}>
                <Typography level="h3">Sign up</Typography>
                <Typography level="body-sm">
                  Already have an account?{" "}
                  <Link href="/signin" level="title-sm">
                    Sign in
                  </Link>
                </Typography>
              </Stack>
              {/* <Button
                variant="soft"
                color="neutral"
                fullWidth
                // startDecorator={<GoogleIcon />}
              >
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
            <Stack gap={4} sx={{ mt: 2 }}>
              <form onSubmit={formik.handleSubmit}>
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
                    name="english_name"
                    placeholder="As written in your Civil ID"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                    placeholder="As written in your civil id"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.arabic_name && formik.errors.arabic_name && (
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
                  error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                >
                  <FormLabel>WhatsApp Number</FormLabel>
                  <Input
                    name="mobile"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    slotProps={{ input: { component: MobileMaskAdapter } }}
                    startDecorator={
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <WhatsAppIcon />
                        <span>+965</span>
                      </Stack>
                    }
                    endDecorator={
                      <Button onClick={handleSendOTP} disabled={!isClickable}>
                        {isClickable
                          ? "Send OTP"
                          : `${Math.floor(timer / 60)}:${(
                              "0" +
                              (timer % 60)
                            ).slice(-2)} until resend`}
                      </Button>
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
                <FormControl>
                  <FormLabel>OTP</FormLabel>
                  <Input
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                    }}
                    slotProps={{ input: { component: OtpMaskAdapter } }}
                    endDecorator={
                      checkingOTP ? (
                        <CircularProgress size={20} />
                      ) : verificationResult === "success" ? (
                        <CheckCircleOutlined color="success" />
                      ) : verificationResult === "error" ? (
                        <CancelOutlinedIcon color="error" />
                      ) : null
                    }
                  />
                </FormControl>

                <FormControl
                  error={formik.touched.email && Boolean(formik.errors.email)}
                >
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                    sx={{
                      "--hue": Math.min(password.length * 10, 120),
                    }}
                  >
                    <Input
                      type="password"
                      placeholder="Type in here …"
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
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="As written in your civil id"
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
                    value={formik.values.sponsor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="As written in your civil id"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>PACI</FormLabel>
                  <Input
                    type="text"
                    name="sponsor"
                    value={formik.values.paci}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="As written in your civil id"
                  />
                  <FormHelperText>(Optional)</FormHelperText>
                </FormControl>

                <Stack gap={4} sx={{ mt: 2 }}>
                  <Button type="submit" fullWidth>
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
          <Box component="footer" sx={{ py: 3 }}>
            <Typography level="body-xs" textAlign="center">
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
            "url(https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?auto=format&w=1000&dpr=2)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage:
              "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
          },
        })}
      />
    </CssVarsProvider>
  );
}
