import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  CardContent,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";

import SAEButton from "../buttons/SAEButton";
import SAETextField from "../inputs/SAETextField";

/**
 * Contenedor visual compartido para las grillas de gestión.
 * La pantalla conserva la lógica y entrega su DataGrid mediante children.
 */
export default function DataGridPanel({
  tabs = [],
  activeTab,
  onTabChange,
  title,
  icon: Icon,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  actionLabel,
  onAction,
  actionIcon = <AddIcon />,
  actions,
  children,
  sx,
  contentSx,
}) {
  const hasSearch = searchValue !== undefined && onSearchChange;
  const hasDefaultAction = actionLabel && onAction;

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 18px 45px rgba(21, 61, 113, 0.08)",
        overflow: "hidden",
        ...sx,
      }}
    >
      <Box
        sx={{
          background: "var(--gradient)",
          color: "white",
          px: 3,
          pt: tabs.length ? 0 : 2.5,
          pb: tabs.length ? 0 : 0.5,
        }}
      >
        {tabs.length > 0 && (
          <Stack
            direction="row"
            overflow={{ xs: "auto", md: "hidden" }}
            spacing={0}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <Box
                  key={tab.key}
                  component="button"
                  type="button"
                  onClick={() => onTabChange?.(tab.key)}
                  aria-pressed={isActive}
                  sx={{
                    appearance: "none",
                    bgcolor: "transparent",
                    border: 0,
                    display: "flex",
                    alignItems: "center",
                    px: 2.5,
                    py: 0.7,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    color: isActive ? "white" : "rgba(255,255,255,0.6)",
                    borderBottom: isActive
                      ? "3px solid white"
                      : "3px solid transparent",
                    transition: "all 0.15s",
                    "&:hover": {
                      color: "white",
                      borderBottomColor: "rgba(255,255,255,0.4)",
                    },
                    "&:focus-visible": {
                      outline: "2px solid white",
                      outlineOffset: -2,
                    },
                  }}
                >
                  <Typography variant="body1" fontWeight={800}>
                    {tab.label}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{ py: 1.5 }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {Icon && <Icon sx={{ fontSize: 30 }} />}
            <Typography variant="h6">{title}</Typography>
          </Stack>

          {(hasSearch || hasDefaultAction || actions) && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              alignItems={{ sm: "center" }}
            >
              {hasSearch && (
                <SAETextField
                  placeholder={searchPlaceholder}
                  size="small"
                  value={searchValue}
                  onChange={(event) => onSearchChange(event.target.value)}
                  sx={{
                    width: { xs: "100%", sm: 240, md: 220 },
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.12)",
                      color: "white",
                      "& fieldset": {
                        borderColor: "rgba(255,255,255,0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255,255,255,0.6)",
                      },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                    "& input::placeholder": {
                      color: "rgba(255,255,255,0.7)",
                      opacity: 1,
                    },
                    "& .MuiInputAdornment-root svg": {
                      color: "rgba(255,255,255,0.7)",
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}

              {actions}

              {hasDefaultAction && (
                <SAEButton
                  variant="contained"
                  startIcon={actionIcon}
                  onClick={onAction}
                  sx={{
                    whiteSpace: "nowrap",
                    bgcolor: "rgba(255,255,255,0.18)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.4)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
                  }}
                >
                  {actionLabel}
                </SAEButton>
              )}
            </Stack>
          )}
        </Stack>
      </Box>

      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 }, ...contentSx }}>
        <Box sx={{ width: "100%" }}>{children}</Box>
      </CardContent>
    </Card>
  );
}
