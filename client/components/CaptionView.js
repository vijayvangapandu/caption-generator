/**
 * MainActivity component
 * @flow
 */

import React, { Component } from 'react';
import CarouselView from './CarouselView';
import styles from '../styles';
import {
    View,
    Text,
    ActivityIndicator,
    FlatList
} from 'react-native';

export default class CaptionView extends Component<{}> {
    constructor(props) {
        super(props);
    }
    render () {
        return (
            <View>
                {!!this.props.labels && <View style={styles.labelView}>
                    {!!this.props.labels && this.props.labels.map((label, i) => (
                        <Text
                            key={i}
                            style={styles.labelText}
                            onPress={() => this.props.generateCaptions(i)}
                            style={[styles.labelText, this.props.selectedCaption === i ? styles.labelTextActive : null]}>
                        {label}
                        </Text>
                    ))}
                </View>}
                {!!this.props.captions.length && <View style={styles.captionView}>
                    {!!this.props.captionsLoading ? (
                        <ActivityIndicator size="small" color="#841584" />
                    ) : (
                        <CarouselView
                            captions={this.props.captions}
                            onPressCaptionItem={(item) => this.props.onPressCaptionItem(item)} />
                    )}
                </View>}
            </View>
        )
    }
}