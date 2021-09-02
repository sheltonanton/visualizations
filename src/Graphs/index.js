import { Component, useEffect, useState, useRef } from 'react';
import './index.css';

import bfs from './bfs';
import dfs from './dfs';
import dfsrand from './dfs_random';

let algos = {
    bfs,
    dfs,
    dfsrand
}

function Cell(props) {
    const {
        i,j,v,a
    } = props;

    return (
        <td 
            className={`cell cell_${a} cell_${v}`}
            draggable={false}
            key={`row_${i}_col_${j}`}
            style={{
                border: '1px solid #ddd',
            }}
            onClick={() => props.clicked(i, j)}
            data-row={i} data-column={j}
        >

        </td>
    )
}

function Grid(props) {

    const {
        horizontal = 20,
        vertical = 15,
        grid,
        action,
        actionCallback
    } = props;

    const mouseActions = useRef([null, null, null]);
    const [state, setState] = useState(false);

    useEffect(() => {
        mouseActions.current = (() => {
            if(action == 'source' || action == 'dest' || action == "flip") {
                return [null, null, null];
            }
            var mouseDown = false;

            const onMouseDown = function(event) {
                mouseDown = true;
                onMouseOver(event);
                event.preventDefault();
                event.stopPropagation();
            }

            const onMouseUp = function(event) {
                mouseDown = false;
                onMouseOver(event);
            }

            const onMouseOver = function(event) {
                if(mouseDown) {
                    let t = event.target;
                    let v = action[0];
                    v = (v == "r") && "" || v;
                    t.className = "";
                    t.classList.add(`cell_${v}`);
                    let d = t.dataset;
                    let [i, j] = [parseInt(d['row']), parseInt(d['column'])]
                    grid[i][j] = v;
                }
            }

            return [onMouseDown, onMouseUp, onMouseOver]
        })()

        setState(!state);
    }, [actionCallback, action]);

    function clicked(i, j) {
        actionCallback(i, j);
    }

    function getGrid(c, r) {
        let rows = [];
        for(var i=0; i < r; i++) {
            let row = [];
            for(var j=0; j < c; j++) {
                row.push(
                    <Cell key={`row_${i}_col${j}`} i={i} j={j} v={grid[i][j]} a={action} clicked={clicked}/>
                )
            }
            rows.push(<tr draggable={false} key={`row_${i}`}>{row}</tr>);
        }
        return rows;
    }

    return (
        <table draggable={false} style={{width: "100%", height: "100%"}}>
            <tbody
                draggable={false}
                onMouseDown={mouseActions.current[0]}
                onMouseOver={mouseActions.current[2]}
                onMouseUp={mouseActions.current[1]}
            >
                {getGrid(horizontal, vertical)}
            </tbody>
        </table>
    )
}

function Controls(props) {
    const [brush, setBrush] = useState('source');
    function clicked(action) {
        setBrush(action);
        props.brushSelected(action);
    }

    const actions = ['source', 'remove', 'add', 'dest'];
    return (
        <div style={{width: '100%', height: '100%', padding: '10px'}}>
            <div>Action: <label>{brush}</label></div>
            {actions.map((action, index) => <button key={index}onClick={() => clicked(action)}>{action}</button>)}
            <p>
                <div><label>Algorithm:</label></div>
                <select ref={props.algo_ref}>
                    <option value="bfs" defaultChecked>BFS</option>
                    <option value="dfs">DFS</option>
                    <option value="dfsrand">DFS Random</option>
                </select>
            </p>
            <p>
                <button onClick={() => props.onRun()}>Run</button>
                <button onClick={() => props.onReset()}>Reset</button>
            </p>
        </div>
    )
}

class Graphs extends Component {

    horizontal = 40;
    vertical = 30;
    algoRef = null;

    constructor(args) {
        super(args);
        let grid = this.initializeGrid();
        this.state = {
            cellAction: 'source',
            grid,
            source: null,
            dest: null
        }
    }

    initializeGrid = () => {
        let grid = [];
        for(var i=0; i < this.vertical; i++) {
            let row = [];
            for(var j=0; j < this.horizontal; j++) { 
                row.push('');
            }
            grid.push(row);
        }
        return grid;
    }

    update = () => {
        this.setState({
            ...this.state
        });
    }

    sourceAction = (i, j) => {
        if(this.state.source != null) {
            let s = this.state.source;
            this.state.grid[s[0]][s[1]] = '';
        }
        this.state.grid[i][j] = 's';
        this.state.source = [i, j];
        this.update();
    }

    destAction = (i, j) => {
        if(this.state.dest != null) {
            let d = this.state.dest;
            this.state.grid[d[0]][d[1]] = '';
        }
        this.state.grid[i][j] = 'd';
        this.state.dest = [i, j];
        this.update();
    }

    addAction = (i, j) => {
        this.state.grid[i][j] = 'a';
        this.update();
    }

    flipAction = (i, j) => {
        this.state.grid[i][j] = 'f';
        this.update();
    }

    removeAction = (i, j) => {
        this.state.grid[i][j] = '';
        this.update();
    }

    actions = {
        source: this.sourceAction,
        dest: this.destAction,
        add: this.addAction,
        remove: this.removeAction,
        flip: this.flipAction
    }

    changeAction = (action) => {
        this.setState({
            cellAction: action,
            grid: this.state.grid,
            source: this.state.source,
            dest: this.state.dest
        })
    }

    startRun = () => {
        let algoName = this.algoRef.value;
        algos[algoName](this.state.source, this.state.grid, this.state.dest, () => {
            this.update();
        });
    }

    reset = () => {
        let [a,b] = this.state.source;
        this.state.grid[a][b] = 's';
        let [k,l] = this.state.dest;
        this.state.grid[k][l] = 'd';
        let grid = this.state.grid;
        for(var i=0; i < grid.length; i++) {
            for(var j=0; j < grid[i].length; j++) {
                if(grid[i][j] == 'f') {
                    grid[i][j] = '';
                }
            }
        }
        this.update();
    }

    render = () => {
        return (
            <div className="bordered flex flex-row">
                <div style={{
                    width: "70%",
                    border: '1px solid #ddd',
                    minHeight: "80vh",
                }}
                >
                    <Grid
                        actionCallback={this.actions[this.state.cellAction]}
                        action={this.state.cellAction}
                        grid={this.state.grid}
                        source={this.state.source}
                        dest={this.state.dest}
                        horizontal={this.horizontal}
                        vertical={this.vertical}
                    />
                </div>
                <div style={{
                    flexGrow: 1
                }}>
                    <Controls brushSelected={this.changeAction} algo_ref={(r) => this.algoRef = r} onRun={this.startRun} onReset={this.reset}/>
                </div>
            </div>
        )
    }
}

export default Graphs;