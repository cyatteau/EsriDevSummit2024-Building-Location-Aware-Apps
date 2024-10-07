import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import {LogBox} from 'react-native';

// Ignoring log notifications
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
MapLibreGL.setAccessToken(null);

// Updated styles to accommodate both functionalities
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
  inputContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 52,
    right: 8, // Align to the right
    zIndex: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center', // Align items vertically
    elevation: 5,
    width: 280,
  },
  input: {
    height: 45,
    fontSize: 16,
    flex: 1, // Take up remaining space
  },
  zoomContainer: {
    flexDirection: 'column', // Change to column direction
    alignItems: 'center', // Center-align the buttons
    position: 'absolute',
    top: 15,
    left: 10,
    zIndex: 2,
  },
  zoomButton: {
    backgroundColor: 'white',
    borderColor: '#007ac2',
    borderWidth: 1,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom: -1.5,
    shadowOpacity: 0.3, // Slightly more visible shadow
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 4, // Slightly elevated
  },
  zoomButtonActive: {
    // New style for active state
    backgroundColor: '#e8f0fe', // Lighter blue on press
  },

  zoomButtonText: {
    color: '#777b7e',
    fontSize: 20,
  },
  buttonText: {
    fontSize: 15,
    backgroundColor: '#007ac2',
    color: 'white',
    borderRadius: 15,
    paddingVertical: 7,
    paddingHorizontal: 9,
    left: 18,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  factContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    margin: 10,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {height: 2, width: 2},
    elevation: 3,
  },
  factText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 5,
  },
  factTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007ac2',
  },
  popupContainer: {
    position: 'absolute',
    top: 300,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: {height: 2, width: 2},
  },
  popupTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginLeft: 1,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  categoryLabel: {
    marginRight: 10,
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 5,
  },
  popupId: {
    marginLeft: 4,
    marginTop: 4,
  },
  annotationContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  annotationFill: {
    width: 14,
    height: 14,
    backgroundColor: '#007bff',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 2,
    shadowOpacity: 1,
    elevation: 3,
  },
  styleButton: {
    marginHorizontal: 3,
    borderColor: '#D3D3D3',
    borderWidth: 0.5,
    borderRadius: 8,
    marginTop: 3,
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  styleButtonText: {
    color: '#fff',
  },
  toggleButton: {
    margin: 5,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  toggleButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 15,
  },
});

const App = () => {
  const [styleURL, setStyleURL] = useState(
    'https://cyatteau.github.io/mapStyle/basemap-style-arcgis-community.json',
  );
  const [basemapStyle, setBasemapStyle] = useState('community');
  const [zoomLevel, setZoomLevel] = useState(12);
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fact, setFact] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [zoomInHovered, setZoomInHovered] = useState(false);
  const [zoomOutHovered, setZoomOutHovered] = useState(false);
  const [placeInfo, setPlaceInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [circleCenter, setCircleCenter] = useState(null);
  const [currentZoom, setCurrentZoom] = useState();
  const mapRef = useRef(null);
  const [isNavigationStyle, setIsNavigationStyle] = useState(false);
  const [showDemographicInfo, setShowDemographicInfo] = useState(false);
  const [showPlaceDetails, setShowPlaceDetails] = useState(false);

  const basemapStyles = {
    community:
      'https://cyatteau.github.io/mapStyle/basemap-style-arcgis-community.json',
    streets:
      'https://cyatteau.github.io/mapStyle/basemap-style-arcgis-streets.json',
    navigation:
      'https://cyatteau.github.io/mapStyle/basemap-style-arcgis-navigation.json',
    places:
      'https://cyatteau.github.io/mapStyle/basemap-style-arcgis-navigation-places.json',
  };

  const changeBasemapStyle = style => {
    setBasemapStyle(style);
    setStyleURL(basemapStyles[style]);
    // Check if the selected style is 'places'
    if (style === 'places') {
      setZoomLevel(17); // Set to 17 for the 'places'
    } else {
      setZoomLevel(12); // Reset to default
    }
  };

  // Add a toggle function for the demographic info checkbox
  const toggleDemographicInfo = () => {
    setShowDemographicInfo(!showDemographicInfo);
    setShowPopup(false);

    // Optionally, clear the circle and fact when the demographic info is disabled
    if (showDemographicInfo) {
      setCircleCenter(null);
      setFact('');
    }

    if (!showDemographicInfo) {
      setShowDemographicInfo(true);
      setZoomLevel(12);
      setShowPlaceDetails(false);
    } else {
      setShowDemographicInfo(false);
      setCircleCenter(null);
      setFact('');
    }
  };

  const togglePlaceDetails = () => {
    if (basemapStyle === 'places') {
      setShowPlaceDetails(!showPlaceDetails);
      // Adjust zoom level when showPlaceDetails is checked
      if (!showPlaceDetails) {
        setZoomLevel(17); // Set zoom level to 17 when place details are shown
        setShowDemographicInfo(false); // Automatically uncheck Show Demographic Info
        setCircleCenter(null); // Clear the circle center
        setFact(''); // Clear the demographic facts
      }
    } else {
      alert('Place Details can only be toggled in Places style.');
    }
  };

  const onZoomChange = async () => {
    const zoom = await mapRef.current.getZoom();
    setCurrentZoom(zoom);
  };

  const zoomIn = () => {
    setZoomLevel(prevZoomLevel => prevZoomLevel + 0.5);
  };

  const zoomOut = () => {
    setZoomLevel(prevZoomLevel => Math.max(prevZoomLevel - 0.25, 0));
  };

  const searchLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const geocodeUrl = `https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=pjson&SingleLine=${location}&token=YOUR_API_KEY`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (!geocodeResponse.ok || geocodeData.candidates.length === 0) {
        throw new Error('Location not found.');
      }

      const longitude = geocodeData.candidates[0].location.x;
      const latitude = geocodeData.candidates[0].location.y;

      setSelectedLocation({longitude, latitude});
    } catch (error) {
      console.error(error);
      setError('Failed to search location');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDemographicData = async (longitude = null, latitude = null) => {
    if (!showDemographicInfo) return;
    setIsLoading(true);
    setError(null);

    try {
      if (!longitude || !latitude) {
        const geocodeUrl = `https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=pjson&SingleLine=${location}&token=AAPK6380af088b344e129f58521554769edbdx36s2ZyRRdVvZZUtlyJLJ8xwY3T1AFvjl7vfl7aVlDRduhtQO-mujlgznaSZ_TW`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        if (!geocodeResponse.ok || geocodeData.candidates.length === 0) {
          throw new Error('Location not found.');
        }

        longitude = geocodeData.candidates[0].location.x;
        latitude = geocodeData.candidates[0].location.y;
      }

      setSelectedLocation({longitude, latitude});
      setCircleCenter([longitude, latitude]); // Set circle center here to reflect the searched or clicked location

      const enrichmentUrl = `https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/GeoEnrichment/enrich?f=json&token=AAPK6380af088b344e129f58521554769edbdx36s2ZyRRdVvZZUtlyJLJ8xwY3T1AFvjl7vfl7aVlDRduhtQO-mujlgznaSZ_TW&studyAreas=[{"geometry":{"x":${longitude},"y":${latitude}}}]`;
      const enrichmentResponse = await fetch(enrichmentUrl);
      const enrichmentData = await enrichmentResponse.json();

      if (!enrichmentResponse.ok) {
        throw new Error('Failed to fetch demographic data.');
      }

      const demographicInfo =
        enrichmentData.results[0].value.FeatureSet[0].features
          .map(feature => {
            const attrs = feature.attributes;
            return (
              `• Total Population: ${attrs.TOTPOP}\n` +
              `• Average Household Size: ${attrs.AVGHHSZ}\n` +
              `• Total Males: ${attrs.TOTMALES}\n` +
              `• Total Females: ${attrs.TOTFEMALES}`
            );
          })
          .join('\n\n');

      setFact(demographicInfo);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapPress = async e => {
    const {coordinates} = e.geometry; // [longitude, latitude]
    if (showDemographicInfo) {
      setCircleCenter(coordinates);
      fetchDemographicData(coordinates[0], coordinates[1]);
    }
    if (showPlaceDetails) {
      fetchPlacesNearPoint(coordinates[0], coordinates[1]);
    }
  };

  const calculateCircleRadiusInPixels = zoomLevel => {
    // This is a heuristic function. You may need to adjust the baseRadius and scaleFactor
    // based on experimentation to match the visual scale of your map at different zoom levels.
    const baseRadius = 410; // Base radius at a reference zoom level (e.g., at zoom level 14)
    const referenceZoomLevel = 14;
    const scaleFactor = 2; // Determines how the radius grows/shrinks per zoom level change

    // Calculate the radius adjustment factor based on the current zoom level
    const radiusAdjustmentFactor = Math.pow(
      scaleFactor,
      zoomLevel - referenceZoomLevel,
    );

    // Adjust the base radius based on the current zoom level
    return baseRadius * radiusAdjustmentFactor;
  };

  const fetchPlacesNearPoint = async (longitude, latitude) => {
    setIsLoading(true);
    setError(null);

    const token =
      'YOUR_API_KEY';
    const url = `https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/places/near-point?x=${longitude}&y=${latitude}&radius=7&token=${token}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }

      console.log(data.results[0]);
      setPlaceInfo(data.results[0]);
      setShowPopup(true);
    } catch (error) {
      console.error(error);
      setError('Failed to load places');
    } finally {
      setIsLoading(false);
    }
  };
  const PlacePopup = ({place}) => {
    // Map over place.categories to extract and render the label of each category
    const categoryLabels = place.categories.map((category, index) => (
      <Text key={index} style={styles.categoryLabel}>
        {category.label}
      </Text>
    ));

    return (
      <View style={styles.popupContainer}>
        <Text style={styles.popupTitle}>{place.name}</Text>
        <View style={styles.categoriesContainer}>{categoryLabels}</View>
        <Text style={styles.popupId}>Place ID: {place.placeId}</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowPopup(false)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <MapLibreGL.MapView
        ref={mapRef}
        style={styles.map}
        onRegionDidChange={onZoomChange} // This might vary based on the exact method name in the library
        zoomEnabled
        styleURL={basemapStyles[basemapStyle]}
        onPress={e => {
          const [longitude, latitude] = e.geometry.coordinates;
          fetchDemographicData(longitude, latitude);
          handleMapPress(e);
        }}>
        {selectedLocation && (
          <MapLibreGL.MarkerView
            key={`${selectedLocation.longitude}-${selectedLocation.latitude}`}
            coordinate={[
              selectedLocation.longitude,
              selectedLocation.latitude,
            ]}>
            {/* Customize your marker appearance here */}
            <View style={styles.annotationContainer}>
              <View style={styles.annotationFill} />
            </View>
          </MapLibreGL.MarkerView>
        )}
        <MapLibreGL.Camera
          zoomLevel={zoomLevel}
          animationMode={'flyTo'}
          centerCoordinate={
            selectedLocation
              ? [selectedLocation.longitude, selectedLocation.latitude]
              : [-116.546459, 33.821037]
          }
        />
        {circleCenter && (
          <MapLibreGL.ShapeSource
            id="circleSource"
            shape={{
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    coordinates: circleCenter, // Use the updated circle center
                  },
                },
              ],
            }}>
            <MapLibreGL.CircleLayer
              id="circleLayer"
              sourceID="circleSource"
              style={{
                circleRadius: calculateCircleRadiusInPixels(currentZoom), // Adjust the radius based on zoom level
                circleColor: 'rgba(255, 18, 202, 0.5)', // Customize as needed
                circleOpacity: 0.8,
                circleStrokeWidth: 3,
                circleStrokeColor: 'rgba(0, 0, 0, 0.4)', // Customize as needed
              }}
            />
          </MapLibreGL.ShapeSource>
        )}
      </MapLibreGL.MapView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          placeholderTextColor="#777b7e"
          onChangeText={setLocation}
          value={location}
          onSubmitEditing={searchLocation}
        />
        <TouchableOpacity style={styles.button} onPress={searchLocation}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        style={{position: 'absolute', top: 7, zIndex: 2, right: 7}}>
        {Object.keys(basemapStyles).map(style => (
          <TouchableOpacity
            key={style}
            style={{
              ...styles.styleButton,
              backgroundColor: basemapStyle === style ? '#007ac2' : 'gray',
            }}
            onPress={() => changeBasemapStyle(style)}>
            <Text style={styles.styleButtonText}>
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.toggleButtonsContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Show Place Details: </Text>
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              backgroundColor:
                showPlaceDetails && basemapStyle === 'places'
                  ? '#007bff'
                  : 'transparent',
              borderColor: '#007ac2',
              borderWidth: 1,
              borderRadius: 3,
              marginHorizontal: 8,
            }}
            onPress={togglePlaceDetails}
            disabled={basemapStyle !== 'places'}>
            {showPlaceDetails && basemapStyle === 'places' && (
              <View style={{flex: 1, backgroundColor: '#007bff'}} />
            )}
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Show Demographic Info: </Text>
          <TouchableOpacity
            style={{
              width: 20,
              height: 20,
              backgroundColor: showDemographicInfo ? '#007bff' : 'transparent',
              borderColor: '#007ac2',
              borderWidth: 1,
              borderRadius: 3,
              marginHorizontal: 8,
            }}
            onPress={toggleDemographicInfo}>
            {showDemographicInfo && (
              <View style={{flex: 1, backgroundColor: '#007bff'}} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.zoomContainer}>
        <TouchableOpacity
          style={[
            styles.zoomButton,
            {backgroundColor: zoomInHovered ? '#e9f0fe' : 'white'},
          ]}
          onPress={zoomIn}
          onPressIn={() => setZoomInHovered(true)}
          onPressOut={() => setZoomInHovered(false)}
          activeOpacity={1}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.zoomButton,
            {backgroundColor: zoomOutHovered ? '#e9f0fe' : 'white'},
          ]}
          onPress={zoomOut}
          onPressIn={() => setZoomOutHovered(true)}
          onPressOut={() => setZoomOutHovered(false)}
          activeOpacity={1}>
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>
      {fact && (
        <View style={styles.factContainer}>
          <Text style={styles.factTitle}>Demographic Information</Text>
          {fact.split('\n\n').map((paragraph, index) => (
            <Text key={index} style={styles.factText}>
              {paragraph}
            </Text>
          ))}
        </View>
      )}
      {showPopup && placeInfo && <PlacePopup place={placeInfo} />}
    </View>
  );
};

export default App;
