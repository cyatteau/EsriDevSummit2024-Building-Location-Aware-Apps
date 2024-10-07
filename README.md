# Building Location-Aware Applications for Various Use Cases

## Overview

In this session, we explore a variety of applications that can be built using the ArcGIS Platform, catering to both anonymous users and those without an ArcGIS identity. We demonstrate how to develop location-based solutions, with and without maps, utilizing modern technologies, different mapping SDKs, and location services.

## Requirements

- **ArcGIS Location Platform Account**: You can sign up for an account [here](https://developers.arcgis.com/sign-up/).
- **ArcGIS Access Token**: Instructions for generating an access token can be found [here](https://developers.arcgis.com/rest/security/overview.htm).

## Demos

### [Grocery Store Demo](https://github.com/cyatteau/EsriDevSummit2024-Building-Location-Aware-Apps/tree/main/grocery-store-demo)
- **Description**: This Grocery Delivery demo app focuses on efficient grocery deliveries by showcasing the **Closest Facility Routing** feature, which automatically selects the nearest distribution center for each order using the ArcGIS Routing Service. As grocery orders are added, the system recalculates the most optimized route in real-time, ensuring quick deliveries. Additionally, the **Service Areas** feature visually represents delivery zones on the map, indicating areas reachable within 5 and 10 minutes.
- **Technologies Used**: ArcGIS REST JS, MapLibre GL JS, Calcite Components

### [Real Estate Demo](https://github.com/cyatteau/EsriDevSummit2024-Building-Location-Aware-Apps/tree/main/real-estate-demo)
- **Description**: This real estate app allows users to explore properties in Palm Springs. Properties are displayed using a hosted Feature Layer, with buttons for filtering based on the number of bathrooms or bedrooms and sorting by price through SQL queries. A custom basemap was created using the **Vector Tile Style Editor** to match the company’s branding. The app also implements spatial querying to show condos within a specified area, and users can click on a property to get routing directions via the **directionsWidget**.
- **Technologies Used**: ArcGIS Maps SDK for JS, Calcite Components

### [Bonus Demo](https://github.com/cyatteau/EsriDevSummit2024-Building-Location-Aware-Apps/tree/main/maplibre-react-native-demo)
- **Description**: This React Native app provides an interactive mapping experience. Users can switch between different basemap styles, with the zoom level set to 17 for better visibility of places. The app integrates the **places service**, allowing users to click on a place to fetch its details, and employs the **geocoding REST API** for location searches. Additionally, the **Geoenrichment service** displays global demographic details about locations clicked on the map.
- **Technologies Used**: React Native, MapLibre GL JS, ArcGIS Places Service, ArcGIS GeoEnrichment Service

## Contact

For questions or feedback, please reach out at [cyatteau@esri.com](mailto:cyatteau@esri.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/courtneyyatteau/).
