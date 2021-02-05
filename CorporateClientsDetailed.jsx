import React from "react";
import { withRouter } from "react-router-dom";
import { Field, Formik } from "formik";
import LocationBasicForm from "../location/LocationBasicForm";
import * as locationService from "../../services/locationService";
import * as corporateClientsServices from "../../services/corporateClientsServices";
import Swal from "sweetalert2";
import corporateClientValidationSchema from "../corporateclients/CorporateClientValidationSchema";
import PropTypes from "prop-types";
import { formatDateTime } from "../../services/dateService";
import "./corporateClients.css";

class CorporateClientsDetailed extends React.Component {
  state = {
    avatarUrl: "",
    companyName: "",
    dateCreated: 0,
    dateModified: 0,
    firstName: "",
    id: "",
    lastName: "",
    location: {
      city: "",
      dateCreated: 0,
      dateModified: 0,
      id: "",
      latitude: "",
      lineOne: "",
      lineTwo: "",
      locationType: {
        id: "",
        name: "",
      },
      longitude: "",
      modifiedBy: "",
      state: {
        code: "",
        id: "",
        name: "",
      },
      zip: "",
    },
    mi: "",
    phone: "",
    userId: "",
  };

  componentDidMount() {
    if (
      this.props.location &&
      this.props.location.state &&
      this.props.location.state.flag === "Corporate Client"
    ) {
      this.setState((prevState) => ({
        ...prevState,
        ...this.props.location.state.oneCorporateClient,
      }));
    } else if (
      (this.props.currentUser &&
        this.props.currentUser.roles.includes("Corporate Client") &&
        this.props.location.pathname === "/dashboard") ||
      this.props.location.pathname === "/profile"
    ) {
      corporateClientsServices
        .getCurrent()
        .then(this.onGetByIdSuccess)
        .catch(this.onGetByIdError);
    } else {
      corporateClientsServices
        .getById(this.props.match.params.id)
        .then(this.onGetByIdSuccess)
        .catch(this.onGetByIdError);
    }
  }

  onGetByIdSuccess = (response) => {
    let client = response.item;
    this.setState((prevState) => ({ ...prevState, ...client }));
  };

  onGetByIdError = () => {
    return null;
  };

  handleSubmit = (values) => {
    const payload = { ...this.state, ...values };
    payload.userId = this.props.currentUser.id;
    payload.locationId = this.state.location.id;
    locationService
      .getGeocode(payload.location)
      .then((response) => this.onGeocodeOk(response, payload))
      .catch(this.onGeocodeNok);
  };

  onGeocodeOk = (response, payload) => {
    payload.location.latitude = response.latitude;
    payload.location.longitude = response.longitude;
    payload.location.stateId = parseInt(payload.location.state.id);
    payload.location.locationTypeId = payload.location.locationType.id;
    const newLocation = payload.location;
    locationService
      .updateLocation(newLocation)
      .then(() => this.onUpdateLocationOk(payload))
      .catch(this.onUpdateLocationNok);
  };
  onGeocodeNok = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "GeoCode wasn't updated!",
    });
  };
  onUpdateLocationOk = (payload) => {
    this.updateCorpClient(payload);
  };
  onUpdateLocationNok = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Location wasn't updated!",
    });
  };

  updateCorpClient = (payload) => {
    corporateClientsServices
      .editById(payload)
      .then(() => this.updateCorpClientOk(payload))
      .catch(this.updateCorpClientNok);
  };

  updateCorpClientOk = (payload) => {
    this.setState(payload);
    Swal.fire(
      "Success",
      "Your record has been successfully updated!",
      "success"
    );
  };
  updateCorpClientNok = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Location wasn't updated!",
    });
  };

  onAddLocationFailure = () => {
    Swal.fire("Location is invalid.", "Please try again.", "error");
  };

  onAddCorporateClientSuccess = () => {
    Swal.fire("Success", "Your record has been successfully added!", "success");
  };

  onAddCorporateClientFailure = () => {
    Swal.fire(
      "There was an unexpected error.",
      "Please try again later.",
      "error"
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="container pt-5">
          <div className="row">
            <div className="xl-50 box-col-6 col-sm-12 col-md-12 col-lg-6 col-xl-4">
              <div>
                <img
                  src={this.state.avatarUrl}
                  alt=""
                  className=" sm-100-w media img-fluid"
                />
                <div>
                  <div>
                    <div className="pt-2">
                      <h5>Address:</h5>
                    </div>
                    <div>
                      <h5>
                        {`${this.state.location.lineOne}
                        ${this.state.location.lineTwo}.`}{" "}
                        <br />
                        {`${this.state.location.city},
                        ${this.state.location.state.name}
                        ${this.state.location.zip}`}
                      </h5>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h5>Phone: </h5>
                    </div>
                    <div>
                      <h5>{this.state.phone}</h5>
                    </div>
                  </div>

                  <div>
                    <div>
                      <h5>Company: </h5>
                    </div>
                    <div>
                      <h5>{this.state.companyName} </h5>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h5>Name:</h5>
                    </div>

                    <div>
                      <h5>
                        {this.state.firstName} {this.state.mi}{" "}
                        {this.state.lastName}.
                      </h5>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h5>Corporate Client Since: </h5>
                    </div>
                    <div>
                      <h5>{formatDateTime(this.state.dateCreated)}</h5>
                    </div>
                  </div>
                  <div>
                    <div>
                      <h5>Corporate Client Id:</h5>
                    </div>
                    <div>
                      <h5>{this.state.id}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Formik
              enableReinitialize={true}
              validationSchema={corporateClientValidationSchema}
              initialValues={this.state}
              onSubmit={this.handleSubmit}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  handleSubmit,
                  isValid,
                  isSubmitting,
                } = props;

                return (
                  <div className="xl-50 box-col-6 col-sm-12 col-md-12 col-lg-6 col-xl-8">
                    <div className="height-equal card">
                      <div className="card-header">
                        <h5>Update Corporate Client</h5>
                      </div>

                      <div className="contact-form card-body">
                        <form onSubmit={handleSubmit}>
                          <LocationBasicForm />
                          <div className="form-group">
                            <label htmlFor="phone">Phone</label>

                            <Field
                              name="phone"
                              type="text"
                              values={values.phone}
                              placeholder="Phone"
                              autoComplete="off"
                              className="form-control"
                            />
                            {errors.phone && touched.phone && (
                              <span className="input-feedback text-danger">
                                {errors.phone}
                              </span>
                            )}
                          </div>

                          <div className="form-group">
                            <label htmlFor="exampleInputName">Company</label>
                            <Field
                              name="companyName"
                              type="text"
                              values={values.companyName}
                              placeholder="Company Name"
                              autoComplete="off"
                              className="form-control"
                            />
                            {errors.companyName && touched.companyName && (
                              <span className="input-feedback text-danger">
                                {errors.companyName}
                              </span>
                            )}
                          </div>

                          <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <Field
                              name="firstName"
                              type="text"
                              values={values.firstName}
                              className="form-control form-control"
                              autoComplete="off"
                              placeholder="First Name"
                            />
                            {errors.firstName && touched.firstName && (
                              <span className="input-feedback text-danger">
                                {errors.phone}
                              </span>
                            )}
                          </div>

                          <div className="form-group">
                            <label htmlFor="mi">Middle Name</label>
                            <Field
                              name="mi"
                              type="text"
                              values={values.mi}
                              className="form-control"
                              autoComplete="off"
                              placeholder="Middle Initial"
                            />
                            {errors.mi && touched.mi && (
                              <span mi="input-feedback text-danger">
                                {errors.phone}
                              </span>
                            )}
                          </div>

                          <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <Field
                              name="lastName"
                              type="text"
                              values={values.lastName}
                              className="form-control form-control"
                              autoComplete="off"
                              placeholder="Last Name"
                            />
                            {errors.lastName && touched.lastName && (
                              <span className="input-feedback text-danger">
                                {errors.lastName}
                              </span>
                            )}
                          </div>

                          <div className="form-group">
                            <label htmlFor="avatarUrl">Avatar Url</label>
                            <Field
                              name="avatarUrl"
                              className="form-control"
                              type="text"
                              values={values.avatarUrl}
                              autoComplete="off"
                              placeholder="Avatar Url"
                            />
                            {errors.avatarUrl && touched.avatarUrl && (
                              <span className="input-feedback text-danger">
                                {errors.avatarUrl}
                              </span>
                            )}
                          </div>

                          <div>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={!isValid || isSubmitting}
                            >
                              Submit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              }}
            </Formik>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

CorporateClientsDetailed.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string,
    state: PropTypes.shape({
      flag: PropTypes.string,
      oneCorporateClient: PropTypes.shape({
        id: PropTypes.number.isRequired,
        avatarUrl: PropTypes.string.isRequired,
        companyName: PropTypes.string.isRequired,
        dateCreated: PropTypes.string,
        firstName: PropTypes.string.isRequired,
        mi: PropTypes.string,
        lastName: PropTypes.string.isRequired,
        location: PropTypes.shape({
          id: PropTypes.number.isRequired,
          city: PropTypes.string.isRequired,
          dateCreated: PropTypes.string,
          dateModified: PropTypes.string,
          latitude: PropTypes.number.isRequired,
          lineOne: PropTypes.string.isRequired,
          lineTwo: PropTypes.string,
          locationType: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
          }),
          longitude: PropTypes.number,
          modifiedBy: PropTypes.number,
          state: PropTypes.shape({
            code: PropTypes.string,
            id: PropTypes.number,
            name: PropTypes.string,
          }),
          zip: PropTypes.string,
        }),
        phone: PropTypes.string,
        userId: PropTypes.number,
      }),
    }),
  }),
};

export default withRouter(CorporateClientsDetailed);
