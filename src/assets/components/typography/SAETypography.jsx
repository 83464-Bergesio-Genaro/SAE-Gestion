import { Typography } from '@mui/material';

export const SAETypography = ({ children, variant = 'body1', sx, ...props }) => {
  return (
    <Typography variant={variant} sx={sx} {...props}>
      {children}
    </Typography>
  );
};