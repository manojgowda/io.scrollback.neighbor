import React from "react-native";
import Colors from "../../colors.json";
import Icon from "./icon";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	icon: {
		margin: 16,
		color: Colors.white
	}
});

export default class AppbarIcon extends React.Component {
	render() {
		return (
			<Icon
				{...this.props}
				style={[ styles.icon, this.props.style ]}
				size={24}
			/>
		);
	}
}
