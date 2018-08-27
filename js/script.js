var b = document.getElementById('asdf');

//function convertEnfaToNfa();
//function convertNfaToDfa();
//function dfaToGraph();

var states = document.getElementById('states');
var n,m;

states.addEventListener('click',(event)=>{
    event.preventDefault();
    var table = document.createElement('table');
    n = document.getElementById('nofstates');
    m = document.getElementById('nofsymbols');

    var tr = '<thead> <tr>';
    tr = tr + `<th>Q\E</th>`;
    for(let i=0;i<m;i++){
        //not working why?
        console.log('s');
        tr = tr + `<th>${i}</th>`;
    }
    tr = tr + '</tr> </thead>';
    console.log(tr);
    tr = tr + '<tbody>';
    for(let i =0;i<n;i++){
        tr = tr + '<tr>';
        tr = tr + `<td><strong>Q${i}<strong></td>`;
        for(let j =0;j<m;j++){
            tr = tr + `<td><input type='text' class = stateTable></td>`;
        }
        tr = tr + '</tr>';
    }
    table.innerHTML=tr;
    var input = document.getElementById('input');

    input.appendChild(table);
})

/*b.addEventListener('click', (event) => {
    //console.log("asd");
    event.preventDefault();
    var nodes = new vis.DataSet([
        {
            id: 1,
            label: '1'
        },
        {
            id: 2,
            label: '2'
        }
    ]);
    var edges = new vis.DataSet([
        {
            from: 1,
            to: 2,
            arrows: 'to',
            label: '23',
            font: { align: 'top' }
        }
    ]);
    var container = document.getElementById('sdf');
    var data = {
        nodes: nodes,
        edges: edges
    }
    var options = {};

    var network = new vis.Network(container, data, options);
})*/