var b = document.getElementById('asdf');

//function convertEnfaToNfa();
//function convertNfaToDfa();
//function dfaToGraph();

var states = document.getElementById('states');
var n,m;
var array;
var nfaST = [];// this is state transition table for nfa

states.addEventListener('click',(event)=>{
    event.preventDefault();
    console.log("sghjk");
    var table = document.createElement('table');
    n = document.getElementById('nofstates').value;
    console.log(document.getElementById('nofstates').value);
    m = document.getElementById('nofsymbols').value;
    array = [];

    var tr = '<thead> <tr>';
    tr = tr + `<th>Q\E</th>`;
    for(let i=0;i<m;i++){
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
            tr = tr + `<td><input type='text' id = stateTable${i}${j}></td>`;
            //console.log(document.getElementsByClassName('stateTable'));
        }
        tr = tr + '</tr>';
    }
    table.innerHTML=tr;
    var input = document.getElementById('input');
    var p = document.createElement('p');
    p.innerHTML = "Enter the state transition table for the NFA:";
    input.appendChild(p);
    input.appendChild(table);
});
var convert = document.getElementById('convert');


convert.addEventListener('click',(event)=>{
    for(var i=0; i<n; i++){
        var atemp = [];
      for(var j=0; j<m; j++){
        var temp = "stateTable"+i.toString()+j.toString();
        atemp.push(document.getElementById(temp).value);
      }
      array.push(atemp);
    }
    console.log(array);
    event.preventDefault();
    var a = [];
    nfaST=[];
  //  var s = document.getElementsByClassName('stateTable');

    for(let i=0;i<n;i++){
        a = [];
        for(let j=0;j<m;j++){
            a.push(array[i][j]);
        }
        nfaST.push(a);
    }
    console.log(nfaST);
    displayNFA(nfaST);
})
function NFAtoDFA(a){
  var na = [];
  for(var i=0; i<n; i++){
    na.push(a[i]);
    for(var j=0; j<m; j++){

    }
  }
}
function displayNFA(a){
    var x = [];
    var obj={};
    for(let i=0;i<n;i++){
        obj = {
            id : i,
            label:`q${i}`
        };
        x.push(obj);
    }
    var nodes = new vis.DataSet(x);
    console.log(x);
    x = [];
    console.log(n + " " + m)
    for(let i=0;i<n;i++){
        for(let j =0;j<m;j++){
            console.log( "value:"+ a[i][j]);

            if(a[i][j]){
                var arr = a[i][j].split(" ");
                console.log(arr);
                for(var k=0; k<arr.length; k++){
                  console.log(arr[k]);
                var y = arr[k].split('Q')[1];
                //console.log(y);
                obj = {
                    from:i,
                    to:y,
                    arrows:'to',
                    label:j.toString(),
                    font:{align:'top'}
                };
                x.push(obj);
              }
                console.log(x);
            }
        }
    }

    var edges = new vis.DataSet(x);
    var data = {
        nodes: nodes,
        edges:edges
    }
    var options = {};
    var container = document.getElementById('sdf');
    var network = new vis.Network(container,data,options);
}

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
