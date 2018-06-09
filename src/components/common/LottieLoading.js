import React from 'react';
import Animation from 'lottie-react-native';

import bounce from '../../assets/bounching_ball.json';

class LottieLoading extends React.Component {
    componentDidMount() {
        this.animation.play();
    }
    render() {
        return (
            <Animation
                resizeMode='cover'
                ref={animation => {
                    this.animation = animation;
                }}
                style={{
                    flex: 1,
                    margin: -3
                }}
                
                loop
                source={bounce}
            />
        );
    }
}
export default LottieLoading;
