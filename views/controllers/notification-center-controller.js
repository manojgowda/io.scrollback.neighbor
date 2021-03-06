import React from "react-native";
import NotificationCenter from "../components/notification-center";
import Controller from "./controller";
import store from "../../store/store";

const {
	InteractionManager
} = React;

class NotificationCenterController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "missing" ]
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes && changes.notes) {
				this._updateData();
			}
		});
	}

	_dismissNote(note) {
		this.dispatch("note", {
			ref: note.ref,
			noteType: note.noteType,
			dismissTime: Date.now()
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					data: store.getNotes()
				});
			}
		});
	}

	render() {
		return (
			<NotificationCenter
				{...this.props}
				{...this.state}
				dismissNote={this._dismissNote.bind(this)}
			/>
		);
	}
}

export default Controller(NotificationCenterController);
