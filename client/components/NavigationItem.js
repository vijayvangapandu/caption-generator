import React, { Component } from 'react';
import styles from '../styles';
import {
    Text,
    View,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';

export default class NavigationItem extends Component {
    constructor(props) {
        super();
        this.state = {};
    }
    _getActiveClass() {
        return this.props.result.item.fileName ===
        this.props.image.fileName ?
        styles.storeViewCellActive : null
    }
    render() {
        let { onPressItem } = this.props;
        return (
            <TouchableOpacity onPress={()=> onPressItem(this.props.result.item)}>
                <View
                    style={[styles.storeViewCell, this._getActiveClass()]}>
                    <Image
                        style={{width: 165, height: 100}}
                        source={{uri: this.props.result.item.data}} />
                    <Text style={[
                        styles.storeViewText, this._getActiveClass()
                    ]}>{this.props.result.item.fileName.slice(20, 46)}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}


