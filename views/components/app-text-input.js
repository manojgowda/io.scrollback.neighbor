import React from "react-native";

const {
	StyleSheet,
	TextInput
} = React;

const styles = StyleSheet.create({
	text: {
		fontSize: 14,
		lineHeight: 21
	}
});

export default class AppText extends React.Component {
	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		return (
			<TextInput
				{...this.props}
				style={[ styles.text, this.props.style ]}
				ref={c => this._root = c}
			>
				{this.props.children}
			</TextInput>
		);
	}
}

AppText.propTypes = {
	children: React.PropTypes.element.isRequired
};
