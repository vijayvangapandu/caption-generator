/**
 * MainActivity component
 * @flow
 */

import React, { Component } from 'react';
import styles from '../styles';
import { View, Text } from 'react-native';

export default class HeaderView extends Component<{}> {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <View style={styles.headerView}>
                <Text style={styles.headerText}>cgen</Text>
            </View>
        )
    }
}