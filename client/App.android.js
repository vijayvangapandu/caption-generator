/**
 * caption generator
 * @flow
 */

import React, { Component } from 'react';
import ApplicationContainer from './containers/ApplicationContainer';
import ImagePicker from 'react-native-image-picker';
import NavigationView  from './components/NavigationView';
import MainActivity from './components/MainActivity';
import styles from './styles';
import c from './constants';
import {
    Text,
    View,
    StatusBar,
    ToolbarAndroid,
    DrawerLayoutAndroid
} from 'react-native';

export default class App extends Component {
    render() {
        return (
            <ApplicationContainer render={(state, actions) => (
                <DrawerLayoutAndroid
                    ref={'DRAWER'}
                    drawerWidth={c.DRAWER_WIDTH}
                    drawerPosition={DrawerLayoutAndroid.positions.Left}
                    drawerBackgroundColor={c.PURPLE}
                    onDrawerOpen={() => actions.onDrawerOpen()}
                    onDrawerClose={() => actions.onDrawerClose()}
                    renderNavigationView={() => (
                        <NavigationView
                            setActiveItem={(item) => actions.setActiveItem(item)}
                            store={state.store}
                            image={state.image} />
                    )}>
                    <View style={styles.container}>

                        <StatusBar backgroundColor={c.PURPLE} barStyle="light-content" />

                        <ToolbarAndroid
                            style={styles.toolbarAndroid}
                            titleColor={c.WHITE}
                            onActionSelected={() => actions.onActionSelected()}
                            title="cgen" />

                        <MainActivity
                            captions={state.captions}
                            selectedCaption={state.selectedCaption}
                            labels={state.labels}
                            image={state.image}
                            captionsLoading={state.captionsLoading}
                            appLoading={state.appLoading}
                            showImagePicker={() => actions.showImagePicker()}
                            generateCaptions={(index) => actions.generateCaptions(index)}
                            onActionSelected={()=> actions.onActionSelected()}
                            onPressCaptionItem={(item) => actions.onPressCaptionItem(item)}
                            processImage={()=> actions.processImage()}
                            loadCameraPhoto={()=> actions.loadCameraPhoto()} />

                    </View>
                </DrawerLayoutAndroid>
            )}/>
        );
    }
}