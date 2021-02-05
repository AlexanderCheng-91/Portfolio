import React from "react";
import { Field, Formik } from "formik";
import LocationBasicForm from "../location/LocationBasicForm";
import corporateClientValidationSchema from "../corporateclients/CorporateClientValidationSchema";
import * as locationService from "../../services/locationService";
import * as corporateClientsServices from "../../services/corporateClientsServices";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";

class CorporateClientsAddPage extends React.Component {
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
    isAdded: false,
  };

  handleSubmit = (values) => {
    locationService
      .getGeocode(values.location)

      .then((response) => {
        const payload = { ...values };
        payload.location.locationTypeId = parseInt(
          values.location.locationType.id
        );
        payload.location.latitude = response.latitude;
        payload.location.longitude = response.longitude;
        payload.location.state = values.location.stateId.split("-")[0];
        payload.location.stateId = parseInt(
          values.location.stateId.split("-")[1]
        );
        return payload;
      })

      .then((payload) => {
        locationService
          .addLocation(payload.location)
          .then((response) => {
            payload.location.id = response.item;
            return payload;
          })
          .then((response) => this.onAddLocationSuccess(payload, response));
      });
  };

  onAddLocationSuccess = (payload, response) => {
    payload.userId = this.props.currentUser.id;
    payload.locationId = parseInt(response.location.id);

    corporateClientsServices
      .addCorporateClient(payload)
      .then(this.onAddCorporateClientSuccess(payload))
      .catch(this.onAddCorporateClientError);
  };

  onAddCorporateClientSuccess = (payload) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your account has been created",
      showConfirmButton: false,
      timer: 1500,
    });
    let user = {
      avatarUrl: payload.avatarUrl,
      email: this.props.currentUser.email,
      id: payload.userId,
      name: payload.companyName,
      roles: ["Corporate Client"],
    };
    this.props.history.push(`/dashboard`, { flag: "login", user });
  };

  onAddCorporateClientError = () => {
    Swal.fire({
      icon: "error",
      title: "Account Information Failed",
      text: "Please try again later",
    });
  };

  render() {
    return (
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
            <div
              className="xl-50 box-col-6 col-sm-12 col-md-9 col-lg-8 col-xl-6"
              style={{ margin: "auto" }}
            >
              <div className="height-equal card">
                <div className="card-header">
                  <h5>Add Corporate Client</h5>
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
                        Formik Submit
                      </button>

                      <button className="btn  btn-danger float-right ">
                        Delete
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
}
CorporateClientsAddPage.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.string.isRequired),
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }),
};

export default withRouter(CorporateClientsAddPage);
