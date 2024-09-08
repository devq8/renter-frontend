import React from "react";
import Stepper from "@mui/joy/Stepper";
import Step, { stepClasses } from "@mui/joy/Step";
import StepIndicator, { stepIndicatorClasses } from "@mui/joy/StepIndicator";
import Typography, { typographyClasses } from "@mui/joy/Typography";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";

export function CustomStepper({ steps, activeStep }) {
  return (
    <Stepper
      orientation="vertical"
      sx={{
        "--Stepper-verticalGap": "2.5rem",
        "--StepIndicator-size": "2.5rem",
        "--Step-gap": "1rem",
        "--Step-connectorInset": "0.5rem",
        "--Step-connectorRadius": "1rem",
        "--Step-connectorThickness": "4px",
        "--joy-palette-success-solidBg": "var(--joy-palette-success-400)",
        [`& .${stepClasses.completed}`]: {
          "&::after": { bgcolor: "success.solidBg" },
        },
        [`& .${stepClasses.active}`]: {
          [`& .${stepIndicatorClasses.root}`]: {
            border: "4px solid",
            borderColor: "#fff",
            boxShadow: (theme) =>
              `0 0 0 1px ${theme.vars.palette.primary[500]}`,
          },
        },
        [`& .${stepClasses.disabled} *`]: {
          color: "neutral.softDisabledColor",
        },
        [`& .${typographyClasses["title-sm"]}`]: {
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontSize: "10px",
        },
      }}
    >
      {steps.map((step, index) => (
        <Step
          key={index}
          completed={index < activeStep}
          active={index === activeStep}
          disabled={index > activeStep}
          indicator={
            index < activeStep ? (
              <StepIndicator variant="solid" color="success">
                <CheckRoundedIcon />
              </StepIndicator>
            ) : index === activeStep ? (
              <StepIndicator variant="solid" color="primary">
                <AppRegistrationRoundedIcon />
              </StepIndicator>
            ) : (
              <StepIndicator>{index + 1}</StepIndicator>
            )
          }
        >
          <div>
            <Typography level="title-sm">Step {index + 1}</Typography>
            {step.label}
          </div>
        </Step>
      ))}
    </Stepper>
  );
}
