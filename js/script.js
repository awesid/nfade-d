var b = document.getElementById('asdf');

//function convertEnfaToNfa();
//function convertNfaToDfa();
//function dfaToGraph();

var states = document.getElementById('states');
var n, m, b;
var array;
var nfaST = []; // this is state transition table for nfa

states.addEventListener('click', (event) => {
  event.preventDefault();
  //  console.log("sghjk");
  var table = document.createElement('table');
  n = document.getElementById('nofstates').value;
  //  console.log(document.getElementById('nofstates').value);
  m = document.getElementById('nofsymbols').value;
  b = document.getElementById('EpsilonNFA').checked;
  console.log(b);
  array = [];

  var tr = '<thead> <tr>';
  tr = tr + `<th>Q\E</th>`;
  if(b==true){
    for (let i = 0; i < m-1; i++) {
      //  console.log('s');
      tr = tr + `<th>${i}</th>`;
    }
    tr = tr + `<th>ε</th>`;
  }
  else{
    for (let i = 0; i < m; i++) {
      //  console.log('s');
      tr = tr + `<th>${i}</th>`;
    }
  }


  tr = tr + '</tr> </thead>';
  //  console.log(tr);
  tr = tr + '<tbody>';
  for (let i = 0; i < n; i++) {
    tr = tr + '<tr>';
    tr = tr + `<td><strong>Q${i}<strong></td>`;

    for (let j = 0; j < m; j++) {
      tr = tr + `<td><input type='text' id = stateTable${i}${j}></td>`;
      //console.log(document.getElementsByClassName('stateTable'));
    }
    tr = tr + '</tr>';
  }
  table.innerHTML = tr;
  var input = document.getElementById('input');
  var p = document.createElement('p');
  p.innerHTML = "Enter the state transition table for the NFA:";
  input.appendChild(p);
  input.appendChild(table);
});
var convert = document.getElementById('convert');


convert.addEventListener('click', (event) => {
  for (var i = 0; i < n; i++) {
    var atemp = [];
    for (var j = 0; j < m; j++) {
      var temp = "stateTable" + i.toString() + j.toString();
      atemp.push(document.getElementById(temp).value);
    }
    array.push(atemp);
  }
  //  console.log(array);
  event.preventDefault();
  var a = [];
  nfaST = [];
  //  var s = document.getElementsByClassName('stateTable');

  for (let i = 0; i < n; i++) {
    a = [];
    for (let j = 0; j < m; j++) {
      a.push(array[i][j]);
    }
    nfaST.push(a);
  }
  //console.log(nfaST);
  displayNFA(nfaST);
  if(b==true)
  eNFAtoDFA(nfaST);
  else
  NFAtoDFA(nfaST);

})
function closure(i, nfaST, temp){
  var s = "Q"+i;
  if(temp.indexOf(s)!=-1)
    return;
  temp.push(s);
  console.log(temp);
  if(nfaST[i][m-1]!=""){

    console.log(nfaST[i][m-1]);
    var splitStates = nfaST[i][m-1].split(" ");
    for(let i=0; i<splitStates.length; i++){
      var y = splitStates[i].split("Q")[1];
      closure(y, nfaST, temp);
    }
  }
}
function eNFAtoDFA(NFAtable){
  var nodes = [];
  var temp = [];
  closure(0, NFAtable, temp);
  console.log(temp);
  var ans = "";
  ans = temp[0];
  for (let i = 1; i < temp.length; i++)
    ans = ans + " " + temp[i];
  ans = MyUnion(ans);
  nodes.push(ans);
  var DFAtable = [];

  var index = 0;
  while (1) {
    console.log(nodes);
    helper(nodes[index], NFAtable, DFAtable, nodes);

    if (index == nodes.length - 1)
      break;
    else
      index++;

  }
  console.log(DFAtable);
  display2(DFAtable, nodes);
}
function MyUnion(ans) {
  if (ans == "")
    return ans;
  var temp = ans.split(" ");
  var u = [];
  for (let i = 0; i < temp.length; i++) {
    if (u.indexOf(temp[i]) == -1)
      u.push(temp[i]);
  }
  u.sort();
  ans = "";
  ans = u[0];
  for (let i = 1; i < u.length; i++)
    ans = ans + " " + u[i];
  return ans;
}

function find(state, nodes) {
  for (var i = 0; i < nodes.length; i++) {
    if (state == nodes[i]) {
      return 1;
    }
  }
  return 0;
}

function helper(state, NFAtable, DFAtable, nodes) {
  console.log(state);
  var col = m;
  if(b==true)
  col = m-1;
  var splitStates = state.split(" ");
  if (splitStates.length == 1) {
    var y = splitStates[0].split("Q")[1];

    var temp = [];
    for (var i = 0; i < col; i++) {
        var transitionState = NFAtable[y][i];
        transitionState = MyUnion(transitionState);
      if (!find(transitionState, nodes)&&transitionState!="") {
        nodes.push(transitionState);
        console.log("pushing " + transitionState);
      }
      //console.log(nodes);
      console.log(transitionState);
      temp.push(transitionState);
    }
    DFAtable.push(temp);
  }
   else {

    var temp = [];
    for (var i = 0; i < col; i++) {
      var ans = "";
      for (var j = 0; j < splitStates.length; j++) {
        var y = splitStates[j].split("Q")[1];
        if (ans != "" && NFAtable[y][i] != "")
          ans = ans + " " + NFAtable[y][i];
        else
          ans += NFAtable[y][i];
      }
      ans = MyUnion(ans);
      temp.push(ans);
      if (!find(ans, nodes)&&ans!="")
        nodes.push(ans);
      console.log(nodes);
    }
    DFAtable.push(temp);
  }
  //state humari current state jispe hai
  //1. iska row dfa mein daalo
  //2 cases
  //1a state single hai
  //1b state multiple hai
  //2. dfa mein state dalte time check if it
  //exists in nodes. If not then add

}

function NFAtoDFA(NFAtable) {
  console.log(NFAtable);
  var nodes = [];
  var DFAtable = [];
  if (NFAtable)
    nodes.push("Q0");
  var index = 0;
  while (1) {
    console.log(nodes);
    helper(nodes[index], NFAtable, DFAtable, nodes);

    if (index == nodes.length - 1)
      break;
    else
      index++;

  }
  console.log(DFAtable);
  display2(DFAtable, nodes);
}
function search(obj, x){
  for(let i=0; i<x.length; i++){
    if((obj.from==x[i].from)&&(obj.to==x[i].to))
      return i;
  }
  return -1;
}
function display2(a, node) {
  var col = m;
  if(b==true)
    col--;
  var x = [];
  var obj = {};
  for (let i = 0; i < node.length; i++) {
    obj = {
      id: i,
      label: `${node[i]}`
    };
    x.push(obj);
  }
  var nodes = new vis.DataSet(x);
  //console.log(x);
  x = [];
  console.log(n + " " + m)
  for (let i = 0; i < node.length; i++) {
    for (let j = 0; j < col; j++) {
      console.log("value:" + a[i][j]);

      if (a[i][j]) {

        var y = node.indexOf(a[i][j]);
        obj = {
          from: i,
          to: y,
          arrows: 'to',
          label: j.toString(),
          font: {
            align: 'top'
          }
        };
      var index = search(obj, x);
      if(index==-1){
        x.push(obj);
      }
      else{
        x[index].label+=","+j.toString();
      }


      }
    }
  }

  var edges = new vis.DataSet(x);
  var data = {
    nodes: nodes,
    edges: edges
  }
  var options = {};
  var container = document.getElementById('DFA');
  var network = new vis.Network(container, data, options);
}



function displayNFA(a) {
  var x = [];
  var obj = {};
  for (let i = 0; i < n; i++) {
    obj = {
      id: i,
      label: `q${i}`
    };
    x.push(obj);
  }
  var nodes = new vis.DataSet(x);
  //console.log(x);
  x = [];
  console.log(n + " " + m)
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      //console.log( "value:"+ a[i][j]);

      if (a[i][j]) {
        var arr = a[i][j].split(" ");
        //console.log(arr);
        for (var k = 0; k < arr.length; k++) {
          //  console.log(arr[k]);
          var y = arr[k].split('Q')[1];
          //console.log(y);
          var ss;
          if(b==true&&j==m-1)
            ss = "ε";
          else
            ss = j.toString();
          obj = {
            from: i,
            to: y,
            arrows: 'to',
            label: ss,
            font: {
              align: 'top'
            }
          };
          var index = search(obj, x);
          if(index==-1){
            x.push(obj);
          }
          else{
            x[index].label+=","+ss;
          }
        }
        //console.log(x);
      }
    }
  }

  var edges = new vis.DataSet(x);
  var data = {
    nodes: nodes,
    edges: edges
  }
  var options = {};
  var container = document.getElementById('NFA');
  var network = new vis.Network(container, data, options);
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
