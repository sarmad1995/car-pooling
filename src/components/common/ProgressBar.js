import React from 'react';
import Animation from 'lottie-react-native';

import progressBar from '../../assets/progress_bar.json';

class ProgressBar extends React.Component {
    componentDidMount() {
        this.animation.play();
    }
    render() {
        const { style } = this.props;
        return (
            <Animation
                resizeMode='cover'
                ref={animation => {
                    this.animation = animation;
                }}
                style={style}
                
                loop
                source={progressBar}
            />
        );
    }
}
export default ProgressBar;
