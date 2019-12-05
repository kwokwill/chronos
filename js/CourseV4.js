firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var name = user.displayName.split(" ", 1);

        document.getElementById("homepagetitle").innerHTML = "Hi " + name + "!";
      } else {
        console.log(user);
      }
    });