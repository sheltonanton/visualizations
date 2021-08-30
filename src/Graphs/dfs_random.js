function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

async function dfs(position, grid, dest, callback) {
    let valid = checkCell(position, grid);
    if(valid) {
        callback(true);
        let isEqual = checkEqual(position, dest);
        if(isEqual) {
            throw new Error('end');
        }
        let [i,j] = position;
        let positions = [[i+1, j], [i, j-1], [i, j+1], [i-1, j]];
        while(positions.length > 0) {
            let random = Math.random();
            let index = Math.floor(random * positions.length);
            // let index = 0;

            await timeout(100);
            await dfs(positions[index], grid, dest, callback);
            positions.splice(index, 1);
        }
    }
}

export default async function(source, grid, dest, callback) {
    try {
        await dfs(source, grid, dest, callback);
    }catch(error) {}
}