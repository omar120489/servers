import { merge } from 'lodash-es';
import type { Components, Theme } from '@mui/material/styles';

// Typed overrides (migrated)
import Button from './Button';
import Paper from './Paper';
import Dialog from './Dialog';
import DataGrid from './DataGrid';
import OutlinedInput from './OutlinedInput';
import InputBase from './InputBase';
import Tabs from './Tabs';
import TableCell from './TableCell';

// Legacy JS overrides (kept for now)
import Alert from './Alert';
import Autocomplete from './Autocomplete';
import Avatar from './Avatar';
import CardActions from './CardActions';
import CardContent from './CardContent';
import CardHeader from './CardHeader';
import Checkbox from './Checkbox';
import Chip from './Chip';
import DatePicker from './DatePicker';
import Divider from './Divider';
import DateTimePickerToolbar from './DateTimePickerToolbar';
import DialogTitle from './DialogTitle';
import InternalDateTimePickerTabs from './InternalDateTimePickerTabs';
import ListItemButton from './ListItemButton';
import ListItemIcon from './ListItemIcon';
import ListItemText from './ListItemText';
import PaginationItem from './PaginationItem';
import PickersTextField from './PickersTextField';
import Select from './Select';
import Slider from './Slider';
import TimelineContent from './TimelineContent';
import TimelineDot from './TimelineDot';
import Tooltip from './Tooltip';
import TreeItem from './TreeItem';
import Typography from './Typography';

export default function componentsOverrides(
  theme: Theme,
  borderRadius: number,
  outlinedFilled: boolean
): Components {
  return merge(
    Alert(theme),
    Autocomplete(theme, borderRadius),
    Avatar(theme),
    Button(theme),
    CardActions,
    CardContent(),
    CardHeader(theme),
    Checkbox(),
    Chip(theme),
    DataGrid(theme),
    DatePicker(),
    DateTimePickerToolbar(),
    Dialog(),
    DialogTitle(theme),
    Divider(theme),
    InputBase(theme),
    InternalDateTimePickerTabs(theme),
    ListItemButton(theme),
    ListItemIcon(theme),
    ListItemText(theme),
    OutlinedInput(theme, borderRadius, outlinedFilled),
    PaginationItem(),
    Paper(borderRadius),
    PickersTextField(theme, borderRadius, outlinedFilled),
    Select(),
    Slider(theme),
    TableCell(theme),
    Tabs(theme),
    TimelineContent(theme),
    TimelineDot(),
    Tooltip(theme),
    TreeItem(),
    Typography(theme)
  ) as Components;
}
