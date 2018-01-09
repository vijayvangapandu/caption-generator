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
        let {
            labels,
            generateCaptions,
            selectedCaption,
            captions,
            captionsLoading,
            onPressCaptionItem
        } = this.props;
        return (
            <View>
                {!!labels && <View style={styles.labelView}>
                    {!!labels && labels.map((label, i) => (
                        <Text
                            key={i}
                            style={styles.labelText}
                            onPress={() => generateCaptions(i)}
                            style={[styles.labelText, selectedCaption === i ? styles.labelTextActive : null]}>
                        {label}
                        </Text>
                    ))}
                </View>}
                {!!captions.length && <View style={[styles.captionView, captionsLoading ? styles.captionViewLoading : null]}>
                    {!!captionsLoading ? (
                        <ActivityIndicator size="small" color="#841584" />
                    ) : (
                        <CarouselView
                            captions={captions}
                            onPressCaptionItem={(item) => onPressCaptionItem(item)} />
                    )}
                </View>}
            </View>
        )
    }
}