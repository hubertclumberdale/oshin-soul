import { extendTheme } from "@mui/joy";

export const theme = extendTheme({
  components: {
    JoyCard: {
      defaultProps: {
        size: "sm",
        variant: "soft",
      },
    },
  },
});
