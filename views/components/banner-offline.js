import React from "react-native";
import Banner from "./banner";

export default class BannerOffline extends React.Component {
	render() {
		const { connectionStatus } = this.props;

		let label;

		switch (connectionStatus) {
		case "offline":
			label = "You're offline";
			break;
		case "connecting":
			label = "Connecting...";
			break;
		default:
			label = "";
		}

		return (
			<Banner
				{...this.props}
				text={label}
				showClose={false}
			/>
		);
	}
}

BannerOffline.propTypes = {
	connectionStatus: React.PropTypes.oneOf([ "offline", "connecting", "online" ])
};