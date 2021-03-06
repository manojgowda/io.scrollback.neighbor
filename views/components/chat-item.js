import React from "react-native";
import Colors from "../../colors.json";
import AppText from "./app-text";
import AvatarRound from "./avatar-round";
import ChatBubble from "./chat-bubble";
import EmbedImage from "./embed-image";
import Embed from "./embed";
import Modal from "./modal";
import Icon from "./icon";
import Clipboard from "../../modules/clipboard";
import Linking from "../../modules/linking";
import textUtils from "../../lib/text-utils";
import timeUtils from "../../lib/time-utils";

const {
	ToastAndroid,
	StyleSheet,
	TouchableOpacity,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 8,
		marginVertical: 4
	},
	chat: {
		flex: 0,
		flexDirection: "column",
		alignItems: "flex-end"
	},
	received: {
		alignItems: "flex-start",
		marginLeft: 44
	},
	timestamp: {
		flexDirection: "row",
		marginTop: 4
	},
	timestampLeft: {
		marginLeft: 52
	},
	timestampRight: {
		alignSelf: "flex-end"
	},
	timestampIcon: {
		color: Colors.black,
		marginVertical: 2,
		opacity: 0.3
	},
	timestampText: {
		color: Colors.black,
		fontSize: 12,
		lineHeight: 18,
		marginHorizontal: 6,
		paddingHorizontal: 8,
		opacity: 0.3
	},
	avatar: {
		position: "absolute",
		top: 0,
		left: -36,
		alignSelf: "flex-end"
	},
	embed: {
		width: 240,
		height: 135,
		marginVertical: 4
	},
	thumbnail: {
		marginVertical: 4
	},
	bubbleReceived: {
		marginRight: 8
	},
	bubbleSent: {
		marginLeft: 8
	},
	hidden: {
		opacity: 0.3
	}
});

export default class ChatItem extends React.Component {
	shouldComponentUpdate(nextProps) {
		if (this.props.text && nextProps.text && this.props.previousText && nextProps.previousText) {
			return (
					this.props.hidden !== nextProps.hidden ||
					this.props.text.text !== nextProps.text.text ||
					this.props.text.from !== nextProps.text.from ||
					this.props.text.time !== nextProps.text.time ||
					this.props.previousText.from !== nextProps.previousText.from ||
					this.props.previousText.time !== nextProps.previousText.time
				);
		} else {
			return true;
		}
	}

	_copyToClipboard(text) {
		Clipboard.setText(text);
		ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
	}

	_showMenu() {
		const { text, textMetadata, currentUser } = this.props;

		const menu = {};

		if (textMetadata && textMetadata.type === "image") {
			menu["Open image in browser"] = () => Linking.openURL(textMetadata.originalUrl);
			menu["Copy image link"] = () => this._copyToClipboard(textMetadata.originalUrl);
		} else {
			menu["Copy text"] = () => this._copyToClipboard(text.text);
			menu["Quote message"] = () => this.props.quoteMessage(text);
		}

		if (currentUser !== text.from) {
			menu["Reply to @" + text.from] = () => this.props.replyToMessage(text);
		}

		if (this.props.isCurrentUserAdmin()) {
			if (this.props.hidden) {
				menu["Unhide message"] = () => this.props.unhideText();
			} else {
				menu["Hide message"] = () => this.props.hideText();
			}

			if (text.from !== this.props.currentUser) {
				if (this.props.isUserBanned()) {
					menu["Unban " + text.from] = () => this.props.unbanUser();
				} else {
					menu["Ban " + text.from] = () => this.props.banUser();
				}
			}
		}

		Modal.showActionSheetWithItems(menu);
	}

	render() {
		const { text, hidden, textMetadata, previousText, currentUser } = this.props;

		const received = text.from !== currentUser;

		const links = textUtils.getLinks(text.text);

		let cover;

		if (textMetadata && textMetadata.type === "image") {
			cover = (
				<EmbedImage
					style={styles.thumbnail}
					height={parseInt(textMetadata.height, 10)}
					width={parseInt(textMetadata.width, 10)}
					uri={textMetadata.thumbnailUrl}
				/>
			);
		} else if (links.length) {
			const uri = text.text;

			if (uri) {
				cover = (
					<Embed
						text={uri}
						style={styles.embed}
						chatItem="true"
					/>
				);
			}
		}

		let showAuthor = received,
			showTime = false;

		if (previousText) {
			if (received) {
				showAuthor = text.from !== previousText.from;
			}

			showTime = (text.time - previousText.time) > 300000;
		}

		return (
			<View {...this.props} style={[ styles.container, this.props.style ]}>
				<View style={[ styles.chat, received ? styles.received : null, hidden ? styles.hidden : null ]}>
					{received && showAuthor ?
						<AvatarRound
							style={styles.avatar}
							size={36}
							nick={text.from}
						/> :
						null
					}

					<TouchableOpacity activeOpacity={0.5} onPress={this._showMenu.bind(this)}>
						<ChatBubble
							text={textMetadata && textMetadata.type === "image" ? { from: text.from } : text}
							type={received ? "left" : "right"}
							showAuthor={showAuthor}
							showArrow={received ? showAuthor : true}
							style={received ? styles.bubbleReceived : styles.bubbleSent}
						>
							{cover}
						</ChatBubble>
					</TouchableOpacity>
				</View>

				{showTime ?
					(<View style={[ styles.timestamp, received ? styles.timestampLeft : styles.timestampRight ]}>
					 <Icon
						name="access-time"
						style={styles.timestampIcon}
						size={12}
					 />
					 <AppText style={styles.timestampText}>{timeUtils.long(text.time)}</AppText>
					</View>) :
					null
				}
			</View>
		);
	}
}

ChatItem.propTypes = {
	text: React.PropTypes.shape({
		text: React.PropTypes.string.isRequired,
		from: React.PropTypes.string.isRequired,
		time: React.PropTypes.number.isRequired
	}).isRequired,
	textMetadata: React.PropTypes.object,
	previousText: React.PropTypes.shape({
		from: React.PropTypes.string.isRequired,
		time: React.PropTypes.number.isRequired
	}),
	currentUser: React.PropTypes.string.isRequired,
	quoteMessage: React.PropTypes.func.isRequired,
	replyToMessage: React.PropTypes.func.isRequired,
	hidden: React.PropTypes.bool.isRequired,
	isCurrentUserAdmin: React.PropTypes.func.isRequired,
	isUserBanned: React.PropTypes.func.isRequired,
	hideText: React.PropTypes.func.isRequired,
	unhideText: React.PropTypes.func.isRequired,
	banUser: React.PropTypes.func.isRequired,
	unbanUser: React.PropTypes.func.isRequired
};
