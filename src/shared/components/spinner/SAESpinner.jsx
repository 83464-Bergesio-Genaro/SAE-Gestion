import { Box, CircularProgress } from "@mui/material";
import utnLogo from "../../../assets/utn.png";

const SIZES = {
  L: { ring: 96, logo: 44 },
  M: { ring: 83, logo: 44 },
  S: { ring: 76, logo: 44 },
};

/**
 * SAESpinner
 * @param {"L"|"M"|"S"} size  - Preset size. Defaults to "L".
 * @param {object} rest       - Any prop accepted by MUI CircularProgress.
 */
export default function SAESpinner({ size = "L", ...rest }) {
  const { ring, logo } = SIZES[size] ?? SIZES.L;

  return (
    <Box
      sx={{
        position: "relative",
        width: 96,
        height: 96,
        display: "grid",
        placeItems: "center",
      }}
    >
      <CircularProgress size={ring} thickness={3.8} {...rest} />
      <Box
        component="img"
        src={utnLogo}
        alt="UTN"
        sx={{
          width: logo,
          height: logo,
          objectFit: "contain",
          position: "absolute",
          borderRadius: "50%",
          bgcolor: "white",
          p: 0.5,
          boxShadow: 1,
        }}
      />
    </Box>
  );
}
