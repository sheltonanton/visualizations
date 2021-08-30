import { Component } from 'react';

function Controls(props) {
    return (
        <div>
            {/* Controls */}
        </div>
    )
}

function Animation(props) {
    return <></>;
}

class Animations extends Component {
    selected = (animation) => {

    }

    render = () => {
        return (
            <div className="bordered flex flex-row">
                <div style={{
                    width: '70%',
                    border: '1px solid #ddd',
                    minHeight: '80vh'
                }}
                >
                    <Animation/>
                </div>
                <div style={{
                    flexGrow: 1
                }}>
                    <Controls onSelect={this.selected}/>
                </div>
            </div>
        )
    }
}

export default Animations;