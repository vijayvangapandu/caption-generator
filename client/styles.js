import { StyleSheet } from 'react-native';
export default  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    toolbarAndroid: {
        height: 50,
        backgroundColor: '#841584'
    },
    storeView: {
        flexDirection: 'column',
        backgroundColor: '#841584'
    },
    storeViewCell: {
        padding: 5,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#841584',
    },
    storeViewLoadingCell: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    storeViewImage: {
        width: 150,
        height: 150,
        borderRadius: 3,
        borderWidth: 1
    },
    storeViewText: {
        color: '#fff',
        fontSize: 12,
        backgroundColor: '#841584',
        fontWeight: 'bold',
        marginTop: 3
    },
    storeViewCellActive: {
        backgroundColor: '#a4c639'
    },
    introView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    introViewInner: {
        width: 300,
        paddingTop: 15,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 0,
        borderWidth: 3,
        borderRadius: 3,
        borderColor: '#841584',
        marginTop: 50
    },
    modalTitle: {
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 16
    },
    modalText: {
        marginBottom: 15
    },
    imageView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222',
        position: 'relative'
    },
    imageComponent:{
        width: 275,
        height: 185,
        resizeMode: 'contain'
    },
    modalView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    modalViewInner: {
        backgroundColor: '#fff',
        width: 300,
        padding: 15,
        borderWidth: 3,
        borderRadius: 3,
        borderColor: '#841584',
        flex: -1
    },
    labelView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginTop: 10
    },
    labelText: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 3,
        borderColor: '#841584',
        color: '#841584',
        paddingLeft: 13,
        paddingRight: 5,
        paddingTop: 7,
        paddingBottom: 3,
        marginHorizontal: 5,
        marginBottom: 8
    },
    captionView: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingBottom: 10,
        transform: [{translateX: 10}]
    },
    caption: {
        marginBottom: 5,
        fontSize: 16
    },
    button: {
        height: 150
    },
    toolbarView: {
        marginTop: 'auto',
        marginBottom: 10,
        flex:0
    },
    row: {
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom:10
    },
    navigationView: {
        paddingTop: 10,
        paddingLeft: 0,
        paddingBottom: 90
    },
    navigationViewTitle: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'right',
        marginRight: 20
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    },
    swiperViewSlide: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});