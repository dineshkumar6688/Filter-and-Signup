import { useState } from "react";
import {
  Row,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Button,
} from "reactstrap";
import "./App.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Filter(fetchedData) {
  var [reset, setReset] = useState(true);
  var [custom, setCustom] = useState(false);
  var [data, setData] = useState([]);
  var [open, setOpen] = useState(false);
  var [from, setFrom] = useState(new Date());
  var [to, setTo] = useState(new Date());

  const toggle = () => {
    setOpen(!open);
  };

  function getYesterdayDate() {
    var yesterdayData = new Date() - 1;
    data = fetchedData.data.filter(function (data) {
      var date = new Date(data["date"]);
      return date === yesterdayData;
    });
    setData(data);
    setReset(false);
    setCustom(false);
  }

  function getLastWeekDate() {
    var startDate = new Date() - 7;
    var endDate = new Date();
    data = fetchedData.data.filter(function (res) {
      var date = new Date(res["date"]);
      return date >= startDate && date <= endDate;
    });
    setData(data);
    setReset(false);
    setCustom(false);
  }

  function getLastMonthDate() {
    var startDate = new Date() - 30;
    var endDate = new Date();
    data = fetchedData.data.filter(function (res) {
      var date = new Date(res["date"]);
      return date >= startDate && date <= endDate;
    });
    setData(data);
    setReset(false);
    setCustom(false);
  }

  function customDate(from, to) {
    var startDate = new Date(from);
    var endDate = new Date(to);
    data = fetchedData.data.filter(function (res) {
      var date = new Date(res["date"]);
      return date > startDate && date < endDate;
    });
    setData(data);
    setReset(false);
  }

  const filterData = (value) => {
    switch (value) {
      case "yesterday":
        getYesterdayDate();
        break;
      case "last week":
        getLastWeekDate();
        break;
      case "last month":
        getLastMonthDate();
        break;
      case "custom date":
        setCustom(!custom);
        break;
      default:
    }
  };

  return (
    <div className="app">
      <Container>
        <Row className="title">
          <h1>FILTERING</h1>
        </Row>
        <Row style={{ textAlign: "right" }}>
          {custom || reset == false ? (
            <Col>
              <Button
                outline
                color="primary"
                onClick={() => {
                  setReset(true);
                  setCustom(false);
                }}
                md={2}
              >
                Reset
              </Button>
            </Col>
          ) : (
            <div />
          )}
        </Row>

        <Row>
          <Col md={2}>
            <Dropdown isOpen={open} toggle={toggle}>
              <DropdownToggle caret>Filter</DropdownToggle>
              <DropdownMenu onClick={(e) => filterData(e.target.id)}>
                <DropdownItem id="yesterday">Yesterday</DropdownItem>
                <DropdownItem id="last week">Last Week</DropdownItem>
                <DropdownItem id="last month">Last Month</DropdownItem>
                <DropdownItem id="custom date">Custom Date</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
          {custom ? (
            <Col md={2}>
              <DatePicker selected={from} onChange={(date) => setFrom(date)} />
            </Col>
          ) : (
            <div />
          )}
          {custom ? (
            <Col md={2}>
              <DatePicker selected={to} onChange={(date) => setTo(date)} />
            </Col>
          ) : (
            <div />
          )}
          {custom ? (
            <Col md={2}>
              <Button type="submit" onClick={() => customDate(from, to)} md={2}>
                Apply
              </Button>
            </Col>
          ) : (
            <div />
          )}
        </Row>
        <hr />

        <Row style={{ backgroundColor: "#D0D0D0" }}>
          <Col>
            <h3>TITLE</h3>
          </Col>
          <Col>
            <h3>DATE</h3>
          </Col>
          <Col>
            <h3>NOTES</h3>
          </Col>
          <Col>
            <h3>BUNTING</h3>
          </Col>
        </Row>
        {reset ? (
          fetchedData.data.map((x, id) => {
            return (
              <Row
                style={{
                  backgroundColor: id % 2 === 0 ? "#F8F8F8" : "#FFFFFF",
                }}
              >
                <Col>{x["title"]}</Col>
                <Col>{x["date"]}</Col>
                <Col>{x["notes"]}</Col>
                <Col>{x["bunting"].toString()}</Col>
              </Row>
            );
          })
        ) : data.length !== 0 ? (
          data.map((x, id) => {
            return (
              <Row
                style={{
                  backgroundColor: id % 2 === 0 ? "#F8F8F8" : "#FFFFFF",
                }}
              >
                <Col>{x["title"]}</Col>
                <Col>{x["date"]}</Col>
                <Col>{x["notes"]}</Col>
                <Col>{x["bunting"].toString()}</Col>
              </Row>
            );
          })
        ) : (
          <div className="noresult">No data</div>
        )}
      </Container>
    </div>
  );
}

export default Filter;
