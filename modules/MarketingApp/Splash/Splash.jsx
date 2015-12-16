import {Component, PropTypes} from 'react';
import ReactDriveIn from 'react-drive-in';

import * as SplashStyles from "./SplashStyles";
import style from './Splash.scss';
import DefaultLayout from "MarketingApp/layouts/DefaultLayout/DefaultLayout";
import CoverageMap from "MarketingApp/CoverageMap/CoverageMap";

export default class Splash extends Component {
	render () {
		return (
			<DefaultLayout>
				<div key="marketing-splash-container" style={SplashStyles.ContainerStyle} className="marketing-splash-container">
					<div style={{width: "100%"}}>
						<div className="intro-text">
							<h1>
								Tesloop
							</h1>
							<h2>
								Sustainable Travel for Everyone.
							</h2>
						</div>
						<div className="video-container">
							<ReactDriveIn show="/videos/tesla-drawing-video.mp4" poster="/images/tesla-drawing.png" loop={false}/>
						</div>
						<div className="call-to-action">
							<a className="book-action">Book a Trip</a>
							<a className="learn-more-action">Learn More</a>
						</div>
					</div>
					<div style={SplashStyles.pane}>
						<CoverageMap/>
					</div>
				</div>
			</DefaultLayout>
		)
	}
}
