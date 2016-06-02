var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")

var Home = React.createClass({
  getInitialState:function(){
      return {
        "events":[],
          "stores":[],
          "specials":[],
      }
    },
    componentDidMount(){
      var Store = Parse.Object.extend("Stores");
  var storeQuery = new Parse.Query(Store);
    storeQuery.find({
      success: function(theCards){
        self.setState({"stores":theCards});
      }
    })

    var Special = Parse.Object.extend("Specials");
var specialQuery = new Parse.Query(Special);
  specialQuery.equalTo("storeName", "Next Gen");
  specialQuery.find({
    success: function(theCards){
      self.setState({"specials":theCards});
    }
  })

  //find events info from parse
  var self=this;
  var Event = Parse.Object.extend("Events");
  //calculate one week from today
  var oneMoreWeek = new Date();
  var curDay = new Date();
  oneMoreWeek.setDate(oneMoreWeek.getDate() + 7);
  var eventQuery = new Parse.Query(Event);

      eventQuery.lessThanOrEqualTo("Date", oneMoreWeek);
      eventQuery.greaterThanOrEqualTo("Date", curDay);
        eventQuery.equalTo("storeName", "Next Gen");
    eventQuery.find({
      success: function(results) {
        var newResults = results.sort(function(a,b) {
              return new Date(a.get("Date")).getTime() - new Date(b.get("Date")).getTime()
        });
          self.setState({"events":newResults})
          self.forceUpdate();
      },
      error: function(error) {
        console.log("Event Server not find")
      }
  })
    },
  render:function(){
    var eventcount=0;
var sixEvents=[];
var rannumbers = [];
var firstone = true;
var loopcount=0;

    while(sixEvents.length<6 && loopcount<50){
      loopcount+=1;
      for(var i =1;i<7;i++){
        var newrand = Math.floor((Math.random() * this.state.events.length) + 1);
        rannumbers.push(newrand)
      }

      var events = this.state.events.forEach(function(thisevent){

        //if this one was chosen
        var chosen = false
        for(var i =0;i<rannumbers.length;i++){
          if(eventcount==rannumbers[i]){
            chosen=true
          }
        }
        eventcount+=1;

        if(chosen && thisevent.get("Date")>=Date.now()){

          var activeWord="";
          if(firstone){
            activeWord="active"
          }
          firstone=false;

          //reformat the date
          var monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
          ];
          var date = thisevent.get("Date");
          var day = date.getUTCDate();
          var monthIndex = date.getMonth();
          var year = date.getFullYear();

          var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
          Date.prototype.getDayName = function() {
            return days[ this.getDay() ];
          };

          var now = new Date();
          var dayname = date.getDayName();
          var redate = dayname + ", " +  monthNames[monthIndex] + " " + day + " " + year

          //Time stuff
          if(thisevent.get("startTime")){
      var start = thisevent.get("startTime").split(":")
      var starthr = start[0];
      var startmin = start[1];
      var startampm = "AM"
      if(parseInt(starthr)>12){
        starthr=parseInt(starthr)-12;
        startampm="PM"
      }
      if(parseInt(starthr)==12){
          startampm="PM"
      }
      if(parseInt(starthr)==0){
        starthr=12;
        startampm="AM"
      }
      if(startmin==undefined){
        startampm=""
        starthr="???"
        startmin=""
      }

      var end = thisevent.get("endTime").split(":")
      var endhr = end[0];
      var endmin = end[1];
      var endampm = "AM"
      if(parseInt(endhr)>12){
        endhr=parseInt(endhr)-12;
        endampm="PM"
      }
      if(parseInt(endhr)==12){
          endampm="PM"
      }
      if(parseInt(endhr)==0){
        endhr=12;
        endampm="AM"
      }
      if(endmin==undefined){
        endampm=""
        endhr="???"
        endmin=""
      }
    }

      var time = <p>{starthr + ":" + startmin + " " + startampm + " To " + endhr + ":" + endmin + " " + endampm}</p>

          sixEvents.push(
            <div  key = {"event" + eventcount} className={"item " + activeWord}>
                <div key={"event" + eventcount}  className="carousel-content maindetails">
                  <a href = {"#details/" + thisevent.id}><h3>{thisevent.get("Name")}</h3>
                    <p>{thisevent.get("Format")}</p>
                        <p>{redate}</p>
                              <p>{time}</p></a>
                </div>
            </div>
          )
        }
      })
    }

    var specials = this.state.specials;
    var special1;
      var special2;
        var special3;
        var specialname1;
          var specialname2;
            var specialname3;

    if(specials.length>0){
        console.log("Specials",specials[0].get("specialDescription1"))
        special1=specials[0].get("specialDescription1");
          special2=specials[0].get("specialDescription2");
            special3=specials[0].get("specialDescription3");
            specialname1=specials[0].get("specialName1");
              specialname2=specials[0].get("specialName2");
                specialname3=specials[0].get("specialName3");

    }


    return(
    <div className="Total">

  <div className = "row special1">

    <div className="col-xs-10 col-xs-offset-1 specialCol">
      <h1>{specialname1}</h1>
        <p>{special1}</p>
    </div>

  </div>


      <div className = "row">
        <div className="col-md-10 col-md-offset-1 events">
          <h1>Upcoming Events</h1>
          <div id="text-carousel" className="carousel slide" data-ride="carousel">

            <div className="row">
              <div className="col-xs-offset-1 col-xs-10">
                <div className="carousel-inner Inner">
                  {sixEvents}
                </div>
              </div>
            </div>

            <a className="left carousel-control" href="#text-carousel" data-slide="prev">
              <span className="glyphicon glyphicon-chevron-left"></span>
            </a>
            <a className="right carousel-control" href="#text-carousel" data-slide="next">
              <span className="glyphicon glyphicon-chevron-right"></span>
            </a>

              <a href="#schedule"><h1 className="fullSchedule">View full Schedule</h1></a>

          </div>
        </div>
    </div>

    <div className = "row special2">

      <div className="col-sm-5 col-sm-offset-1 col-xs-12 specialCol">
        <h1>{specialname2}</h1>
          <p>{special2}</p>
      </div>
      <div className="col-sm-5 col-xs-12 specialCol">
        <h1>{specialname3}</h1>
          <p>{special3}</p>
      </div>

    </div>

      <div className="row mainpagerow">
        <div className="col-sm-4 col-sm-offset-1 col-xs-12 mainpage">
          <div className = "imageContainer"><img className="mainImage" src = "images/Nextgen2.jpg"/></div>
        </div>

      <div className="col-sm-6 col-xs-12 mainpage">
              <p>Next Gen is the all in one shop for MTG supplies and cards. The owners are really knowledgeable about deck construction, play format, and rules. They will spend quality time looking for a card you need or sitting down and helping you build a desk. Play level here is competitive so if you are looking to improve your game and play against some top rated decks this is the place for you to come, learn, grow, and play. - Richard Meyers</p>
      </div>

    </div>

    <div className="row mainpagerow mainbottom">


    <div className="col-sm-6 col-xs-12 col-sm-offset-1 mainpage">
            <p>Very awesome place! Everyone's pretty friendly and awesome. It's always nice to go and hang around people that can make ya laugh and have a good time!! - Kitty LaBoone</p>
            <p>Love this place! Great prices! Great atmosphere!!! By far best location upstate!! Highly recommend!! - Eddie Bowles </p>
            <p>Very solid store, great shopkeepers and competitive yet friendly atmosphere. - Sean Melton  </p>
    </div>

    <div className="col-sm-4  col-xs-12 mainpage">
      <div className = "imageContainer"><img className="mainImage" src = "images/Nextgen1.jpg"/></div>
    </div>

  </div>

    </div>
    )

  }
})


module.exports = Home;
