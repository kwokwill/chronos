// Initialize the calendar by appending the HTML dates
    function init_calendar(date) {
      $(".tbody").empty();
      $(".events-container").empty();
      var calendar_days = $(".tbody");
      var month = date.getMonth();
      var year = date.getFullYear();
      var day_count = days_in_month(month, year);
      var row = $("<tr class='table-row'></tr>");
      var today = date.getDate();
      // Set date to 1 to find the first day of the month
      date.setDate(1);
      var first_day = date.getDay();
      // 35+firstDay is the number of date elements to be added to the dates table
      // 35 is from (7 days in a week) * (up to 5 rows of dates in a month)
      for (var i = 0; i < 35 + first_day; i++) {
        // Since some of the elements will be blank, 
        // need to calculate actual date from index
        var day = i - first_day + 1;
        // If it is a sunday, make a new row
        if (i % 7 === 0) {
          calendar_days.append(row);
          row = $("<tr class='table-row'></tr>");
        }
        // if current index isn't a day in this month, make it blank
        if (i < first_day || day > day_count) {
          var curr_date = $("<td class='table-date nil'>" + "</td>");
          row.append(curr_date);
        } else {
          var curr_date = $("<td class='table-date'>" + day + "</td>");
          var events = check_events(day, month + 1, year);
          if (today === day && $(".active-date").length === 0) {
            curr_date.addClass("active-date");
            show_events(events, months[month], day);
          }
          // If this date has any events, style it with .event-date
          if (events.length !== 0) {
            curr_date.addClass("event-date");
          }
          // Set onClick handler for clicking a date
          curr_date.click({
            events: events,
            month: months[month],
            day: day
            
          }, date_click);
          row.append(curr_date);
        }
      }
      // Append the last row and set the current year
      calendar_days.append(row);
      $(".year").text(year);
    }

    // Get the number of days in a given month/year
    function days_in_month(month, year) {
      var monthStart = new Date(year, month, 1);
      var monthEnd = new Date(year, month + 1, 1);
      return (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
    }

    // Event handler for when a date is clicked
    function date_click(event) {
      $(".events-container").show(250);
      $("#dialog").hide(250);
      $(".active-date").removeClass("active-date");
      $(this).addClass("active-date");
      //!!!! this is where we want to create function for when date is clicked
      // !!!! figure out date -> year collection
      var date = event.data.date;
      var year = document.getElementById("label").innerHTML;
      console.log(year + " testing year parameter");
      
      show_events(event.data.events, event.data.month, event.data.day, year);
        
    };

    // Event handler for when a month is clicked
    // function month_click(event) {
    //   $(".events-container").show(250);
    //   $("#dialog").hide(250);
    //   var date = event.data.date;
    //   $(".active-month").removeClass("active-month");
    //   $(this).addClass("active-month");
    //   var new_month = $(".month").index(this);
    //   date.setMonth(new_month);
    //   init_calendar(date);
    // }

    // Event handler for when the year right-button is clicked
    function next_year(event) {
      $("#dialog").hide(250);
      var date = event.data.date;
      var new_year = date.getFullYear() + 1;
      $("year").html(new_year);
      date.setFullYear(new_year);
      init_calendar(date);
    }

    function year_chosen(event){
      $("#dialog").hide(250);
      var date = event.data.date;
      var current_year = date.getFullYear();
      var new_year = document.getElementById("mySelect").value;
      
      $("year").html(new_year);
 
      switch (new_year){
        case "2019":
          new_year = 2019;
          break;
        case "2020":
          new_year = 2020;
          break;
        case "2021":
          new_year = 2021;
          break;
        case "2022":
          new_year = 2022;
          break;
      }
      var getDiffYear = new_year - current_year;
      new_year = date.getFullYear() + getDiffYear;
      date.setFullYear(new_year);
      init_calendar(date);

    };

    // Event handler for when the year left-button is clicked
    function prev_year(event) {
      $("#dialog").hide(250);
      var date = event.data.date;
      var new_year = date.getFullYear() - 1;
      $("year").html(new_year);
      date.setFullYear(new_year);
      init_calendar(date);
    }

    // Event handler for when the month right-month button is clicked
    function next_month(event){
      $("#dialog").hide(250);
      var date = event.data.date;
      var new_month = date.getMonth() + 1;
      $("#labelMonth").html(new_month);
      date.setMonth(new_month);
      init_calendar(date);
    }

    // Event handler for when the month left-month button is clicked
    function prev_month(event){
      $("#dialog").hide(250);
      var date = event.data.date;
      var new_month = date.getMonth() - 1;
      $("#labelMonth").html(new_month);
      date.setMonth(new_month);
      init_calendar(date);
    }

    // Event handler for clicking the new event button
    function new_event(event) {
        firebase.auth().onAuthStateChanged(function (user){
      // if a date isn't selected then do nothing
      if ($(".active-date").length === 0)
        return;
      // empty inputs and hide events
      $("#dialog input[type=text]").val('');
      $("#dialog input[type=number]").val('');
      $(".events-container").hide(250);
      $("#dialog").show(250);
      // Event handler for cancel button
      $("#cancel-button").click(function() {
        $("#name").removeClass("error-input");
        $("#count").removeClass("error-input");
        $("#dialog").hide(250);
        $(".events-container").show(250);
    });

      // Event handler for ok button
      $("#ok-button").unbind().click({
        date: event.data.date
      }, function() {
        var date = event.data.date;
        var name = $("#name").val().trim();
        var eventInfo = $("#eventInfo").val().trim();
        var day = parseInt($(".active-date").html());
        
        // creating variable string for collection db
        var  year = date.getFullYear() + "";
        var month = date.getMonth()+1 + "";
        var num = day + "";

        // Basic form validation
        if (name.length === 0) {
          $("#name").addClass("error-input");
        } else if (eventInfo.length === 0) {
          $("#eventInfo").addClass("error-input");
        } else {
          $("#dialog").hide(250);
          console.log("new event");
          new_event_json(name, eventInfo, date, day);
          date.setDate(day);
          init_calendar(date);
          
          // add to the collection each time the ok button is clicked;
            db.collection("users/").doc(user.uid).collection('cally').doc(year).collection(month).doc(num).collection("info").add({
            name: name,
            eventInfo: eventInfo,
            day: day,
            month: date.getMonth()+1,
            });
        }
      });
    })};

    // Adds a json event to event_data
    function new_event_json(name, eventInfo, date, day) {
      var event = {
        "occasion": name,
        "eventInfo": eventInfo,
        "year": date.getFullYear(),
        "month": date.getMonth() + 1,
        "day": day
      };
      event_data["events"].push(event);
    }

    // Display all events of the selected date in card views
    function show_events(events, month, day, year) {
        console.log(month);
      console.log(day);
      console.log(year);
        var year = year+"";
        var day = day+"";
        firebase.auth().onAuthStateChanged(function (user){
            if (user) {
      // Clear the dates container
      $(".events-container").empty();
      $(".events-container").show(250);
      $("#labelMonth").html(month);
      // Determines String month to number month to use to grab from database
      var monthNum;
      switch(month){
        case "January":
          monthNum = "1";
          break;
        case "Febuary":
          monthNum = "2";
          break;
        case "March":
          monthNum = "3";
          break;
        case "April":
          monthNum = "4";
          break;
        case "May":
          monthNum = "5";
          break;
        case "June":
          monthNum = "6";
          break;
        case "July":
          monthNum = "7";
          break;
        case "August":
          monthNum = "8";
          break;
        case "September":
          monthNum = "9";
          break;
        case "October":
          monthNum = "10";
          break;    
        case "November":
          monthNum = "11";
          break;
        case "December":
          monthNum = "12";
          break;
      }
      monthNum += "";
        
        
       
        db.collection("users/").doc(user.uid).collection('cally').doc(year).collection(monthNum).doc(day).collection("info").get().then(function(snap){
          console.log(snap);
          snap.forEach(function(doc){
            var n = doc.data().name;
            var desc = doc.data().eventInfo;
            console.log(n + " Number Input: " + desc);
            var event_card = $("<div class='event-card'></div>");
            var event_name = $("<div class='event-name'>" + n + ":</div>");
            var event_info = $("<div class='event-count'>" + desc + "</div>");
          $(event_card).append(event_name).append(event_info);
          $(".events-container").append(event_card);
          })
        })
      }})};

    // Checks if a specific date has any events
    function check_events(day, month, year) {
      var events = [];
      for (var i = 0; i < event_data["events"].length; i++) {
        var event = event_data["events"][i];
        if (event["day"] === day &&
          event["month"] === month &&
          event["year"] === year) {
          events.push(event);
        }
      }
      return events;
    }

    // Given data for events in JSON format
    var event_data = {

      "events": [{
          "occasion": " Repeated Test Event ",
          "invited_count": 120,
          "year": 2017,
          "month": 5,
          "day": 10,
          "cancelled": true
        },
        {
          "occasion": " Repeated Test Event ",
          "invited_count": 120,
          "year": 2017,
          "month": 5,
          "day": 10,
          "cancelled": true
        },
        {
          "occasion": " Repeated Test Event ",
          "invited_count": 120,
          "year": 2017,
          "month": 5,
          "day": 10,
          "cancelled": true
        },
        {
          "occasion": " Repeated Test Event ",
          "invited_count": 120,
          "year": 2017,
          "month": 5,
          "day": 10
        },
        {
          "occasion": " Repeated Test Event ",
          "invited_count": 120,
          "year": 2017,
          "month": 5,
          "day": 10,
          "cancelled": true
        },
        {
          "occasion": " Repeated Test Event ",
          "invited_count": 120,
          "year": 2017,
          "month": 5,
          "day": 10
        },
        {
          "occasion": " Repeated Test Event ",
          "invited_count": 120,
          "year": 2017,
          "month": 5,
          "day": 10,
          "cancelled": true
        },
        {
          "occasion": " Repeated Test Event ",
          "invited_count": 120,
          "year": 2017,
          "month": 5,
          "day": 10
        }
      ]
    };

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    db.collection("COMP1510").get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    });