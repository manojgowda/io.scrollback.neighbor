import React from "react-native";
import Card from "./card";
import CardTitle from "./card-title";
import CardSummary from "./card-summary";
import CardHashtags from "./card-hashtags";
import CardAuthor from "./card-author";
import DiscussionFooter from "./discussion-footer";
import Embed from "./embed";
import TouchFeedback from "./touch-feedback";
import Modal from "./modal";
import Icon from "./icon";
import Clipboard from "../../modules/clipboard";
import Share from "../../modules/share";
import routes from "../utils/routes";
import textUtils from "../../lib/text-utils";
import oembed from "../../lib/oembed";

const {
	StyleSheet,
	TouchableOpacity,
	View
} = React;

const styles = StyleSheet.create({
	image: {
		resizeMode: "cover",
		height: 160
	},
	author: {
		marginVertical: 8
	},
	cover: {
		marginTop: 4,
		marginBottom: 12
	},
	item: {
		marginHorizontal: 16
	},
	footer: {
		marginBottom: 8
	},
	topArea: {
		flexDirection: "row"
	},
	title: {
		flex: 1,
		marginTop: 16
	},
	expand: {
		marginHorizontal: 16,
		marginVertical: 12,
		color: "#000",
		fontSize: 24,
		opacity: 0.5
	}
});

export default class DiscussionItem extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
				this.props.thread.title !== nextProps.thread.title ||
				this.props.thread.text !== nextProps.thread.text ||
				this.props.thread.from !== nextProps.thread.from
			);
	}

	_showMenu() {
		const options = [ "Copy title", "Copy summary", "Share discussion" ];

		Modal.showActionSheetWithOptions({ options }, index => {
			switch (index) {
			case 0:
				Clipboard.setText(this.props.thread.title);
				break;
			case 1:
				Clipboard.setText(this.props.thread.text);
				break;
			case 2:
				const { id, to } = this.props.thread;

				Share.shareItem("Share discussion", `https://heyneighbor.chat/${to}/${id}`);
			}
		});
	}

	_onPress() {
		this.props.navigator.push(routes.chat({
			thread: this.props.thread.id,
			room: this.props.thread.to
		}));
	}

	render() {
		const { thread } = this.props;

		const trimmedText = (thread.text || "This is a text").trim();

		const hashtags = textUtils.getHashtags(trimmedText);
		const links = textUtils.getLinks(trimmedText);

		let cover;

		if (links.length) {
			const uri = links[0];
			const endpoint = oembed(uri);

			if (endpoint) {
				cover = (
					<Embed
						style={styles.cover}
						uri={uri}
						endpoint={endpoint}
					/>
				);
			}
		}

		return (
			<Card {...this.props}>
				<TouchFeedback onPress={this._onPress.bind(this)}>
					<View>
						<View style={styles.topArea}>
							<CardTitle
								style={[ styles.item, styles.title ]}
								text={this.props.thread.title}
							/>

							<TouchableOpacity onPress={this._showMenu.bind(this)}>
								<Icon name="expand-more" style={styles.expand} />
							</TouchableOpacity>
						</View>

						{cover || <CardSummary style={styles.item} text={trimmedText} />}

						{hashtags.length ?
							<CardHashtags style={styles.item} hashtags={hashtags} /> :
							null
						}

						<CardAuthor style={[ styles.item, styles.author ]} nick={thread.from} />

						<DiscussionFooter style={[ styles.item, styles.footer ]} thread={thread} />
					</View>
				</TouchFeedback>
			</Card>
		);
	}
}

DiscussionItem.propTypes = {
	thread: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		text: React.PropTypes.string.isRequired,
		from: React.PropTypes.string.isRequired,
		to: React.PropTypes.string.isRequired
	}).isRequired,
	navigator: React.PropTypes.object.isRequired
};
