function checkCell(position, grid) {
    let [i,j] = position;
    if(i >= 0 && i < grid.length && j >= 0 && j < grid[0].length && (grid[i][j] == '' || grid[i][j] == 's' || grid[i][j] == 'd')) {
        grid[i][j] = 'f';
        return true;
    }
    return false;
}

function checkEqual(cell_a, cell_b) {
    let [ai, aj] = cell_a;
    let [bi, bj] = cell_b;
    return (ai == bi && aj == bj);
}

export default function(source, grid, dest, callback) {
    let queue = [source];
    var interval = setInterval(() => {
        if(queue.length == 0) {
            clearInterval(interval);
            callback(false);
            return;
        }
        let length = queue.length;
        for(var i=0; i < length; i++) {
            let position = queue.shift();
            let valid = checkCell(position, grid);
            if(valid) {
                if(checkEqual(position, dest)) {
                    clearInterval(interval);
                    break;
                }
                let top = [position[0]-1, position[1]];
                let bottom = [position[0]+1, position[1]];
                let left = [position[0], position[1]-1];
                let right = [position[0], position[1]+1];

                queue.push(top);
                queue.push(left);
                queue.push(bottom);
                queue.push(right);
            }
        }
        callback(true);
    }, 200);
}

//use queue
//store the source in the queue, iterate through the queue and turn all the found cells as f