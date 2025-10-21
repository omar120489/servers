import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import SubCard from 'ui-component/cards/SubCard';

// ==============================|| TOTAL-SUBCARD PAGE ||============================== //

export default function TotalCard({ productsData, allAmounts }) {
  const theme = useTheme();

  return (
    <>
      {productsData.length ? (
        <Grid size={12}>
          <SubCard sx={{ mx: 0, mb: 0, bgcolor: 'primary.light', ...theme.applyStyles('dark', { bgcolor: 'dark.main' }) }}>
            <Grid container spacing={2} sx={{ justifyContent: 'flex-end' }}>
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
                          ${allAmounts.subTotal}
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="subtitle1" sx={{ textAlign: 'right' }}>
                          Taxes (10%) :
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" sx={{ textAlign: 'right' }}>
                          ${allAmounts.taxesAmount}
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="subtitle1" sx={{ textAlign: 'right' }}>
                          Discount (5%) :
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" sx={{ textAlign: 'right' }}>
                          ${allAmounts.discountAmount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <Divider sx={{ bgcolor: 'dark.main' }} />
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
                          ${allAmounts.totalAmount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </SubCard>
          <Grid sx={{ mt: 3 }} size={12}>
            <Divider />
          </Grid>
        </Grid>
      ) : null}
    </>
  );
}

TotalCard.propTypes = { productsData: PropTypes.any, allAmounts: PropTypes.any };
