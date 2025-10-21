import { useRef } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// third party
import { useReactToPrint } from 'react-to-print';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import SubCard from 'ui-component/cards/SubCard';
import Logo from 'ui-component/Logo';
import { gridSpacing } from 'store/constant';

// table data
function createData(product, description, quantity, amount, total) {
  return { product, description, quantity, amount, total };
}

const rows = [
  createData('Logo Design', 'lorem ipsum dolor sit amat, connecter adieu siccing eliot', '6', '$200.00', '$1200.00'),
  createData('Landing Page', 'lorem ipsum dolor sit amat, connecter adieu siccing eliot', '7', '$100.00', '$700.00'),
  createData('Admin Template', 'lorem ipsum dolor sit amat, connecter adieu siccing eliot', '5', '$150.00', '$750.00')
];

// ==============================|| INVOICE DETAILS - INVOICE ||============================== //

export default function InvoiceTab() {
  const theme = useTheme();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <Grid container spacing={gridSpacing} sx={{ justifyContent: 'center' }}>
      <Grid ref={contentRef} size={{ xs: 12, md: 10, lg: 8 }}>
        <SubCard darkTitle title="Invoice #125863478945" secondary={<Logo />}>
          <Grid container spacing={gridSpacing}>
            <Grid size={12}>
              <Grid container spacing={0}>
                <Grid size={12}>
                  <Typography variant="subtitle1">Demo Company Inc.</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2">1065 Mandan Road, Columbia MO,</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2">Missouri. (123)-65202</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography component={Link} to="#" variant="body2" sx={{ color: 'primary.main' }}>
                    demo@company.com
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2">(+91) 9999 999 999</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <Grid container spacing={gridSpacing}>
                <Grid size={{ sm: 5 }}>
                  <Grid container spacing={1}>
                    <Grid size={12}>
                      <Typography variant="h5">Customer :</Typography>
                    </Grid>
                    <Grid size={12}>
                      <Grid container spacing={0}>
                        <Grid size={12}>
                          <Typography variant="subtitle1">John Doe</Typography>
                        </Grid>
                        <Grid size={12}>
                          <Typography variant="body2">1065 Mandan Road, Columbia MO,</Typography>
                        </Grid>
                        <Grid size={12}>
                          <Typography variant="body2">Missouri. (123)-65202</Typography>
                        </Grid>
                        <Grid size={12}>
                          <Typography variant="body2">(+61) 9999 567 891</Typography>
                        </Grid>
                        <Grid size={12}>
                          <Typography component={Link} to="#" variant="body2" sx={{ color: 'primary.main' }}>
                            demo@company.com
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid size={{ sm: 4 }}>
                  <Grid container spacing={1}>
                    <Grid size={12}>
                      <Typography variant="h5">Order Details :</Typography>
                    </Grid>
                    <Grid size={12}>
                      <Grid container spacing={0}>
                        <Grid size={4}>
                          <Typography variant="body2">Date :</Typography>
                        </Grid>
                        <Grid size={8}>
                          <Typography variant="body2">November 14</Typography>
                        </Grid>
                        <Grid sx={{ my: 0.5 }} size={4}>
                          <Typography variant="body2">Status :</Typography>
                        </Grid>
                        <Grid sx={{ my: 0.5 }} size={8}>
                          <Chip label="Pending" variant="outlined" size="small" color="warning" />
                        </Grid>
                        <Grid size={4}>
                          <Typography variant="body2">Order Id :</Typography>
                        </Grid>
                        <Grid size={8}>
                          <Typography variant="body2" component={Link} to="#">
                            #146859
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={12}>
              <TableContainer>
                <Table
                  sx={{
                    '& tr:last-of-type td': {
                      borderBottom: 'none'
                    },
                    '& thead tr th': {
                      borderBottom: 'none'
                    },
                    '& th:first-of-type, & td:first-of-type': {
                      pl: { xs: 2.5, md: 5 }
                    },
                    '& th:last-of-type, & td:last-of-type': {
                      pr: { xs: 6.25, md: 8.75 }
                    }
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ pl: 3 }}>DESCRIPTION</TableCell>
                      <TableCell align="right">QUANTITY</TableCell>
                      <TableCell align="right">AMOUNT</TableCell>
                      <TableCell align="right" sx={{ pr: 3 }}>
                        TOTAL
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ pl: 3 }}>
                          <Typography variant="subtitle1">{row.product}</Typography>
                          <Typography variant="body2">{row.description}</Typography>
                        </TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
                        <TableCell align="right" sx={{ pr: 3 }}>
                          {row.total}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid size={12}>
              <SubCard sx={{ bgcolor: 'primary.light', ...theme.applyStyles('dark', { bgcolor: 'dark.main' }) }}>
                <Grid container spacing={gridSpacing} sx={{ justifyContent: 'flex-end' }}>
                  <Grid size={{ sm: 6, md: 4 }}>
                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <Grid container spacing={1}>
                          <Grid size={6}>
                            <Typography variant="subtitle1" sx={{ textAlign: 'right' }}>
                              Sub Total :
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="body2" sx={{ textAlign: 'right' }}>
                              $2650
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="subtitle1" sx={{ textAlign: 'right' }}>
                              Tax (10%) :
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="body2" sx={{ textAlign: 'right' }}>
                              $265
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="subtitle1" sx={{ textAlign: 'right' }}>
                              Discount (5%) :
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="body2" sx={{ textAlign: 'right' }}>
                              $145.75
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={12}>
                        <Divider />
                      </Grid>
                      <Grid size={12}>
                        <Grid container spacing={1}>
                          <Grid size={6}>
                            <Typography variant="subtitle1" sx={{ textAlign: 'right', color: 'primary.main' }}>
                              Total :
                            </Typography>
                          </Grid>
                          <Grid size={6}>
                            <Typography variant="subtitle1" sx={{ textAlign: 'right', color: 'primary.main' }}>
                              $2769.25
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </SubCard>
            </Grid>
            <Grid size={12}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <Typography variant="h6">Terms and Condition :</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="body2">
                    lorem ipsum dolor sit connecter adieu siccing eliot, sed do elusion tempore incident ut laborer et dolors magna aliquot.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid size={{ xs: 12, lg: 8 }}>
        <Stack direction="row" sx={{ justifyContent: 'center' }}>
          <AnimateButton>
            <Button variant="contained" onClick={() => reactToPrintFn()}>
              Print
            </Button>
          </AnimateButton>
        </Stack>
      </Grid>
    </Grid>
  );
}
