export const prensaStyles = {
  page: {
    mt: "-90px",
    pt: { xs: "114px", md: "130px" },
    pb: 8,
    minHeight: "calc(100vh - 90px)",
    bgcolor: "#f4f8fc",
  },

  loadingOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 1300,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(2px)",
  },

  loadingBox: {
    position: "relative",
    width: 200,
    height: 200,
    display: "grid",
    placeItems: "center",
  },

  loadingImg: {
    width: 125,
    height: 125,
    objectFit: "contain",
    position: "absolute",
    borderRadius: "50%",
    bgcolor: "white",
    p: 0.5,
    boxShadow: 1,
  },

  heroBanner: (baseUrl) => ({
    overflow: "hidden",
    borderRadius: 6,
    px: { xs: 3, md: 6 },
    py: { xs: 4, md: 5 },
    mb: 3,
    minHeight: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 3,
    backgroundImage: `linear-gradient(125deg, rgba(18,54,102,0.96) 0%, rgba(53,108,178,0.88) 58%, rgba(108,171,221,0.80) 100%), url('${baseUrl}images/carrousel/EntradaUTN.jpg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
  }),

  heroTextBox: {
    maxWidth: 700,
  },

  heroBackButton: {
    color: "rgba(255,255,255,0.7)",
    "&:hover": { color: "white", bgcolor: "rgba(255,255,255,0.12)" },
  },

  heroOverline: {
    letterSpacing: 1.8,
    opacity: 0.85,
    fontWeight: 700,
  },

  heroTitle: {
    mt: 1,
    fontWeight: 800,
    lineHeight: 1.1,
    fontSize: { xs: "2rem", md: "2.6rem" },
  },

  heroSubtitle: {
    mt: 2,
    maxWidth: 520,
    fontSize: { xs: 15, md: 17 },
    opacity: 0.92,
  },

  heroChip: {
    bgcolor: "rgba(255,255,255,0.18)",
    color: "white",
    fontWeight: 700,
  },

  heroLogo: (baseUrl) => ({
    display: { xs: "none", md: "block" },
    width: 180,
    height: 180,
    borderRadius: "28px",
    backgroundImage: `url('${baseUrl}images/principal/logoUTNrotado.png')`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    transform: "rotate(8deg)",
    filter: "drop-shadow(0 18px 35px rgba(0,0,0,0.22))",
    flexShrink: 0,
  }),

  searchBar: {
    position: "sticky",
    top: 64,
    zIndex: 10,
    borderRadius: "16px 16px 0 0",
    px: { xs: 2, md: 3 },
    py: 1.5,
    background: "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(232,243,253,0.98) 100%)",
    border: "1px solid rgba(91, 150, 204, 0.20)",
    borderBottom: "none",
    backdropFilter: "blur(10px)",
    boxShadow: "0 -2px 12px rgba(21, 61, 113, 0.06)",
    display: "flex",
    alignItems: "center",
    gap: 2,
  },

  searchTextField: {
    m: 0,
    flexGrow: 1,
    minWidth: 160,
  },

  filterDateControl: {
    minWidth: 190,
    flexShrink: 0,
  },

  filterNameControl: {
    minWidth: 170,
    flexShrink: 0,
  },

  clearFiltersButton: {
    flexShrink: 0,
    color: "text.secondary",
    "&:hover": { color: "error.main" },
  },

  adminButton: {
    flexShrink: 0,
    whiteSpace: "nowrap",
  },

  publicationsBox: {
    borderRadius: "0 0 16px 16px",
    border: "1px solid rgba(91, 150, 204, 0.20)",
    borderTop: "1px solid rgba(91, 150, 204, 0.18)",
    boxShadow: "0 4px 24px rgba(21, 61, 113, 0.08)",
    bgcolor: "white",
    px: { xs: 2, md: 3 },
    py: 3,
    mb: 3,
  },

  noResults: {
    textAlign: "center",
    py: 4,
  },

  card: (accentColor) => ({
    borderRadius: 4,
    boxShadow: "0 18px 45px rgba(21, 61, 113, 0.12)",
    border: "1px solid rgba(17, 53, 101, 0.08)",
    borderTop: `3px solid ${accentColor}`,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    "&:hover": {
      transform: "translateY(-3px)",
      boxShadow: "0 24px 55px rgba(21, 61, 113, 0.18)",
    },
    display: "flex",
    flexDirection: "column",
  }),

  cardActionArea: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  },

  cardContent: {
    p: 2.5,
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },

  cardChipsBox: {
    display: "flex",
    gap: 0.5,
    mb: 1.5,
    flexWrap: "wrap",
  },

  cardTitle: {
    fontWeight: 800,
    color: "#123666",
    lineHeight: 1.3,
    mb: 1,
  },

  cardDescription: {
    color: "#5a6f8f",
    flexGrow: 1,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  cardFooter: {
    mt: 2,
    pt: 1.5,
    borderTop: "1px solid rgba(17, 53, 101, 0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardDate: {
    color: "#7a92b0",
  },

  cardViewsBox: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
  },

  cardViewsIcon: {
    fontSize: 14,
    color: "#7a92b0",
  },

  cardViewsText: {
    color: "#7a92b0",
  },

  dialogChipsBox: {
    display: "flex",
    gap: 1,
    mb: 2,
  },

  dialogViewsBox: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    ml: "auto",
  },

  dialogDatesBox: {
    display: "flex",
    gap: 3,
    mb: 2,
  },

  dialogDocsTitleBox: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mt: 2,
    mb: 1,
  },

  dialogDocIconBox: {
    display: "flex",
    alignItems: "center",
  },
};