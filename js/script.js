var states = document.getElementById('states');
var n, m;
var b;
var nfaST = []; // this is state transition table for nfa
var I, F;
var convert = document.getElementById('convert');
convert.classList.add('invisible');
// var NFA = document.getElementById('NFA');
// NFA.classList.add('invisible');
// var DFA = document.getElementById('DFA');
// DFA.classList.add('invisible');
states.addEventListener('click', (event) => {
	event.preventDefault();
	var input = document.getElementById('input');
	var NFAcontainer = document.getElementById('NFA');
	var DFAcontainer = document.getElementById('DFA');
	NFAcontainer.innerHTML = "";
	DFAcontainer.innerHTML = "";
	input.innerHTML = "";

	var table = document.createElement('table');
	table.classList.add('table');
	table.classList.add('table-bordered');
	table.classList.add('table-hover');
	table.classList.add('table-sm');
	table.classList.add('table-light');
	n = document.getElementById('nofstates').value;
	m = document.getElementById('nofsymbols').value;
	if (!n || !m || n > 10 || m > 10) {
		alert("Enter valid number of states and symbols please!");
		return;
	}
	b = document.getElementById('EpsilonNFA').checked;
	I = document.getElementById('initials').value.toString();
	F = document.getElementById('finals').value.toString();
	if (!I || !F || !checkStateValidity(I) || !checkStateValidity(F) || !checkInitialStateValidity(I)) {
		alert("Enter valid Initial and Final state(s) please!");
		return;
	}
	nfaST = [];
	var tr = '<thead class="thead"> <tr>';
	tr = tr + `<th scope="col">Q\E</th>`;
	if (b == true) {
		for (let i = 0; i < m - 1; i++) {
			tr = tr + `<th scope="col">${i}</th>`;
		}
		tr = tr + `<th scope="col">ε</th>`;
	} else {
		for (let i = 0; i < m; i++) {
			tr = tr + `<th scope="col">${i}</th>`;
		}
	}
	tr = tr + '</tr> </thead>';
	tr = tr + '<tbody>';
	for (let i = 0; i < n; i++) {
		tr = tr + '<tr>';
		tr = tr + `<td><strong>Q${i}<strong></td>`;

		for (let j = 0; j < m; j++) {
			tr = tr + `<td><input class="form-control form-control-sm" type='text' id = stateTable${i}${j}></td>`;
		}
		tr = tr + '</tr>';
	}
	table.innerHTML = tr;

	var p = document.createElement('p');
	p.innerHTML = "Enter the state transition table for the NFA:";
	input.appendChild(p);
	input.appendChild(table);
	convert.classList.remove('invisible');
	convert.classList.add('visible');
});




convert.addEventListener('click', (event) => {

	event.preventDefault();
	n = document.getElementById('nofstates').value;
	m = document.getElementById('nofsymbols').value;
	if (!n || !m || n > 10 || m > 10) {
		alert("Enter valid number of states and symbols please!");
		return;
	}
	b = document.getElementById('EpsilonNFA').checked;
	I = document.getElementById('initials').value.toString();
	F = document.getElementById('finals').value.toString();
	if (!I || !F || !checkStateValidity(I) || !checkStateValidity(F) || !checkInitialStateValidity(I)) {
		alert("Enter valid Initial and Final state(s) please!");
		return;
	}
	initials = I.split(" ");
	finals = F.split(" ");
	var a = [];
	nfaST = [];
	for (var i = 0; i < n; i++) {
		var a = [];
		for (var j = 0; j < m; j++) {
			var temp = "stateTable" + i.toString() + j.toString();
			a.push(document.getElementById(temp).value);
		}
		nfaST.push(a);
	}
	if (!valid(nfaST)) {
		alert("Enter valid Transition Table!");
		return;
	}
	displayNFA(nfaST);
	if (b == true)
		eNFAtoDFA(nfaST);
	else
		NFAtoDFA(nfaST);

});

function equal(num, q, spaces) {
	spaces++;
	return (spaces == q) && (q == num);
}

function checkInitialStateValidity(state) {
	var sp = state.split(" ");
	if (sp.length > 1) return false;

	return true;
}

function checkStateValidity(state) {
	if (state == "")
		return true;

	var flag = 1;
	for (var i = 0; i < state.length; i++) {
		var y = state.charAt(i);
		console.log(y + ":" + i);
		if (y === 'Q') {
			i++;
			y = state.charCodeAt(i);
			console.log(y + ":" + i);
			if (y >= 48 && y <= 48+parseInt(n) -1) {
				i++;
				console.log(48+parseInt(n)-1+ ":ssdfg:"+y);
				y = state.charAt(i);
				console.log(y + ":" + i);
				
				if(y !== " " && i===state.length-1) flag = 0;	
			} else flag = 0;
		} else flag = 0;
	}

	if(flag) return true;
	else return false; 
}

function valid(NFA) {
	if (!NFA)
		return false;
	var count = 0;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			if (NFA[i][j] != "")
				count++;
			if (checkStateValidity(NFA[i][j]) == false)
				return false;

			var state = NFA[i][j];
			var temp = state.split(" ");
			var u = [];
			for (let i = 0; i < temp.length; i++) {
				if (u.indexOf(temp[i]) == -1)
					u.push(temp[i]);
			}
			u.sort();
			state = "";
			state = u[0];
			for (let i = 1; i < u.length; i++) {
				state = state + " " + u[i];
			}
			NFA[i][j] = state;
		}
	}
	if (count == 0)
		return false;
	return true;
}

function closure(i, nfaST, temp) {
	var s = "Q" + i;
	if (temp.indexOf(s) != -1)
		return;
	temp.push(s);
	console.log(temp);
	if (nfaST[i][m - 1] != "") {

		console.log(nfaST[i][m - 1]);
		var splitStates = nfaST[i][m - 1].split(" ");
		for (let i = 0; i < splitStates.length; i++) {
			var y = splitStates[i].split("Q")[1];
			if (temp.indexOf(splitStates[i]) === -1) {
				closure(y, nfaST, temp);
			}
		}
	}
}

function eNFAtoDFA(NFAtable) {
	var nodes = [];
	var temp = [];
	var init = initials[0].split("Q")[1];
	console.log("asdfgh:"+init);
	closure(init, NFAtable, temp);
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
	var iflag = false,
		fflag = false;
	if (initials.indexOf(u[0]) !== -1) iflag = true;
	if (finals.indexOf(u[0]) !== -1) fflag = true;
	ans = u[0];
	for (let i = 1; i < u.length; i++) {
		if (initials.indexOf(u[i]) !== -1) iflag = true;
		if (finals.indexOf(u[i]) !== -1) fflag = true;
		ans = ans + " " + u[i];
	}

	if (iflag) initials.push(ans);
	if (fflag) finals.push(ans);
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
	if (b == true)
		col = m - 1;
	var splitStates = state.split(" ");
	if (splitStates.length == 1) {
		var y = splitStates[0].split("Q")[1];

		var temp = [];
		for (var i = 0; i < col; i++) {
			var transitionState = NFAtable[y][i];
			transitionState = MyUnion(transitionState);
			if (!find(transitionState, nodes) && transitionState != "") {
				nodes.push(transitionState);
				console.log("pushing " + transitionState);
			}
			console.log(nodes);
			console.log(transitionState);
			temp.push(transitionState);
		}
		DFAtable.push(temp);
	} else {

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
			if (!find(ans, nodes) && ans != "")
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
	//console.log(NFAtable);
	var nodes = [];
	var DFAtable = [];
	if (NFAtable)
		nodes.push(initials[0]);
	//console.log("asd:"+initials);
	var index = 0;
	while (1) {
		//console.log(nodes);
		helper(nodes[index], NFAtable, DFAtable, nodes);

		if (index == nodes.length - 1)
			break;
		else
			index++;

	}
	//console.log(DFAtable);
	display2(DFAtable, nodes);
}

function search(obj, x) {
	for (let i = 0; i < x.length; i++) {
		if ((obj.from == x[i].from) && (obj.to == x[i].to))
			return i;
	}
	return -1;
}

function display2(a, node) {
	var col = m;
	if (b == true)
		col--;
	var x = [];
	var obj = {};
	for (let i = 0; i < node.length; i++) {
		obj = {
			id: i,
			label: `${node[i]}`
		};
		if (initials.indexOf(obj.label) !== -1) {
			obj.color = {
				border: 'black'
			};
		}

		if (finals.indexOf(obj.label) !== -1) {
			obj.color = {
				background: 'yellow',
				border: 'yellow'
			};
		}

		if (initials.indexOf(obj.label) !== -1 && finals.indexOf(obj.label) !== -1) {
			obj.color = {
				background: 'yellow',
				border: 'black'
			};
		}
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
					color: {
						color: 'black'
					},
					font: {
						align: 'top'
					}
				};
				var index = search(obj, x);
				if (index == -1) {
					x.push(obj);
				} else {
					x[index].label += "," + j.toString();
				}


			}
		}
	}

	var edges = new vis.DataSet(x);
	var data = {
		nodes: nodes,
		edges: edges
	}
	var options = {
		nodes: {
			borderWidth: 2
		},
		interaction: {
			hover: true
		},
		physics: {
			barnesHut: {
				gravitationalConstant: -4000
			}
		},
		edges: {
			arrows: {
				to: {
					enabled: false,
					scaleFactor: 0.5,
					type: 'arrow'
				}
			}
		}
	};
	var container = document.getElementById('DFA');
	var network = new vis.Network(container, data, options);
}



function displayNFA(a) {
	var x = [];
	var obj = {};
	for (let i = 0; i < n; i++) {
		obj = {
			id: i,
			label: `Q${i}`
		};
		if (initials.indexOf(obj.label) !== -1) {
			obj.color = {
				border: 'black'
			};
		}

		if (finals.indexOf(obj.label) !== -1) {
			obj.color = 'yellow';
		}

		if (initials.indexOf(obj.label) !== -1 && finals.indexOf(obj.label) !== -1) {
			obj.color = {
				border: 'black',
				background: 'yellow'
			};
		}
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
					if (b == true && j == m - 1)
						ss = "ε";
					else
						ss = j.toString();
					obj = {
						from: i,
						to: y,
						arrows: 'to',
						label: ss,
						color: {
							color: 'black'
						},
						font: {
							align: 'top'
						}
					};
					var index = search(obj, x);
					if (index == -1) {
						x.push(obj);
					} else {
						x[index].label += "," + ss;
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
	var options = {
		nodes: {
			borderWidth: 2
		},
		interaction: {
			hover: true
		},
		physics: {
			barnesHut: {
				gravitationalConstant: -4000
			}
		},
		edges: {
			arrows: {
				to: {
					enabled: false,
					scaleFactor: 0.5,
					type: 'arrow'
				}
			}
		}
	};
	var container = document.getElementById('NFA');
	var network = new vis.Network(container, data, options);
}
