/**
 * MainActivity component
 * @flow
 */

import React, { Component } from 'react';
import ApplicationContainer from './containers/ApplicationContainer';
import MainActivity from './components/MainActivity';
import NavigationView  from './components/NavigationView';
import HeaderView from './components/HeaderView';
import DrawerLayout from 'react-native-drawer-layout-polyfill';
import c from './constants';
import styles from './styles';
import {
    StyleSheet,
    NavigatorIOS,
    View,
    Text,
    StatusBar
} from 'react-native';

export default class App extends Component<{}> {
    render() {
        return (
            <ApplicationContainer render={(state, actions) => (
                <DrawerLayout
                    ref={'DRAWER'}
                    drawerWidth={c.DRAWER_WIDTH}
                    drawerPosition={DrawerLayout.positions.Left}
                    drawerBackgroundColor={c.PURPLE}
                    onDrawerOpen={() => actions.onDrawerOpen()}
                    onDrawerClose={() => actions.onDrawerClose()}
                    renderNavigationView={() => {
                        return <NavigationView
                                    setActiveItem={(item) => actions.setActiveItem(item)}
                                    store={state.store}
                                    image={state.image} />
                }}>

                <StatusBar backgroundColor={c.PURPLE} barStyle={"light-content"} />

                <HeaderView />

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
                </DrawerLayout>
            )}/>
        );
    }
}
