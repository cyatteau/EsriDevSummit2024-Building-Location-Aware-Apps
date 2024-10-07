import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';

MapLibreGL.setAccessToken(null);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    flex: 1,
    alignSelf: 'stretch',
  },
});

const theApp = () => {
  return (
    <View style={styles.page}>
      <MapLibreGL.MapView
        style={styles.map}
        zoomEnabled
        styleURL="https://cyatteau.github.io/mapStyle/basemap-style-arcgis-streets.json">
        <MapLibreGL.Camera
          zoomLevel={14}
          animationMode={'flyTo'}
          centerCoordinate={[-116.53816, 33.82653]}
        />
      </MapLibreGL.MapView>
    </View>
  );
};

export default theApp;
