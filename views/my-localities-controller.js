import React from "react-native";
import MyLocalities from "./my-localities";
import locationUtils from "../lib/location-utils";
import socket from "../lib/socket";

const {
    InteractionManager
} = React;

const currentLocation = {
    latitude: 12.9667,
    longitude: 77.5667
};

export default class MyLocalitiesController extends React.Component {
    constructor(props) {
        super(props);

        this._data = [ "LOADING" ];

        this.state = {
            data: this._data
        };
    }

    componentDidMount() {
        this._mounted = true;
        this._socketMessageHandler = this._onSocketMessage.bind(this);
        this._errorHandler = this._onError.bind(this);

        socket.on("message", this._socketMessageHandler);
        socket.on("error", this._errorHandler);

        socket.send(JSON.stringify({ type: "get" }));
    }

    componentWillReceiveProps(nextProps) {
        this._setFilteredData(this._data, nextProps.filter);
    }

    componentWillUnmount() {
        this._mounted = false;

        socket.off("message", this._socketMessageHandler);
        socket.off("error", this._errorHandler);
    }

    _setFilteredData(data, filter) {
        const filteredData = filter ? data.filter(room => {
            return (
                room.id.toLowerCase().indexOf(filter) > -1 ||
                room.displayName.toLowerCase().indexOf(filter) > -1
            );
        }) : data;

        filteredData.sort((a, b) => locationUtils.compareAreas(currentLocation, a, b));

        this.setState({
            data: filteredData
        });
    }

    _onDataArrived(newData) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this._data = newData;

                this._setFilteredData(newData, this.props.filter);
            }
        });
    }

    _onError() {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({
                    data: [ "FAILED" ]
                });
            }
        });
    }

    _onRefresh() {

    }

    _onSocketMessage(message) {
        let parsed;

        try {
            parsed = JSON.parse(message);
        } catch (e) {
            // do nothing
        }

        if (parsed && parsed.type === "data") {
            this._onDataArrived(parsed.data.rooms);
        }
    }

    render() {
        return (
            <MyLocalities
                {...this.props}
                {...this.state}
                refreshData={this._onRefresh.bind(this)}
            />
        );
    }
}

MyLocalitiesController.propTypes = {
    filter: React.PropTypes.string
};
