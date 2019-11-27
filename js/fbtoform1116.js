const workList = document.querySelector('#COMP1116-list');
const form = document.querySelector('#add-1116-form');

// create element & render workList
function renderWork(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let dueDate = document.createElement('span');
    let description = document.createElement('span');
    let cross = document.createElement('div');
    var stringMonth = doc.data().dueDate + '';

    var res = stringMonth.split("-"); // turn the date into a list format (Split by / if needed)
    var months = ["Jan", "Feb", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];

    dueDate.textContent = (months[res[1] - 1] + " " + [res[2]] + ", " + [res[0]]);

    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    description.textContent = doc.data().description;
    cross.textContent = 'x';
    li.className += 'listeroos';
    li.appendChild(name);
    li.appendChild(description);
    li.appendChild(dueDate);
    li.appendChild(cross);

    workList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('COMP1116').doc(id).delete();
    });
}

// saving data and adding timestamp to allow work to be ordered
// data saved and is submitted with name/city/createdAt (what time)
form.addEventListener('submit', (e) => {
    var cs = document.getElementById("wow")
    var strUser = cs.options[cs.selectedIndex].value;
    e.preventDefault();
    console.log(strUser);
    db.collection(strUser).add({
        name: form.name.value,
        dueDate: form.dueDate.value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        description: form.description.value,

    });
    form.name.value = '';
    form.dueDate.value = '';
    form.description.value = '';
    var timeoutID = window.setTimeout(function () {
        // location.reload();
    }, 1500);

});
//^^^^^^^^^^^^^^^^^^^
// allowing submission time for add-work-form and then rendering afterwards to bring newest li up top!!!!
//document.getElementById("myButton").addEventListener("click",function () {
//    var timeoutID = window.setTimeout(function () {
//        location.reload();
//    }, 180);
//  });

function clearList() {
    var lists = document.getElementsByClassName('listeroos');
    for(var index = 0; index < lists.length; index++) {
        lists[index].style.display = "none";
    }
}
var select = document.getElementById('wow');
select.addEventListener('change', logValue, false);
// real-time listener
function logValue() {
    clearList();
    db.collection(this.value).orderBy("createdAt", "desc").onSnapshot(snapshot => {
        let changes = snapshot.docChanges();

        changes.forEach(change => {
            console.log(change.doc.data());

            if (change.type == 'added') {
                renderWork(change.doc);

            } else if (change.type == 'removed') {
                let li = workList.querySelector('[data-id=' + change.doc.id + ']');
                workList.removeChild(li);
            }
        });

    });
}
var date = new Date();
console.log(date);