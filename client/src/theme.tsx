import { extendTheme } from "@mui/joy";
import { AvatarOwnerState } from "@mui/joy/Avatar"; // Import the AvatarOwnerState type

type ExtendedOwnerState = AvatarOwnerState & {
  size?: "sm" | "md" | "lg" | "xl";
};

export const theme = extendTheme({
  components: {
    JoyAvatar: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: ExtendedOwnerState }) => ({
          ...(ownerState.size === "sm" && {
            width: 16,
            height: 16,
          }),
          ...(ownerState.size === "md" && {
            width: 24,
            height: 24,
          }),
          ...(ownerState.size === "lg" && {
            width: 42,
            height: 42,
          }),
        }),
      },
    },
    JoyCard: {
      defaultProps: {
        variant: "soft",
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState && {
            userSelect: "none",
            boxShadow: theme.shadow.sm,
          }),
          ...(ownerState.size === "sm" && {
            padding: theme.spacing(0.75),
          }),
        }),
      },
    },
    JoyButton: {
      defaultProps: {
        color: "neutral",
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState && {
            minHeight: 0,
          }),
        }),
      },
    },
    JoyChip: {
      defaultProps: {
        variant: "soft",
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...(ownerState && {
            border: `1px solid ${theme.palette.background.level2}`,
          }),
        }),
      },
    },
  },
});
