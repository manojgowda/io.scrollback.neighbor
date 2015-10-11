import React from "react-native";
import NotificationCenterItem from "./notification-center-item";
import PageEmpty from "./page-empty";
import PageLoading from "./page-loading";
import PageRetry from "./page-retry";

const {
	ListView,
	View
} = React;

export default class NotificationCenter extends React.Component {
	constructor(props) {
		super(props);

		this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	}

	_getDataSource() {
		return this.dataSource.cloneWithRows(this.props.data);
	}

	render() {
		return (
			<View {...this.props}>
				{(() => {
					if (this.props.data.length === 0) {
						return <PageEmpty />;
					}

					if (this.props.data.length === 1) {
						if (this.props.data[0] === "loading") {
							return <PageLoading />;
						}

						if (this.props.data[0] === "missing") {
							return <PageRetry onRetry={this.props.refreshData} />;
						}
					}

					const dataSource = this._getDataSource();

					return (
						<ListView
							initialListSize={5}
							dataSource={dataSource}
							renderRow={note => {
								return (
									<NotificationCenterItem
										key={note.ref + note.type}
										note={note}
										navigator={this.props.navigator}
										dismissNote={this.props.dismissNote}
									/>
								);
							}}
						/>
					);
				})()}
			</View>
		);
	}
}

NotificationCenter.propTypes = {
	data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "loading", "missing" ]),
		React.PropTypes.shape({
			id: React.PropTypes.string
		})
	])).isRequired,
	dismissNote: React.PropTypes.func.isRequired,
	refreshData: React.PropTypes.func,
	navigator: React.PropTypes.object.isRequired
};
