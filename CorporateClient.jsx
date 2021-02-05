import React from "react";
import * as corporateClientsServices from "../../services/corporateClientsServices";
import SingleCorporateClient from "./SingleCorporateClient";
import Pagination from "rc-pagination";
import PropTypes from "prop-types";
import "rc-pagination/assets/index.css";
import { withRouter } from "react-router-dom";

class CorporateClients extends React.Component {
  state = {
    mappedCorporateClient: [],
    pageData: {
      current: 1,
      pageSize: 6,
      totalNumber: 0,
    },
    searchField: "",
  };
  componentDidMount() {
    this.renderCorporateClients(1);
  }
  renderCorporateClients = (page) => {
    if (this.state.searchField.length > 0) {
      corporateClientsServices
        .searchByQuery(
          page - 1,
          this.state.pageData.pageSize,
          this.state.searchField
        )
        .then(this.onRenderCorporateClientsSuccess)
        .catch(this.onRenderCorporateClientsFailure);
    } else {
      corporateClientsServices
        .getAll(page - 1, this.state.pageData.pageSize)
        .then(this.onRenderCorporateClientsSuccess)
        .catch(this.onRenderCorporateClientsFailure);
    }
  };
  onRenderCorporateClientsSuccess = (response) => {
    const mappedCorporateClient = response.item.pagedItems.map(
      this.mapCorporateClient
    );
    const current = ++response.item.pageIndex;
    const pageSize = response.item.pageSize;
    const totalNumber = response.item.totalCount;
    this.setState((prevState) => ({
      ...prevState,
      pageData: {
        current: current,
        pageSize: pageSize,
        totalNumber: totalNumber,
      },
      mappedCorporateClient: mappedCorporateClient,
    }));
  };

  onRenderCorporateClientsFailure = () => {};

  detailClickHandler = (oneCorporateClient) => {
    this.props.history.push(`/corporateClients/${oneCorporateClient.id}`, {
      oneCorporateClient,
      flag: "Corporate Client",
    });
  };

  mapCorporateClient = (oneCorporateClient) => {
    return (
      <SingleCorporateClient
        corporateClient={oneCorporateClient}
        detailClickHandler={this.detailClickHandler}
        key={`corporateClient-${oneCorporateClient.id}`}
      />
    );
  };
  onSearchFieldChanged = (e) => {
    e.preventDefault();
    let value = e.currentTarget.value;
    this.setState(
      (prevState) => ({
        ...prevState,
        searchField: value,
      }),
      () => this.renderCorporateClients(1)
    );
  };
  onSearchPageSizeChanged = (e) => {
    let value = e.currentTarget.value;
    this.setState(
      (prevState) => ({
        ...prevState,
        pageData: { ...prevState.pageData, pageSize: value },
      }),
      () => this.renderCorporateClients(1)
    );
  };
  render() {
    return (
      <React.Fragment>
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-9">
              <div className="container">
                <div className="row">{this.state.mappedCorporateClient}</div>
              </div>
            </div>

            <div className="col-lg-3">
              <p>Show # of Pages</p>
              <select
                onChange={this.onSearchPageSizeChanged}
                value={this.state.pageData.pageSize}
              >
                <option value="6"> 6</option>
                <option value="9"> 9</option>
                <option value="18"> 18</option>
                <option value="100"> 100</option>
              </select>
              <br />
              <form className="form-inline">
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={this.state.searchField}
                  onChange={this.onSearchFieldChanged}
                />
              </form>
            </div>
          </div>
        </div>

        <div className="container pt-5">
          <div className="row pb-4">
            <Pagination
              onChange={this.renderCorporateClients}
              current={this.state.pageData.current}
              total={this.state.pageData.totalNumber}
              pageSize={this.state.pageData.pageSize}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
CorporateClients.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
export default withRouter(CorporateClients);
