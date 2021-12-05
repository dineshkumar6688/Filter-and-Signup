import axios from "axios";
import { Component } from "react";
import "./App.css";
import Filter from "./filter";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    axios.get("https://www.gov.uk/bank-holidays.json").then((response) => {
      this.setState({ data: response.data["northern-ireland"].events });
    });
  }

  render() {
    return (
      <div>
        <Filter data={this.state.data}/>
      </div>
    );
  }
}

export default App;
