import PropTypes from 'prop-types';
import { useState, useCallback, useMemo, memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// third party
import Map, { Layer, Source } from 'react-map-gl/mapbox';

// project imports
import MapControl from 'ui-component/third-party/map/MapControl';
import MapPopup from 'ui-component/third-party/map/MapPopup';

// ==============================|| HIGHLIGHT BY FILTER WITH HOVER TOOLTIP ||============================== //

function HighlightByFilter({ ...other }) {
  const theme = useTheme();

  const countiesLayer = {
    id: 'counties',
    type: 'fill',
    'source-layer': 'original',
    paint: {
      'fill-outline-color': theme.palette.grey[900],
      'fill-color': theme.palette.grey[900],
      'fill-opacity': 0.12
    },
    source: ''
  };

  const highlightLayer = {
    id: 'counties-highlighted',
    type: 'fill',
    source: 'counties',
    'source-layer': 'original',
    paint: {
      'fill-outline-color': theme.palette.error.main,
      'fill-color': theme.palette.error.main,
      'fill-opacity': 0.48
    }
  };

  const [hoverInfo, setHoverInfo] = useState(null);

  const onHover = useCallback((event) => {
    const county = event.features && event.features[0];

    if (county) {
      setHoverInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        countyName: county.properties?.COUNTY || ''
      });
    } else {
      setHoverInfo(null);
    }
  }, []);

  const selectedCounty = (hoverInfo && hoverInfo.countyName) || '';

  const filter = useMemo(() => ['in', 'COUNTY', selectedCounty], [selectedCounty]);

  return (
    <Map
      initialViewState={{
        latitude: 38.88,
        longitude: -98,
        zoom: 3
      }}
      minZoom={2}
      onMouseMove={onHover}
      onMouseLeave={() => setHoverInfo(null)}
      interactiveLayerIds={['counties']}
      {...other}
    >
      <MapControl />
      <Source type="vector" url="mapbox://mapbox.82pkq93d">
        <Layer beforeId="waterway-label" {...countiesLayer} />
        <Layer beforeId="waterway-label" {...highlightLayer} filter={filter} />
      </Source>

      {/* Tooltip-style hover popup */}
      {hoverInfo && hoverInfo.countyName && (
        <MapPopup
          longitude={hoverInfo.longitude}
          latitude={hoverInfo.latitude}
          closeButton={false}
          closeOnClick={false}
          anchor="top"
          offset={10}
        >
          <Typography variant="body2" sx={{ color: 'secondary.lighter' }}>
            {hoverInfo.countyName}
          </Typography>
        </MapPopup>
      )}
    </Map>
  );
}

export default memo(HighlightByFilter);

HighlightByFilter.propTypes = { other: PropTypes.any };
