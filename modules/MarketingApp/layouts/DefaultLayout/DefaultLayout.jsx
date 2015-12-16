import {Component, PropTypes} from 'react';
const AppBar = require('material-ui/lib/app-bar');
const LeftNav = require('material-ui/lib/left-nav');
const FlatButton = require('material-ui/lib/flat-button');
const FontIcon = require('material-ui/lib/font-icon');
const IconButton = require('material-ui/lib/icon-button');
const MenuItem = require('material-ui/lib/menu/menu-item');
const Styles = require('material-ui/lib/styles');

var {ThemeManager} = Styles;

import * as LayoutStyles from "./DefaultLayoutStyles";
import TesloopTheme from "MarketingApp/TesloopTheme";
import style from "./DefaultLayout.scss";

class DefaultLayout extends Component {
	constructor (props) {
		super(props);

		this.state = {};
		if (typeof window !== "undefined") {
			this.state.height = $(window)[0].innerHeight;
			this.state.width = $(window)[0].innerWidth;
		} else {
			this.state.height = 0;
			this.state.width = 0;
		}
	}
	render () {
		console.log("Rerendering Component...");
		var menuItems = [
			{
				type: MenuItem.Types.LINK,
				payload: 'https://book.tesloop.com',
				text: 'Book'
			}, {
				type: MenuItem.Types.LINK,
				payload: 'https://blog.tesloop.com',
				text: 'About'
			}, {
				type: MenuItem.Types.LINK,
				payload: 'https://blog.tesloop.com',
				text: 'Blog'
			}, {
				type: MenuItem.Types.LINK,
				payload: 'https://blog.tesloop.com',
				text: 'Contact'
			}
		]
		var header;
		if (this.state.width > 600) {
			header = <header style={LayoutStyles.headerStyle}>
				<a style={LayoutStyles.mainHeaderLink} href="/">
					<img style={LayoutStyles.logoImageStyle} src="/images/tesloop_left_logo.png"/>
					<h2 style={LayoutStyles.logoTextStyle}>tesloop</h2>
				</a>
				<ul style={LayoutStyles.headerLinkContainerStyle}>
					{menuItems
						.map(function(menuItem) {
							return <li key={"header" + menuItem.text + "Link"} style={LayoutStyles.headerLinkListItemStyle}>
								<a style={LayoutStyles.headerLink} href={menuItem.route}>{menuItem.text}</a>
							</li>
						})}
				</ul>
			</header>
		} else {
			header = <header style={LayoutStyles.headerStyle}>
				<IconButton onTouchTap={this._handleLeftNavToggle}>
					<FontIcon style={LayoutStyles.drawerToggle} className="mdi mdi-menu"/>
				</IconButton>
				<h2 style={LayoutStyles.logoTextStyle}></h2>
			</header>
		}
		return (
			<div className="default-layout-container" style={LayoutStyles.layoutContainerStyle}>
				<LeftNav ref="leftNav" docked={false} style={LayoutStyles.leftNav} menuItemClassNameLink="left-nav-menu-item" menuItems={menuItems} className="default-left-nav"/>
				{header}
				{this.props.children}
				<footer>
					<div className="top-section">
						{menuItems
							.map(function(menuItem) {
								return <a className="footer-link" key={"footer" + menuItem.text + "Link"} href={menuItem.route}>{menuItem.text}</a>
							})}
					</div>
					<div className="bottom-section">
						<a className="footer-link">Some Text</a>
					</div>
				</footer>
			</div>
		)
	}
	componentWillMount () {
		this._throttleUpdateDimensions = _.throttle(this._updateDimensions, 500);
		if (typeof window !== "undefined") {
			window.addEventListener("resize", this._throttleUpdateDimensions);
		}
	}
	componentWillUnmount () {
		if (typeof window !== "undefined") {
			window.removeEventListener("resize", this._throttleUpdateDimensions);
		}
	}
// Events
	_handleLeftNavToggle = () => {
		return this
			.refs
			.leftNav
			.toggle();
	}
// Helpers
	_updateDimensions = () => {
		console.log("Updating Dimensions...");
		if (typeof window !== "undefined") {
			this.setState({
				width: $(window)[0].innerWidth,
				height: $(window)[0].innerHeight
			});
		}
	}
// Contexts
	getChildContext () {
		let theTheme = ThemeManager.getMuiTheme(TesloopTheme);
		console.log(theTheme)
		return {
			muiTheme: theTheme
		};
	}
};
DefaultLayout.propTypes = {
	children: PropTypes.any.isRequired
};
DefaultLayout.childContextTypes = {
	muiTheme: React.PropTypes.object
};

export default DefaultLayout;
