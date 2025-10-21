import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Rating from '@mui/material/Rating';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// third party
import { useFormik, Form, FormikProvider, useField } from 'formik';
import * as yup from 'yup';

// project imports
import ColorOptions from '../ColorOptions';
import Avatar from 'ui-component/extended/Avatar';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch, useSelector } from 'store';
import { addProduct } from 'store/slices/cart';

// assets
import CircleIcon from '@mui/icons-material/Circle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import StarBorderTwoToneIcon from '@mui/icons-material/StarBorderTwoTone';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartTwoToneIcon from '@mui/icons-material/ShoppingCartTwoTone';

// project imports

// product color select
function getColor(color) {
  return ColorOptions.filter((item) => item.value === color);
}

// product size
const sizeOptions = [8, 10, 12, 14, 16, 18, 20];

const validationSchema = yup.object({
  color: yup.string().required('Color selection is required'),
  size: yup.number().required('Size selection is required.')
});

// ==============================|| COLORS OPTION ||============================== //

function Colors({ checked, colorsData }) {
  const theme = useTheme();

  return (
    <Grid>
      <Tooltip title={colorsData[0].label}>
        <ButtonBase sx={{ borderRadius: '50%' }}>
          <Avatar
            color="inherit"
            size="badge"
            sx={{
              bgcolor: colorsData[0].bg,
              color: 'grey.50',
              ...theme.applyStyles('dark', { color: 'grey.800' })
            }}
          >
            {checked && <CircleIcon sx={{ color: 'inherit', fontSize: '0.75rem' }} />}
            {!checked && <CircleIcon sx={{ color: colorsData[0].bg, fontSize: '0.75rem' }} />}
          </Avatar>
        </ButtonBase>
      </Tooltip>
    </Grid>
  );
}

function Increment(props) {
  const [field, , helpers] = useField(props);

  const { value } = field;
  const { setValue } = helpers;
  return (
    <ButtonGroup size="large" variant="text" color="inherit" sx={{ border: '1px solid', borderColor: 'grey.400' }}>
      <Button
        key="three"
        disabled={value <= 1}
        onClick={() => setValue(value - 1)}
        sx={{ pr: 0.75, pl: 0.75, minWidth: '0px !important' }}
        aria-label="'decrease'"
      >
        <RemoveIcon fontSize="inherit" />
      </Button>
      <Button key="two" sx={{ pl: 0.5, pr: 0.5 }}>
        {value}
      </Button>
      <Button key="one" onClick={() => setValue(value + 1)} sx={{ pl: 0.75, pr: 0.75, minWidth: '0px !important' }} aria-label="'increase'">
        <AddIcon fontSize="inherit" />
      </Button>
    </ButtonGroup>
  );
}

// ==============================|| PRODUCT DETAILS - INFORMATION ||============================== //

export default function ProductInfo({ product }) {
  const theme = useTheme();
  const downSM = useMediaQuery(theme.breakpoints.down('sm'));

  const [favorite, setFavorite] = useState(false);

  const dispatch = useDispatch();
  const history = useNavigate();

  const cart = useSelector((state) => state.cart);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: product.id,
      name: product.name,
      image: product.image,
      salePrice: product.salePrice,
      offerPrice: product.offerPrice,
      color: '',
      size: '',
      quantity: 1
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(addProduct(values, cart.checkout.products));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Submit Success',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

      history('/apps/e-commerce/checkout');
    }
  });

  const { values, errors, handleSubmit, handleChange } = formik;

  const addCart = () => {
    values.color = values.color ? values.color : 'primaryDark';
    values.size = values.size ? values.size : '8';
    dispatch(addProduct(values, cart.checkout.products));
    dispatch(
      openSnackbar({
        open: true,
        message: 'Add To Cart Success',
        variant: 'alert',
        alert: {
          color: 'success'
        },
        close: false
      })
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Grid container spacing={1}>
            <Grid size={12}>
              <Chip
                size="small"
                label={product.isStock ? 'In Stock' : 'Out of Stock'}
                color={product.isStock ? 'success' : 'error'}
                sx={{ borderRadius: '4px', textTransform: 'capitalize' }}
              />
            </Grid>
            <Grid size={12}>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
                <Typography variant="h3">{product.name}</Typography>
                <Chip size="small" label="New" color="primary" variant="outlined" />
              </Stack>
            </Grid>
          </Grid>
          <Avatar
            variant="rounded"
            sx={{
              cursor: 'pointer',
              bgcolor: 'grey.200',
              color: favorite ? 'error.main' : 'grey.600',
              ...theme.applyStyles('dark', { bgcolor: 'grey.500' })
            }}
            onClick={() => setFavorite(!favorite)}
          >
            {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </Avatar>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Typography variant="body2">{product.description}</Typography>
      </Grid>
      <Grid size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Rating
            name="simple-controlled"
            value={product.rating}
            icon={<StarTwoToneIcon fontSize="inherit" />}
            emptyIcon={<StarBorderTwoToneIcon fontSize="inherit" />}
            precision={0.1}
            readOnly
          />
          <Typography variant="caption" sx={{ lineHeight: 1 }}>
            ({product.rating})
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
          <Typography variant="h2" sx={{ color: 'primary.main' }}>
            ${product.offerPrice}
          </Typography>
          {product.salePrice && (
            <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
              ${product.salePrice}
            </Typography>
          )}
          <Typography variant="caption">(Inclusive of all taxes)</Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Divider />
      </Grid>
      <Grid size={12}>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, lg: 10 }}>
                <Table>
                  <TableBody sx={{ '& .MuiTableCell-root': { borderBottom: 'none' } }}>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body2">
                          Colors
                          <Typography component="span" sx={{ color: 'error.main' }}>
                            *
                          </Typography>
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          row
                          value={values.color}
                          onChange={handleChange}
                          aria-label="colors"
                          name="color"
                          id="color"
                          sx={{ ml: 1 }}
                        >
                          {product.colors &&
                            product.colors.map((item, index) => {
                              const colorsData = getColor(item);
                              return (
                                <FormControlLabel
                                  key={index}
                                  value={item}
                                  control={
                                    <Radio
                                      sx={{ p: 0.25 }}
                                      disableRipple
                                      checkedIcon={<Colors checked colorsData={colorsData} />}
                                      icon={<Colors colorsData={colorsData} />}
                                    />
                                  }
                                  label=""
                                />
                              );
                            })}
                        </RadioGroup>
                        {errors.color && (
                          <FormHelperText error id="standard-label-color">
                            {errors.color}
                          </FormHelperText>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2">
                            Size
                            <Typography component="span" sx={{ color: 'error.main' }}>
                              *
                            </Typography>
                          </Typography>
                          <Typography variant="caption" component={Link} to="#" sx={{ color: 'primary.main' }}>
                            Size Chart?
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <FormControl sx={{ minWidth: 120 }}>
                          <Select
                            id="size"
                            name="size"
                            value={values.size}
                            onChange={handleChange}
                            displayEmpty
                            slotProps={{ input: { 'aria-label': 'Without label' } }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {sizeOptions.map((option, index) => (
                              <MenuItem sx={{ p: 1.25 }} key={index} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {errors.size && (
                          <FormHelperText error id="standard-label-size">
                            {errors.size}
                          </FormHelperText>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Typography variant="body2">Quantity</Typography>
                      </TableCell>
                      <TableCell>
                        <Increment name="quantity" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>
              <Grid size={12}>
                <Grid container spacing={1}>
                  <Grid size={6}>
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      size={downSM ? undefined : 'large'}
                      startIcon={<ShoppingCartTwoToneIcon />}
                      onClick={addCart}
                    >
                      Add to Cart
                    </Button>
                  </Grid>
                  <Grid size={6}>
                    <Button type="submit" fullWidth color="secondary" variant="contained" size={downSM ? undefined : 'large'}>
                      Buy Now
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </FormikProvider>
      </Grid>
    </Grid>
  );
}

Colors.propTypes = { checked: PropTypes.bool, colorsData: PropTypes.array };

ProductInfo.propTypes = { product: PropTypes.any };
