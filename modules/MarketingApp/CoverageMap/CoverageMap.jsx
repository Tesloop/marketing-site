import {Component, PropTypes} from 'react';
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');
import {divIcon} from 'leaflet';
import {
	Map,
	Marker,
	Popup,
	TileLayer,
	CircleMarker,
	Polyline
} from 'react-leaflet';
import lunr from 'lunr';
// Marketing Site
import * as CoverageMapStyles from "./CoverageMapStyles";
import style from "./CoverageMap.scss";

var routes = [
	{
		originCityId: 0,
		destinationCityId: 1
	}, {
		originCityId: 0,
		destinationCityId: 2
	}, {
		originCityId: 0,
		destinationCityId: 3
	}
]

// Already Available Cities
var tesloopCities = [
	{
		state: "California",
		city: "Las Vegas",
		id: 0,
		latitude: 36.1215,
		longitude: -115.1739
	}, {
		state: "California",
		city: "Los Angeles",
		id: 1,
		latitude: 34.0500,
		longitude: -118.2500
	}, {
		state: "California",
		city: "Phoenix",
		id: 2,
		latitude: 34.4500,
		longitude: -112.0667
	}, {
		state: "California",
		city: "San Fransisco",
		id: 3,
		latitude: 37.7833,
		longitude: -122.4167
	}
]
var tesloopCitiesSearchIndex = lunr(function() {
	this.field('city', {boost: 10});
	this.field('state');
});
tesloopCities.forEach(function(tesloopCity) {
	tesloopCitiesSearchIndex.add(tesloopCity);
});

// Possible Cities
var possibleTesloopCities = [
	{
		state: "California",
		city: "Sacramento",
		id: 0,
		latitude: 38.5556,
		longitude: -121.4689
	}, {
		state: "California",
		city: "Portland",
		id: 1,
		latitude: 45.5200,
		longitude: -122.6819
	}, {
		state: "California",
		city: "Seattle",
		id: 2,
		latitude: 47.6097,
		longitude: -122.3331
	}
]
var possibleTesloopCitiesSearchIndex = lunr(function() {
	this.field('city', {boost: 10});
	this.field('state');
});
possibleTesloopCities.forEach(function(possibleTesloopCity) {
	possibleTesloopCitiesSearchIndex.add(possibleTesloopCity);
})

export default React.createClass({
	mixins: [ReactMeteorData],
	zoom: 4,
	latitude: 39.50,
	longitude: -98.35,
	lastLatLng: [],
	lastZoom: 0,
	getInitialState() {
		var windowHeight, windowWidth;
		if (typeof window !== "undefined") {
			windowHeight = $(window)[0].innerHeight;
			windowWidth  = $(window)[0].innerWidth;
		} else {
			windowHeight = 1920;
			windowWidth  = 1080;
		}
		console.log("Window Width", windowWidth);
		return {
			searchInput: "",
			searchResults: [],
			possibleSearchResults: [],
			possibleNewCities: [],
			routeCityId: -1,
			windowWidth: windowWidth,
			windowHeight: windowHeight
		}
	},
	getMeteorData() {
		console.log("Getting Meteor Data");
		return {}
	},
	componentWillMount() {
		this._throttleUpdateDimensions = _.throttle(this._updateDimensions, 250);
		if (typeof window !== "undefined") {
			window.addEventListener("resize", this._throttleUpdateDimensions);
		}
	},
	componentWillUnmount () {
		if (typeof window !== "undefined") {
			window.removeEventListener("resize", this._throttleUpdateDimensions);
		}
	},
	componentWillUpdate(nextProps, nextState) {
		console.log("CoverageMap: componentWillUpdate cycle");
		console.log("WindowWidth", this.state.windowWidth)
		if (nextState.routeCityId === -1) {
			this.latitude = 39.50;
			this.longitude = -98.35;
			if (this.state.windowWidth > 900) {
				this.zoom = 4;
			} else
			if (this.state.windowWidth > 550) {
				this.zoom = 3;
			} else {
				this.zoom = 3;
			}
		} else {
			var selectedCity = tesloopCities[nextState.routeCityId]
			this.latitude = selectedCity.latitude;
			this.longitude = selectedCity.longitude;
			if (this.state.windowWidth > 900) {
				this.zoom = 6;
			} else
			if (this.state.windowWidth > 550) {
				this.zoom = 5;
			} else {
				this.zoom = 4;
			}
		}
	},
	render() {
		console.log("CoverageMap: render cycle")
		const selectedCity = tesloopCities[this.state.routeCityId]
		const position = [this.latitude, this.longitude];
// Set Initial State on Last LatLng/Position if not set
		if (this.lastLatLng.length == 0) {
			this.lastLatLng = position;
		};
		if (this.lastZoom == 0) {
			this.lastZoom = this.zoom;
		};
		const mapboxAccessToken = 'pk.eyJ1Ijoiam9yZGFuZ2Fyc2lkZSIsImEiOiJjaWZpd3Y3bGFjMm5scnlseHl3NHM4ZWc1In0.5clIBRNdc4THWZmUx9yswg';

// Make the Location Markers Smaller if Zoomed
		var markerRadius;
		if (this.zoom < 5) {
			markerRadius = 5;
		} else {
			markerRadius = 8;
		}
// Create Route Lines if a City is Selected
		var routeLines = [];
		if (this.state.routeCityId > -1) {
			var cityRoutes = _.filter(routes, (route) => {
				return route.originCityId == this.state.routeCityId
			})
			cityRoutes.forEach(function(cityRoute) {
				const originCity = tesloopCities[cityRoute.originCityId];
				const destinationCity = tesloopCities[cityRoute.destinationCityId];
				const positions = [
					[
						originCity.latitude, originCity.longitude
					],
					[destinationCity.latitude, destinationCity.longitude]
				];
				routeLines.push(<Polyline key = {
					"tesloop-route-" + originCity.city + destinationCity.city
				}
				positions = {
					positions
				}
				color = "#01f8ff" opacity = {
					1
				}
				weight = {
					1
				} />)
			});
		}
		var searchDisplay;
		if (this.state.routeCityId > -1) {
			searchDisplay = <div>
				<div style={CoverageMapStyles.locationInputContainer}>
					<input style={CoverageMapStyles.locationInput} type="text" value={selectedCity.city} disabled/>
					<IconButton style={CoverageMapStyles.rightIconContainer} onClick={this._clearCity}>
						<FontIcon style={CoverageMapStyles.rightIcon} className="mdi mdi-close"/>
					</IconButton>
				</div>
			</div>
		} else {
			searchDisplay = <div>
				<div style={CoverageMapStyles.locationInputContainer}>
					<input style={CoverageMapStyles.locationInput} type="text" placeholder="Search Tesloop Cities" onChange={this._searchChange} onKeyPress={this._searchKepress} value={this.state.magnify}/>
					<IconButton style={CoverageMapStyles.rightIconContainer} onClick={this._searchClick}>
						<FontIcon style={CoverageMapStyles.rightIcon} className="mdi mdi-magnify"/>
					</IconButton>
				</div>
				<div style={CoverageMapStyles.searchResultsContainer}>
					<ul style={CoverageMapStyles.searchResults}>
						{this
							.state
							.searchResults
							.map((searchResult) => {
								return <li className="search-result" key={"search-result-" + searchResult.id} style={CoverageMapStyles.searchResult} onClick={this._cityClick}>{searchResult.city}</li>
							})}
					</ul>
					{/*
                    <ul style={CoverageMapStyles.searchResults}>
                      {this.state.searchResults.map(function(searchResult) {
                        return <li key={"search-result-" + searchResult.id} style={CoverageMapStyles.searchResult}>{searchResult.text}</li>
                      })}
                    </ul>
                    */}
				</div>
			</div>
		}
		return (
			<div key="marketing-coverage-map" style={CoverageMapStyles.container}>
				{searchDisplay}
				<Map ref="map" style={CoverageMapStyles.mapContainer} center={this.lastLatLng} zoom={this.lastZoom} zoomControl={false} dragging={false} touchZoom={false} doubleClickZoom={false} scrollWheelZoom={false}>
					<TileLayer url={"http://api.tiles.mapbox.com/v4/jordangarside.3f8c50e9/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken} detectRetina={true}/>

					{tesloopCities.map((tesloopCity) => {
						var center = [tesloopCity.latitude, tesloopCity.longitude];
						let cityNameMarker;
						if (this.state.routeCityId > -1) {
							let icon = divIcon({className: "city-label", html: tesloopCity.city, iconSize: 200});
							cityNameMarker = <Marker icon={icon} position={center} />
						}
						return <CircleMarker key={"tesloop-city-" + tesloopCity.city + "-marker"} center={center} fillColor='#FFF' radius={markerRadius} stroke={false} fillOpacity={0.7} html={"<div>hello</div>"}>
							{cityNameMarker}
						</CircleMarker>
					})}
					{possibleTesloopCities.map((possibleTesloopCity) => {
						return <CircleMarker key={"possible-tesloop-city-" + possibleTesloopCity.city + "-marker"} center={[possibleTesloopCity.latitude, possibleTesloopCity.longitude]} fillColor='gray' radius={markerRadius} stroke={false} fillOpacity={0.9}>
						</CircleMarker>
					})}
					{routeLines}
				</Map>
			</div>
		)
	},
	componentDidUpdate() {
		console.log("CoverageMap: componentDidUpdate cycle")
		var newPosition = [this.latitude, this.longitude];
		var newZoom = this.zoom;
		let leafletElement = this
			.refs
			.map
			.getLeafletElement();
		leafletElement.setView(newPosition, newZoom);
		this.lastZoom = newZoom;
		this.lastLatLng = newPosition;
	},
	_updateDimensions() {
		if (typeof window !== "undefined") {
			this.setState({
				windowWidth: $(window)[0].innerWidth,
				windowHeight: $(window)[0].innerHeight
			});
		}
	},
	_searchChange(event) {
		var searchText = event.target.value;
		// Update Input Value
		this.setState({searchInput: searchText});
		// Update Search Results
		var lunrCityResults = tesloopCitiesSearchIndex.search(searchText);
		var citySearchResults = [];
		lunrCityResults.forEach(function(lunrCityResult) {
			citySearchResults.push(tesloopCities[lunrCityResult.ref]);
		});
		this.setState({searchResults: citySearchResults});
	},
	_searchKeypress(event) {
		// If Enter is Pressed, select top city
		if (event.which == 13 && this.state.searchResults.length > 0){
			var topCity = this.state.searchResults[0];
			this.setState({routeCityId: topCity.id});
		}
	},
	_cityClick(event) {
		var city = event.target.textContent;
		var location = _.findWhere(tesloopCities, {city: city});
		this.setState({routeCityId: location.id});
	},
	_searchClick(event) {
		var topCity = this.state.searchResults[0];
		this.setState({routeCityId: topCity.id});
	},
	_clearCity(event) {
		this.setState({routeCityId: -1});
	}
})
