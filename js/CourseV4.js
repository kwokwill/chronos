//Function for getting the first name from
//firebase when the user creates an Account.
//The first token of the string
//is taken as the first name, any tokens after is removed.
firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var name = user.displayName.split(" ", 1);

        document.getElementById("homepagetitle").innerHTML = "Hi " + name + "!";
      } else {
        console.log(user);
      }
    });