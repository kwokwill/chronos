//Takes saved due dates posted on firebase and
//displays them on the specific course page.
const workList = document.querySelector('.list-group');

//Renders the document on firebase that corresponds to
//HTML elements on the course page.
//doc is the documents in this course's collection.
    function renderWork(doc) {
      let li = document.createElement('a');
      li.classList.add("testing", "list-group-item", "list-group-item-action", "flex-column", "align-items-start");
      let name = document.createElement('div');
      let dueDate = document.createElement('p');
      let cross = document.createElement('div');
      let desc = document.createElement('div');
      name.setAttribute("id","title");

      var stringMonth = doc.data().dueDate + '';
      var res = stringMonth.split("-"); // turn the date into a list format (Split by / if needed)
      var months = ["Jan", "Feb", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
      ];

      dueDate.textContent = (months[res[1] - 1] + " " + [res[2]] + ", " + [res[0]]);
      desc.textContent = doc.data().description;
      li.setAttribute('data-id', doc.id);
      name.textContent = doc.data().name;
      
      li.appendChild(name);
      li.appendChild(desc);
      li.appendChild(dueDate);
      li.appendChild(cross);

      workList.appendChild(li);

      // deleting data
      cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('COMP1536').doc(id).delete();
      });
    }

// real-time listener
//Orders the due dates in firebase by descending order to be
//displayed on the course page.
    db.collection("COMP1536").orderBy("dueDate", "desc").onSnapshot(snapshot => {
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