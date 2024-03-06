import { createTheme, responsiveFontSizes } from '@mui/material/styles';
// import './fonts.css';

declare module '@mui/material/styles' {
  interface TypeBackground {
    listItem: string;
    reverse: string;
    accordionIcon: string;
    listItemBorder: string;
    listItemDragHandler: string;
    listItemIconButton: string;
    disabledSocialIcon: string;
    selectedItemIcon: string;
    defaultText: string;
    defaultIcon: string;
    red: string;
    backdrop: string;
    headerButtons: string;
    accordionButtonIcon: string;
    accordionButtonIconSelected: string;
    avatar: string;
    green: string;
    danger: string;
    grey: string;
    blue: string;
    secondaryText: string;
    panel: string;
    formOption: string;
  }
}

const globalTheme = createTheme();

const responsiveTypography = {
  fontFamily: 'Roboto Condensed, Montserrat, Cairo',

  h1: {
      fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
    },

    h2: {
      fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
      fontWeight: 600,
      fontSize: '1.75rem',
    },

    h3: {
      fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
    },

    h4: {
      fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
    },

    h5: {
      fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      [globalTheme.breakpoints.up('sm')]: {
        fontSize: '1.5rem',
      },
    },

    h6: {
      fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },

    body1: {
      fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    
    body2: {
      fontFamily: 'Roboto Condensed, Helvetica, Arial, sans-serif',
    },
};

const completeTheme = createTheme(globalTheme, {
  typography: responsiveTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          paddingTop: globalTheme.spacing(2),
          paddingBottom: globalTheme.spacing(2),
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          // General overrides for all Typography components
        },
        h1: {
          // Specific overrides for 'h1' variant
        },
        body1: {
          // Specific overrides for 'body1' variant
        },
        // ... Other specific overrides
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '& svg': {
            fontSize: 24
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginRight: 0,
        },
        label: {
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: globalTheme.spacing(1),
          '&:first-of-type': {
            borderRadius: globalTheme.spacing(1),
          }
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderTopLeftRadius: globalTheme.spacing(1),
          borderTopRightRadius: globalTheme.spacing(1),
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: globalTheme.spacing(2),
          borderBottomLeftRadius: globalTheme.spacing(1),
          borderBottomRightRadius: globalTheme.spacing(1),
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '&.MuiSnackbar-anchorOriginBottomCenter': {
            bottom: '35px !important',
            [globalTheme.breakpoints.down('sm')]: {
              bottom: '19px !important',
            },
          },
        },
      },
    },
    
  },
});

const responsiveGlobalTheme = responsiveFontSizes(completeTheme);

const LIGHT_COLOR_PALETTE = {
  default: '#FBFBFB',
  reverse: '#222630',
  lighter: '#ffffff',
  darker: '#CBD5E1',
  darkerPlus: '#8795A6',
  dark: '#64748B',
  blue: '#25a0ff',
  darkBlue: '#0080e3',
  green: '#34A353',
  grey: '#e0e2e5',
  red: '#BD081C',
}

const lightTheme = createTheme(responsiveGlobalTheme, {
  palette: {
    mode: 'light',
    background: {
      default: LIGHT_COLOR_PALETTE.default,
      reverse: LIGHT_COLOR_PALETTE.reverse,
      appBarButtons: LIGHT_COLOR_PALETTE.dark,
      listItemBorder: LIGHT_COLOR_PALETTE.grey,
      listItemDragHandler: LIGHT_COLOR_PALETTE.dark,
      listItemIconButton: LIGHT_COLOR_PALETTE.dark,
      disabledSocialIcon: LIGHT_COLOR_PALETTE.dark,
      selectedItemIcon: LIGHT_COLOR_PALETTE.blue,
      defaultText: LIGHT_COLOR_PALETTE.dark,
      defaultIcon: LIGHT_COLOR_PALETTE.darker,
      red: LIGHT_COLOR_PALETTE.red,
      backdrop: LIGHT_COLOR_PALETTE.default,
      headerButtons: LIGHT_COLOR_PALETTE.dark,
      accordionIcon: LIGHT_COLOR_PALETTE.dark,
      accordionButtonIcon: LIGHT_COLOR_PALETTE.darker,
      accordionButtonIconSelected: LIGHT_COLOR_PALETTE.dark,
      avatar: LIGHT_COLOR_PALETTE.darker,
      green: LIGHT_COLOR_PALETTE.green,
      grey: LIGHT_COLOR_PALETTE.grey,
      blue: LIGHT_COLOR_PALETTE.blue,
      danger: LIGHT_COLOR_PALETTE.red,
      secondaryText: LIGHT_COLOR_PALETTE.dark,
      panel: LIGHT_COLOR_PALETTE.lighter,
      formOption: LIGHT_COLOR_PALETTE.grey,
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h5: {
          color: LIGHT_COLOR_PALETTE.reverse,
        },
        h4: {
          color: LIGHT_COLOR_PALETTE.reverse,
        },
        h3: {
          color: LIGHT_COLOR_PALETTE.reverse,
        },
        body1: {
          color: LIGHT_COLOR_PALETTE.dark,
        },
        body2: {
          color: LIGHT_COLOR_PALETTE.reverse,
          opacity: '0.5'
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: LIGHT_COLOR_PALETTE.blue,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: LIGHT_COLOR_PALETTE.lighter,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: LIGHT_COLOR_PALETTE.darkerPlus,
          },
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: LIGHT_COLOR_PALETTE.darkerPlus,
            },
          },
          '&.Mui-focused + .MuiInputLabel-outlined': {
            color: LIGHT_COLOR_PALETTE.blue,
          },
          '&.Mui-disabled': {
            color: LIGHT_COLOR_PALETTE.darker,
            '& .Mui-disabled': {
              color: LIGHT_COLOR_PALETTE.darker,
              textFillColor: LIGHT_COLOR_PALETTE.darker,
            },
          },
        },
        input: {
          color: LIGHT_COLOR_PALETTE.dark,
        },
        notchedOutline: {
          borderColor: LIGHT_COLOR_PALETTE.darker,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: LIGHT_COLOR_PALETTE.darkerPlus,
          '&.Mui-focused': {
            color: LIGHT_COLOR_PALETTE.blue,
          },
        },
        outlined: {},
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: LIGHT_COLOR_PALETTE.reverse,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-contained': {
            backgroundColor: LIGHT_COLOR_PALETTE.blue,
            color: LIGHT_COLOR_PALETTE.default,
            
            '&:hover': {
              backgroundColor: LIGHT_COLOR_PALETTE.darkBlue,
            },

            '&:active': {
              backgroundColor: LIGHT_COLOR_PALETTE.blue,
            },

            '&.Mui-disabled': {
              backgroundColor: LIGHT_COLOR_PALETTE.darker,
              color: LIGHT_COLOR_PALETTE.darkerPlus,
            },
          },
          '&.MuiButton-outlined': {
            borderColor: LIGHT_COLOR_PALETTE.blue,
            color: LIGHT_COLOR_PALETTE.blue,
            backgroundColor: LIGHT_COLOR_PALETTE.default,
            '&:hover': {
              borderColor: LIGHT_COLOR_PALETTE.darkBlue,
              backgroundColor: LIGHT_COLOR_PALETTE.darker,
            },

            '&:active': {
              borderColor: LIGHT_COLOR_PALETTE.darkBlue,
            },

            '&.Mui-disabled': {
              borderColor: LIGHT_COLOR_PALETTE.darker,
              color: LIGHT_COLOR_PALETTE.darkerPlus,
              opacity: 0.5
            },
            '&.MuiButton-outlinedSecondary': {
              borderColor: LIGHT_COLOR_PALETTE.dark,
              color: LIGHT_COLOR_PALETTE.dark,
              '&:hover': {
                backgroundColor: LIGHT_COLOR_PALETTE.darker,
              },
            }
          },
        },

        label: {
          color: 'desiredTextColor',

          '&:hover': {
            color: 'desiredHoverTextColor',
          },

          '&:active': {
            color: 'desiredActiveTextColor',
          },

          '&.Mui-disabled': {
            color: 'desiredDisabledTextColor',
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {},
      },
    },
    MuiStep: {
      styleOverrides: {
        root: {
          '&.Mui-active': {},
          '&.Mui-completed': {},
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            // backgroundColor: '#ff0000',
          },

          '&.Mui-completed': {},
        },
        label: {
          textTransform: 'capitalize',
          color: LIGHT_COLOR_PALETTE.dark,
          '&.Mui-active': {
            color: LIGHT_COLOR_PALETTE.dark,
          },
          '&.Mui-completed': {
            color: LIGHT_COLOR_PALETTE.dark,
          },
        },
        iconContainer: {
          '& .MuiSvgIcon-root': {
            color: LIGHT_COLOR_PALETTE.darkerPlus,
          },
          '&.Mui-active': {
            '& .MuiSvgIcon-root': {
              color: LIGHT_COLOR_PALETTE.blue,
            },
          },
          '&.Mui-completed': {
            '& .MuiSvgIcon-root': {
              color: LIGHT_COLOR_PALETTE.green,
            },
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: LIGHT_COLOR_PALETTE.darker,
          '&.Mui-active': {},
          '&.Mui-completed': {},
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: LIGHT_COLOR_PALETTE.dark,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
        },
        paper: {
          backgroundColor: LIGHT_COLOR_PALETTE.default,
          backgroundImage: 'none'
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
          root: {
          },
          paper: {
            backgroundColor: LIGHT_COLOR_PALETTE.default,
            backgroundImage: 'none',
          },
          paperWidthSm: {
          },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: LIGHT_COLOR_PALETTE.lighter,
          border: 'none',
          boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.05)'
        },
        columnHeader: {
          '&:hover': {
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: LIGHT_COLOR_PALETTE.dark,
          },
          '& .MuiIconButton-root': {
            color: LIGHT_COLOR_PALETTE.dark,
          }
        },
        row: {
          '&.Mui-even': {
          },
          '&.Mui-selected': {
            backgroundColor: 'transparent !important',
          },
          '&.Mui-hovered': {
            backgroundColor: 'transparent !important',
          }
        },
        cell: {
          borderBottomColor: LIGHT_COLOR_PALETTE.darker,
          '& .MuiButtonBase-root': {
            color: LIGHT_COLOR_PALETTE.dark,
          },
        },
        columnHeaderWrapper: {
          borderColor: LIGHT_COLOR_PALETTE.darker,
        },
        overlay: {
        },
        columnHeaderTitleContainer: {
        },
        footerContainer: {
          justifyContent: 'flex-start',
          borderColor: LIGHT_COLOR_PALETTE.dark,
          '&.MuiDataGrid-withBorderColor': {
            borderColor: LIGHT_COLOR_PALETTE.default,
          },
          '& .MuiDataGrid-selectedRowCount': {
            display: 'none',
          },
          '& .MuiTablePagination-selectLabel': {
            color: LIGHT_COLOR_PALETTE.dark,
          },
          '& .MuiSelect-select': {
            color: LIGHT_COLOR_PALETTE.dark,
          },
          '& .MuiSvgIcon-root': {
            color: LIGHT_COLOR_PALETTE.dark,
          },
          '& .Mui-disabled': {
            '& .MuiSvgIcon-root': {
              color: LIGHT_COLOR_PALETTE.darker,
            },
          },
          '& .MuiTablePagination-displayedRows': {
            color: LIGHT_COLOR_PALETTE.dark,
          }
        },
        pagination: {
          '& .MuiPaginationItem-root': {
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: LIGHT_COLOR_PALETTE.lighter,
          boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.05)',
        },
        expanded: {
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: LIGHT_COLOR_PALETTE.lighter,
          borderBottom: `1px solid ${LIGHT_COLOR_PALETTE.darker}`
        },
        content: {
        },
        expandIconWrapper: {
          color: LIGHT_COLOR_PALETTE.dark,
          '&.Mui-expanded': {
            
          },
          '& .MuiSvgIcon-root': {
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: LIGHT_COLOR_PALETTE.lighter,
        },
      },
    },
    MuiAccordionActions: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${LIGHT_COLOR_PALETTE.grey}`,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: LIGHT_COLOR_PALETTE.darker,
        },
      },
    },
  },
});

const DARK_COLOR_PALETTE = {
  default: '#222630',
  reverse: '#FBFBFB',
  lighter: '#2A3141',
  light: '#566d87',
  darker: '#2A3043',
  darkerPlus: '#111111',
  dark: '#000000',
  blue: '#25a0ff',
  darkBlue: '#0080e3',
  green: '#34A353',
  grey: '#BEC9D8',
  red: '#BD081C',
}

const darkTheme = createTheme(responsiveGlobalTheme, {
  palette: {
    mode: 'dark',
    background: {
      default: DARK_COLOR_PALETTE.default,
      reverse: DARK_COLOR_PALETTE.reverse,
      listItem: DARK_COLOR_PALETTE.lighter,
      listItemBorder: DARK_COLOR_PALETTE.grey,
      listItemDragHandler: DARK_COLOR_PALETTE.light,
      listItemIconButton: DARK_COLOR_PALETTE.light,
      disabledSocialIcon: DARK_COLOR_PALETTE.darker,
      selectedItemIcon: DARK_COLOR_PALETTE.blue,
      defaultText: DARK_COLOR_PALETTE.reverse,
      defaultIcon: DARK_COLOR_PALETTE.darker,
      red: DARK_COLOR_PALETTE.red,
      backdrop: DARK_COLOR_PALETTE.default,
      headerButtons: DARK_COLOR_PALETTE.light,
      accordionIcon: DARK_COLOR_PALETTE.reverse,
      accordionButtonIcon: DARK_COLOR_PALETTE.light,
      accordionButtonIconSelected: DARK_COLOR_PALETTE.grey,
      avatar: DARK_COLOR_PALETTE.light,
      green: DARK_COLOR_PALETTE.green,
      grey: DARK_COLOR_PALETTE.grey,
      blue: DARK_COLOR_PALETTE.blue,
      secondaryText: DARK_COLOR_PALETTE.light,
      danger: DARK_COLOR_PALETTE.red,
      panel: DARK_COLOR_PALETTE.darker,
      formOption: DARK_COLOR_PALETTE.darker,
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        h5: {
          color: DARK_COLOR_PALETTE.reverse,
        },
        h4: {
          color: DARK_COLOR_PALETTE.reverse,
        },
        h3: {
          color: DARK_COLOR_PALETTE.reverse,
        },
        body1: {
          color: DARK_COLOR_PALETTE.reverse,
        },
        body2: {
          color: `${DARK_COLOR_PALETTE.reverse} !important`,
          opacity: '0.5'
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: DARK_COLOR_PALETTE.blue,
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: DARK_COLOR_PALETTE.default,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: DARK_COLOR_PALETTE.light,
          },
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: DARK_COLOR_PALETTE.light,
            },
          },
          '&.Mui-focused + .MuiInputLabel-outlined': {
            color: DARK_COLOR_PALETTE.blue,
          },
          '&.Mui-disabled': {
            color: DARK_COLOR_PALETTE.light,
            '& .Mui-disabled': {
              color: DARK_COLOR_PALETTE.light,
              textFillColor: DARK_COLOR_PALETTE.light,
            },
          },
        },
        input: {
          color: DARK_COLOR_PALETTE.reverse,
        },
        notchedOutline: {
          borderColor: DARK_COLOR_PALETTE.light,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: DARK_COLOR_PALETTE.light,
          '&.Mui-focused': {
            color: DARK_COLOR_PALETTE.blue,
          },
        },
        outlined: {},
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: DARK_COLOR_PALETTE.reverse,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-contained': {
            backgroundColor: DARK_COLOR_PALETTE.blue,
            color: DARK_COLOR_PALETTE.default,
            
            '&:hover': {
              backgroundColor: DARK_COLOR_PALETTE.darkBlue,
            },

            '&:active': {
              backgroundColor: DARK_COLOR_PALETTE.blue,
            },

            '&.Mui-disabled': {
              backgroundColor: DARK_COLOR_PALETTE.darker,
              color: DARK_COLOR_PALETTE.darkerPlus,
            },
          },
          '&.MuiButton-outlined': {
            borderColor: DARK_COLOR_PALETTE.blue,
            color: DARK_COLOR_PALETTE.blue,
            backgroundColor: DARK_COLOR_PALETTE.default,
            '&:hover': {
              borderColor: DARK_COLOR_PALETTE.darkBlue,
              backgroundColor: DARK_COLOR_PALETTE.darker,
            },

            '&:active': {
              borderColor: DARK_COLOR_PALETTE.darkBlue,
            },

            '&.Mui-disabled': {
              borderColor: DARK_COLOR_PALETTE.darker,
              color: DARK_COLOR_PALETTE.darkerPlus,
              opacity: 0.5
            },
            '&.MuiButton-outlinedSecondary': {
              borderColor: DARK_COLOR_PALETTE.grey,
              color: DARK_COLOR_PALETTE.grey,
              '&:hover': {
                backgroundColor: DARK_COLOR_PALETTE.darker,
              },
            }
          },
        },

        label: {
          color: 'desiredTextColor',

          '&:hover': {
            color: 'desiredHoverTextColor',
          },

          '&:active': {
            color: 'desiredActiveTextColor',
          },

          '&.Mui-disabled': {
            color: 'desiredDisabledTextColor',
          },
        },
      },
    },
    // MuiIconButton: {
    //   styleOverrides: {
    //     root: {
    //       color: DARK_COLOR_PALETTE.light,
    //       '& svg': {
    //       },
    //       '&:hover': {
    //         color: DARK_COLOR_PALETTE.darkBlue,
    //       },
    //       '&.Mui-disabled': {
    //         color: DARK_COLOR_PALETTE.darker,
    //       },
    //     },
    //   },
    // },
    MuiStepper: {
      styleOverrides: {
        root: {},
      },
    },
    MuiStep: {
      styleOverrides: {
        root: {
          '&.Mui-active': {},
          '&.Mui-completed': {},
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            // backgroundColor: '#ff0000',
          },

          '&.Mui-completed': {},
        },
        label: {
          textTransform: 'capitalize',
          color: DARK_COLOR_PALETTE.light,
          '&.Mui-active': {
            color: DARK_COLOR_PALETTE.light,
          },
          '&.Mui-completed': {
            color: DARK_COLOR_PALETTE.light,
          },
        },
        iconContainer: {
          '& .MuiSvgIcon-root': {
            color: DARK_COLOR_PALETTE.darkerPlus,
          },
          '&.Mui-active': {
            '& .MuiSvgIcon-root': {
              color: DARK_COLOR_PALETTE.blue,
            },
          },
          '&.Mui-completed': {
            '& .MuiSvgIcon-root': {
              color: DARK_COLOR_PALETTE.green,
            },
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: DARK_COLOR_PALETTE.light,
          '&.Mui-active': {},
          '&.Mui-completed': {},
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: DARK_COLOR_PALETTE.light,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
        },
        paper: {
          backgroundColor: DARK_COLOR_PALETTE.default,
          backgroundImage: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
          root: {
          },
          paper: {
            backgroundColor: DARK_COLOR_PALETTE.default,
            backgroundImage: 'none',
          },
          paperWidthSm: {
          },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: DARK_COLOR_PALETTE.darker,
          border: 'none',
        },
        columnHeader: {
          '&:hover': {
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: DARK_COLOR_PALETTE.light,
          },
          '& .MuiIconButton-root': {
            color: DARK_COLOR_PALETTE.light,
          },
        },
        row: {
          '&.Mui-even': {
          },
          '&.Mui-selected': {
            backgroundColor: 'transparent !important',
          },
          '&.Mui-hovered': {
            backgroundColor: 'transparent !important',
          }
        },
        cell: {
          borderBottomColor: DARK_COLOR_PALETTE.default,
          '& .MuiButtonBase-root': {
            color: DARK_COLOR_PALETTE.light,
          },
        },
        columnHeaderWrapper: {
          borderBottom: '1px solid #ccc',
        },
        overlay: {
        },
        columnHeaderTitleContainer: {
        },
        footerContainer: {
          justifyContent: 'flex-start',
          borderColor: DARK_COLOR_PALETTE.light,
          '&.MuiDataGrid-withBorderColor': {
            borderColor: DARK_COLOR_PALETTE.default,
          },
          '& .MuiDataGrid-selectedRowCount': {
            display: 'none',
          },
          '& .MuiTablePagination-selectLabel': {
            color: DARK_COLOR_PALETTE.light,
          },
          '& .MuiSelect-select': {
            color: DARK_COLOR_PALETTE.light,
          },
          '& .MuiSvgIcon-root': {
            color: DARK_COLOR_PALETTE.light,
          },
          '& .Mui-disabled': {
            '& .MuiSvgIcon-root': {
              color: DARK_COLOR_PALETTE.lighter,
            },
          },
          '& .MuiTablePagination-displayedRows': {
            color: DARK_COLOR_PALETTE.light,
          }
        },
        pagination: {
          '& .MuiPaginationItem-root': {
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: DARK_COLOR_PALETTE.darker,
        },
        expanded: {
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: DARK_COLOR_PALETTE.darker,
          borderBottom: `1px solid ${DARK_COLOR_PALETTE.lighter}`
        },
        content: {
        },
        expandIconWrapper: {
          color: DARK_COLOR_PALETTE.light,
          '&.Mui-expanded': {
            
          },
          '& .MuiSvgIcon-root': {
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: DARK_COLOR_PALETTE.darker,
        },
      },
    },
    MuiAccordionActions: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${DARK_COLOR_PALETTE.grey}`,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: DARK_COLOR_PALETTE.lighter,
        },
      },
    },
  },
});

export { lightTheme, darkTheme };