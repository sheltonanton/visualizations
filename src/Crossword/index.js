import { Component, useEffect } from 'react';
import './index.css';

function Game(props) {
    const HORIZONTAL = 0;
    const VERTICAL = 1;
    let {
        items
    } = props;

    function fillGrid(grid, i, j, type, item) {
        if(type == HORIZONTAL) {
            for(var k=j; k < (item.length + j); k++) {
                grid[i][k] = item[k - j];
            }
        }else{
            for(var k=i; k < (item.length + i); k++) {
                grid[k][j] = item[k - i];
            }
        }
    }

    function addToGrid(grid, item, index) {
        let size = grid.length;
        if(index == 0) {
            fillGrid(grid, 0, parseInt(size/2), VERTICAL, item);
        }else {
            //dynamically add the item, with interchanging types
            //the item should match most of the letters in the grid.
        }
    }

    function getGrid(items, n) {
        let grid = Array(n).fill(null);
        grid = grid.map(g => Array(n).fill(""));
        items.forEach((item, index) => {
            addToGrid(grid, item, index);
        });
        return grid;
    }

    items = items.sort((a, b) => b.length - a.length); 
    let n = items.reduce((acc, item) => Math.max(acc, item.length), 0);
    n = (n > 15)? n: 15;

    let grid = getGrid(items, n);

    return (
        <></>
    )
}

class CrossWord extends Component {
    inputRef = null

    constructor(props) {
        super(props);
        this.state = {
            'values': []
        }
    }

    inputChanged = () => {
        let value = this.inputRef.value;
        let values = value.split(',').map(v => v.trim());
        this.setState({
            values
        })
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
                    <Game items={this.state.values}/>
                </div>
                <div style={{
                    flexGrow: 1,
                    padding: "20px"
                }}>
                    <textarea ref={(r) => this.inputRef = r} onChange = {() => this.inputChanged()} style={{width: "100%"}}/>
                </div>
            </div>
        )
    }
}

export default CrossWord;

//crossword length
//