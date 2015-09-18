/* global fetch */

import React from "react-native";
import Loading from "./loading";
import Linking from "../modules/linking";

const {
    StyleSheet,
    View,
    Image,
    TouchableHighlight
} = React;

const styles = StyleSheet.create({
    container: {
        height: 240
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    progress: {
        height: 36,
        width: 36
    },
    thumbnail: {
        height: 240,
        justifyContent: "center",
        alignItems: "center"
    },
    play: {
        backgroundColor: "transparent",
        height: 64,
        width: 64,
        borderRadius: 32,
        opacity: 0.7
    }
});

export default class Embed extends React.Component {
    componentDidMount() {
        fetch(this.props.endpoint)
            .then(response => response.json())
            .then(embed => this.setState({ embed }));
    }

    onPress() {
        Linking.openURL(this.props.uri);
    }

    render() {
        return (
            <View {...this.props} style={[ styles.container, this.props.style ]}>
                {this.state && this.state.embed && this.state.embed.thumbnail_url ?
                    (<TouchableHighlight onPress={this.onPress.bind(this)}>
                        <Image source={{ uri: this.state.embed.thumbnail_url }} style={styles.thumbnail}>
                            <Image source={require("image!embed_play")} style={styles.play} />
                        </Image>
                    </TouchableHighlight>) :
                    (<View style={styles.overlay}>
                        <Loading style={styles.progress} />
                    </View>)
                }
            </View>
        );
    }
}

Embed.propTypes = {
    uri: React.PropTypes.string.isRequired,
    endpoint: React.PropTypes.string.isRequired
};