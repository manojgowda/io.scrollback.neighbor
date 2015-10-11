import React from "react-native";
import LocalitiesFiltered from "../components/localities-filtered";
import debounce from "../../lib/debounce";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class LocalitiesFilterController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: []
		};

		this._fetchMatchingRooms = debounce(this._fetchMatchingRoomsImmediate.bind(this));

		this._cachedResults = {};
	}

	_fetchMatchingRoomsImmediate(filter) {
		this.query("getRooms", { ref: filter + "*" }).then(res => {
			const data = res.results || [];

			this._cachedResults[filter] = data;

			if (filter !== this.state.filter) {
				return;
			}

			this._onDataArrived(data);
		});
	}

	_onDataArrived(data) {
		this.setState({ data });
	}

	_onSearchChange(filter) {
		if (filter) {
			InteractionManager.runAfterInteractions(() => {
				if (this._mounted) {
					if (this._cachedResults[filter]) {
						this.setState({
							filter,
							data: this._cachedResults[filter]
						});
					} else {
						this.setState({
							filter,
							data: [ "loading" ]
						});
					}
				}
			});

			this._fetchMatchingRooms(filter);
		} else {
			this.setState({
				filter,
				data: []
			});
		}
	}

	_onError() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					data: [ "missing" ]
				});
			}
		});
	}

	render() {
		return (
			<LocalitiesFiltered
				{...this.props}
				{...this.state}
				onSearchChange={this._onSearchChange.bind(this)}
			/>
		);
	}
}

LocalitiesFilterController.propTypes = {
	filter: React.PropTypes.string
};
