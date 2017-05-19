# airport-api

## GET /api/airports
This endpoint returns a JSON-formatted list of airports within a given radius of coordinates. 

| Parameter  | Title  | Description |
| ------------- | ------------- | ------------- |
| lat  | Latitude  | [required] Center latitude for search. Must be -90 < lat < 90  |
| long  | Longitude  | [required] Center longitude for search. Must be -180 < long < 180  |
| r  | Radius  | [required] Radius (in meters) for search. Must be greater than 0  |

Example usage: /api/airports?lat=42.290763&long=-71.35368&r=20

Response Body
```
[
  {
    "id": 8280,
    "airport_name": "Norwood Memorial Airport",
    "city": "Norwood",
    "country": "United States",
    "iata_faa": "OWD",
    "icao": "KOWD",
    "latitude": 42.1905,
    "longitude": -71.1729,
    "altitude": 49,
    "timezone": "America/New_York",
    "createdAt": null,
    "updatedAt": null,
    "distance": 11.55201639072461
  },
  {
    "id": 3425,
    "airport_name": "Laurence G Hanscom Fld",
    "city": "Bedford",
    "country": "United States",
    "iata_faa": "BED",
    "icao": "KBED",
    "latitude": 42.47,
    "longitude": -71.289,
    "altitude": 133,
    "timezone": "America/New_York",
    "createdAt": null,
    "updatedAt": null,
    "distance": 12.813655172836809
  }
]
```

## GET /api/distance
This endpoint returns a distance (in meters) between two airports 

| Parameter  | Title  | Description |
| ------------- | ------------- | ------------- |
| apid1  | Airport 1 ID  | [required] Airport to check distance (in meters) from |
| apid2  | Airport 2 ID  | [required] Airport to check distance (in meters) to |

Example usage: /api/distance?apid1=8280&apid2=8265

Response Body
```
17418.874779062142
```

## GET /api/countries
This endpoint return a JSON-formatted response with the geographically closest airports between two countries.

| Parameter  | Title  | Description |
| ------------- | ------------- | ------------- |
| c1  | Country 1  | [required] Country to find nearest airport from  |
| c2  | Country 2  | [required] Country to find nearest airport to  |

Example usage: /api/countries?c1=United%20States&c2=Mexico

Response Body
```
[
  {
    "id": 7659,
    "airport_name": "Brown Field Municipal Airport",
    "city": "San Diego",
    "country": "United States",
    "iata_faa": "SDM",
    "icao": "KSDM",
    "latitude": 32.5723,
    "longitude": -116.98,
    "altitude": 526,
    "timezone": "America/Los_Angeles",
    "createdAt": null,
    "updatedAt": null
  },
  {
    "id": 1847,
    "airport_name": "General Abelardo L Rodriguez Intl",
    "city": "Tijuana",
    "country": "Mexico",
    "iata_faa": "TIJ",
    "icao": "MMTJ",
    "latitude": 32.5411,
    "longitude": -116.97,
    "altitude": 489,
    "timezone": "America/Tijuana",
    "createdAt": null,
    "updatedAt": null
  }
]
```

