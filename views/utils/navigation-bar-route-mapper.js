import React from "react-native";
import AppbarTouchable from "../components/appbar-touchable";
import AppbarIcon from "../components/appbar-icon";
import routes from "./routes";

const {
	StyleSheet,
	Text
} = React;

const styles = StyleSheet.create({
	title: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 18,
		marginVertical: 14,
		marginRight: 64,
		paddingHorizontal: 4
	}
});

const NavigationBarRouteMapper = {
	LeftButton(route, navigator) {
		const goBack = () => {
			if (navigator.getCurrentRoutes().length > 1) {
				navigator.pop();
			} else {
				navigator.replace(routes.home());
			}
		};

		if (route.leftComponent) {
			return <route.leftComponent {...route.passProps} navigator={navigator} />;
		}

		if (route.index !== 0) {
			return (
				<AppbarTouchable onPress={goBack}>
					<AppbarIcon name="arrow-back" />
				</AppbarTouchable>
			);
		}
	},

	RightButton(route, navigator) {
		if (route.rightComponent) {
			return <route.rightComponent {...route.passProps} navigator={navigator} />;
		}

		return null;
	},

	Title(route, navigator) {
		if (route.titleComponent) {
			return <route.titleComponent {...route.passProps} navigator={navigator} />;
		}

		return (
			<Text style={styles.title} numberOfLines={1}>
				{route.title}
			</Text>
		);
	}
};

export default NavigationBarRouteMapper;
