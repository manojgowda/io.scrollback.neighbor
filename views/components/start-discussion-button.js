import React from "react-native";

const {
    StyleSheet,
    TouchableHighlight,
    View,
    Image
} = React;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 16,
        bottom: 16,
        height: 56,
        width: 56,
        borderRadius: 28
    },
    fab: {
        backgroundColor: "#ff9800",
        height: 56,
        width: 56,
        borderRadius: 28
    },
    icon: {
        height: 24,
        width: 24,
        margin: 16,
        opacity: 0.5
    }
});

export default class StartDiscussionButton extends React.Component {
    render() {
        return (
            <TouchableHighlight {...this.props} style={styles.container}>
                <View style={styles.fab}>
                    <Image source={require("image!ic_create_black")} style={styles.icon} />
                </View>
            </TouchableHighlight>
        );
    }
}

StartDiscussionButton.propTypes = {
    room: React.PropTypes.string.isRequired
};