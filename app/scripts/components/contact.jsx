var React = require("react");
var ReactDOM=require("react-dom");
var Backbone = require("backbone");
var $ = require("jquery")
var Input = require("react-bootstrap/lib/Input")
var Parse = require("parse")


var Contact = React.createClass({
  getInitialState:function(){
      return {
          "stores":[],
      }
    },
    componentDidMount:function(){
  //find events info from parse
  var self=this;
  var Store = Parse.Object.extend("Stores");
  //calculate one week from today
  var eventQuery = new Parse.Query(Store);

        eventQuery.equalTo("storeName", "Next Gen");
    eventQuery.find({
      success: function(results) {
          self.setState({"stores":results})
          self.forceUpdate();
      },
      error: function(error) {
        console.log("Event Server not find")
      }
  })

    },
  render:function(){
var store = this.state.stores;
var days = [];
var address =[];
var phone;
var email;
if(store.length>0){
      address[0]= store[0].get("address");
      address[1]= store[0].get("state");
      address[2]= store[0].get("city");
      address[3]= store[0].get("zip");
phone=store[0].get("phone");
email=store[0].get("email");
}


    return(
    <div className="Total">
      <div className="row contactUs">
            <h1>Contact Us</h1>
        <div className="col-xs-6 col-xs-offset-3 bottom">

          <p>Phone: {phone}</p>
          <p>Email: {email}</p>
              <p><a href="https://www.facebook.com/groups/284052025052403/?fref=ts">Facebook</a></p>
        </div>

      </div>
    </div>
    )

  }
})


module.exports = Contact;
