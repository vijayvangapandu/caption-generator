import React, { Component } from 'react';
import NavigationItem from './NavigationItem.js';
import styles from '../styles';
import {
    Text,
    View,
    Image,
    FlatList
} from 'react-native';

export default class NavigationView extends Component {
    constructor(props) {
        super();
        this.state = {};
    }
    render() {
        return (
            <View style={styles.navigationView}>
            <Text style={styles.navigationViewTitle}>Recent Photos</Text>
            {(this.props.store.length > 0) && <View style={styles.storeView}>
                <FlatList
                    data={this.props.store}
                    extraData={this.props}
                    keyExtractor={(item) => item.filename}
                    renderItem={(result) => {
                        return <NavigationItem
                                    result={result}
                                    onPressItem={(item) => this.props.setActiveItem(item)}
                                    image={this.props.image} />
                    }} />
                </View>}
            </View>
        )
    }
}